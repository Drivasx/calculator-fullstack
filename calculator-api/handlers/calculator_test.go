package handlers_test

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"api-calculadora/routes"

	"github.com/gin-gonic/gin"
)

type apiResponse struct {
	Result *float64 `json:"result"`
	Error  string   `json:"error"`
}

func setupRouter() *gin.Engine {
	gin.SetMode(gin.TestMode)
	router := gin.New()
	routes.CalculadoraRoutes(router)
	return router
}

func doPost(router http.Handler, path, body string) *httptest.ResponseRecorder {
	req := httptest.NewRequest(http.MethodPost, path, bytes.NewBufferString(body))
	req.Header.Set("Content-Type", "application/json")
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	return w
}

func TestCalculatorEndpoints(t *testing.T) {
	router := setupRouter()

	tests := []struct {
		name       string
		path       string
		body       string
		wantStatus int
		wantResult float64
	}{
		{name: "add two numbers", path: "/api/v1/calculator/add", body: `{"a":10,"b":4}`, wantStatus: http.StatusOK, wantResult: 14},
		{name: "add with zero", path: "/api/v1/calculator/add", body: `{"a":0,"b":5}`, wantStatus: http.StatusOK, wantResult: 5},
		{name: "add with negatives", path: "/api/v1/calculator/add", body: `{"a":-3,"b":7}`, wantStatus: http.StatusOK, wantResult: 4},

		{name: "subtract two numbers", path: "/api/v1/calculator/subtract", body: `{"a":100,"b":27}`, wantStatus: http.StatusOK, wantResult: 73},

		{name: "multiply two numbers", path: "/api/v1/calculator/multiply", body: `{"a":10,"b":4}`, wantStatus: http.StatusOK, wantResult: 40},

		{name: "divide two numbers", path: "/api/v1/calculator/divide", body: `{"a":10,"b":4}`, wantStatus: http.StatusOK, wantResult: 2.5},
		{name: "divide by zero", path: "/api/v1/calculator/divide", body: `{"a":10,"b":0}`, wantStatus: http.StatusBadRequest},

		{name: "power", path: "/api/v1/calculator/pow", body: `{"a":2,"b":10}`, wantStatus: http.StatusOK, wantResult: 1024},

		{name: "square root", path: "/api/v1/calculator/sqrt", body: `{"b":4}`, wantStatus: http.StatusOK, wantResult: 2},
		{name: "square root of negative", path: "/api/v1/calculator/sqrt", body: `{"b":-9}`, wantStatus: http.StatusBadRequest},

		{name: "percentage", path: "/api/v1/calculator/percentage", body: `{"b":50}`, wantStatus: http.StatusOK, wantResult: 0.5},

		{name: "malformed json", path: "/api/v1/calculator/add", body: `{"a":`, wantStatus: http.StatusBadRequest},
		{name: "missing field", path: "/api/v1/calculator/add", body: `{"a":5}`, wantStatus: http.StatusBadRequest},
		{name: "null field", path: "/api/v1/calculator/add", body: `{"a":null,"b":5}`, wantStatus: http.StatusBadRequest},
		{name: "wrong type", path: "/api/v1/calculator/add", body: `{"a":"hello","b":5}`, wantStatus: http.StatusBadRequest},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			w := doPost(router, tt.path, tt.body)

			if w.Code != tt.wantStatus {
				t.Fatalf("status = %d, want %d (body: %s)", w.Code, tt.wantStatus, w.Body.String())
			}

			var resp apiResponse
			if err := json.Unmarshal(w.Body.Bytes(), &resp); err != nil {
				t.Fatalf("response is not valid JSON: %v (body: %s)", err, w.Body.String())
			}

			if tt.wantStatus == http.StatusOK {
				if resp.Result == nil {
					t.Fatalf("expected a result, got body: %s", w.Body.String())
				}
				if *resp.Result != tt.wantResult {
					t.Errorf("result = %v, want %v", *resp.Result, tt.wantResult)
				}
				return
			}

			if resp.Error == "" {
				t.Errorf("expected an error message, got body: %s", w.Body.String())
			}
		})
	}
}
