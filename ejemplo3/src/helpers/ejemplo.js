//IMPORTAACIONES
import { config } from "dotenv";
import { exec } from "child_process";

//DECLARACION DE VARIABLES
config();

const API_URL=process.env.API_URL;

export const getAllUsers=()=>{
    //Logica para obtener todos los usuarios
    const URL_BASE=`${API_URL}/users`;
    const cmd=`curl -X GET ${URL_BASE} `;
    console.log(cmd);

    exec(cmd,(error,stdout,stderr)=>{
        if(error){
            console.error(`Error ejecutando el curl ${error.message()}`);
            return;
        }
        if(stderr){
            console.error(`Error ejecutando el curl ${stderr}`);
            return;
        }

        const data=JSON.parse(stdout);

        console.log(data);
    });
}