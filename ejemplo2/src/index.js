//IMPORTACIONES
import dotenv from "dotenv";

//Cargo las variables .env a este fichero
dotenv.config();
//todas las variables estan en process.env.NOMBRE

//mostrar por consola el valor de las variables de entorno
console.log("URL de acceso: " + process.env.URL);
console.log("Puerto: " + process.env.PORT);
console.log("URL con puerto: " + `${process.env.URL}:${process.env.PORT}`);
