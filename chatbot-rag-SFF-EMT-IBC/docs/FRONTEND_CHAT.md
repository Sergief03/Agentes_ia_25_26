# 💬 Frontend de Chat RAG - Guía de Usuario

## 🎯 Descripción

Interfaz de chat moderna y responsive que permite interactuar con el sistema RAG (Retrieval Augmented Generation) para consultar información del Reglamento de Organización y Funcionamiento del IES.

---

## ✨ Características

### Diseño Moderno
- 🌙 **Tema oscuro** con gradientes vibrantes
- 🎨 **Glassmorphism** y efectos de profundidad
- ✨ **Animaciones suaves** para mejor UX
- 📱 **Totalmente responsive** (móvil, tablet, desktop)

### Funcionalidades
- 💬 **Chat en tiempo real** con el asistente
- 🔍 **Búsqueda semántica** inteligente
- 📚 **Fuentes citadas** con scores de similitud
- ⌨️ **Atajos de teclado** (Enter para enviar, Shift+Enter para nueva línea)
- 🔄 **Reconexión automática** al servidor
- ⚡ **Indicador de escritura** animado
- ✅ **Validación de entrada** en tiempo real
- 📊 **Estado del servidor** en tiempo real

---

## 🚀 Inicio Rápido

### 1. Iniciar servicios Docker

```bash
docker-compose up -d
```

### 2. Cargar datos en Qdrant (si no lo has hecho)

```bash
npm run cargar-bd
```

### 3. Iniciar el backend

```bash
cd backend
npm install
npm start
```

### 4. Abrir el frontend

Abre tu navegador en: **http://localhost:3000**

---

## 🎮 Cómo usar

### Interfaz

```
┌───────────────────────────────────────────────────────────┐
│  🤖 Chatbot ROF                          ● Conectado      │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  🤖  ┌───────────────────────────────────────────┐        │
│      │ ¡Hola! Soy el asistente virtual...        │        │
│      │                                           │        │
│      │ Algunos ejemplos de preguntas:            │        │
│      │ • ¿Cuál es el horario de entrada?         │        │
│      │ • ¿Qué hacer ante inasistencias?          │        │
│      │ • Uniforme del centro                     │        │
│      └───────────────────────────────────────────┘        │
│                                                           │
│      ┌───────────────────────────────────────────┐  👤    │
│      │ ¿Cuál es el horario de entrada?           │        │
│      └───────────────────────────────────────────┘        │
│                                                           │
│  🤖  ┌───────────────────────────────────────────┐        │
│      │ El horario de entrada es de 08:00...      │        │
│      │                                           │        │
│      │ 📚 Fuentes consultadas:                   │        │
│      │ • "El horario de entrada..." 87%          │        │
│      │ • "Los estudiantes deben..." 72%          │        │
│      └───────────────────────────────────────────┘        │
│                                                           │
├───────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────┐     ▲    │
│  │ Escribe tu pregunta sobre el ROF...         │     │    │
│  └─────────────────────────────────────────────┘     │    │
│  0/500                Powered by Ollama & Qdrant     │    │
└───────────────────────────────────────────────────────────┘

```

### Enviar mensajes

1. **Escribe tu pregunta** en el campo de texto
2. **Presiona Enter** o haz clic en el botón de enviar
3. **Espera la respuesta** (verás un indicador de escritura animado)
4. **Revisa las fuentes** citadas debajo de la respuesta

### Ejemplos de consultas

Haz clic en cualquier ejemplo de la lista para probarlo:

```
✅ ¿Cuál es el horario de entrada?
✅ ¿Qué hacer ante inasistencias?
✅ ¿Cuál es el uniforme del centro?
✅ ¿Cómo justificar una falta?
✅ ¿Qué normas de convivencia hay?
✅ ¿Cuál es el procedimiento para solicitudes?
```

---

## 🏗️ Arquitectura

### Frontend → Backend → RAG

```
┌──────────────┐     HTTP      ┌──────────────┐
│   Frontend   │───────────────▶│   Backend    │
│  (Browser)   │◀───────────────│  Express.js  │
└──────────────┘    JSON        └──────────────┘
                                      │
                                      │ 1. Generar embedding
                                      ▼
                                ┌──────────────┐
                                │    Ollama    │
                                │  (Embeddings)│
                                └──────────────┘
                                      │
                                      │ 2. Buscar similares
                                      ▼
                                ┌──────────────┐
                                │    Qdrant    │
                                │   (Vectores) │
                                └──────────────┘
                                      │
                                      │ 3. Generar respuesta
                                      ▼
                                ┌──────────────┐
                                │    Ollama    │
                                │     (LLM)    │
                                └──────────────┘
```

