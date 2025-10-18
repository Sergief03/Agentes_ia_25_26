#!/bin/bash

# Colores
GREEN="\033[0;32m"
RED="\033[0;31m"
NC="\033[0m"

# Función check
check() {
    if [ "$1" -eq 0 ]; then
        echo -e "[${GREEN}✔${NC}] $2"
    else
        echo -e "[${RED}✘${NC}] $2"
        FAIL=1
    fi
}

FAIL=0

# Archivos
[ -f "package.json" ]      ; check $? "package.json"; PKG=$?
[ -f "src/db/db.json" ]    ; check $? "src/db/db.json"
[ -f ".gitignore" ]        ; check $? ".gitignore"
[ -f ".env.example" ]      ; check $? ".env.example"
[ -f "README.md" ]         ; check $? "README.md"
[ -f "checklist.md" ]      ; check $? "checklist.md"
[ -f "peticiones-crud.http" ] ; check $? "peticiones-crud.http"
[ -f "src/crud-curl.js" ]  ; check $? "src/crud-curl.js"

# Carpeta images
if [ -d "images" ]; then
    COUNT=$(ls images/*.{png,jpg,jpeg,gif} 2>/dev/null | wc -l)
    if [ "$COUNT" -ge 6 ]; then
        echo -e "[${GREEN}✔${NC}] images/ folder exists with $COUNT screenshots"
    else
        echo -e "[${RED}✘${NC}] images/ folder must have ≥6 screenshots (found $COUNT)"
        FAIL=1
    fi
else
    echo -e "[${RED}✘${NC}] images/ folder missing"
    FAIL=1
fi

# Carpeta scripts
[ -d "scripts" ] ; check $? "scripts"

# Dependencias
if [ $PKG -eq 0 ]; then
    if npm list dotenv json-server >/dev/null 2>&1; then
        echo -e "[${GREEN}✔${NC}] Dependencies dotenv & json-server installed"
    else
        echo -e "[${RED}✘${NC}] Missing dependencies dotenv or json-server"
        FAIL=1
    fi

    # Scripts en package.json
    if grep -q '"server:up"' package.json && grep -q '"crud:curl"' package.json; then
        echo -e "[${GREEN}✔${NC}] Scripts (server:up, crud:curl) exist in package.json"
    else
        echo -e "[${RED}✘${NC}] Missing scripts (server:up, crud:curl) in package.json"
        FAIL=1
    fi
fi

# Resultado final
if [ $FAIL -eq 0 ]; then
    echo -e "\n${GREEN}✅ Project validation successful!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Validation failed. Please fix the issues above.${NC}"
    exit 1
fi
