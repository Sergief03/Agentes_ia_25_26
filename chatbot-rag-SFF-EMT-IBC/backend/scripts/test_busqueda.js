// scripts/test_busqueda.js
import dotenv from 'dotenv';
import { QdrantClient } from '@qdrant/qdrant-js';

dotenv.config('../.env');

// --- Configuración ---
const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME || 'fragmentos_rof';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';

const client = new QdrantClient({ url: QDRANT_URL });

// --- Funciones ---

/**
 * Calcula la similitud de coseno entre dos vectores
 * @param {number[]} v1 - Primer vector
 * @param {number[]} v2 - Segundo vector
 * @returns {number} Similitud de coseno (0-1, donde 1 = idénticos)
 */
function calcularSimilitud(v1, v2) {
    if (!v1 || !v2 || v1.length !== v2.length) return 0;
    
    // Producto punto
    const dot = v1.reduce((acc, val, i) => acc + val * v2[i], 0);
    
    // Magnitudes
    const mag1 = Math.sqrt(v1.reduce((acc, val) => acc + val * val, 0));
    const mag2 = Math.sqrt(v2.reduce((acc, val) => acc + val * val, 0));
    
    // Similitud de coseno
    return mag1 && mag2 ? dot / (mag1 * mag2) : 0;
}

/**
 * Genera un embedding para un texto usando Ollama
 * @param {string} texto - Texto para generar embedding
 * @returns {Promise<number[]>} Vector de embedding
 */
async function generarEmbedding(texto) {
    try {
        const response = await fetch(`${OLLAMA_URL}/api/embeddings`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: OLLAMA_EMBEDDING_MODEL,
                prompt: texto
            })
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta de Ollama: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.embedding) {
            throw new Error("No se encontró 'embedding' en la respuesta de Ollama");
        }
        
        return data.embedding;
    } catch (error) {
        console.error('❌ Error al generar embedding:', error);
        throw error;
    }
}

/**
 * Busca fragmentos similares a la consulta usando Qdrant
 * @param {string} consulta - Texto de consulta
 * @param {number} limite - Número máximo de resultados
 * @returns {Promise<Array>} Array de fragmentos similares con puntuación
 */
async function buscarFragmentosSimilares(consulta, limite = 3) {
    try {
        // Generar embedding de la consulta
        const embeddingConsulta = await generarEmbedding(consulta);

        // Buscar en Qdrant usando búsqueda vectorial
        const resultados = await client.search(QDRANT_COLLECTION_NAME, {
            vector: embeddingConsulta,
            limit: limite,
            with_payload: true,
            with_vector: false
        });

        // Formatear resultados
        return resultados.map(result => ({
            contenido: result.payload.contenido,
            fuente: result.payload.fuente,
            pagina: result.payload.pagina,
            similitud: result.score // Qdrant ya calcula la similitud de coseno
        }));
    } catch (error) {
        console.error('❌ Error en la búsqueda:', error);
        throw error;
    }
}

/**
 * Muestra los resultados de búsqueda formateados
 * @param {string} consulta - Consulta realizada
 * @param {Array} resultados - Array de resultados
 */
function mostrarResultados(consulta, resultados) {
    console.log(`\n🔍 Buscando fragmentos similares a: "${consulta}"`);
    console.log('📍 Resultados (similitud):\n');
    
    if (resultados.length === 0) {
        console.log('   ⚠️  No se encontraron resultados');
        return;
    }
    
    resultados.forEach((resultado, index) => {
        const score = resultado.similitud.toFixed(2);
        const contenidoCorto = resultado.contenido.length > 80 
            ? resultado.contenido.substring(0, 77) + '...' 
            : resultado.contenido;
        
        console.log(`${index + 1}. [${score}] "${contenidoCorto}"`);
    });
}

// --- Ejecución de pruebas ---
export async function ejecutarPruebasBusqueda() {
    try {
        // Verificar que Qdrant tenga datos
        const count = await client.count(QDRANT_COLLECTION_NAME);

        if (!count || count.count === 0) {
            console.error('❌ La colección está vacía. Ejecuta primero: npm run cargar-bd');
            return; // Salimos de la función sin terminar todo el proceso
        }

        console.log(`✅ Colección encontrada con ${count.count} fragmentos\n`);
        console.log('═'.repeat(80));

        // Ejemplos de consultas de prueba
        const consultas = [
            "¿Cuál es el horario de entrada?",
            "¿Qué hacer ante inasistencias?",
            "Uniforme del centro"
        ];

        // Ejecutar búsquedas para cada consulta
        for (const consulta of consultas) {
            const resultados = await buscarFragmentosSimilares(consulta, 3);
            mostrarResultados(consulta, resultados);
            console.log('\n' + '─'.repeat(80));
        }

        console.log('\n✅ Pruebas de búsqueda completadas');

    } catch (error) {
        console.error('\n💥 Error en búsqueda semántica:', error.message);
    }
}

export { calcularSimilitud, generarEmbedding, buscarFragmentosSimilares };

