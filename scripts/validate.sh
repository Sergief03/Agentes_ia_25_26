#!/bin/bash
# @author: Sergio Fernández Fernández
# @comment:~
# @description: Script que valida su tenemos instalados git, node, npm, curl
#Crear un script utilizando el comando command -v verifique si tengo instalado o no tengo instalado los paquetes git, node, npm, curl
#Si alguno de dichos paquetes no esta en el sistema mostraremos mensaje de error 

paquetes=("git" "node" "npm" "curl")

for pkg in "${paquetes[@]}"; do
    if  ! command -v "$pkg" >/dev/null 2>&1; then
        echo "[ERROR] $pkg NO está instalado"
        exit 0
    else
        echo "[OK] $pkg está instalado"
        echo -e "VERSION: $($pkg --version)\n"
    fi
done

echo "Todos los paquetes están instalados"


