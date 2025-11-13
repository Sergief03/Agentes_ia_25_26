# ✅ Hito 2: Chatbot RAG — Fase de Ingesta de Datos (Checklist)

> Este checklist detalla los requisitos para la entrega del **Hito 2**, centrado en la **ingesta de datos** y la **creación de la base de datos vectorial**.

---

## 1. Configuración Inicial del Proyecto (Parte 1)

| Tarea | Requisito | Estado |
| :--- | :--- | :---: |
| **Estructura** | Crear carpeta del proyecto: `chatbot-rag-[tus-iniciales]` | [ ] |
| **Estructura** | Crear carpetas: `datos`, `scripts`, `backend` | [ ] |
| **Git** | Inicializar repositorio Git (`git init`) | [ ] |
| **Git** | Crear rama de trabajo (`git checkout -b hito2/rag-embeddings`) | [ ] |
| **Dependencias** | Inicializar `package.json` (`npm init -y`) | [ ] |
| **Dependencias** | Instalar: `dotenv`, `better-sqlite3`, `express` | [ ] |
| **Dependencias (dev)** | Instalar `nodemon` | [ ] |
| **Configuración Node** | Configurar como ESM: `"type": "module"` en `package.json` | [ ] |
| **Scripts npm** | Configurar scripts: `procesar`, `embeddings`, `cargar-bd`, `ingesta`, `test-busqueda`, `dev` | [ ] |
| **Archivo ROF** | Obtener el ROF en formato texto y guardar en `datos/rof.txt` | [ ] |
| **Archivo ROF** | El archivo `rof.txt` debe tener al menos **5000 caracteres** | [ ] |
| **Configuración** | Crear archivo `.env` con las variables del entorno | [ ] |
| **Configuración** | Crear archivo `.env.example` (template para versionar) | [ ] |
| **.gitignore** | Incluir: `node_modules/`, `.env`, `datos/*.db`, `datos/*.json` | [ ] |
| **Ollama** | Verificar que Ollama esté instalado y accesible en `http://localhost:11434` | [ ] |
| **Ollama** | Instalar modelo de embeddings: `ollama pull nomic-embed-text` | [ ] |
| **Ollama (opcional)** | Instalar modelo LLM (para el siguiente hito): `ollama pull mistral` | [ ] |

---

## 2. Scripts de Ingesta de Datos (Parte 2)

| Script | Requisito | Resultado Esperado | Estado |
| :--- | :--- | :--- | :---: |
| **`scripts/procesar_rof.js`** | Lee `datos/rof.txt` | Genera `datos/chunks.json` | [ ] |
|  | Divide el texto en párrafos (`\n\n`) y filtra los de menos de 100 caracteres | | [ ] |
|  | Crea estructura JSON: `{ id, contenido, fuente, pagina }` | | [ ] |
| **`scripts/generar_embeddings.js`** | Llama a Ollama (`/api/embeddings`) con modelo `nomic-embed-text` | Genera `datos/embeddings.json` | [ ] |
|  | Maneja la conexión y errores de Ollama | | [ ] |
|  | Muestra progreso y tiempo total de generación | | [ ] |
| **`scripts/cargar_bd.js`** | Crea base de datos `datos/rof_vectores.db` con tabla `fragmentos` | Genera `rof_vectores.db` | [ ] |
|  | Define campo `embedding` como tipo `TEXT` | | [ ] |
|  | Lee `datos/embeddings.json` e inserta fragmentos | | [ ] |
|  | Usa transacciones (`BEGIN`, `COMMIT`) para mejorar rendimiento | | [ ] |
|  | Implementa `verificarBD()` (conteo de filas y tamaño del archivo) | | [ ] |
| **`scripts/test_busqueda.js`** | Implementa `calcularSimilitud(v1, v2)` (similitud de coseno) | | [ ] |
|  | Genera embedding de la consulta y busca los **N fragmentos** más similares en BD | | [ ] |
|  | Muestra puntuación de similitud y resultados en consola | | [ ] |

---

## 3. Orquestación, Documentación y Control de Versiones

| Tarea | Requisito | Estado |
| :--- | :--- | :---: |
| **Docker Compose** | Crear `docker-compose.yml` para el servicio de Ollama | [ ] |
| **Documentación** | Crear `README.md` completo | [ ] |
| **README.md** | Incluir descripción del proyecto (RAG, embeddings), requisitos, instalación y ejecución | [ ] |
| **README.md** | Explicar el flujo de ingesta de datos y los scripts individuales | [ ] |
| **README.md** | Explicar qué es un *embedding* y la búsqueda por similitud de coseno | [ ] |
| **Validación** | Crear `validacion.http` con tests de conexión y verificación | [ ] |
| **Control de Versiones** | Realizar commits incrementales (`init`, `feat`, `docs`, etc.) | [ ] |
| **Entrega** | Crear Pull Request hacia `main` con título y descripción completa | [ ] |

---

## 4. Criterios de Aprobación (Verificación Final)

| Requisito Obligatorio | Estado |
| :--- | :---: |
| Pull Request creado antes de la fecha límite | [ ] |
| Scripts funcionales (`npm run ingesta` es exitoso) | [ ] |
| Base de datos SQLite3 generada y verificable | [ ] |
| Búsqueda semántica funcional | [ ] |
| Docker Compose operativo | [ ] |
| `README.md` completo y claro | [ ] |
| `.env` **NO versionado** (incluido en `.gitignore`) | [] |
