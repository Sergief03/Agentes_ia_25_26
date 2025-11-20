# Mi Proyecto

Repositorio que contiene la aplicación de ingesta y búsqueda de información basada en **RAG (Retrieval-Augmented Generation)** y **embeddings**.

---

## 4.1 Documentación del proyecto

### 4.1.1 Descripción del proyecto

Este proyecto permite procesar documentos en formato texto (ROF), generar **embeddings** y cargarlos en una base de datos para realizar búsquedas semánticas.  

- **Qué es RAG:**  
  RAG (Retrieval-Augmented Generation) es una técnica que combina la recuperación de información con generación de texto, permitiendo responder consultas utilizando documentos relevantes.  

- **Qué es un embedding:**  
  Es la representación vectorial de un texto, donde textos similares tienen vectores cercanos. Permite búsquedas por similitud de coseno.  

- **Flujo de ingesta de datos:**  
  1. Procesar el ROF → trocear el texto en fragmentos.  
  2. Generar embeddings de cada fragmento.  
  3. Cargar los embeddings en la base de datos para búsquedas.  

---

### 4.1.2 Requisitos

- Node.js  
- Docker  
- Ollama  
- Documento ROF en formato texto  

---

### 4.1.3 Instalación

1. Clonar el repositorio:  
   ```bash
   git clone <url-del-repositorio>
   ```
2. Instalar dependencias:
    ```bash
    cd backend
    npm install
    ```

3. Descargar archivo ROF y colocarlo en backend/datos/.

4. Configurar variables de entorno en un archivo .env.

---

### 4.1.4 Ejecución completa

Para ejecutar todo el flujo de ingesta:
    ```bash
    npm run ingesta
    ```

· Este comando ejecuta secuencialmente: `procesar → embeddings → cargar-bd.`

---

### 4.1.5 Scripts individuales

`npm run procesar` → Fase 1: trocear ROF.

`npm run embeddings` → Fase 2: generar vectores.

`npm run cargar-bd` → Fase 3: cargar datos en BD.

`npm run test-busqueda` → Probar búsqueda de fragmentos similares.

---

### 4.1.6 Estructura de datos

chunks.json: Fragmentos generados a partir del ROF.

embeddings.json: Vectores asociados a cada fragmento.

Tabla `fragmentos` en la BD: Almacena fragmentos y sus embeddings para búsquedas.

---

### 4.1.7 ¿Qué es un embedding?

Representación vectorial de texto.

Textos similares → vectores cercanos.

Búsqueda por similitud de coseno para encontrar fragmentos relevantes.

---

### 4.1.8 Decisiones de diseño

SQLite3: Ligera, fácil de configurar y suficiente para prototipo.

nomic-embed-text: Genera embeddings eficientes y rápidos.

Tamaño mínimo de fragmentos: 100 caracteres para mantener contexto suficiente en cada embedding.

---

### 4.1.9 Próximas fases

Crear backend para responder consultas en tiempo real.

Desarrollar frontend para interfaz de usuario amigable.
