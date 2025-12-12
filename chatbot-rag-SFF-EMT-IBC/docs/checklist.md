# ✅ Checklist del Proyecto Chatbot RAG

> Este checklist ha sido actualizado para reflejar el estado completo del proyecto, incluyendo la fase de ingesta, el backend, el frontend y el despliegue con Docker.

---

## 1. Configuración del Entorno y Pipeline de Datos

| Tarea              | Requisito                                                                                              | Estado |
| :----------------- | :----------------------------------------------------------------------------------------------------- | :----: |
| **Estructura**     | Organizar el proyecto en carpetas `backend`, `frontend`, `docs` y `public`.                            |  [x]   |
| **Git**            | Inicializar y gestionar el control de versiones con Git.                                               |  [x]   |
| **Dependencias**   | Gestionar dependencias del backend con `package.json`.                                                 |  [x]   |
| **Dependencias**   | Instalar: `dotenv`, `@qdrant/qdrant-js`, `express`, `cors`, etc.                                       |  [x]   |
| **Scripts npm**    | Configurar scripts: `procesar`, `embeddings`, `cargar-bd`, `ingesta`, `test-busqueda`, `dev`, `start`. |  [x]   |
| **Archivo Fuente** | Usar `PLAN-DE-CENTRO-SIMPLE.txt` como documento base.                                                  |  [x]   |
| **Configuración**  | Crear `.env` para variables de entorno (URLs, modelos, etc.).                                          |  [x]   |
| **Configuración**  | Proveer `.env.example` como plantilla.                                                                 |  [x]   |
| **.gitignore**     | Ignorar `node_modules/`, `.env`, y archivos generados como `chunks.json` y `embeddings.json`.          |  [x]   |

---

## 2. Scripts de Ingesta y Pruebas

| Script                              | Requisito                                                                | Resultado Esperado                                | Estado |
| :---------------------------------- | :----------------------------------------------------------------------- | :------------------------------------------------ | :----: |
| **Sergio**                          |
| **`scripts/procesar_rof.js`**       | Lee el `.txt` y lo divide en fragmentos (`chunks`).                      | Genera `backend/datos/chunks.json`.               |  [x]   |
|                                     | Filtra párrafos de menos de 100 caracteres.                              |                                                   |  [x]   |
|                                     | Crea estructura JSON: `{ id, contenido, fuente, pagina }`.               |                                                   |  [x]   |
| **Esther**                          |
| **`scripts/generar_embeddings.js`** | Llama a Ollama para convertir cada chunk en un vector.                   | Genera `backend/datos/embeddings.json`.           |  [x]   |
|                                     | Usa el modelo `nomic-embed-text`.                                        |                                                   |  [x]   |
|                                     | Muestra barra de progreso y tiempo de ejecución.                         |                                                   |  [x]   |
| **Iván**                            |
| **`scripts/cargar_bd.js`**          | Se conecta a la base de datos vectorial **Qdrant**.                      | Carga los datos en la colección `fragmentos_rof`. |  [x]   |
|                                     | Lee `embeddings.json` e inserta los puntos (vectores + payload).         |                                                   |  [x]   |
|                                     | Usa inserción por lotes (`batching`) para optimizar.                     |                                                   |  [x]   |
|                                     | Verifica la carga al finalizar.                                          |                                                   |  [x]   |
| **Sergio**                          |
| **`scripts/test_busqueda.js`**      | Realiza consultas de prueba contra Qdrant.                               |                                                   |  [x]   |
|                                     | Genera el embedding de la consulta y busca los fragmentos más similares. |                                                   |  [x]   |
|                                     | Muestra los resultados y su puntuación de similitud en la consola.       |                                                   |  [x]   |

---

## 3. Desarrollo de Backend y Frontend

| Componente                | Requisito                                                                         | Estado |
| :------------------------ | :-------------------------------------------------------------------------------- | :----: |
| **Sergio**                |
| **Backend (Express.js)**  | Crear un servidor (`server.js`) que sirva el frontend y la API.                   |  [x]   |
|                           | Implementar endpoint `POST /api/chat` para el flujo RAG completo.                 |  [x]   |
|                           | Orquestar la comunicación con Ollama (embeddings y LLM) y Qdrant.                 |  [x]   |
|                           | Implementar endpoint `GET /api/health` para verificar el estado de los servicios. |  [x]   |
| **Esther, Iván**                |
| **Frontend (Vanilla JS)** | Crear una interfaz de chat (`index.html`, `styles.css`, `app.js`).                |  [x]   |
|                           | Enviar las preguntas del usuario al backend y mostrar la respuesta.               |  [x]   |
|                           | Mostrar las fuentes de información recuperadas junto con la respuesta.            |  [x]   |
|                           | Incluir un indicador de "escribiendo..." y gestionar el estado de la conexión.    |  [x]   |

---

## 4. Orquestación y Documentación

| Tarea                    | Requisito                                                                                                  | Estado |
| :----------------------- | :--------------------------------------------------------------------------------------------------------- | :----: |
| **Sergio**               |
| **Docker Compose**       | Crear `docker-compose.yml` para orquestar los servicios: `app` (backend), `frontend`, `qdrant` y `ollama`. |  [x]   |
|                          | Configurar redes, volúmenes y variables de entorno para la comunicación entre servicios.                   |  [x]   |
| **Esther**               |
| **Documentación**        | Crear un `README.md` principal completo y bien estructurado.                                               |  [x]   |
|                          | Explicar la arquitectura, el flujo de datos, la instalación y el uso del proyecto.                         |  [x]   |
|                          | Crear `README_SCRIPTS.md` con una guía detallada de cada script del pipeline.                              |  [x]   |
|                          | Crear `README_DOCKER.md` para explicar el despliegue con Docker.                                           |  [x]   |
|                          | Documentar la API y el frontend (`FRONTEND_CHAT.md`, `RESUMEN_FINAL.md`).                                  |  [x]   |
| **Iván**               |
| **Validación API**       | Crear `validacion.http` para realizar pruebas manuales a los endpoints del backend.                        |  [x]   |
| **Sergio**               |
| **Control de Versiones** | Realizar commits incrementales (`init`, `feat`, `docs`, etc.)                                              |  [x]   |
| **Entrega**              | Crear Pull Request hacia `main` con título y descripción completa                                          |  [x]   |

---

## 5. Criterios de Aprobación Final

| Requisito Obligatorio                                                           | Estado |
| :------------------------------------------------------------------------------ | :----: |
| El comando `npm run ingesta` ejecuta el pipeline de datos correctamente.        |  [x]   |
| La base de datos vectorial **Qdrant** se puebla y es consultable.               |  [x]   |
| El comando `npm run test-busqueda` devuelve resultados de similitud coherentes. |  [x]   |
| El comando `docker-compose up -d` levanta todo el entorno funcionalmente.       |  [x]   |
| La aplicación web es accesible y el chat RAG responde a las consultas.          |  [x]   |
| La documentación es clara, completa y refleja la implementación final.          |  [x]   |
| El archivo `.env` no está versionado en Git.                                    |  [x]   |
