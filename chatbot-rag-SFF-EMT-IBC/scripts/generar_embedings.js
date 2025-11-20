import fs from 'fs/promises';
import fetch from 'node-fetch';
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';

//generarEmbedings(texto)
// Realiza POST a http://localhost:11434/api/embeddings
// Envía modelo nomic-embed-text y el texto
// Retorna array de números (vector ~768 dimensiones)
// Maneja errores si Ollama no disponible
async function generarEmbedings(texto) {
    try {
        const response = await fetch('http://localhost:11434/api/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: OLLAMA_EMBEDDING_MODEL,
                input: texto
            })
        });
        if (!response.ok) {
            throw new Error(`Error en la respuesta: ${response.statusText}`);
        }
        const data = await response.json();
        return data.embedding;
    }
    catch (error) {
        console.error('Error al generar embeddings:', error);
        return null;
    }
}

//procesarTodos()
// Lee datos/chunks.json
// Por cada chunk, genera embedding
// Muestra progreso: Procesando 1/87...
// Guarda resultado en datos/embeddings.json
async function procesarTodos() {
    try {
        const chunksData = await fs.readFile('datos/embeddings.json', 'utf-8');
        const chunks = JSON.parse(chunksData);
        const totalChunks = chunks.length;
        const embeddings = [];
        console.log(`Iniciando generación de embeddings para ${totalChunks} chunks...`);
        const startTime = Date.now();
        for (let i = 0; i < totalChunks; i++) {
            console.log(`Procesando ${i + 1}/${totalChunks}...`);
            const embedding = await generarEmbedings(chunks[i].text);
            if (embedding) {
                embeddings.push({
                    id: chunks[i].id,
                    embedding: embedding
                });
            }
        }
        const endTime = Date.now();
        const totalTime = ((endTime - startTime) / 1000).toFixed(2);
        await fs.writeFile('datos/embeddings.json', JSON.stringify(embeddings, null, 2));
        console.log(`Embeddings generados exitosamente`)
        console.log(`Generación de embeddings completada en ${totalTime} segundos.`);
        console.log(`Guardados en datos/embeddings.json`);
        console.log(`Dimensión de los embeddings: ${embeddings[0]?.embedding.length || 0}`);
    }
    catch (error) {
        console.error('Error al procesar los chunks:', error);
    }
}

// Mostrar en consola:
// Estado de conexión a Ollama
// Barra de progreso o contador
// Tiempo total de procesamiento
// Dimensión de embeddings
