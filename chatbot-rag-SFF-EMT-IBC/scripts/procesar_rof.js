// scripts/procesar_rof.js
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

/**
 * Divide texto en chunks con tamaño máximo y overlap configurable
 * @param {string[]} parrafos - Párrafos del texto
 * @param {number} maxLen - Tamaño máximo del fragmento (en caracteres)
 * @param {number} overlap - Solapamiento entre fragmentos (en caracteres)
 * @returns {Array} Lista de fragmentos
 */
function generarChunks(parrafos, maxLen = 1000, overlap = 100) {
  if (parrafos.length == 0) {
    return [];
  }


  let id = 1;
  let buffer = "";

  const chunks =parrafos.reduce((chunks, p) => {
    if ((buffer + p).length > maxLen) {
      // guarda fragmento actual
      chunks.push({
        id: id++,
        contenido: buffer.trim(),
        fuente: "ROF IES HLanz",
        pagina: null,
      });

      // crea overlap con el final del buffer anterior
      const overlapText = buffer.slice(-overlap);
      buffer = overlapText + " " + p;
      return chunks;
    } else {
      buffer += (buffer ? " " : "") + p;
      return chunks;
    }
  },[]);

  // guarda el último fragmento si queda texto
  if (buffer.trim().length > 0) {
    chunks.push({
      id: id++,
      contenido: buffer.trim(),
      fuente: "ROF IES HLanz",
      pagina: null,
    });
  }

  return chunks;
}

function procesarROF() {
  const inputPath = "./datos/datos.txt";
  const outputPath = "./datos/chunks.json";

  if (!fs.existsSync(inputPath)) {
    console.error("❌ Error: No se encontró el archivo datos/datos.txt");
    process.exit(1);
  }

  const texto = fs.readFileSync(inputPath, "utf-8");
  const parrafos = texto.split(/\n\s*\n/); // divide por párrafos
  const chunks = generarChunks(parrafos, 150); // tamaño máx. 1000, overlap 150

  // guardar
  fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2), "utf-8");

  // estadísticas
  const totalChars = chunks.reduce((acc, ch) => acc + ch.contenido.length, 0);
  const promedio = totalChars / (chunks.length || 1);

  console.log("✅ ROF procesado con éxito");
  console.log(`📦 Total fragmentos: ${chunks.length}`);
  console.log(`🧮 Tamaño promedio: ${promedio.toFixed(2)} caracteres`);
  console.log(`🧩 Ejemplo del primer fragmento:\n${chunks[0].contenido.slice(0, 200)}...`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  procesarROF();
}
procesarROF();

export default procesarROF;