---

## 📡 API Endpoints

### GET /
Sirve el frontend (index.html)

**Respuesta:** HTML

---

### POST /api/chat
Envía un mensaje al chatbot y obtiene respuesta generada con RAG

**Request:**
```json
{
  "mensaje": "¿Cuál es el horario de entrada?",
  "limite": 3
}
```

**Response:**
```json
{
  "mensaje": "¿Cuál es el horario de entrada?",
  "respuesta": "El horario de entrada es de 08:00 a 08:30...",
  "fragmentos": [
    {
      "contenido": "El horario de entrada es de 08:00...",
      "similitud": "0.87"
    },
    {
      "contenido": "Los estudiantes deben llegar...",
      "similitud": "0.72"
    }
  ]
}
```

---

### POST /api/buscar
Búsqueda semántica simple (sin generar respuesta con LLM)

**Request:**
```json
{
  "consulta": "horario",
  "limite": 5
}
```

**Response:**
```json
{
  "consulta": "horario",
  "total": 3,
  "resultados": [
    {
      "contenido": "El horario de entrada...",
      "fuente": "ROF IES HLanz",
      "pagina": 5,
      "similitud": 0.87
    }
  ]
}
```

---

### GET /api/health
Verificar estado del servidor y servicios

**Response:**
```json
{
  "status": "ok",
  "servicios": {
    "qdrant": {
      "estado": "conectado",
      "fragmentos": 25
    },
    "ollama": {
      "estado": "conectado",
      "url": "http://localhost:11434"
    }
  },
  "configuracion": {
    "coleccion": "fragmentos_rof",
    "modelo_embeddings": "nomic-embed-text",
    "modelo_llm": "llama3.2"
  }
}
```

---

## 🎨 Personalización

### Cambiar colores

Edita `frontend/styles.css` - variables CSS:

```css
:root {
    --primary-color: #6366f1;      /* Color principal */
    --secondary-color: #8b5cf6;    /* Color secundario */
    --bg-primary: #0f172a;         /* Fondo principal */
    --text-primary: #f1f5f9;       /* Texto principal */
}
```

### Cambiar modelo LLM

Edita `.env`:

```bash
OLLAMA_MODEL_LLM=llama3.2  # Cambiar a otro modelo
```

Modelos disponibles:
- `llama3.2:1b` - Rápido, ligero
- `phi4-mini` - Bueno para razonamiento
- `qwen2.5:3b` - Multilingüe
- `deepseek-r1:1.5b` - Chain-of-thought

### Cambiar número de fragmentos recuperados

Edita `frontend/app.js`, línea ~133:

```javascript
body: JSON.stringify({ mensaje: message, limite: 5 })  // Cambiar de 3 a 5
```

---

## 🐛 Solución de Problemas

### El chat no se conecta

**Síntomas:** Estado muestra "Servidor desconectado"

**Soluciones:**
```bash
# 1. Verificar que el servidor esté corriendo
# En backend/
npm start

# 2. Verificar que Docker esté corriendo
docker ps

# 3. Verificar puerto 3000 libre
netstat -ano | findstr :3000
```

---

### Error al enviar mensaje

**Síntomas:** "Error al procesar tu mensaje"

**Soluciones:**
```bash
# 1. Verificar logs del servidor
# Revisar la consola donde corre el backend

# 2. Verificar Qdrant
curl http://localhost:6333/collections/fragmentos_rof

# 3. Verificar Ollama
curl http://localhost:11434/api/tags

# 4. Reiniciar servicios
docker-compose restart
```

---

### Respuestas muy lentas

**Causas posibles:**
- Modelo LLM muy grande
- Falta de RAM

**Soluciones:**
```bash
# Usar un modelo más ligero
# Editar .env
OLLAMA_MODEL_LLM=llama3.2:1b  # Más rápido

# O ajustar límite de fragmentos
# En frontend/app.js, reducir de 3 a 2
```

---

### Las fuentes no aparecen

**Verificar:**
1. Que Qdrant tenga datos: `npm run cargar-bd`
2. Que la consulta tenga score > 0.3
3. Revisar consola del navegador (F12)

---

## 📊 Interpretación de Scores

Los scores de similitud indican qué tan relevante es cada fragmento:

| Score | Interpretación |
|-------|---------------|
| 0.90 - 1.00 | 🟢 Muy alta relevancia |
| 0.70 - 0.89 | 🟡 Alta relevancia |
| 0.50 - 0.69 | 🟠 Relevancia moderada |
| 0.30 - 0.49 | 🔴 Baja relevancia |

