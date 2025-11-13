import express from "express";
import { config } from "dotenv";
import cors from "cors";


config();

const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || "0.0.0.0";
const SERVER_URL = process.env.SERVER_URL || "http://localhost";
const NODE_ENV = process.env.NODE_ENV;
const AI_API_URL=process.env.AI_API_URL;
const AI_MODEL=process.env.AI_MODEL;


const app = express();

app.use(cors());

app.use(express.json());

const getAppInfo=()=>{
    return {
        name:"mini-server backend ollama",
        version:'1.0.0',
        status:"running",
        descripcion:"Servidor backend para manejar la api de ollama",
        endpoints:{
            'GET /api': 'Infromacion basica del servidor y del modelo de IA',
            'GET /api/modelos': 'Infromacion del modelo de IA configurado en ollama',
            'POST /api/consulta': 'Enviar un prompt al modelo de IA y recibir la respuesta',
        },
        model:AI_MODEL,
        host:`${HOST}:${PORT}`,
        ollama:{
            url:AI_API_URL
        }
    }
}

app.get("/", (req, res) => {
    res.json(getAppInfo());
});

app.get("/api", (req, res) => {
    res.json(getAppInfo());
});

//Enpoint para obtener la informacion del modelo de IA
app.get("/api/modelos", async (req, res) => {
    try {
    const response = await fetch(`${AI_API_URL}/api/tags`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) {
      throw new Error(
        `Error en la respuesta de la API de Ollama: ${response.statusText}`
      );
    }

    const data = await response.json();
    const models = data.models || [];
    res.json({
        total:models.length,
        models,
        origen: AI_API_URL
    });
    res.status(200);
  } catch (error) {
    console.error("Error al obtener los modelos:", error);
    res.status(502).json({
      error: "Error al obtener los modelos",
      message: error.message,
    });
  }
});

app.post("/api/consulta", async (req, res) => {
    const { prompt,model } = req.body || {};

    if(!prompt||typeof prompt!=="string"){
        return res.status(400).json({error:"Error al escribir el prompt"});
    }

    const targetModel=model||AI_MODEL;

    try{
        //peticion a Ollama
        const response = await fetch(`${AI_API_URL}/api/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                model: targetModel,
                prompt,
                stream: false,
            }),
        });

        if (!response.ok) {
            throw new Error(`Error en la respuesta de la API de Ollama: ${response.statusText}`);
        }

        const data = await response.json();

        res.json({
            prompt,
            modelos: targetModel,
            respuesta: data.response,
            latencyMs: data.latencyMs,
            origen: AI_API_URL,
        });
        res.status(200);

    }catch(error){
        console.error("Error al obtener los modelos:", error);
        res.status(502).json({
          error: "Error al obtener los modelos",
          message: error.message,
        });
    }
});




app.listen(PORT, HOST, () => {
  console.log(
    "--------------------- Mini-server backend ollama funcionando by Sergio Fernandez -----------------------"
  );
  console.log(
    `Servidor API-Ollama escuchando en ${SERVER_URL} - Modo: ${NODE_ENV}`
  );
  console.log("\t Escuchando peticiones");
  console.log(`Porfavir accede a ${SERVER_URL}/api para ver la infromacion del servidor `)
  console.log(`Asegurate de que el servicio de IA esten corriendo en ${AI_API_URL}`);
});