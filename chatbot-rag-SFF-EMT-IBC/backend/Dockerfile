FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ENV API_PORT=3000
ENV QDRANT_URL=http://qdrant:6333
ENV QDRANT_COLLECTION_NAME=fragmentos_rof

EXPOSE 3000

CMD ["node", "server.js"]
