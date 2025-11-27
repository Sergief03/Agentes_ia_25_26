// scripts/generarEmbedings.js
import { config } from 'dotenv';
import fs from 'fs/promises';

// URL y modelo de Ollama desde .env
config();
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';

/**
 * Genera embeddings para un texto usando Ollama
 * @param {string} texto
 * @returns {Promise<number[] | null>} vector de embedding o null si falla
 */
export async function generarEmbedings(texto) {
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
            throw new Error(`Error en la respuesta: ${response.statusText}`);
        }

        const data = await response.json();
        return data.embedding;
    } catch (error) {
        console.error('Error al generar embeddings:', error);
        return null;
    }
}

/**
 * Procesa todos los chunks del ROF y genera embeddings
 */
export async function procesarTodos() {
    try {
        // Leer los chunks generados por procesar_rof.js
        const chunksData = await fs.readFile('datos/chunks.json', 'utf-8');
        const chunks = JSON.parse(chunksData);
        const totalChunks = chunks.length;
        const embeddings = [];

        console.log(`Iniciando generación de embeddings para ${totalChunks} chunks...`);
        const startTime = Date.now();

        for (let i = 0; i < totalChunks; i++) {
            console.log(`Procesando ${i + 1}/${totalChunks}...`);
            const embedding = await generarEmbedings(chunks[i].contenido);

            if (embedding) {
                embeddings.push({
                    id: chunks[i].id,
                    contenido: chunks[i].contenido,
                    fuente: chunks[i].fuente,
                    pagina: chunks[i].pagina,
                    embedding: embedding
                });
            }
        }

        const endTime = Date.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(2);

        await fs.writeFile('datos/embeddings.json', JSON.stringify(embeddings, null, 2));

        console.log('✅ Embeddings generados exitosamente');
        console.log(`⏱ Generación completada en ${totalTime} segundos`);
        console.log('📁 Guardados en datos/embeddings.json');
        console.log(`📏 Dimensión de los embeddings: ${embeddings[0]?.embedding.length || 0}`);
    } catch (error) {
        console.error('Error al procesar los chunks:', error);
    }
}

// Ejecuta la función si se corre directamente
procesarTodos();

export default procesarTodos;
