# CodeLab – Web-Based Code Editor

A lightweight browser-based IDE for a **5-mark DevOps college assignment**.

> GitHub stores source code, Jenkins automates the build pipeline, Maven builds and packages the application, and JFrog Artifactory stores the generated artifacts.

**DevOps chain:** GitHub → Jenkins → Maven → Build/Test → JFrog

**Note:** There is **no database**. The backend stores files **in memory** (`ConcurrentHashMap`). All files are lost when Spring Boot restarts. This is intentional.

---

## 1. Project Overview

CodeLab lets you:

- Select a programming language (JS, TS, Java, Python, C, C++, HTML, CSS, JSON, SQL)
- Write code in Monaco Editor (VS Code engine)
- Create / open / save / delete files via REST API
- Copy, download, reset code
- Switch dark/light themes
- See cursor position and backend connection status

The React frontend talks to the Spring Boot API over HTTP (`http://localhost:8080/api/files`).

---

## 2. Features

**Frontend:** file explorer, Monaco editor (highlighting, line numbers, autocomplete, folding, minimap), language selector, theme switcher, save/download/copy/reset, status bar, toasts.

**Backend:** REST CRUD for files, in-memory store, validation, `201/200/204/400/404/409` status codes, global `@RestControllerAdvice` handler, CORS for `http://localhost:5173`, JUnit 5 tests.

---

## 3. Architecture

```
                    GitHub
                       |
                       v
                    Jenkins
                       |
                 Maven Build
                       |
          ┌────────────┴────────────┐
          │                         │
     React Build              Spring Boot Build
          │                         │
          └────────────┬────────────┘
                       |
                 Package Artifacts
                       |
                       v
              JFrog Artifactory
```

```
┌─────────────────────────────────────────────┐
│                 React UI                    │
│  File Explorer    Monaco Code Editor        │
│  Language         Theme / Save / Download   │
└──────────────────────┬──────────────────────┘
                       │ REST / HTTP
                       ▼
┌─────────────────────────────────────────────┐
│             Spring Boot API                 │
│  File Controller → File Service             │
│                    → In-Memory File Store   │
└─────────────────────────────────────────────┘
```

Full DevOps flow:

```
                    ┌─────────────┐
                    │   GitHub    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Jenkins   │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │    Maven    │
                    └──────┬──────┘
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      React Frontend              Spring Boot Backend
             │                           │
             └─────────────┬─────────────┘
                           ▼
                     Build Artifacts
                           │
                           ▼
                  ┌─────────────────┐
                  │ JFrog Artifactory│
                  └─────────────────┘
```

---

## 4. Technology Stack

| Component | Purpose |
|---|---|
| React + Vite + Monaco | Frontend code editor |
| Spring Boot 3 + Validation | REST API backend |
| Java `ConcurrentHashMap` | Temporary in-memory storage |
| Maven | Build, test and package |
| Jenkins | CI/CD automation |
| JFrog Artifactory | Artifact repository |
| GitHub | Source control |

No MySQL/Postgres/Mongo/Redis/Kafka/Docker/K8s/Auth/JWT — kept intentionally simple.

---

## 5. Project Structure

```
codelab/
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── components/ (Header, Sidebar, CodeEditor, StatusBar, FileDialog, Toast)
│       ├── services/api.js
│       ├── data/sampleCode.js
│       ├── App.jsx, App.css, main.jsx
├── backend/
│   ├── pom.xml
│   └── src/main/java/com/codelab/
│       ├── CodeLabApplication.java, CorsConfig.java
│       ├── controller/FileController.java
│       ├── service/FileService.java
│       ├── model/ (CodeFile, CreateFileRequest, UpdateFileRequest)
│       └── exception/ (FileNotFoundException, DuplicateFileException, GlobalExceptionHandler)
│   └── src/test/java/com/codelab/FileServiceTest.java
├── pom.xml
├── Jenkinsfile
├── README.md
└── .gitignore
```

---

## 6. Running Locally

Backend (port 8080):

```bash
cd backend
mvn spring-boot:run
```

Frontend (port 5173):

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## 7. API Documentation

Base: `http://localhost:8080/api/files`

