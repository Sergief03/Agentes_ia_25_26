#!/bin/bash
BASE_URL="http://192.168.56.1:3000"

echo " === LISTAR LIBROS ==="
curl -s $BASE_URL/books | jq .

echo -e "\n\n === CREAR LIBRO ==="
curl -s -X POST $BASE_URL/books \
  -H "Content-Type: application/json" \
  -d '{
    "titulo": "Nuevo Libro",
    "editorial": "OpenAI Press",
    "anio": 2025,
    "categoria": "IA",
    "isbn": "0000000000",
    "precio": 19.99,
    "authorId": 1
  }' | jq .

echo -e "\n\n === ACTUALIZAR LIBRO (PUT) ==="
curl -s -X PUT $BASE_URL/books/1 \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "titulo": "Clean Code (2ª Edición)",
    "editorial": "Prentice Hall",
    "anio": 2010,
    "categoria": "Buenas prácticas",
    "isbn": "9780132350884",
    "precio": 40.99,
    "authorId": 1
  }' | jq .

echo -e "\n\n === ELIMINAR LIBRO ==="
curl -s -X DELETE $BASE_URL/books/2 | jq .

echo -e "\n\n === LISTAR AUTORES ==="
curl -s $BASE_URL/authors | jq .

echo -e "\n\n === CREAR AUTOR ==="
curl -s -X POST $BASE_URL/authors \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Nuevo Autor",
    "nacionalidad": "España"
  }' | jq .

echo -e "\n\n === ACTUALIZAR AUTOR (PUT) ==="
curl -s -X PUT $BASE_URL/authors/1 \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "nombre": "Robert Cecil Martin",
    "nacionalidad": "EEUU"
  }' | jq .

echo -e "\n\n === ELIMINAR AUTOR ==="
curl -s -X DELETE $BASE_URL/authors/3 | jq .
