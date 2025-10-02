# ✅ Project Progress Checklist

Este archivo controla el progreso del ejercicio CRUD HTTP con cURL, Thunder Client y REST Client.  

---

## 🏗 Phase 1: Initial Setup
- [x] Create project folder `manual-http-[name-initials-surname]`
- [x] Initialize project with `npm init`
- [x] Complete `package.json` metadata
- [x] Install dependencies:  
  - [x] json-server  
  - [x] dotenv  
- [] Configure `package.json` with:
  - [x] `"type": "module"`
  - [ ] Script `server:up` → run json-server on port 4000
  - [ ] Script `crud:curl` → run `src/crud-curl.js`
  - [ ] Script `validate` → run `scripts/validate.sh`
- [ ] Create folder structure:
  - [x] `src/db/db.json`
  - [x] `src/crud-curl.js`
  - [ ] `scripts/validate.sh`
  - [x] `images/`
- [x] Create `.env` file
- [] Create `.env.example` template
- [x] Configure `.gitignore`

---

## 🔧 Phase 2: Required Scripts
- [ ] `src/crud-curl.js` implemented
- [ ] `scripts/validate.sh` implemented and executable

---

## 💻 Phase 3: CRUD Functions in `crud-curl.js`
- [ ] `createStudent(studentData)`
- [ ] `readAllStudents()`
- [ ] `readStudentById(id)`
- [ ] `updateStudent(id, studentData)` (PUT)
- [ ] `patchStudent(id, partialData)` (PATCH)
- [ ] `deleteStudent(id)`
- [ ] All functions print correct cURL commands

---

## 📚 Phase 4: CRUD Documentation
- [ ] Document CREATE
- [ ] Document READ ALL
- [ ] Document READ BY ID
- [ ] Document UPDATE (PUT)
- [ ] Document PATCH
- [ ] Document DELETE
- [ ] Explain each flag (-i, -X, -H, -d)
- [ ] Include HTTP response examples with headers + body
- [ ] Include explanation of status codes

---

## ⚡ Phase 5: Thunder Client
- [ ] Create collection "CRUD Students API"
- [ ] Setup environment variables (baseUrl, port, fullUrl)
- [ ] Add 6 CRUD requests
- [ ] Capture screenshots of each request + response
- [ ] Save screenshots in `/images`
- [ ] Include them in README.md

---

## 📝 Phase 6: REST Client
- [ ] Create `peticiones-crud.http`
- [ ] Define variables (@baseUrl, @port, @apiUrl)
- [ ] Implement CRUD operations
- [ ] Add filters (active students, by level)
- [ ] Separate requests with `###`
- [ ] Add descriptive comments
- [ ] Test all requests from VS Code

---

## ✅ Phase 7: Validation
- [ ] `scripts/validate.sh` validates:
  - [ ] package.json exists
  - [ ] src/db/db.json exists
  - [ ] .gitignore exists
  - [ ] .env.example exists
  - [ ] README.md exists
  - [ ] checklist.md exists
  - [ ] peticiones-crud.http exists
  - [ ] src/crud-curl.js exists
  - [ ] images/ folder exists with ≥6 screenshots
  - [ ] scripts/ folder exists
  - [ ] Dependencies (dotenv, json-server) installed
  - [ ] Scripts (`server:up`, `crud:curl`) exist in package.json
- [ ] Validation script prints success message

---

## 🌿 Phase 8: Git & GitHub
- [ ] Initialize Git locally
- [ ] Connect to remote repository
- [ ] Set main branch
- [ ] Push initial code
- [ ] Create branch `m1/http-request-response`
- [ ] Make incremental commits with descriptive messages
- [ ] Push branch to GitHub
- [ ] Open Pull Request to main
- [ ] Add professor as reviewer
- [ ] Merge PR
- [ ] Create and push tag `M1/http-request-response`

---