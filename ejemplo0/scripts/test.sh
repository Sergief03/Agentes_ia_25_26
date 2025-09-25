#!/bin/bash
# Script de pruebas con curl (JSONPlaceholder)


BASE_URL="https://jsonplaceholder.typicode.com/posts"

echo "========== TEST GET =========="
curl -s -X GET "$BASE_URL/1" | jq .

echo "========== TEST POST =========="
curl -s -X POST "$BASE_URL" \
    -H "Content-Type: application/json" \
    -d '{"title":"Nuevo post","body":"Contenido de prueba","userId":1}' | jq .

echo "========== TEST PUT =========="
curl -s -X PUT "$BASE_URL/1" \
    -H "Content-Type: application/json" \
    -d '{"id":1,"title":"Post actualizado","body":"Contenido actualizado","userId":1}' | jq .

echo "========== TEST PATCH =========="
curl -s -X PATCH "$BASE_URL/1" \
    -H "Content-Type: application/json" \
    -d '{"title":"Título modificado"}' | jq .

echo "========== TEST DELETE =========="
curl -s -X DELETE "$BASE_URL/1" -w "\nHTTP_CODE: %{http_code}\n"


