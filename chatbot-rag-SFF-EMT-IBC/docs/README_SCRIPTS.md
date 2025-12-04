# 📜 Guía de Scripts del Pipeline RAG

Este documento ofrece una explicación detallada de cada uno de los scripts que componen el pipeline de ingesta y prueba del sistema RAG. Estos scripts se encargan de procesar el documento fuente, generar los embeddings y cargarlos en la base de datos vectorial para su posterior consulta.

---

## ▶️ Ejecución Completa del Pipeline

Para ejecutar todo el proceso de ingesta de datos de forma secuencial y automatizada, puedes usar el siguiente comando:

```bash
npm run ingesta
```

Este comando ejecuta los siguientes scripts en orden:

1.  `npm run procesar`
2.  `npm run embeddings`
3.  `npm run cargar-bd`

---

## 📄 Fase 1: `scripts/procesar_rof.js`

Este script es el primer paso del pipeline. Su función es leer el documento de texto plano (`.txt`) y dividirlo en fragmentos más pequeños y manejables, conocidos como _chunks_.

### Ejecución

```bash
npm run procesar
```

### Funcionalidad Detallada

- **Entrada**: `backend/datos/PLAN-DE-CENTRO-SIMPLE.txt`.
- **Salida**: `backend/datos/chunks.json`.
- **Proceso**:
  1.  Lee el contenido completo del archivo de texto.
  2.  Divide el texto en párrafos, utilizando el doble salto de línea (`\n\n`) como separador.
  3.  Filtra y descarta los fragmentos que no alcanzan un umbral mínimo de 100 caracteres para asegurar que contengan información relevante.
  4.  Asigna a cada fragmento un `id` único, el `contenido` del texto, una `fuente` (nombre del documento) y un número de `pagina` (actualmente un valor fijo).
  5.  Guarda el array de objetos resultante en formato JSON.

### Estructura de Salida (`chunks.json`)

```json
[
  {
    "id": 1,
    "contenido": "El horario general del centro será de 8:15 horas a 21:45 horas de forma ininterrumpida...",
    "fuente": "ROF IES HLanz",
    "pagina": 1
  },
  ...
]
```

---

## 🔢 Fase 2: `scripts/generar_embeddings.js`

Una vez que el texto está fragmentado, este script se encarga de convertir cada _chunk_ de texto en una representación numérica (vector) llamada _embedding_.

### Ejecución

```bash
npm run embeddings
```

### Funcionalidad Detallada

- **Entrada**: `backend/datos/chunks.json`.
- **Salida**: `backend/datos/embeddings.json`.
- **Proceso**:
  1.  Lee el archivo `chunks.json` generado en la fase anterior.
  2.  Para cada fragmento de texto, realiza una llamada a la API de **Ollama** (`/api/embeddings`).
  3.  Utiliza el modelo `nomic-embed-text` para generar un vector de 768 dimensiones que captura el significado semántico del texto.
  4.  Muestra una barra de progreso en la consola para visualizar el avance y el tiempo estimado.
  5.  Guarda un nuevo archivo JSON que contiene los datos del fragmento original junto con su `embedding` correspondiente.

### Estructura de Salida (`embeddings.json`)

```json
[
  {
    "id": 1,
    "contenido": "El horario general del centro será de 8:15 horas a 21:45 horas...",
    "embedding": [0.123, -0.456, 0.789, ...],
    "fuente": "ROF IES HLanz",
    "pagina": 1
  },
  ...
]
```

---

## 💾 Fase 3: `scripts/cargar_bd.js`

Este script toma los fragmentos y sus embeddings y los almacena en **Qdrant**, una base de datos vectorial optimizada para búsquedas de similitud.

### Ejecución

```bash
npm run cargar-bd
```

### Funcionalidad Detallada

- **Entrada**: `backend/datos/embeddings.json`.
- **Salida**: Una colección poblada en la base de datos Qdrant (ej. `fragmentos_rof`).
- **Proceso**:
  1.  **Inicialización**: Se conecta a Qdrant y, para asegurar una carga limpia, elimina la colección si ya existe y la crea de nuevo. La dimensión de los vectores (768) y la métrica de distancia (`Cosine`) se configuran en este paso.
  2.  **Inserción en lotes (Batching)**: Lee el archivo `embeddings.json` e inserta los datos en Qdrant en lotes de 50 para optimizar el rendimiento y evitar sobrecargar la API.
  3.  **Uso de `upsert`**: Este comando inserta nuevos puntos o actualiza los existentes si el `id` ya existe, manejando la consistencia de los datos.
  4.  **Verificación**: Al finalizar, el script verifica que la carga se ha completado correctamente, contando el número de puntos en la colección y mostrando el tamaño del archivo procesado.

### Salida en Consola

