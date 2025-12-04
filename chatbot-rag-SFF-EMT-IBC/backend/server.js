import { config } from "dotenv";
import express from "express";
import cors from "cors";

import procesarTodos, { generarEmbedings } from "./scripts/generar_embedings.js";
import multer from "multer";
import procesarROF from "./scripts/procesar_rof.js";
import { ejecutarCarga } from "./scripts/cargar_bd.js";
import { QdrantClient } from "@qdrant/qdrant-js";


config();
const API_PORT=process.env.API_PORT || 3000;

const QDRANT_URL = process.env.QDRANT_URL || 'http://localhost:6333';
const QDRANT_COLLECTION_NAME = process.env.QDRANT_COLLECTION_NAME || 'fragmentos_rof';
const OLLAMA_URL = process.env.OLLAMA_URL || 'http://localhost:11434';
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'nomic-embed-text';
const OLLAMA_LLM_MODEL = process.env.OLLAMA_MODEL_LLM || 'llama3.2:1b';

const client = new QdrantClient({ url: QDRANT_URL });

const app=express();

await procesarROF();
await procesarTodos();
await ejecutarCarga();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'datos/'); // 👉 Ruta donde guardar directamente
    },
    filename: function (req, file, cb) {
        const nombreFinal = Date.now() + '-' + file.originalname;
        cb(null, nombreFinal);
    }
});

const upload = multer({ storage });

app.use(cors());
app.use(express.json());

async function buscarFragmentosSimilares(consulta, limite = 3) {

    try{
        const embedding=await generarEmbedings(consulta);

        const resultados=await client.search(QDRANT_COLLECTION_NAME, {
            vector:embedding,
            limit:limite,
            with_payload:true,
            with_vector:false
        });

        return resultados.map(result=>({
            contenido:result.payload.contenido,
            fuente:result.payload.fuente,
            pagina:result.payload.pagina,
            similitud:result.score
        }));
    }catch(error){
        console.error('❌ Error en la búsqueda:',error);
        throw error;
    }
}

app.post("/buscar",async(req,res)=>{
    try{
        const {consulta,limite=3}=req.body;

        if(!consulta){
            return res.status(400).json({error:"Falta la consulta"});
        }

        console.log(`Busqueda: ${consulta}`);

        const resultados=await buscarFragmentosSimilares(consulta,limite);
        res.json({
            consulta,
            resultados,
            total:resultados.length
        });
    }catch(error){
        console.error('💥 Error en /api/buscar:', error);
        res.status(500).json({ 
            error: 'Error al procesar la búsqueda',
            detalle: error.message 
        });
    }
    
})

app.post("/chat",async (req,res)=>{
    try{
        const { mensaje, limite = 3 } = req.body;

        if(!mensaje){
            return res.status(400).json({error:"Falta el mensaje"});
        }

        console.log(`Chat: ${mensaje}`);

        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Transfer-Endcoding', 'chunked');

        const fragmentos=await buscarFragmentosSimilares(mensaje,limite);

        const prompt = `Eres un asistente del IES que responde preguntas sobre el Reglamento de Organización y Funcionamiento (ROF).

        Contexto relevante del ROF:
        ${fragmentos.map((c, i) => `${i + 1}. ${c.contenido}`).join('\n\n')}

        Pregunta del usuario: ${mensaje}

        Instrucciones:
        - Responde de forma clara y concisa basándote ÚNICAMENTE en el contexto proporcionado
        - Si el contexto no contiene información suficiente, indícalo claramente
        - Sé amable y profesional
        - Cita las fuentes cuando sea relevante

        Respuesta:`;

        const response=await fetch(`${OLLAMA_URL}/api/generate`,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                model:OLLAMA_LLM_MODEL,
                prompt,
                stream:true,
            })
        });

        if(!response.ok){
            throw new Error(`Error en la respuesta de Ollama: ${response.statusText}`);
        }

        const reader=response.body.getReader();
        const decoder=new TextDecoder();

        while(true){
            const { done, value }=await reader.read();
            if(done) break;

            const chunk=decoder.decode(value, {stream:false});
            const lines=chunk.split('\n');

            for(const line of lines){
                if(!line.trim()) continue;

                try{
                    const json=JSON.parse(line);
                    if(json.response){
                        res.write(JSON.stringify({
                            type: 'content',
                            text: json.response
                        })+ '\n')
                    }
                }catch(error){
                    console.error('Error parseando chunk de Ollama',error);
                }
            }
        }

        res.end();

    }catch(error){
        console.error('💥 Error en /chat:', error);
        // Si ya empezamos a enviar headers, enviamos un evento de error
        if (!res.headersSent) {
            res.status(500).json({ 
                error: 'Error al procesar el mensaje',
                detalle: error.message 
            });
        } else {
            res.write(JSON.stringify({ 
                type: 'error', 
                text: 'Error interno del servidor durante el streaming.' 
            }) + '\n');
            res.end();
        }
    }
})

