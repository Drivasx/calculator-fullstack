# Full Stack calculator

A full-featured calculator with a **React + TypeScript (Vite)** frontend and a **Go (Gin)** backend, communicating via a **REST API**. It includes basic and advanced arithmetic operations, input validation, unit tests for both layers and Docker container deployment.

---

## Project Structure

```
.
├── calculator-api/        # Backend Go
├── calculator-client/      # Frontend React with TypeScript
├── compose.yml             
└── README.md               
```

---

## Technologies

| Layer       | Stack                                                        |
|-------------|--------------------------------------------------------------|
| Backend     | Go 1.26, Gin, Gin-CORS, tests with `testing` library         |
| Frontend    | React 19, TypeScript, Vite, Vitest                           |
| Infra       | Docker, Docker Compose                                       |

---

## How to run it

### Clone the repo
```bash
git clone https://github.com/Drivasx/calculator-fullstack
```

### Move to the directory
```bash
cd calculator-fullstack
```


### Option A: Docker Compose


Run everything:

```bash
docker compose up -d --build
```

- Frontend → http://localhost:5173
- Backend  → http://localhost:8080

---

## API uses examples

All endpoints are `POST` with JSON body and returns `{"result": ...}`.

**Binary operations** (body: `{ "a": ..., "b": ... }`):

```bash
curl -X POST http://localhost:8080/api/v1/calculator/add \
  -H "Content-Type: application/json" \
  -d '{"a": 7, "b": 3}'
# => {"result":10}

curl -X POST http://localhost:8080/api/v1/calculator/multiply \
  -H "Content-Type: application/json" \
  -d '{"a": 4, "b": 5}'
# => {"result":20}

curl -X POST http://localhost:8080/api/v1/calculator/pow \
  -H "Content-Type: application/json" \
  -d '{"a": 2, "b": 8}'
# => {"result":256}
```

**Unary operations** (body: `{ "b": ... }`):

```bash
curl -X POST http://localhost:8080/api/v1/calculator/sqrt \
  -H "Content-Type: application/json" \
  -d '{"b": 9}'
# => {"result":3}

curl -X POST http://localhost:8080/api/v1/calculator/percentage \
  -H "Content-Type: application/json" \
  -d '{"b": 50}'
# => {"result":0.5}
```

**Error handling** 

```bash
curl -X POST http://localhost:8080/api/v1/calculator/divide \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 0}'
# => 400 {"error":"You cannot divide by zero."}

curl -X POST http://localhost:8080/api/v1/calculator/sqrt \
  -H "Content-Type: application/json" \
  -d '{"b": -16}'
# => 400 {"error":"You cannot get the square root of a negative number."}
```

---


## Tests and coverage

| Layer   | command                                                   | 
|---------|-----------------------------------------------------------|
| Backend | `cd calculator-api && go test -cover ./...`               | 
| Frontend| `cd calculator-api && npm run coverage`                   | 

backend:

![](image_2.png)

---

frontend:

![](image.png)


