// IMPORTACIONES
import dotenv from "dotenv";

//Cargo las variables .env a este fichero
dotenv.config();

//mostrar por consola el valor de las variables de entorno
console.log("URL de acceso: " + process.env.PORT);
console.log("Puerto: " + process.env.API_BASE_URL);

// Construir la BASE_URL completa
const BASE_URL = process.env.API_BASE_URL + ":" + process.env.PORT;
console.log("BASE_URL completa: " + BASE_URL);

/**
 * Crea un nuevo estudiante
 * @param {Object} studentData -Datos del estudiante
 */
function createStudent(studentData){
    
    // Se crea la URL para estudiantes
    const url = BASE_URL + "/students";

    // Preparamos los datos en JSON. (Estos datos se envían a la petición)
    const data = '{ "nombre": "'+studentData.nombre+'", "edad": '+studentData.edad + ' }';

    // Comando curl con el método POST 
    const curl = 'curl -X POST "' + url + '" -H "Content-Type: application/json" -d \'' +data+ '\'';
    
    // Se muestra el comando por consola, si se ha hecho bien devuelve true o flase si no se ha hecho bien
    console.log("Crear estudiante:");
    console.log(curl);
}

/**
 * Lee todos los estudiantes
 */
function readAllStudents(){

    // Se crea la URL para estudiantes
    const url = BASE_URL + "/students";
    
    // comando curl con el método GET para hacer una petición
    const curl = 'curl -X GET "'+url+'"';

    // Se muestra el comando por consola, si se ha hecho bien devuelve true o flase si no se ha hecho bien
    console.log("Leer estudiantes:");
    console.log(curl);
}

/**
 * Lee un estudiante por su ID
 * @param {Number} id 
 */
function readStudentsById(id){

    // Se crea la URL con el id del estudiante
    const url = BASE_URL+"/students/"+id;

    // comando curl para leer a un solo estudiante
    const curl = 'curl -X GET "'+url+'"';

    // Se muestra el comando por consola, si se ha hecho bien devuelve true o flase si no se ha hecho bien
    console.log("Leer estudiantes por Id:");
    console.log(curl);
}

/**
 * Actualizar un estudiante
 * @param {Number} id -Id del estudiante
 * @param {Object} studentData - Datos del estudiante
 */
function updateStudent(id, studentData){

    // Se crea la URL con el id del estudiante
    const url = BASE_URL+"/students/"+id;

    // Preparamos los datos en JSON para mandar los campos actualizados
    const data = '{ "nombre": "'+studentData.nombre+'", "edad": '+studentData.edad + ' }';

    // comando curl con PUT para que se actualicen los datos
    const curl = 'curl -X PUT "' + url + '" -H "Content-Type: application/json" -d \'' + data+ '\'';

    // Se muestra el comando por consola, si se ha hecho bien devuelve true o flase si no se ha hecho bien
    console.log("Actualizar estudiante:");
    console.log(curl);
}

/**
 * Actualiza algunos campos del estudiante
 * @param {Number} id -Id del estudiante
 * @param {Object} partialData 
 */
function patchStudent(id, partialData){

    // Se crea la URL con el id del estudiante
    const url = BASE_URL+"/students/"+id;

    // Preparamos los datos en JSON para mandar los campos actualizados
    const data = '{ "edad": '+partialData.edad+' }';

    // comando curl con PATCH para actualizar los datos parcialmente
    const curl = 'curl -X PATCH "'+url+'" -H "Content-Type: application/json" -d \''+data+'\'';

    // Se muestra el comando por consola, si se ha hecho bien devuelve true o flase si no se ha hecho bien
    console.log("Actualizar parcialmente");
    console.log(curl);
}

/**
 * Elimina un estudiante por el Id
 * @param {Number} id -Id del estudiante
 */
function deleteStudent(id){

    // Se crea la URL con el id del estudiante
    const url = BASE_URL+"/students/"+id;

    // comando curl con DELETE para eliminar el esutidante
    const curl = 'curl -X DELETE "'+url+'"';

    // Se muestra el comando por consola, si se ha hecho bien devuelve true o flase si no se ha hecho bien
    console.log("Eliminar estudiante: ");
    console.log(curl);
}

// ---Ejecución del Script---

createStudent({nombre: "Antonio", edad: 43});
readAllStudents();
readStudentsById(1);
updateStudent(1, {nombre: "Antonio Lovato", edad: 45});
patchStudent(1, {edad:49});
deleteStudent(1);