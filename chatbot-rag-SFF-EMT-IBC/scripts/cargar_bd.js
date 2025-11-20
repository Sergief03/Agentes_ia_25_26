import { QdrantClient } from '@qdrant/qdrant-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

// --- Configuración ---
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME || 'chatbot-rag';
const BATCH_SIZE = 100; // Tamaño del lote para inserciones
const client = new QdrantClient({ url: QDRANT_URL });
const jsonPath = path.resolve('datos/embeddings.json');

// --- Funciones de Utilidad ---

/**
 * Inicializa la colección en Qdrant si no existe.
 */
async function inicializarDB() {
    console.log('🗄 Inicializando colección Qdrant...');
    const collections = await client.getCollections();
    const existe = collections.collections.some(c => c.name === QDRANT_COLLECTION_NAME);

    if (!existe) {
        await client.createCollection({
            name: QDRANT_COLLECTION_NAME,
            vectors: {
                size: 768,
                distance: 'Cosine'
            }
        });
        console.log(`✅ Colección '${QDRANT_COLLECTION_NAME}' creada`);
    } else {
        console.log(`ℹ Colección '${QDRANT_COLLECTION_NAME}' ya existe`);
    }
}

/**
 * Carga y parsea el archivo JSON de fragmentos.
 */
function cargarJSON() {
    if (!fs.existsSync(jsonPath)) throw new Error('❌ No existe datos/embeddings.json');
    const contenido = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(contenido);
}

/**
 * Inserta los fragmentos en la colección de Qdrant usando procesamiento por lotes (batch).
 */
async function insertarFragmentos() {
    console.log('📥 Leyendo embeddings...');
    const fragmentos = cargarJSON();
    console.log(`📄 Total fragmentos: ${fragmentos.length}`);

    // --- Inserción por Lotes (Batch) ---
    const totalBatches = Math.ceil(fragmentos.length / BATCH_SIZE);
    
    for (let i = 0; i < fragmentos.length; i += BATCH_SIZE) {
        const batch = fragmentos.slice(i, i + BATCH_SIZE);
        
        // Mapear el lote de fragmentos al formato de puntos de Qdrant
        const points = batch.map(frag => ({
            id: frag.id,
            vector: frag.embedding,
            payload: {
                // Usar contenido si texto no existe (nullish coalescing, pero en JS antiguo: ||)
                contenido: frag.texto || frag.contenido, 
                fuente: frag.fuente || null,
                pagina: frag.pagina || null
            }
        }));

        // Enviar el lote a Qdrant
        await client.upsert(QDRANT_COLLECTION_NAME, { points });
        
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        process.stdout.write(`\rInsertando lotes: ${batchNumber}/${totalBatches} (${i + batch.length}/${fragmentos.length})`);
    }
    
    console.log('\n✅ Fragmentos insertados correctamente');
}

/**
 * Verifica y muestra el total de puntos en la colección.
 */
async function verificarBD() {
    const info = await client.count(QDRANT_COLLECTION_NAME, { exact: true });
    console.log(`📊 Total fragmentos en Qdrant: ${info.count}`);
}

// --- Ejecución Principal ---
(async () => {
    try {
        await inicializarDB();
        await insertarFragmentos();
        await verificarBD();
        console.log('🎉 Base de datos cargada con éxito');
    } catch (error) {
        console.error('💥 Error durante la carga de la base de datos:', error.message);
        process.exit(1); // Sale con un código de error
    }
})();