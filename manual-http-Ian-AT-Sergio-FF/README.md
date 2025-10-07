# CRUD DOCUMENTATION

Documentación para explicar cómo realizar las operaciones **CRUD**

---

## Configuración Principal

Lo primero que hay que hacer, son las importaciones. En este caso solamente tenemos que hacer la importación del "dotenv" para poder cargar variables de entorno desde un archivo .env

>import dotenv from "dotenv";


Las variables de entorno definen la URL base:

```bash
API_BASE_URL=http://localhost
PORT=3000
```

Por lo tanto, la URL base será:

```
BASE_URL=http://localhost:3000
```

---
## CREATE

Con el CREATE tenemos que crear un nuevo estudiante en la base de datos y para eso tenemos que hacer lo siguiente:

### URL

Lo primero que hacemos, es crear la URL para los estudiantes:
>const url = BASE_URL + "/students";

### Comando `curl`

Después de crear la URL, ahora prosigue el comando CURL y este lo preparamos con los datos en JSON

```bash
curl -X POST "http://localhost:3000/students" -H "Content-Type: application/json" -d '{ "nombre": "Antonio", "edad": 43 }'
```
### Flags

| Flag | Significado |
|------|--------------|
| `-X POST` | Indica el método HTTP **POST** |
| `-H "Content-Type: application/json"` | Especifica que el cuerpo es JSON |
| `-d '{ ... }'` | Envía los datos en formato JSON |

### Resultado

Si te ha salido bien el comando, se tendria que ver algo así como lo siguiente:

**Código:** `201 Created`  
**Body:**
```json
{
  "id": 1,
  "nombre": "Antonio",
  "edad": 43
}
```
---
## READ ALL

Con el READ ALL, tenemos que leer todos los estudiantes de la base de datos para tener una lista con todos los estudiantes y para eso tenemos que hacer lo siguiente:

### URL

Lo primero que hacemos, es crear la URL para leer todos los estudiantes:
>const url = BASE_URL + "/students";

### Comando `curl`

Después de crear la URL, tenemos que hacer el comando CURL a través de una petición GET y para poder hacer eso, necesitamos colocar dentro del comando una cadena de carácteres y usar una variable que tenga la dirección del recurso que se quiere usar

```bash
const curl = 'curl -X GET "'+url+'"'
```

### Resultado

Si te ha salido bien el comando, se tendria que ver algo así como lo siguiente:

**Código:** `200 OK`  
**Body:**
```json
[
  { "id": 1, "nombre": "Antonio", "edad": 43 },
  { "id": 2, "nombre": "María", "edad": 25 }
]
```
---
## READ BY ID

Con el READ BY ID, tenemos que leer un estudiante por su ID y para eso tenemos que hacer lo siguiente:

### URL

Lo primero que hacemos, es crear la URL para leer los estudiantes por su ID y para que sea así, tenemos que agregar "**+id**" al después de "**students/**":
>const url = BASE_URL+"/students/"+id;

### Comando `curl`

Después de crear la URL, tenemos que hacer el comando CURL a través de una petición GET y para poder hacer eso, necesitamos colocar dentro del comando una cadena de carácteres y usar una variable que tenga la dirección del recurso que se quiere usar

```bash
const curl = 'curl -X GET "'+url+'"'
```

### Resultado

Si te ha salido bien el comando, se tendria que ver algo así como lo siguiente:

**Código:** `200 OK`  
**Body:**
```json
{
  "id": 1,
  "nombre": "Antonio",
  "edad": 43
}
```
**Si el ID no existe:**

**Código:** `404 Not Found`  
**Body:**
```json
{ "error": "Estudiante no encontrado" }
```

---
## UPDATE (PUT)

Con el UPDATE (PUT), tenemos que actualizar los datos de un estudiante por su ID y para eso tenemos que hacer lo siguiente:

### URL

