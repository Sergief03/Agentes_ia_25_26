// scripts/cargar_bd.js
import { QdrantClient } from '@qdrant/qdrant-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// --- Configuración ---
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME || 'fragmentos_rof';
const BATCH_SIZE = 50; // Tamaño del lote para inserciones

// Crear cliente Qdrant
const client = new QdrantClient({ url: QDRANT_URL });

const jsonPath = path.resolve('datos/embeddings.json');

// --- Funciones de Utilidad ---

/**
 * Genera una barra de progreso ASCII
 * @param {number} current - Valor actual
 * @param {number} total - Valor total
 * @param {number} width - Ancho de la barra
 * @returns {string} Barra de progreso
 */
function generarBarraProgreso(current, total, width = 40) {
    const percentage = (current / total) * 100;
    const filled = Math.floor((current / total) * width);
    const empty = width - filled;
    
    const bar = '█'.repeat(filled) + '░'.repeat(empty);
    return `[${bar}] ${current}/${total} ${percentage.toFixed(0)}%`;
}

/**
 * Inicializa la base de datos Qdrant
 */
async function inicializarBD() {
    console.log('🗄 Inicializando base de datos...');
    
    try {
        // Verificar si la colección existe
        const collections = await client.getCollections();
        const existe = collections.collections.some(c => c.name === QDRANT_COLLECTION_NAME);

        if (existe) {
            // Si existe, eliminarla para evitar duplicados
            console.log(`⚠️  Colección '${QDRANT_COLLECTION_NAME}' ya existe, eliminando...`);
            await client.deleteCollection(QDRANT_COLLECTION_NAME);
        }

        // Leer un embedding de ejemplo para determinar la dimensionalidad
        const fragmentos = cargarJSON();
        const vectorSize = fragmentos[0]?.embedding?.length || 768;

        // Crear la colección
        await client.createCollection(QDRANT_COLLECTION_NAME, {
            vectors: {
                size: vectorSize,
                distance: 'Cosine'
            }
        });
        
        console.log(`✅ Tabla 'fragmentos' creada`);
    } catch (error) {
        console.error('❌ Error al inicializar base de datos:', error.message);
        throw error;
    }
}

/**
 * Carga el JSON de embeddings
 * @returns {Array} Array de fragmentos con embeddings
 */
function cargarJSON() {
    if (!fs.existsSync(jsonPath)) {
        throw new Error('❌ No existe datos/embeddings.json');
    }
    const contenido = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(contenido);
}

/**
 * Valida que no haya IDs duplicados
 * @param {Array} fragmentos - Array de fragmentos
 * @returns {boolean} True si no hay duplicados
 */
function validarDuplicados(fragmentos) {
    const ids = fragmentos.map(f => f.id);
    const idsUnicos = new Set(ids);
    
    if (ids.length !== idsUnicos.size) {
        console.warn('⚠️  Se encontraron IDs duplicados, se procesarán con upsert');
        return false;
    }
    return true;
}

/**
 * Inserta fragmentos en lotes con transacciones
 */
async function insertarFragmentos() {
    const fragmentos = cargarJSON();
    const total = fragmentos.length;
    
    console.log(`📥 Insertando ${total} fragmentos...`);
    
    // Validar duplicados
    validarDuplicados(fragmentos);
    
    // Procesar en lotes para mejorar rendimiento
    const totalBatches = Math.ceil(total / BATCH_SIZE);
    let insertados = 0;

    for (let i = 0; i < total; i += BATCH_SIZE) {
        const batch = fragmentos.slice(i, i + BATCH_SIZE);
        
        // Preparar los puntos para Qdrant
        const points = batch.map(frag => ({
            id: frag.id,
            vector: frag.embedding,
            payload: {
                contenido: frag.contenido,
                fuente: frag.fuente || 'desconocido',
                pagina: frag.pagina || null,
                creado_en: new Date().toISOString()
            }
        }));

        try {
            // Usar upsert para manejar duplicados automáticamente
            await client.upsert(QDRANT_COLLECTION_NAME, {
                wait: true,
                points: points
            });
            
            insertados += batch.length;
            
            // Mostrar progreso con barra
            const progreso = generarBarraProgreso(insertados, total);
            process.stdout.write(`\r${progreso}`);
            
        } catch (err) {
            console.error(`\n❌ Error insertando lote ${Math.floor(i/BATCH_SIZE)+1}:`, err.message);
            throw err;
        }
    }
    
    console.log('\n✅ Base de datos cargada exitosamente');
}

/**
 * Verifica la integridad de la base de datos
 */
async function verificarBD() {
    try {
        // Contar fragmentos
        const info = await client.count(QDRANT_COLLECTION_NAME, { exact: true });
        console.log(`📊 Fragmentos en BD: ${info.count}`);
        
        // Obtener información de la colección
        const collectionInfo = await client.getCollection(QDRANT_COLLECTION_NAME);
        
        // Calcular tamaño estimado
        const fileStats = fs.statSync(jsonPath);
        const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(1);
        console.log(`💾 Tamaño de archivo: ${fileSizeMB} MB`);
        
        // Validar integridad
        if (info.count > 0) {
            // Intentar recuperar un punto aleatorio para verificar
            const scrollResult = await client.scroll(QDRANT_COLLECTION_NAME, {
                limit: 1,
                with_payload: true,
                with_vector: true
            });
            
            if (scrollResult.points && scrollResult.points.length > 0) {
                const punto = scrollResult.points[0];
                const tieneVector = punto.vector && Array.isArray(punto.vector) && punto.vector.length > 0;
                const tienePayload = punto.payload && punto.payload.contenido;
                
                if (tieneVector && tienePayload) {
                    console.log('✅ Integridad verificada');
                } else {
                    console.warn('⚠️  Advertencia: Algunos datos pueden estar incompletos');
                }
            }
        } else {
            console.warn('⚠️  No se encontraron fragmentos en la base de datos');
        }
        
    } catch (err) {
        console.error('❌ Error verificando base de datos:', err.message);
    }
}

// --- Ejecución Principal ---
export async function ejecutarCarga() {
    try {
        await inicializarBD();
        await insertarFragmentos();
        await verificarBD();
        console.log('');
        return { ok: true, mensaje: "Carga completada" };
    } catch (error) {
        console.error('💥 Error durante la carga de la base de datos:', error.message);
        return { ok: false, mensaje: error.message };
    }
}

ejecutarCarga();

