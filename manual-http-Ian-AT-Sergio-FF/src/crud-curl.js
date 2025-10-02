// IMPORTACIONES
import dotenv from "dotenv";

//Cargo las variables .env a este fichero
dotenv.config();

//mostrar por consola el valor de las variables de entorno
console.log("URL de acceso: " + process.env.PORT);
console.log("Puerto: " + process.env.API_BASE_URL);

// Construir la BASE_URL completa
console.log("BASE_URL completa: " + `${process.env.API_BASE_URL}:${process.env.PORT}`);

