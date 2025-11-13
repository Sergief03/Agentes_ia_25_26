const p=`curl -X POST http://localhost:11434/api/generate 
-H "Content-Type: application/json"
-d '{
  "model": "phi3:mini",
  "prompt": "Hola que tal",
  "stream": false
}` ;



