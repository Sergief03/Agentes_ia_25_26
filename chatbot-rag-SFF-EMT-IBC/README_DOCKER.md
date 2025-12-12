# Guía de Despliegue con Docker

Este proyecto ha sido contenerizado para facilitar su despliegue y ejecución. A continuación se detallan los pasos para levantar el entorno.

## Requisitos

- Docker Desktop instalado y ejecutándose.

## Estructura de Servicios

El archivo `docker-compose.yml` define dos servicios principales:

1.  **app**: Contenedor que ejecuta el servidor Node.js (Backend) y sirve la aplicación Frontend.
2.  **qdrant**: Base de datos vectorial para almacenar y buscar los embeddings.

> **Nota sobre Ollama**: El proyecto asume que Ollama se está ejecutando en la máquina anfitriona (tu PC). El contenedor está configurado para conectarse a `host.docker.internal:11434`. Asegúrate de que Ollama esté corriendo y escuchando conexiones.

## Instrucciones de Uso

### 1. Levantar los servicios

Ejecuta el siguiente comando en la raíz del proyecto:

```bash
docker-compose up -d
```

Esto descargará las imágenes necesarias y levantará los contenedores en segundo plano.

### 2. Cargar la Base de Datos (Primera vez)

Si es la primera vez que ejecutas el proyecto o si has limpiado los volúmenes, necesitas cargar los datos en Qdrant. Puedes hacerlo ejecutando el script de carga dentro del contenedor de la aplicación:

```bash
docker-compose exec app npm run cargar-bd
```

Si necesitas regenerar los embeddings desde cero (procesar y generar), puedes ejecutar:

```bash
docker-compose exec app npm run ingesta
```

### 3. Acceder a la Aplicación

Una vez levantados los servicios, abre tu navegador y visita:

[http://localhost:3000](http://localhost:3000)

### 4. Ver Logs

Para ver los logs de la aplicación:

```bash
docker-compose logs -f app
```

### 5. Detener los servicios

Para detener y eliminar los contenedores:

```bash
docker-compose down
```

## Configuración

Las variables de entorno están definidas en `docker-compose.yml`. Si necesitas cambiar la configuración (por ejemplo, puertos o URLs), puedes editar ese archivo o crear un archivo `.env` local (el cual tiene prioridad si se descomenta en el docker-compose).

- **PORT**: Puerto del servidor (default: 3000)
- **QDRANT_URL**: URL de Qdrant (default: http://qdrant:6333)
- **OLLAMA_URL**: URL de Ollama (default: http://host.docker.internal:11434)
