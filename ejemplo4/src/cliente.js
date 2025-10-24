// el fichero cliente lanzara peticiones a las API REST
import { config } from "dotenv";

config();

const SERVER_URL = process.env.SERVER_URL || "http://localhost";
const PORT = process.env.PORT || 4001;
const NODE_ENV = process.env.NODE_ENV;
const HOST = process.env.HOST;

const apiUrl = `${SERVER_URL}:${PORT}/usuarios`;


//  GET → Obtener todos los usuarios

const traerUsuarios = async () => {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error("Error al traer los usuarios");
    const data = await response.json();
    console.log(" Usuarios recibidos:", data);
  } catch (error) {
    console.error(" Error:", error.message);
  }
};


// POST → Crear un nuevo usuario

const crearUsuario = async (usuario) => {
  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario),
    });

    if (!response.ok) throw new Error("Error al crear el usuario");
    const data = await response.json();
    console.log(" Usuario creado correctamente:", data);
  } catch (error) {
    console.error(" Error:", error.message);
  }
};


// PUT → Actualizar un usuario existente

const actualizarUsuario = async (id, nuevosDatos) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevosDatos),
    });

    if (!response.ok) throw new Error("Error al actualizar el usuario");
    const data = await response.json();
    console.log("Usuario actualizado correctamente:", data);
  } catch (error) {
    console.error(" Error:", error.message);
  }
};

//  DELETE → Eliminar un usuario por ID

const eliminarUsuario = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) throw new Error("Error al eliminar el usuario");
    const data = await response.json();
    console.log(" Usuario eliminado correctamente:", data);
  } catch (error) {
    console.error(" Error:", error.message);
  }
};

const ejecutarCRUD = async () => {
  await traerUsuarios();

  await crearUsuario({
    nombre: "Juana Morales",
    email: "juana@example.com",
    username: "juanam",
    passwordHash: "hash123456",
    rol: "usuario",
    activo: true,
  });

  await actualizarUsuario(11, { nombre: "Elena G. Actualizada", activo: false });

  await eliminarUsuario(11);

  await traerUsuarios(); // Ver el estado final
};

ejecutarCRUD();