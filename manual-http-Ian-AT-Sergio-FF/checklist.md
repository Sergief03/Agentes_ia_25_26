# ✅ Project Progress Checklist

Este archivo controla el progreso del ejercicio CRUD HTTP con cURL, Thunder Client y REST Client.  

---

## 🏗 Phase 1: Initial Setup **(Sergio)**
- [x] Create project folder `manual-http-[name-initials-surname]`
- [x] Initialize project with `npm init`
- [x] Complete `package.json` metadata
- [x] Install dependencies:  
  - [x] json-server  
  - [x] dotenv  
- [x] Configure `package.json` with:
  - [x] `"type": "module"`
  - [X] Script `server:up` → run json-server on port 4000
  - [X] Script `crud:curl` → run `src/crud-curl.js`
  - [X] Script `validate` → run `scripts/validate.sh`
- [x] Create folder structure:
  - [x] `src/db/db.json`
  - [x] `src/crud-curl.js`
  - [x] `scripts/validate.sh`
  - [x] `images/`
- [x] Create `.env` file
- [x] Create `.env.example` template
- [x] Configure `.gitignore`

---

## 🔧 Phase 2: Required Scripts
- [x] `src/crud-curl.js` implemented **(Ian)**
- [X] `scripts/validate.sh` implemented and executable **(Sergio)**

---

## 💻 Phase 3: CRUD Functions in `crud-curl.js` **(Ian)**
- [x] `createStudent(studentData)`
- [x] `readAllStudents()`
- [x] `readStudentById(id)`
- [x] `updateStudent(id, studentData)` (PUT)
- [x] `patchStudent(id, partialData)` (PATCH)
- [x] `deleteStudent(id)`
- [x] All functions print correct cURL commands

---

## 📚 Phase 4: CRUD Documentation **(Ian)**
- [x] Document CREATE
- [x] Document READ ALL
- [x] Document READ BY ID
- [x] Document UPDATE (PUT)
- [x] Document PATCH
- [x] Document DELETE
- [x] Explain each flag (-i, -X, -H, -d)
- [x] Include HTTP response examples with headers + body
- [x] Include explanation of status codes

---

## ⚡ Phase 5: Thunder Client **(Sergio)**
- [x] Create collection "CRUD Students API"
- [x] Setup environment variables (baseUrl, port, fullUrl)
- [x] Add 6 CRUD requests
- [x] Capture screenshots of each request + response
- [x] Save screenshots in `/images`
- [x] Include them in README.md

---

## 📝 Phase 6: REST Client **(Sergio)**
- [x] Create `peticiones-crud.http`
- [x] Define variables (@baseUrl, @port, @apiUrl)
- [x] Implement CRUD operations
- [x] Add filters (active students, by level)
- [x] Separate requests with `###`
- [x] Add descriptive comments
- [x] Test all requests from VS Code

---

## ✅ Phase 7: Validation **(Sergio)**
- [x] `scripts/validate.sh` validates:
  - [x] package.json exists
  - [x] src/db/db.json exists
  - [x] .gitignore exists
  - [x] .env.example exists
  - [x] README.md exists
  - [x] checklist.md exists
  - [x] peticiones-crud.http exists
  - [x] src/crud-curl.js exists
  - [x] images/ folder exists with ≥6 screenshots
  - [x] scripts/ folder exists
  - [x] Dependencies (dotenv, json-server) installed
  - [x] Scripts (`server:up`, `crud:curl`) exist in package.json
- [x] Validation script prints success message

---

## 🌿 Phase 8: Git & GitHub **(Sergio)**
- [x] Initialize Git locally
- [x] Connect to remote repository
- [x] Set main branch
- [x] Push initial code
- [x] Create branch `m1/http-request-response`
- [x] Make incremental commits with descriptive messages
- [x] Push branch to GitHub
- [x] Open Pull Request to main
- [x] Add professor as reviewer
- [x] Merge PR
- [x] Create and push tag `M1/http-request-response`

---