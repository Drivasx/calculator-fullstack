package service_test

import (
	"api-calculadora/service"
	"testing"
)

func TestAdd(t *testing.T) {
	tests := []struct {
		name string
		a, b float64
		want float64
	}{
		{name: "normal addition", a: 10, b: 4, want: 14},
		{name: "addition with zero", a: 0, b: 5, want: 5},
		{name: "addition with negatives", a: -3, b: 7, want: 4},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := service.Add(tt.a, tt.b)

			if got != tt.want {
				t.Errorf("Add(%v, %v) = %v, want %v", tt.a, tt.b, got, tt.want)
			}

		})
	}
}

func TestSubtract(t *testing.T) {
	tests := []struct {
		name string
		a, b float64
		want float64
	}{
		{name: "normal subtraction", a: 100, b: 27, want: 73},
		{name: "negative result", a: 542, b: 740, want: -198},
		{name: "subtraction with zero", a: 0, b: 3, want: -3},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := service.Subtract(tt.a, tt.b)

			if got != tt.want {
				t.Errorf("Subtract(%v, %v) = %v, want %v", tt.a, tt.b, got, tt.want)
			}

		})
	}
}

func TestMultiply(t *testing.T) {
	tests := []struct {
		name string
		a, b float64
		want float64
	}{
		{name: "normal multiplication", a: 10, b: 4, want: 40},
		{name: "multiplication with zero", a: 123, b: 0, want: 0},
		{name: "negative x negative", a: -4, b: -3, want: 12},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := service.Multiply(tt.a, tt.b)

			if got != tt.want {
				t.Errorf("Multiply(%v, %v) = %v, want %v", tt.a, tt.b, got, tt.want)
			}

		})
	}
}

func TestDivide(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
		wantErr bool
	}{
		{name: "normal division", a: 10, b: 4, want: 2.5},
		{name: "division by zero", a: 10, b: 0, wantErr: true},
		{name: "zero divided by non-zero", a: 0, b: 5, want: 0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := service.Divide(tt.a, tt.b)
			if tt.wantErr {
				if err == nil {
					t.Fatalf("Divide(%v, %v): expected error, got no error", tt.a, tt.b)
				}
				return
			}
			if err != nil {
				t.Fatalf("Unexpected error: %v", err)
			}
			if got != tt.want {
				t.Errorf("Divide(%v, %v) = %v, want %v", tt.a, tt.b, got, tt.want)
			}

		})
	}
}

func TestPow(t *testing.T) {
	tests := []struct {
		name string
		a, b float64
		want float64
	}{
		{name: "normal power", a: 7, b: 2, want: 49},
		{name: "exponent zero", a: 10, b: 0, want: 1},
		{name: "negative exponent", a: 2, b: -2, want: 0.25},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := service.Pow(tt.a, tt.b)

			if got != tt.want {
				t.Errorf("Pow(%v, %v) = %v, want %v", tt.a, tt.b, got, tt.want)
			}

		})
	}
}

func TestSqrt(t *testing.T) {
	tests := []struct {
		name    string
		b       float64
		want    float64
		wantErr bool
	}{
		{name: "normal square root", b: 4, want: 2},
		{name: "square root with a negative number", b: -16, wantErr: true},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := service.Sqrt(tt.b)
			if tt.wantErr {
				if err == nil {
					t.Fatalf("Sqrt(%v): expected error, got no error", tt.b)
				}
				return
			}
			if err != nil {
				t.Fatalf("Unexpected error: %v", err)
			}
			if got != tt.want {
				t.Errorf("Sqrt(%v) = %v, want %v", tt.b, got, tt.want)
			}

		})
	}
}

func TestPercentage(t *testing.T) {
	tests := []struct {
		name string
		b    float64
		want float64
	}{
		{name: "normal percentage", b: 75, want: 0.75},
		{name: "percentage of zero", b: 0, want: 0},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := service.Percentage(tt.b)

			if got != tt.want {
				t.Errorf("Percentage(%v) = %v, want %v", tt.b, got, tt.want)
			}

		})
	}
}