**Ejemplo:**
```
📚 Fuentes consultadas:
• "El horario de entrada es..." 87% similar  ← Alta relevancia
• "Los estudiantes deben..." 72% similar     ← Alta relevancia
• "El retraso se justifica..." 65% similar   ← Moderada relevancia
```

---

## 🎯 Mejores Prácticas

### Para obtener mejores respuestas:

1. **Sé específico en tus preguntas**
   - ❌ "horario"
   - ✅ "¿Cuál es el horario de entrada?"

2. **Usa lenguaje natural**
   - ❌ "horario entrada hora"
   - ✅ "¿A qué hora debo llegar al instituto?"

3. **Una pregunta a la vez**
   - ❌ "¿Cuál es el horario y el uniforme y las normas?"
   - ✅ "¿Cuál es el horario de entrada?"

4. **Reformula si no obtienes buena respuesta**
   - Intenta con sinónimos
   - Añade más contexto
   - Simplifica la pregunta

---

## 🚀 Características Avanzadas

### Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Enter` | Enviar mensaje |
| `Shift + Enter` | Nueva línea |
| `Esc` | Limpiar input (próximamente) |

### Auto-scroll

El chat se desplaza automáticamente al último mensaje al:
- Enviar un mensaje
- Recibir una respuesta

### Contador de caracteres

Límite: 500 caracteres
- Color normal: 0-450 caracteres
- Color amarillo: 451-500 caracteres

### Reconexión automática

Si se pierde la conexión:
- El sistema intenta reconectar cada 10 segundos
- El indicador de estado se actualiza automáticamente

---

## 📁 Estructura de Archivos

```
frontend/
├── index.html      # Estructura HTML del chat
├── styles.css      # Estilos modernos con dark theme
└── app.js          # Lógica del chat y API calls

backend/
├── server.js       # Servidor Express con endpoints RAG
└── package.json    # Dependencias del backend
```

---

## 🎓 Conceptos Técnicos

### Flujo de Chat RAG

1. **Usuario escribe pregunta**
   ```
   "¿Cuál es el horario de entrada?"
   ```

2. **Frontend envía a /api/chat**
   ```javascript
   POST /api/chat
   { "mensaje": "¿Cuál es el horario de entrada?" }
   ```

3. **Backend genera embedding**
   ```
   Ollama → [0.123, -0.456, ..., 0.789]
   ```

4. **Backend busca en Qdrant**
   ```
   Top 3 fragmentos más similares
   ```

5. **Backend genera respuesta con LLM**
   ```
   Prompt = Contexto + Pregunta
   Ollama LLM → Respuesta
   ```

6. **Frontend muestra respuesta + fuentes**
   ```
   Respuesta del bot
   📚 Fuentes consultadas:
   • Fragmento 1 (87% similar)
   • Fragmento 2 (72% similar)
   ```

---

## 🔧 Configuración Avanzada

### Cambiar Puerto del Servidor

Edita `backend/server.js` o `.env`:

```bash
PORT=5000  # Cambiar de 3000 a 5000
```

Y actualiza `frontend/app.js`:

```javascript
const API_URL = 'http://localhost:5000';  // Cambiar puerto
```

### CORS personalizado

Edita `backend/server.js`:

```javascript
app.use(cors({
    origin: 'http://tudominio.com',
    credentials: true
}));
```

### Añadir autenticación

Agregar middleware en `backend/server.js`:

```javascript
function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'No autorizado' });
    // Validar token...
    next();
}

app.post('/api/chat', authMiddleware, async (req, res) => {
    // ...
});
```

---

## 📈 Métricas y Analytics

### Próximas funcionalidades:

- 📊 Dashboard de estadísticas
- 📝 Historial de conversaciones
- ⭐ Ratings de respuestas
- 📤 Exportar conversaciones
- 🔔 Notificaciones
- 🌐 Multiidioma

---

## 🌟 Demo en Vivo

**URL:** http://localhost:3000

**Credenciales:** No requiere (por ahora)

---

## 📚 Recursos

- [Express.js](https://expressjs.com/)
- [Qdrant Search API](https://qdrant.tech/documentation/concepts/search/)
- [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

## ✅ Checklist de Despliegue

Antes de usar en producción:

- [ ] Cambiar a HTTPS
- [ ] Añadir autenticación
- [ ] Configurar límites de rate
- [ ] Implementar logging
- [ ] Añadir monitorización
- [ ] Configurar backups
- [ ] Optimizar rendimiento
- [ ] Probar en móvil
- [ ] Probar en diferentes navegadores
- [ ] Añadir tests

---

**¡Disfruta del chat con RAG! 🚀**
