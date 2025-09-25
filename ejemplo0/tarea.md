# Tarea Curl

- Crear un documento que ejemplifique todas las opciones del comando curl 
- Usar alguna web fake rest API (JSOn placeholder) para probar las posibles funcionalidades del comando Curl
- Crear un /script/test.sh  que lance todos los posibles test del comando curl para relizar GET, POST, DELETE, PATCH, PUT 

# Guía de opciones de `curl` con ejemplos (JSONPlaceholder)

Esta guía muestra las opciones más importantes de `curl` con ejemplos prácticos usando la API de prueba [JSONPlaceholder](https://jsonplaceholder.typicode.com).

---

## 1. Opciones básicas

- **`-V, --version`** → Muestra la versión de `curl`.
```bash
curl -V
```

- **`-h, --help`** → Muestra la ayuda.
```bash
curl -h
```

- **`-s, --silent`** → Silencia la salida (no muestra progreso).
```bash
curl -s https://jsonplaceholder.typicode.com/posts/1
```

- **`-v, --verbose`** → Muestra información detallada de la transferencia.
```bash
curl -v https://jsonplaceholder.typicode.com/posts/1
```

- **`-L, --location`** → Sigue redirecciones.
```bash
curl -L http://jsonplaceholder.typicode.com/posts/1
```

- **`-4`** → Forzar IPv4.
```bash
curl -4 https://jsonplaceholder.typicode.com/posts/1
```

- **`-6`** → Forzar IPv6.
```bash
curl -6 https://jsonplaceholder.typicode.com/posts/1
```

- **`-k, --insecure`** → Ignora verificación SSL/TLS.
```bash
curl -k https://jsonplaceholder.typicode.com/posts/1
```

---

## 2. Métodos HTTP

- **`-X, --request <METHOD>`** → Define el método (GET, POST, PUT, DELETE, PATCH).
```bash
curl -X DELETE https://jsonplaceholder.typicode.com/posts/1
```

- **`-G, --get`** → Fuerza GET incluso si hay datos.
```bash
curl -G -d "userId=1" https://jsonplaceholder.typicode.com/posts
```

- **`--head` o `-I`** → Solo cabeceras (HEAD).
```bash
curl -I https://jsonplaceholder.typicode.com/posts/1
```

- **Forzar versión HTTP**
```bash
curl --http1.1 https://jsonplaceholder.typicode.com/posts/1
```

---

## 3. Cabeceras

- **`-H, --header <string>`** → Añade cabeceras personalizadas.
```bash
curl -H "X-Test: ejemplo" https://jsonplaceholder.typicode.com/posts/1
```

- **`-A, --user-agent <string>`** → Define el User-Agent.
```bash
curl -A "MiCliente/1.0" https://jsonplaceholder.typicode.com/posts/1
```

- **`-e, --referer <URL>`** → Define Referer.
```bash
curl -e "https://google.com" https://jsonplaceholder.typicode.com/posts/1
```

- **`--compressed`** → Solicita respuesta comprimida.
```bash
curl --compressed https://jsonplaceholder.typicode.com/posts/1
```

- **`-b, --cookie <data>`** → Envía cookies.
```bash
curl -b "user=sergio" https://jsonplaceholder.typicode.com/posts/1
```

- **`-c, --cookie-jar <file>`** → Guarda cookies en archivo.
```bash
curl -c cookies.txt https://jsonplaceholder.typicode.com/posts/1
```

---

## 4. Datos (cuerpo de la petición)

- **`-d, --data <data>`** → Envía datos (POST por defecto).
```bash
curl -d "title=Nuevo&body=Contenido&userId=1" -X POST https://jsonplaceholder.typicode.com/posts
```

- **`--data-raw <data>`** → Igual que `--data`, sin procesar.
```bash
curl --data-raw "title=Raw&body=Test&userId=1" -X POST https://jsonplaceholder.typicode.com/posts
```

- **`--data-urlencode <data>`** → Codifica datos como URL.
```bash
curl --data-urlencode "title=Espacios en blanco" -X POST https://jsonplaceholder.typicode.com/posts
```

- **`-F, --form <name=content>`** → Formulario `multipart/form-data`.
```bash
curl -F "title=Foto" -F "file=@imagen.png" https://jsonplaceholder.typicode.com/posts
```

- **`--form-string <name=string>`** → Envía string literal.
```bash
curl --form-string "mensaje=Hola@123" https://jsonplaceholder.typicode.com/posts
```

- **`-T, --upload-file <file>`** → Sube archivo (PUT).
```bash
curl -T archivo.txt -X PUT https://jsonplaceholder.typicode.com/posts/1
```

---

## 5. Autenticación

- **`-u, --user <user:password>`** → Autenticación básica.
```bash
curl -u usuario:clave https://jsonplaceholder.typicode.com/posts/1
```

- **`--anyauth`** → Negocia cualquier método.
```bash
curl --anyauth -u user:pass https://jsonplaceholder.typicode.com/posts/1
```

- **Ejemplo OAuth2 (token simulado)**
```bash
curl --oauth2-bearer 12345token https://jsonplaceholder.typicode.com/posts
```

---

## 6. Salida

- **`-o, --output <file>`** → Guardar en archivo.
```bash
curl -o salida.json https://jsonplaceholder.typicode.com/posts/1
```

- **`-O, --remote-name`** → Guardar con nombre original.
```bash
curl -O https://jsonplaceholder.typicode.com/posts/1
```

- **`-J, --remote-header-name`** → Usar nombre sugerido por `Content-Disposition`.
```bash
curl -OJ https://jsonplaceholder.typicode.com/posts/1
```

- **`--create-dirs`** → Crear carpetas necesarias.
```bash
curl --create-dirs -o ./descargas/post.json https://jsonplaceholder.typicode.com/posts/1
```

- **`--progress-bar`** → Barra de progreso.
```bash
curl --progress-bar -O https://jsonplaceholder.typicode.com/posts/1
```

- **`-S, --show-error`** → Mostrar errores con `-s`.
```bash
curl -sS https://jsonplaceholder.typicode.com/posts/9999
```

---

## 7. Red

- **`-x, --proxy`** → Usar un proxy.
```bash
curl -x http://127.0.0.1:8080 https://jsonplaceholder.typicode.com/posts/1
```

- **`--proxy-user <user:password>`**
```bash
curl -x http://127.0.0.1:8080 --proxy-user user:pass https://jsonplaceholder.typicode.com/posts/1
```

- **`--socks5 <host:port>`**
```bash
curl --socks5 127.0.0.1:1080 https://jsonplaceholder.typicode.com/posts/1
```

- **`--limit-rate <speed>`**
```bash
curl --limit-rate 200k -O https://jsonplaceholder.typicode.com/posts/1
```

- **`--max-time <seconds>`**
```bash
curl --max-time 5 https://jsonplaceholder.typicode.com/posts/1
```

- **`--connect-timeout <seconds>`**
```bash
curl --connect-timeout 3 https://jsonplaceholder.typicode.com/posts/1
```

- **`--interface <name>`**
```bash
curl --interface eth0 https://jsonplaceholder.typicode.com/posts/1
```

---

## 8. FTP / SFTP (ejemplos genéricos)

- **`--ftp-create-dirs`**
```bash
curl --ftp-create-dirs -T archivo.txt ftp://user:pass@ftp.ejemplo.com/dir/archivo.txt
```

- **`--ftp-method <method>`**
```bash
curl --ftp-method nocwd ftp://user:pass@ftp.ejemplo.com/archivo.txt
```

- **`--ftp-pasv` / `--ftp-port`**
```bash
curl --ftp-pasv ftp://user:pass@ftp.ejemplo.com/archivo.txt
```

- **`-Q, --quote <command>`**
```bash
curl -Q "DELE archivo.txt" ftp://user:pass@ftp.ejemplo.com/
```

- **`--sftp`**
```bash
curl --sftp -u user:pass -T archivo.txt sftp://ejemplo.com/archivo.txt
```

---

## 9. Seguridad y SSL/TLS

- **`--ssl`**
```bash
curl --ssl https://jsonplaceholder.typicode.com/posts/1
```

- **`--ssl-reqd`**
```bash
curl --ssl-reqd https://jsonplaceholder.typicode.com/posts/1
```

- **Forzar versión TLS**
```bash
curl --tlsv1.2 https://jsonplaceholder.typicode.com/posts/1
```

- **`--ciphers <list>`**
```bash
curl --ciphers AES256-SHA https://jsonplaceholder.typicode.com/posts/1
```

---

## 10. Depuración

- **`--trace <file>`**
```bash
curl --trace trace.log https://jsonplaceholder.typicode.com/posts/1
```

- **`--trace-ascii <file>`**
```bash
curl --trace-ascii trace_ascii.log https://jsonplaceholder.typicode.com/posts/1
```

- **`--trace-time`**
```bash
curl --trace-time --trace trace.log https://jsonplaceholder.typicode.com/posts/1
```

- **`--dump-header <file>`**
```bash
curl --dump-header headers.txt https://jsonplaceholder.typicode.com/posts/1
```

- **`-w, --write-out <format>`**
```bash
curl -w "Código HTTP: %{http_code}\n" -s -o /dev/null https://jsonplaceholder.typicode.com/posts/1
```

---

## 11. Varias utilidades

- **`--parallel`**
```bash
curl --parallel https://jsonplaceholder.typicode.com/posts/1 https://jsonplaceholder.typicode.com/posts/2
```

- **`--retry <num>`**
```bash
curl --retry 3 https://jsonplaceholder.typicode.com/posts/1
```

- **`--retry-delay <seconds>`**
```bash
curl --retry 3 --retry-delay 2 https://jsonplaceholder.typicode.com/posts/1
```

- **`--retry-all-errors`**
```bash
curl --retry-all-errors --retry 2 https://jsonplaceholder.typicode.com/posts/1
```

- **`-K, --config <file>`**
```bash
curl -K opciones.conf
```

---