| Method | Endpoint | Body | Success |
|---|---|---|---|
| GET | `/api/files` | – | `200` list of `{name, language}` (+content) |
| GET | `/api/files/{name}` | – | `200` `{name, language, content}` / `404` |
| POST | `/api/files` | `{name, language, content}` | `201` / `400` blank / `409` duplicate |
| PUT | `/api/files/{name}` | `{content, language?}` | `200` / `404` |
| DELETE | `/api/files/{name}` | – | `204` / `404` |

Examples:

```bash
curl http://localhost:8080/api/files
curl http://localhost:8080/api/files/main.js
curl -X POST http://localhost:8080/api/files \
  -H "Content-Type: application/json" \
  -d '{"name":"hello.py","language":"python","content":"print(\"Hello CodeLab\")"}'
curl -X PUT http://localhost:8080/api/files/hello.py \
  -H "Content-Type: application/json" \
  -d '{"content":"print(\"Updated Code\")"}'
curl -X DELETE http://localhost:8080/api/files/hello.py -i
```

---

## 8. Maven Build

```bash
mvn clean package
```

Does: build React frontend → `npm install` → `npm run build` → run backend tests (fails build on failure) → package `codelab-backend-1.0.0.jar` → zip `frontend/dist` → `codelab-frontend-1.0.0.zip`.

Result in `target/`:

```
target/
├── codelab-backend-1.0.0.jar
└── codelab-frontend-1.0.0.zip
```

Backend only:

```bash
mvn -pl backend test
mvn -pl backend package
```

---

## 9. Jenkins Pipeline

Stages: `Checkout → Build Frontend → Test Backend → Package Backend → Package Frontend → Publish Artifacts`.

- Runs `mvn clean package` (via split steps so logs clearly show each stage).
- Archives `target/*.jar, target/*.zip`.
- Publishes to JFrog **only if** frontend build ✓, backend tests ✓, packaging ✓ all pass — otherwise `Pipeline FAILED` and nothing is uploaded.
- JFrog credentials come from Jenkins Credentials (`jfrog-url`, `jfrog-creds`) — never hardcoded.

---

## 10. JFrog

Generic repo: `codelab-generic-local`

```
codelab-generic-local/
├── codelab-backend-1.0.0.jar
└── codelab-frontend-1.0.0.zip
```

Upload is a `curl -u $USER:$TOKEN -T <file> $JFROG_URL/artifactory/<repo>/<file>` in the `Publish Artifacts` stage.

---

## 11. DevOps Demonstration (5–10 min viva)

1. **App:** open CodeLab, create `hello.py`, write `print("Hello CodeLab")`, Save.
2. **Backend:** `GET /api/files` in browser/Postman — show saved file.
3. **GitHub:** `git add . && git commit -m "Add new code editor feature" && git push`.
4. **Jenkins:** run pipeline — show all green: Checkout ✓ Frontend ✓ Tests ✓ Package ✓ Publish ✓.
5. **JFrog:** open `codelab-generic-local` — show JAR + ZIP.

---

## 12. Assignment Mapping

| Component | Purpose |
|---|---|
| React | Frontend code editor |
| Monaco | Code editing experience |
| Spring Boot | REST API backend |
| Java Collections | Temporary in-memory storage |
| Maven | Build, test and package |
| Jenkins | CI/CD automation |
| JFrog | Artifact repository |
| GitHub | Source control |

---

## 13. Local Continuous Deployment (optional)

Jenkins runs in Docker (`jenkins-codelab:1.0`, UI on `http://localhost:8081`).
Its `Deploy to Local` stage copies each green build into `deploy/` on the host
(mounted as `/deploy` in the container). A host watcher redeploys from there:

```powershell
# one terminal, leave running:
powershell -ExecutionPolicy Bypass -File scripts/watch-deploy.ps1
# stop the deployed app:
powershell -ExecutionPolicy Bypass -File scripts/stop-deploy.ps1
```

Demo loop: edit → `git commit` → `git push` → Jenkins polls Git (~2 min),
builds, deploys to `deploy/` → watcher restarts backend on `:8080` and serves
the fresh production frontend on `:5173`. Refresh the browser to see the change.
In-memory files are reset on each redeploy (no database, by design).
