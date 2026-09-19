# calculator-api — Backend Go (Gin)

REST service that handles calculator operations. Pure arithmetic in `service/`, 
input validation in `models/`, and HTTP logic in `handlers/` + `routes/`.

---

## Endpoints

Base: `POST /api/v1/calculator`

| Operation       | Path                  | Body          | Response     |
|-----------------|-----------------------|---------------|--------------|
| Add             | `/add`                | `{a, b}`      | `{"result"}` |
| Subtract        | `/subtract`           | `{a, b}`      | `{"result"}` |
| Multiply        | `/multiply`           | `{a, b}`      | `{"result"}` |
| Divide          | `/divide`             | `{a, b}`      | `{"result"}` |
| Power           | `/pow`                | `{a, b}`      | `{"result"}` |
| Square root     | `/sqrt`               | `{b}`         | `{"result"}` |
| Percentage      | `/percentage`         | `{b}`         | `{"result"}` |

All routes return JSON: `200 {"result": <number>}` or `400 {"error": "<message>"}`.

### Examples

```bash
# Add
curl -sX POST http://localhost:8080/api/v1/calculator/add \
  -H "Content-Type: application/json" \
  -d '{"a": 7, "b": 3}'
# {"result":10}

# Division by zero → error 400
curl -sX POST http://localhost:8080/api/v1/calculator/divide \
  -H "Content-Type: application/json" \
  -d '{"a": 10, "b": 0}'
# {"error":"You cannot divide by zero."}

# Square root
curl -sX POST http://localhost:8080/api/v1/calculator/sqrt \
  -H "Content-Type: application/json" \
  -d '{"b": 9}'
# {"result":3}

# Percentage 
curl -sX POST http://localhost:8080/api/v1/calculator/percentage \
  -H "Content-Type: application/json" \
  -d '{"b": 50}'
# {"result":0.5}
```

## How to run it

```bash
go mod download
go run ./cmd/api
# server in http://localhost:8080
```

Tests (unit + coverage):

```bash
go test ./... -cover
# with saved report:
go test ./... -coverprofile=coverage.out
go tool cover -func=coverage.out
```


## State

- Tests backend: `service` **100%**, `handlers` **75%** (sin tests `routes` aún).
  Report: `coverage.out`.
