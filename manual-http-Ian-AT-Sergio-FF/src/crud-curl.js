// IMPORTACIONES
import { config } from "dotenv";
import { exec } from "child_process";

// DECLARACION DE VARIABLES
config();

console.log("----- Comienzo de la ejecución del script -----");

const API_URL = process.env.API_BASE_URL + ":" + process.env.PORT;

// --- CRUD de estudiantes ---

/**
 * Crear un nuevo estudiante
 * @param {Object} studentData - Datos del estudiante
 */
export const createStudent = (studentData) => {
  // Se crea la URL para estudiantes
  const URL_BASE = `${API_URL}/students`;
  
  // Preparamos los datos en JSON. (Estos datos se envían a la petición)
  const data = JSON.stringify({ nombre: studentData.nombre, edad: studentData.edad }).replace(/"/g, '\\"');
  
  // Comando curl con el método POST 
  const cmd = `curl -s -X POST "${URL_BASE}" -H "Content-Type: application/json" -d "${data}"`;

  console.log("Crear estudiante:");
  console.log(cmd);

  // Ejecuta el comando curl y maneja el resultado
  exec(cmd, (error, stdout, stderr) => {
    if (error) return console.error(`Error ejecutando curl: ${error.message}`);
    if (stderr) console.error(`stderr: ${stderr}`);

    try {
      const result = JSON.parse(stdout);
      console.log(result);
    } catch {
      console.log(stdout);
    }
  });
};

/**
 * Leer todos los estudiantes
 */
export const getAllStudents = () => {
  // Se crea la URL para estudiantes
  const URL_BASE = `${API_URL}/students`;

  // Comando curl con el método GET para hacer una petición
  const cmd = `curl -s -X GET "${URL_BASE}"`;

  console.log("Leer todos los estudiantes:");
  console.log(cmd);

  // Ejecuta el comando curl y maneja el resultado
  exec(cmd, (error, stdout, stderr) => {
    if (error) return console.error(`Error ejecutando curl: ${error.message}`);
    if (stderr) console.error(`stderr: ${stderr}`);

    try {
      const result = JSON.parse(stdout);
      console.log(result);
    } catch {
      console.log(stdout);
    }
  });
};

/**
 * Lee un estudiante por su ID
 * @param {Number} id 
 */
export const getStudentById = (id) => {
  // Se crea la URL con el id del estudiante
  const URL_BASE = `${API_URL}/students/${id}`;

  // comando curl para leer a un solo estudiante
  const cmd = `curl -s -X GET "${URL_BASE}"`;

  console.log("Leer estudiante por ID:");
  console.log(cmd);
  
  // Ejecuta el comando curl y maneja el resultado
  exec(cmd, (error, stdout, stderr) => {
    if (error) return console.error(`Error ejecutando curl: ${error.message}`);
    if (stderr) console.error(`stderr: ${stderr}`);

    try {
      const result = JSON.parse(stdout);
      console.log(result);
    } catch {
      console.log(stdout);
    }
  });
};

/**
 * Actualizar un estudiante
 * @param {Number} id - Id del estudiante
 * @param {Object} studentData - Datos del estudiante
 */
export const updateStudent = (id, studentData) => {
  // Se crea la URL con el id del estudiante
  const URL_BASE = `${API_URL}/students/${id}`;

  // Preparamos los datos en JSON para mandar los campos actualizados
  const data = JSON.stringify({ nombre: studentData.nombre, edad: studentData.edad }).replace(/"/g, '\\"');
  
  // comando curl con PUT para que se actualicen los datos
  const cmd = `curl -s -X PUT "${URL_BASE}" -H "Content-Type: application/json" -d "${data}"`;

  console.log("Actualizar estudiante:");
  console.log(cmd);

  // Ejecuta el comando curl y maneja el resultado
  exec(cmd, (error, stdout, stderr) => {
    if (error) return console.error(`Error ejecutando curl: ${error.message}`);
    if (stderr) console.error(`stderr: ${stderr}`);

    try {
      const result = JSON.parse(stdout);
      console.log(result);
    } catch {
      console.log(stdout);
    }
  });
};

/**
 * Actualiza algunos campos del estudiante
 * @param {Number} id - Id del estudiante
 * @param {Object} partialData - Datos del estudiante
 */
export const patchStudent = (id, partialData) => {
  // Se crea la URL con el id del estudiante
  const URL_BASE = `${API_URL}/students/${id}`;

  // Preparamos los datos en JSON para mandar los campos actualizados
  const data = JSON.stringify({ edad: partialData.edad }).replace(/"/g, '\\"');

  // comando curl con PATCH para actualizar los datos parcialmente
  const cmd = `curl -s -X PATCH "${URL_BASE}" -H "Content-Type: application/json" -d "${data}"`;

  console.log("Actualizar parcialmente estudiante:");
  console.log(cmd);

  // Ejecuta el comando curl y maneja el resultado
  exec(cmd, (error, stdout, stderr) => {
    if (error) return console.error(`Error ejecutando curl: ${error.message}`);
    if (stderr) console.error(`stderr: ${stderr}`);

    try {
      const result = JSON.parse(stdout);
      console.log(result);
    } catch {
      console.log(stdout);
    }
  });
};

/**
 * Elimina un estudiante por el Id
 * @param {Number} id - Id del estudiante
 */
export const deleteStudent = (id) => {
  // Se crea la URL con el id del estudiante
  const URL_BASE = `${API_URL}/students/${id}`;
  
  // comando curl con DELETE para eliminar a un estudiante
  const cmd = `curl -s -X DELETE "${URL_BASE}"`;

  console.log("Eliminar estudiante:");
  console.log(cmd);

  // Ejecuta el comando curl y maneja el resultado
  exec(cmd, (error, stdout, stderr) => {
    if (error) return console.error(`Error ejecutando curl: ${error.message}`);
    if (stderr) console.error(`stderr: ${stderr}`);

    try {
      const result = JSON.parse(stdout);
      console.log(result);
    } catch {
      console.log(stdout);
    }
  });
};

// --- Ejemplo de ejecución secuencial usando callbacks ---

  createStudent({ nombre: "Antonio", edad: 43 });

  // Nota: Como las funciones usan exec() asíncrono, si quieres secuenciar,
  // debes anidar llamadas o usar callbacks dentro de cada exec() si necesitas
  // que un paso ocurra después del anterior.
  // Aquí solo mostramos ejecución independiente de ejemplo.
  getAllStudents();
  getStudentById(1);
  updateStudent(1, { nombre: "Antonio Lovato", edad: 45 });
  patchStudent(1, { edad: 49 });
  deleteStudent(1);

  console.log("----- Fin de la ejecución del script -----");