Lo primero que hacemos, es crear la URL para actualizar los datos de un estudiante por su ID y para que sea así, tenemos que agregar "**+id**" al después de "**students/**":
>const url = BASE_URL + "/students";

### Comando `curl`

Después de crear la URL, ahora prosigue el comando CURL y este lo preparamos con los datos en JSON para poder actualizar los datos del estudiante

```bash
// Preparamos los datos en JSON en la variable data para mandar los campos actualizados
const data = '{ "nombre": "'+studentData.nombre+'", "edad": '+studentData.edad + ' }';

// comando curl con PUT para que se actualicen los datos
const curl = 'curl -X PUT "' + url + '" -H "Content-Type: application/json" -d \'' + data+ '\'';
```

### Resultado

Si te ha salido bien el comando, se tendria que ver algo así como lo siguiente:

**Código:** `200 OK`  
**Body:**
```json
{
  "id": 1,
  "nombre": "Antonio Lovato",
  "edad": 45
}
```

**Si el ID no existe:**
**Código:** `404 Not Found`

---

## PATCH

Con el PATCH, tenemos que actualizar algunos campos de los datos de un estudiante por su ID y para eso tenemos que hacer lo siguiente:

### URL

Lo primero que hacemos, es crear la URL para actualizar los datos de un estudiante por su ID y para que sea así, tenemos que agregar "**+id**" al después de "**students/**":
>const url = BASE_URL + "/students";

### Comando `curl`

Después de crear la URL, ahora prosigue el comando CURL y este lo preparamos con los datos en JSON para poder actualizar algunos de los datos del estudiante

```bash
// Preparamos los datos en JSON para mandar los campos actualizados
const data = '{ "edad": '+partialData.edad+' }';

// comando curl con PATCH para actualizar los datos parcialmente
const curl = 'curl -X PATCH "'+url+'" -H "Content-Type: application/json" -d \''+data+'\'';
```

### Resultado

Si te ha salido bien el comando, se tendria que ver algo así como lo siguiente:

**Código:** `200 OK`  
**Body:**
```json
{
  "id": 1,
  "nombre": "Antonio Lovato",
  "edad": 49
}
```

---

## DELETE

Con el DELETE, tenemos que eliminar un estudiante por su ID y para eso tenemos que hacer lo siguiente:

### URL

Lo primero que hacemos, es crear la URL para eliminar los datos de un estudiante por su ID y para que sea así, tenemos que agregar "**+id**" al después de "**students/**":

### Comando `curl`

Después de crear la URL, tenemos que hacer el comando CURL a través de DELETE y para eliminar ese estudiante, necesitamos colocar dentro del comando una cadena de carácteres y usar una variable que tenga la dirección del recurso que se quiere usar

```bash
const curl = 'curl -X DELETE "'+url+'"';
```

### Resultado

**Código:** `204 No Content`  
(Sin cuerpo)

**Si el ID no existe:**

**Código:** `404 Not Found`  
**Body:**
```json
{ "error": "Estudiante no encontrado" }
```
---

## Explicación de las Flags de `curl`

| Flag | Descripción |
|------|--------------|
| `-i` | Muestra **headers** y **body** de la respuesta |
| `-X` | Especifica el método HTTP (**GET**, **POST**, **PUT**, etc.) |
| `-H` | Añade encabezados a la petición |
| `-d` | Envía datos en el cuerpo de la petición (solo para **POST**, **PUT**, **PATCH**) |

---

## Códigos del Estado HTTP

| Código | Significado | Uso |
|--------|--------------|-----|
| `200 OK` | Petición exitosa | GET, PUT, PATCH |
| `201 Created` | Recurso creado correctamente | POST |
| `204 No Content` | Eliminación exitosa, sin cuerpo | DELETE |
| `400 Bad Request` | Datos enviados no válidos | POST, PUT, PATCH |
| `404 Not Found` | Recurso no encontrado | GET, PUT, PATCH, DELETE |
| `500 Internal Server Error` | Error en el servidor | General |