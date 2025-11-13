import express from "express";
import { config } from "dotenv";
import cors from "cors";

//0. Crear las variables de entorno cargadas en memoria
config();

//1. Crear un servidor con express

const app = express();

//2. Crear variables basandonos en las variables de entorno cargadas
const PORT = process.env.PORT || 3002;
const HOST = process.env.HOST || "0.0.0.0";
const NODE_ENV = process.env.NODE_ENV || "development";
const SERVER_URL = process.env.SERVER_URL || `http://${HOST}:${PORT}`;
const AI_API_URL = process.env.AI_API_URL || "http://localhost:11434";
const AI_MODEL = process.env.AI_MODEL || "llama3.2:1b";

//3. Middlewares para habilitar CORS y parseo de JSON en los navegadores
app.use(cors());
app.use(express.json());

//4. (Opcional) Funcion que muestre informacion al usuario
const getInfoApi = () => ({
  service: "Servicio api-ollama",
  status: "ready",
  endpoints: {
    "GET /api": "Info de la API-Ollama",
    "GET /api/modelos": "Mostramos informacion de los modelos disponibles",
    "POST /api/consulta": "Enviar un prompt para reazalizar consultas a la IA",
  },
  model: `${AI_MODEL}`,
  host: `${HOST}:${PORT}`,
  ollama_url: `${AI_API_URL}`,
});

//5. Generar los endpoints
app.get("/", (req, res) => {
  res.json(getInfoApi());
});

app.get("/api", (req, res) => {
  res.json(getInfoApi());
});

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
    res.json(models.map((model) => ({ modelo: model.name })));
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
  const { prompt, model } = req.body || {};

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Error al escribir el prompt" });
  }

  const modelSelected = model || AI_MODEL;

  try {
    const response = await fetch(`${AI_API_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: modelSelected,
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
      model: modelSelected,
      respuesta: data.response,
    });
  } catch (error) {
    console.error("Error al realizar la consulta:", error);
    res.status(502).json({
      error: "Error al realizar la consulta",
      message: error.message,
    });
  }
});


//6. Levantar el servidor para escuchar peticiones
app.listen(PORT, HOST, () => {
  console.log(
    "--------------------- Servidor express funcionando -----------------------"
  );
  console.log(
    `Servidor API-Ollama escuchando en ${SERVER_URL} - Modo: ${NODE_ENV}`
  );
  console.log("\t Escuchando peticiones");
});
