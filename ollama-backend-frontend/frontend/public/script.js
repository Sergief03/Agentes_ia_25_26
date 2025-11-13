document.getElementById("btnModelos").addEventListener("click", async() => {
    try{
        const response=await fetch("http://localhost:3002/api/modelos");
        if(!response.ok){
            throw new Error(`Error en la respuesta de la API de Ollama: ${response.statusText}`);
        }

        const data= await response.json();
        console.table(data)
        const nombreModelos=data.modelos.map(modelo=>modelo.name);

        //seleccionamos el parrafo donde mostrar los modelos
        document.getElementById("mostrarModelos").textContent=`Modelos disponibles: ${nombreModelos.join(", ")}`;
    }catch(error){
        console.error(error);
    }
})