app.post("/insertar", upload.single('archivo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "Falta el archivo" });
        }

        console.log('Archivo recibido:', req.file);

        const rutaArchivo = req.file.path; // Ruta completa del archivo guardado

        // Procesar el archivo y generar embeddings
        await procesarROF(rutaArchivo); // Si es asíncrona, usar await
        await procesarTodos();          // Si es asíncrona, usar await

        const carga = await ejecutarCarga(); // Asegurarnos que termine

        if (!carga.ok) {
            return res.status(400).json({ error: "Error al insertar el fragmento" });
        }

        res.json({
            ok: true,
            mensaje: "Fragmento insertado correctamente"
        });

    } catch (error) {
        console.error('💥 Error en /insertar:', error);
        res.status(500).json({
            error: 'Error al insertar el fragmento',
            detalle: error.message
        });
    }
});



app.get("/status",async (req,res)=>{
    try{
        const fragmentos=client.count(QDRANT_COLLECTION_NAME);

        const ollamaOk=await fetch(`${OLLAMA_URL}/api/tags`).ok;

        res.json({
            status:"ok",
            servicios:{
                qdrant:{
                    estado:fragmentos? true:false,
                    fragmentos:fragmentos || 0,
                },
                ollama:{
                    estado:ollamaOk? "conectado":"desconectado",
                    url:OLLAMA_URL,
                },
            },
            configuracion:{
                coleccion:QDRANT_COLLECTION_NAME,
                modelo_embeddings:OLLAMA_EMBEDDING_MODEL,
                modelo_llm:OLLAMA_LLM_MODEL
            },
        });
    }catch(error){
        console.error('💥 Error en /status:', error);
        res.status(500).json({ 
            error: 'Error al obtener el estado del servidor',
            detalle: error.message 
        });
    }
})


// Iniciar servidor
app.listen(API_PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║   🤖 Servidor RAG Chatbot Iniciado                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('');
    console.log(`📡 Servidor:              http://localhost:${API_PORT}`);
    console.log(`🌐 Frontend:              http://localhost:8081`);
    console.log(`🔍 API Búsqueda:          POST /api/buscar`);
    console.log(`💬 API Chat:              POST /api/chat`);
    console.log(`❤️  Health Check:         GET /api/health`);
    console.log('');
    console.log(`⚙️  Qdrant:               ${QDRANT_URL}`);
    console.log(`🧠 Ollama:                ${OLLAMA_URL}`);
    console.log(`📚 Colección:             ${QDRANT_COLLECTION_NAME}`);
    console.log(`🔢 Modelo Embeddings:     ${OLLAMA_EMBEDDING_MODEL}`);
    console.log(`🤖 Modelo LLM:            ${OLLAMA_LLM_MODEL}`);
    console.log('');
    console.log('✅ Listo para recibir consultas!');
    console.log('');
});