```
🗄 Inicializando base de datos...
✅ Colección 'fragmentos_rof' creada.
📥 Insertando 87 fragmentos...
[████████████████████████████████████████] 87/87 100%
✅ Base de datos cargada exitosamente.
📊 Fragmentos en BD: 87
💾 Tamaño de archivo: 3.2 MB
✅ Integridad verificada.
```

---

## 🔍 Script de Prueba: `scripts/test_busqueda.js`

Este script es una herramienta de validación que permite probar la eficacia de la búsqueda semántica directamente desde la consola, sin necesidad de un backend o frontend completos.

### Ejecución

```bash
npm run test-busqueda
```

### Funcionalidad Detallada

- **Proceso**:
  1.  Define una lista de consultas de prueba (ej: "¿Cuál es el horario de entrada?").
  2.  Para cada consulta, primero genera su _embedding_ llamando a **Ollama**.
  3.  Utiliza este _embedding_ para realizar una búsqueda de similitud en **Qdrant**. Qdrant compara el vector de la consulta con todos los vectores almacenados y devuelve los más cercanos (los más relevantes semánticamente).
  4.  Muestra en la consola los 3 fragmentos más relevantes para cada consulta, junto con su puntuación de similitud (score).

### ¿Cómo funciona la búsqueda semántica?

1.  **Generación de embedding de consulta**:
    ```
    "¿Cuál es el horario de entrada?" → (Ollama) → [0.12, -0.45, ..., 0.78]
    ```
2.  **Búsqueda vectorial en Qdrant**: Qdrant utiliza la **similitud de coseno** para medir el "ángulo" entre el vector de la consulta y los vectores de los fragmentos almacenados. Un ángulo más pequeño (un score más cercano a 1.0) significa una mayor similitud semántica.

3.  **Resultados ordenados**: Devuelve los fragmentos con el score más alto.

### Interpretación de los Scores

- **0.90 - 1.00**: Coincidencia semántica casi perfecta.
- **0.70 - 0.89**: Alta relevancia. El fragmento está muy relacionado con la consulta.
- **0.50 - 0.69**: Relevancia moderada. El fragmento toca el tema de la consulta.
- **< 0.50**: Baja relevancia.

### Salida en Consola

```
🔍 Buscando fragmentos similares a: "¿Qué hacer ante inasistencias?"
📍 Resultados (similitud):

1. [0.65] "a las clases y actividades programadas. Las faltas de asistencia deberán just..."
2. [0.62] "horas, de lunes a viernes. Las actividades extraescolares podrán desarrollars..."
3. [0.59] "a cooperación y la no violencia. Se rechaza toda forma de acoso, discriminaci..."
```

---

## ⚙️ Scripts de Desarrollo

### `npm run dev`

Este comando ejecuta el script `test_busqueda.js` en modo de vigilancia (`watch`). Es útil durante el desarrollo, ya que vuelve a ejecutar las pruebas de búsqueda automáticamente cada vez que se guarda un cambio en el archivo.

```bash
npm run dev
```

---

## 📁 Estructura de Archivos Relevante

```
chatbot-rag-SFF-EMT-IBC/
└── backend/
    ├── datos/
    │   ├── PLAN-DE-CENTRO-SIMPLE.txt  # Entrada
    │   ├── chunks.json                # Salida de 'procesar'
    │   └── embeddings.json            # Salida de 'embeddings'
    └── scripts/
        ├── procesar_rof.js
        ├── generar_embeddings.js
        ├── cargar_bd.js
        └── test_busqueda.js
```

## 🛠️ Configuración

Todos los scripts leen su configuración del archivo `.env` en la raíz del proyecto. Asegúrate de que las siguientes variables estén correctamente definidas:

```env
# Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL_EMBEDDINGS=nomic-embed-text

# Qdrant
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION_NAME=fragmentos_rof
```

## 🐛 Solución de Problemas Comunes

#### Error: "No existe datos/embeddings.json"

**Causa**: No se ha ejecutado el script `generar_embeddings.js` antes de `cargar_bd.js`.
**Solución**: Ejecuta `npm run embeddings` o el pipeline completo `npm run ingesta`.

#### Error de conexión con Qdrant u Ollama

**Causa**: Los contenedores de Docker no están en ejecución.
**Solución**:

1.  Verifica que los servicios estén activos con `docker ps`.
2.  Si no lo están, inícialos con `docker-compose up -d`.
3.  Asegúrate de que las URLs en el archivo `.env` coinciden con los puertos expuestos en `docker-compose.yml`.

#### Scores de similitud muy bajos

**Causa**:

- La consulta no está relacionada con el contenido del documento.
- El modelo de embeddings utilizado para la búsqueda es diferente al utilizado durante la ingesta.
- La fragmentación del texto no es óptima y ha perdido contexto.
  **Solución**:

1.  Asegúrate de que `OLLAMA_MODEL_EMBEDDINGS` es el mismo en todas las fases.
2.  Revisa los fragmentos en `chunks.json` para ver si tienen sentido de forma aislada.
3.  Prueba con consultas más específicas o reformuladas.
