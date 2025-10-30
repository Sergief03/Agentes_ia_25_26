// Fichero encargado de levantar una API REST con Express
//IMPORT
import { config } from "dotenv";
import express from "express";
import cors from "cors";
import dataAPI from "./db/db.js";


//VARIABLES
config();

const SERVER_URL=process.env.SERVER_URL || "http://localhost";
const PORT=process.env.PORT || 4001;
const NODE_ENV=process.env.NODE_ENV;
const HOST=process.env.HOST;

const app=express();

app.use(cors());

//voy a permitir JSOn como cuerpo de peticiones

app.use(express.json());

//midleware

app.use((req,res,next)=>{
    const timeData=new Date().toISOString();
    console.log(`${timeData} ${req.method} ${req.url} - IP ${req.ip}`);

    next();
})

//Bienvenida...
app.get("/", (req, res) => {
  res.json({
    mensaje: "Mini API de posts de alumnos",
    version: "1.0",
    endpoints: {
      "GET /usuarios": "Obtiene todos los usuarios",
      "POST /usuarios": "Crea un nuevo usuario",
      "PUT /usuarios/:id": "Actualiza un usuario existente",
      "DELETE /usuarios/:id": "Elimina un usuario por ID"
    },
  });
});

// GET → obtener todos los usuarios
app.get("/usuarios", (req, res) => {
  res.json({
    success: true,
    data: dataAPI,
    count: dataAPI.length,
  });
});

// POST → crear nuevo usuario
app.post("/usuarios", (req, res) => {
  const { nombre, email, username, passwordHash, rol, activo } = req.body;

  if (!nombre || !email || !username || !passwordHash) {
    return res.status(400).json({
      success: false,
      message: "Faltan campos obligatorios (nombre, email, username o passwordHash).",
    });
  }

  const nuevoUsuario = {
    id: dataAPI.length > 0 ? dataAPI[dataAPI.length - 1].id + 1 : 1,
    fechaCreacion: new Date().toISOString(),
    nombre,
    email,
    username,
    passwordHash,
    rol: rol || "usuario",
    activo: activo ?? true,
  };

  dataAPI.push(nuevoUsuario);

  res.status(201).json({
    success: true,
    message: "Usuario creado correctamente",
    data: nuevoUsuario,
  });
});

// PUT → actualizar usuario existente
app.put("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = dataAPI.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  dataAPI[index] = {
    ...dataAPI[index],
    ...req.body,
    id,
  };

  res.json({
    success: true,
    message: "Usuario actualizado correctamente",
    data: dataAPI[index],
  });
});

// DELETE → eliminar usuario
app.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = dataAPI.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  const eliminado = dataAPI.splice(index, 1)[0];

  res.json({
    success: true,
    message: "Usuario eliminado correctamente",
    deleted: eliminado,
    count: dataAPI.length,
  });
});

app.listen(PORT,HOST,()=>{
    console.log(`Servidor de Sergio Fernández -----> ${HOST}:${PORT}`)
})