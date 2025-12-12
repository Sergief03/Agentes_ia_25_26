# 🤖 Chatbot RAG - Sistema de Consulta de Documentos IES

Sistema de búsqueda semántica y chatbot basado en RAG (Retrieval Augmented Generation) para consultar el Reglamento de Organización y Funcionamiento (ROF) del IES.

---

## 📖 Índice

1. [Descripción del Proyecto](#-descripción-del-proyecto)
2. [¿Qué es RAG?](#-qué-es-rag)
3. [¿Qué es un Embedding?](#-qué-es-un-embedding)
4. [Flujo de Ingesta de Datos](#-flujo-de-ingesta-de-datos)
5. [Requisitos](#-requisitos)
6. [Instalación](#-instalación)
7. [Ejecución](#-ejecución)
8. [Scripts Disponibles](#-scripts-disponibles)
9. [Arquitectura y Componentes](#-arquitectura-y-componentes)
10. [Estructura de Datos](#-estructura-de-datos)
11. [Decisiones de Diseño](#-decisiones-de-diseño)
12. [Backend y Frontend](#-próximas-fases)
13. [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 🎯 Descripción del Proyecto

Este proyecto implementa un sistema RAG (Retrieval Augmented Generation) que permite realizar consultas en lenguaje natural sobre documentos extensos, específicamente el Reglamento de Organización y Funcionamiento del instituto.

### Características principales:

- ✅ **Búsqueda semántica**: Encuentra información relevante aunque no coincidan las palabras exactas
- ✅ **Embeddings locales**: Genera vectores usando Ollama (sin dependencias de APIs externas)
- ✅ **Base de datos vectorial**: Qdrant para búsquedas rápidas y eficientes
- ✅ **Ejecución completa**: Desde procesamiento de texto hasta búsqueda semántica
- ✅ **Dockerizado**: Fácil despliegue con Docker Compose

---

## 🧠 ¿Qué es RAG?

**RAG (Retrieval Augmented Generation)** es una técnica que combina:

1. **Retrieval (Recuperación)**: Busca información relevante en una base de datos
2. **Augmented (Aumentada)**: Enriquece el contexto con los datos encontrados
3. **Generation (Generación)**: Genera respuestas coherentes usando un LLM

### Flujo RAG

```
Usuario: "¿Cuál es el horario de entrada?"
           ↓
    [1. RECUPERACIÓN]
           ↓
    Búsqueda semántica en BD
           ↓
    Fragmentos relevantes encontrados
           ↓
    [2. AUMENTACIÓN]
           ↓
    Contexto + Consulta → LLM
           ↓
    [3. GENERACIÓN]
           ↓
    "El horario de entrada es de 08:00 a 08:30..."
```

### Ventajas de RAG

- ✅ **Respuestas basadas en datos reales** 
- ✅ **Actualizaciones fáciles** 
- ✅ **Trazabilidad** 
- ✅ **Específico del dominio** 

---

## 🔢 ¿Qué es un Embedding?

Un **embedding** es una representación vectorial (numérica) de un texto que captura su significado semántico.

### Concepto básico

```
Texto: "¿Cuál es el horario de entrada?"
         ↓ (Modelo de embeddings)
Vector: [0.123, -0.456, 0.789, ..., 0.321]  (768 dimensiones)
```

### Propiedades clave

1. **Textos similares → Vectores cercanos**

   ```
   "horario de entrada" ≈ [0.5, 0.3, 0.1, ...]
   "hora de llegada"    ≈ [0.4, 0.3, 0.2, ...]
   ```

2. **Búsqueda por similitud**

   - Se calcula la **similitud de coseno** entre vectores
   - Valores de 0 (diferentes) a 1 (idénticos)

3. **Espacio semántico**
   - Palabras relacionadas están cerca en el espacio vectorial
   - Permite encontrar conceptos relacionados aunque usen palabras diferentes

### Ejemplo visual

```
Espacio vectorial (simplificado a 2D):

    "horario de entrada" ●
                          \
                           \ ← Alta similitud (0.87)
                            \
                   "hora de llegada" ●


    "uniforme del centro" ●  ← Baja similitud (0.32)
```

---

## 🔄 Flujo de Ingesta de Datos

El proceso completo de transformar documentos en un sistema de búsqueda semántica:

```
┌─────────────────────────────────────────────────────────────────┐
│  FASE 1: PROCESAMIENTO (procesar_rof.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  datos/datos.txt (ROF completo)                                 │
│         ↓                                                       │
│  Fragmentación (chunks)                                         │
│         ↓                                                       │
│  datos/chunks.json                                              │
│  [                                                              │
│    {                                                            │
│      "id": 1,                                                   │
│      "contenido": "El horario de entrada...",                   │
│      "fuente": "ROF IES HLanz",                                 │
│      "pagina": 5                                                │
│    },                                                           │
│    ...                                                          │
│  ]                                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 2: GENERACIÓN DE EMBEDDINGS (generar_embedings.js)        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Para cada chunk:                                               │
│    "El horario de entrada..." → Ollama → [0.1, -0.5, 0.7, ...]  │
│                                                                 │
│  datos/embeddings.json                                          │
│  [                                                              │
│    {                                                            │
│      "id": 1,                                                   │
│      "contenido": "El horario de entrada...",                   │
│      "embedding": [0.123, -0.456, 0.789, ...],                  │
│      "fuente": "ROF IES HLanz",                                 │
│      "pagina": 5                                                │
│    },                                                           │
│    ...                                                          │
│  ]                                                              │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  FASE 3: CARGA EN BASE DE DATOS (cargar_bd.js)                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Qdrant (Base de datos vectorial)                               │
│                                                                 │
│  Colección: fragmentos_rof                                      │
│  ┌─────────────────────────────────────────┐                    │
│  │ ID  │ Vector (768D)   │ Payload         │                    │
│  ├─────────────────────────────────────────┤                    │
│  │ 1   │ [0.1, -0.5,...] │ {contenido,... }│                    │
│  │ 2   │ [0.3, 0.2,...]  │ {contenido,... }│                    │
│  │ ... │ ...             │ ...             │                    │
│  └─────────────────────────────────────────┘                    │
│                                                                 │
│  ✅ Indexado para búsqueda rápida                              │
│  ✅ Búsqueda por similitud de coseno                           │
└─────────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│  BÚSQUEDA SEMÁNTICA (test_busqueda.js)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Consulta: "¿Cuál es el horario de entrada?"                    │
│         ↓                                                       │
│  Embedding de consulta → [0.15, -0.48, 0.72, ...]               │
│         ↓                                                       │
│  Búsqueda en Qdrant (similitud de coseno)                       │
│         ↓                                                       │
│  Resultados ordenados por relevancia:                           │
│    1. [0.87] "El horario de entrada es de 08:00..."             │
│    2. [0.72] "Los estudiantes deben llegar puntualmente..."     │
│    3. [0.65] "El retraso se justifica solamente..."             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📋 Requisitos

### Software necesario

#### 1. **Node.js** (v18 o superior)

```bash
node --version  # Verificar versión
```

#### 2. **Docker** y **Docker Compose**

```bash
docker --version
docker-compose --version
```

#### 3. **Servicios Docker** (incluidos en el proyecto)

- **Qdrant**: Base de datos vectorial (puerto 6333)
- **Ollama**: Servidor de modelos LLM y embeddings (puerto 11434)

### Datos

- **ROF en formato texto**: Archivo `datos/datos.txt` con el contenido del reglamento

### Modelos Ollama

El proyecto usa:

- `nomic-embed-text`: Modelo de embeddings (768 dimensiones)

---

## 🚀 Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd chatbot-rag-SFF-EMT-IBC
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Colocar el archivo ROF

Coloca el archivo de texto del ROF en:

```
datos/datos.txt
```

### 4. Configurar variables de entorno

Copia el archivo de ejemplo y configúralo:

```bash
# Windows
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

Edita `.env` con tus configuraciones:

```bash
# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL_EMBEDDINGS=nomic-embed-text
OLLAMA_MODEL_LLM=llama3.2

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION_NAME=fragmentos_rof

# Entorno
NODE_ENV=development
```

### 5. Iniciar servicios Docker

```bash
docker-compose up -d
```

Verifica que los servicios estén corriendo:

```bash
docker ps
```

Deberías ver:

- `qdrant` en puerto 6333
- `ollama` en puerto 11434

### 6. Descargar modelo de embeddings

```bash
docker exec -it ollama ollama pull nomic-embed-text
```

---

## ▶️ Ejecución

### Ejecución completa

El comando `ingesta` ejecuta todo el proceso automáticamente:

```bash
npm run ingesta
```

Esto ejecuta en secuencia:

1. ✅ `procesar` → Fragmenta el ROF en chunks
2. ✅ `embeddings` → Genera vectores para cada chunk
3. ✅ `cargar-bd` → Carga los vectores en Qdrant

**Salida esperada:**

```
> Procesando ROF...
✅ 87 fragmentos generados
✅ Guardados en datos/chunks.json

> Generando embeddings...
Procesando 87/87...
✅ Embeddings generados exitosamente
⏱ Generación completada en 45.23 segundos
📁 Guardados en datos/embeddings.json

> Cargando en base de datos...
🗄 Inicializando base de datos...
✅ Tabla 'fragmentos' creada
📥 Insertando 87 fragmentos...
[████████████████████████████████████████] 87/87 100%
✅ Base de datos cargada exitosamente
📊 Fragmentos en BD: 87
💾 Tamaño de archivo: 3.2 MB
✅ Integridad verificada
```

---

## 📜 Scripts Disponibles

### Scripts de ingesta

#### 1. `npm run procesar`

**Fase 1: Trocear el ROF**

Fragmenta el documento completo en chunks manejables.

```bash
npm run procesar
```

**Entrada:** `datos/datos.txt`  
**Salida:** `datos/chunks.json`

**Funcionalidad:**

- Lee el archivo ROF completo
- Divide en fragmentos de tamaño óptimo
- Añade metadata (fuente, página)
- Valida tamaño mínimo (100 caracteres)

---

#### 2. `npm run embeddings`

**Fase 2: Generar vectores**

Genera embeddings para cada fragmento usando Ollama.

```bash
npm run embeddings
```

**Entrada:** `datos/chunks.json`  
**Salida:** `datos/embeddings.json`

**Funcionalidad:**

- Lee los chunks generados
- Para cada chunk, genera embedding (768 dimensiones)
- Guarda fragmento + embedding
- Muestra progreso y tiempo estimado

---

#### 3. `npm run cargar-bd`

**Fase 3: Cargar a base de datos**

Almacena los embeddings en Qdrant.

```bash
npm run cargar-bd
```

**Entrada:** `datos/embeddings.json`  
**Salida:** Colección Qdrant `fragmentos_rof`

**Funcionalidad:**

- Inicializa colección en Qdrant
- Inserta fragmentos en lotes (optimización)
- Valida duplicados
- Verifica integridad de datos

---

### Scripts de prueba

#### 4. `npm run test-busqueda`

**Probar búsqueda semántica**

Ejecuta consultas de prueba y muestra resultados.

```bash
npm run test-busqueda
```

**Consultas de ejemplo:**

- "¿Cuál es el horario de entrada?"
- "¿Qué hacer ante inasistencias?"
- "Uniforme del centro"

**Salida esperada:**

```
🔍 Buscando fragmentos similares a: "¿Cuál es el horario de entrada?"
📍 Resultados (similitud):

1. [0.87] "El horario de entrada es de 08:00 a 08:30..."
2. [0.72] "Los estudiantes deben llegar puntualmente..."
3. [0.65] "El retraso se justifica solamente en caso de..."
```

---

#### 5. `npm run dev`

**Modo desarrollo**

Ejecuta test de búsqueda con recarga automática (útil para desarrollo).

```bash
npm run dev
```

---

## 🏗️ Arquitectura y Componentes

El proyecto sigue una arquitectura de microservicios orquestada con Docker Compose, separando las responsabilidades para facilitar el desarrollo, despliegue y escalabilidad.

```
      Usuario
         │
         ▼
┌──────────────────┐     HTTP/JSON      ┌──────────────────┐
│    Frontend      │───────────────────▶│      Backend     │
│ (HTML, CSS, JS)  │◀───────────────────│   (Node/Express) │
└──────────────────┘                    └──────────────────┘
                                                 │
                                                 │ API Calls
                                                 ▼
          ┌──────────────────────────────────────────────────────────┐
          │                       Contenedores Docker                │
          ├────────────────────┬──────────────────┬──────────────────┤
          │      App (Backend) │      Qdrant      │      Ollama      │
          │  (Este contenedor) │   (BD Vectorial) │  (Host Machine)  │
          └────────────────────┴──────────────────┴──────────────────┘
```

### Componentes Clave

#### 1. **Frontend (`/frontend`)**
-   **Tecnología**: HTML5, CSS3, JavaScript (Vanilla JS).
-   **Función**: Proporciona una interfaz de chat para que el usuario interactúe con el sistema. Se comunica con el backend a través de una API REST para enviar preguntas y recibir respuestas. Es una aplicación de página única (SPA) servida directamente por el backend de Express.

#### 2. **Backend (`/backend`)**
-   **Tecnología**: Node.js con Express.js.
-   **Función**: Actúa como el cerebro del sistema. Orquesta todo el flujo RAG:
    1.  Recibe la consulta del usuario desde el frontend.
    2.  Llama a **Ollama** para convertir la consulta en un *embedding* (vector numérico).
    3.  Usa ese vector para buscar los fragmentos de texto más relevantes en la base de datos vectorial **Qdrant**.
    4.  Construye un *prompt* enriquecido con los fragmentos recuperados.
    5.  Envía el *prompt* a **Ollama** para que un Modelo de Lenguaje Grande (LLM) genere una respuesta en lenguaje natural.
    6.  Devuelve la respuesta y las fuentes al frontend.

#### 3. **Ollama (Servicio Externo en Host)**
-   **Función**: Proporciona los modelos de inteligencia artificial de forma local.
-   **Modelo de Embeddings (`nomic-embed-text`)**: Transforma texto en vectores numéricos que capturan su significado.
-   **Modelo de Lenguaje (`llama3.2`)**: Genera las respuestas en texto conversacional basándose en el contexto proporcionado por el backend.
-   **Comunicación**: El backend se conecta a Ollama a través de `host.docker.internal`, lo que permite que el contenedor de la aplicación acceda a un servicio que se ejecuta en la máquina anfitriona.

#### 4. **Qdrant (Servicio Docker)**
-   **Tecnología**: Base de datos vectorial.
-   **Función**: Almacena los *embeddings* de todos los fragmentos del documento ROF. Permite realizar búsquedas de similitud a alta velocidad para encontrar los fragmentos más relevantes para una consulta dada.

#### 5. **Docker Compose (`docker-compose.yml`)**
-   **Función**: Orquesta el despliegue de todos los servicios (`backend`/`frontend` y `qdrant`). Define las redes, volúmenes y variables de entorno, asegurando que todos los componentes puedan comunicarse entre sí de manera predecible.

---

## 📊 Estructura de Datos

### 1. `chunks.json`

Fragmentos del documento original.

```json
[
  {
    "id": 1,
    "contenido": "El horario de entrada es de 08:00 a 08:30. Los estudiantes...",
    "fuente": "ROF IES HLanz",
    "pagina": 5
  },
  {
    "id": 2,
    "contenido": "Las faltas de asistencia deberán justificarse documentalmente...",
    "fuente": "ROF IES HLanz",
    "pagina": 12
  }
]
```

**Campos:**

- `id`: Identificador único del fragmento
- `contenido`: Texto del fragmento (100-500 caracteres aprox.)
- `fuente`: Origen del documento
- `pagina`: Número de página (si disponible)

---

### 2. `embeddings.json`

Fragmentos con sus vectores de embedding.

```json
[
  {
    "id": 1,
    "contenido": "El horario de entrada es de 08:00 a 08:30...",
    "embedding": [0.123, -0.456, 0.789, ..., 0.321],
    "fuente": "ROF IES HLanz",
    "pagina": 5
  }
]
```

**Campos adicionales:**

- `embedding`: Array de 768 números (vector semántico del texto)

**Tamaño del vector:**

- Dimensiones: 768
- Modelo: `nomic-embed-text`
- Rango de valores: aproximadamente [-1, 1]

---

### 3. Colección Qdrant: `fragmentos_rof`

Estructura en la base de datos vectorial:

```
┌─────────────────────────────────────────────────────┐
│ PUNTO (Point)                                       │
├─────────────────────────────────────────────────────┤
│ id: 1                                               │
│                                                     │
│ vector: [0.123, -0.456, 0.789, ..., 0.321]          │
│         ↑                                           │
│         768 dimensiones                             │
│                                                     │
│ payload: {                                          │
│   contenido: "El horario de entrada...",            │
│   fuente: "ROF IES HLanz",                          │
│   pagina: 5,                                        │
│   creado_en: "2025-11-25T10:00:00.000Z"             │
│ }                                                   │
└─────────────────────────────────────────────────────┘
```

**Configuración de la colección:**

- Dimensión de vectores: 768
- Métrica de distancia: Coseno (Cosine)
- Indexación: HNSW (Hierarchical Navigable Small World)

---

## 🎨 Decisiones de Diseño

### 1. ¿Por qué Qdrant?

Aunque el enunciado menciona SQLite, se decidió usar **Qdrant** por:

✅ **Optimizado para búsqueda vectorial**: Qdrant está diseñado específicamente para búsquedas de similitud


✅ **Escalabilidad**: Qdrant puede manejar millones de vectores eficientemente


✅ **Índices especializados**


✅ **Facilidad de uso**:

- API REST simple
- Cálculo de similitud incorporado
- Docker image oficial

---

### 2. ¿Por qué nomic-embed-text?

✅ **Optimizado para español**

✅ **Tamaño razonable**


---

### 3. Tamaño mínimo de fragmentos: 100 caracteres

✅ **Contexto suficiente**

- 100 caracteres ≈ 15-20 palabras (Suficiente para capturar una idea completa)

✅ **Evita fragmentos inútiles**

✅ **Balance**

- Fragmentos muy grandes: contexto mezclado
- Fragmentos muy pequeños: sin contexto suficiente

**Configuración recomendada:**

- Mínimo: 100 caracteres
- Óptimo: 200-400 caracteres
- Máximo: 500 caracteres

---

### 4. Otras decisiones

**Batch size: 50**

- Inserciones en lotes para optimizar velocidad
- Balance entre memoria y velocidad

**Distance metric: Cosine**

- Normalizado (0-1)
- No afectado por magnitud del vector
- Estándar en NLP

**Puerto Qdrant: 6333**

- Puerto por defecto de Qdrant
- HTTP/REST API

---

## 🔌 Backend y Frontend

### Backend (API REST con Express)

El backend, construido con Node.js y Express, expone una API REST para gestionar el flujo RAG. El punto de entrada principal es `server.js`.

#### Endpoint principal: `POST /api/chat`

Este endpoint orquesta todo el proceso de consulta y generación de respuesta:

1.  **Recibe la consulta**: Acepta un cuerpo JSON con la pregunta del usuario.
    ```json
    { "mensaje": "¿Cuál es el horario de entrada?" }
    ```

2.  **Genera el Embedding de la Consulta**: Se comunica con el servicio de **Ollama** para convertir la pregunta del usuario en un vector numérico (embedding).

3.  **Búsqueda en Qdrant**: Utiliza el vector para realizar una búsqueda de similitud en la base de datos vectorial **Qdrant**, recuperando los fragmentos de texto más relevantes del documento.

4.  **Generación de Respuesta con LLM**: Construye un *prompt* que incluye la pregunta original y los fragmentos recuperados. Envía este *prompt* enriquecido a **Ollama** para que el modelo de lenguaje (`llama3.2`) genere una respuesta coherente y contextualizada.

5.  **Devuelve la Respuesta**: Envía una respuesta JSON al frontend que contiene el texto generado y las fuentes utilizadas.
    ```json
    {
      "respuesta": "Según el reglamento, el horario de entrada es de 8:15 a 14:45 horas.",
      "fuentes": [
        { "contenido": "Artículo 9. Horario general. El horario lectivo del centro será de 8:15 a 14:45 horas...", "fuente": "ROF IES HLanz" }
      ]
    }
    ```

---

### Frontend (Interfaz de Chat)

La interfaz de usuario es una aplicación de página única (SPA) construida con HTML, CSS y JavaScript (Vanilla JS).

#### Funcionalidades clave:

1.  **Interfaz de Chat**: El archivo `index.html` define la estructura de una ventana de chat donde el usuario puede escribir sus preguntas. Los estilos se gestionan en `styles.css`.

2.  **Lógica del Cliente (`app.js`)**:
    -   Captura el mensaje enviado por el usuario.
    -   Muestra un indicador de "escribiendo..." mientras espera la respuesta del servidor.
    -   Realiza una llamada `fetch` al endpoint `/api/chat` del backend, enviando la pregunta.
    -   Al recibir la respuesta, la muestra en la interfaz de chat, junto con las fuentes de información que el LLM utilizó para generarla.

3.  **Servido por Express**: El propio backend de Express se encarga de servir los archivos estáticos del frontend, simplificando el despliegue.

---

## 📁 Estructura del Proyecto
```
chatbot-rag-SFF-EMT-IBC/
├── 📁 backend/                                   # API y procesamiento RAG + BD
│   ├── server.js                                 # Servidor Express + endpoints
│   ├── routes/                                   # Controladores de la API
│   ├── 📁 datos/                                 # Datos generados y fuente
│   │   ├── PLAN-DE-CENTRO-SIMPLE.txt             # ROF en texto plano (fuente principal)
│   │   ├── chunks.json                           # Fragmentos del ROF
│   │   └── embeddings.json                       # Embeddings del ROF
│   ├── 📁 node_modules/                          # Dependencias node (NO en Git)
│   ├── 📁 scripts/                               # Scripts del pipeline RAG (ETL)
│   │   ├── procesar_rof.js                       # Fase 1: División en chunks
│   │   ├── generar_embeddings.js                 # Fase 2: Crear embeddings Qdrant
│   │   ├── cargar_bd.js                          # Fase 3: Carga a la BD vectorial
│   │   └── test_busqueda.js                      # Validar la similitud en Qdrant
│   ├── .env                                      # Variables privadas del backend (omitido en Git)
│   ├── Dockerfile                                # Imagen Docker para backend
│   ├── package-lock.json
│   ├── package.json                              # Scripts NPM y dependencias backend
│   └── validacion.http                           # Pruebas manuales API REST
│
│
├── 📁 docs/                                      # Documentación del proyecto
│   ├── cargar_bd_README.md                       # Guía fase de carga en BD
│   ├── checklist.md                              # Lista de tareas del proyecto
│   ├── FRONTEND_CHAT.md                          # Diseño UI del chatbot
│   ├── IMPEMENTACION_COMPLETA.md                 # Documentación del flujo completo
│   ├── README.md                                 # Documentación general
│   ├── RESUMEN_FINAL.md                          # Informe final presentado
│   └── test_busqueda_README.md                   # Explicación del script de prueba
│
├── 📁 frontend/                                  # Interfaz del Chatbot
│   ├── app.js                                    # Lógica del cliente y llamadas API
│   ├── Dockerfile                                # Imagen Docker para frontend
│   ├── favicon.svg
│   ├── index.html                                # Interfaz del chatbot
│   ├── package-lock.json
│   ├── package.json                              # Scripts NPM y dependencias frontend
│   └── styles.css                                # Estilos del chatbot
│
├── 📁 public/                                  
│   └── 📁 img/                                    
│        ├── Chat_interface.jpg                                
│        └── demo_animación.mp4
│
├── 📄 .env.example                                # Ejemplo de variables de entorno
├── 📄 .gitignore                                 # Archivos ignorados por Git
├── 📄 docker-compose.yml                         # Orquestación de servicios Docker
├── 📄 README_DOCKER.md                           # Guía de despliegue con Docker
└── 📄 README.md                                  # Descripción principal del proyecto
```
---

## 🛠️ Comandos útiles

### Docker

```bash
# Iniciar servicios
docker-compose up -d

# Ver logs
docker logs qdrant
docker logs ollama

# Detener servicios
docker-compose down

# Reiniciar servicios
docker-compose restart
```

### Qdrant

```bash
# Ver colecciones
curl http://localhost:6333/collections

# Ver info de colección
curl http://localhost:6333/collections/fragmentos_rof

# Contar puntos
curl http://localhost:6333/collections/fragmentos_rof/points/count
```

### Ollama

```bash
# Listar modelos descargados
docker exec -it ollama ollama list

# Descargar modelo
docker exec -it ollama ollama pull nomic-embed-text

# Probar embedding
curl http://localhost:11434/api/embeddings -d '{
  "model": "nomic-embed-text",
  "prompt": "test"
}'
```

---

## 📚 Recursos adicionales

### Documentación oficial

- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [Ollama Documentation](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Nomic Embed Text](https://www.nomic.ai/blog/posts/nomic-embed-text-v1)

### Conceptos

- [RAG explained](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [Embeddings explained](https://platform.openai.com/docs/guides/embeddings)
- [Cosine Similarity](https://en.wikipedia.org/wiki/Cosine_similarity)

### Tutoriales

- [Building a RAG system](https://www.youtube.com/watch?v=sVcwVQRHIc8)
- [Vector databases explained](https://www.youtube.com/watch?v=klTvEwg3oJ4)

---

###  👥 Colaboradores

Este proyecto se ha sido realizado por:
 
- Sergio Fernández Fernández 
- Iván Balderas Carmona
- Esther Maroto Torres

El trabajo se ha repertido por apartados especificado en el archivo `checkList.md`
