package service

import (
	"errors"
	"math"
)

func Add(a, b float64) float64 {
	return a+b
}

func Subtract(a, b float64) float64{
	return a-b
}

func Multiply(a, b float64) float64 {
	return a * b
}

func Divide(a, b float64) (float64, error) {
	if b == 0 {
		error := errors.New("You cannot divide by zero.")
		return 0, error
	}

	return a / b, nil
} 

func Pow(a, b float64) float64 {
	return math.Pow(a, b)
}

func Sqrt(b float64) (float64, error) {
	if b < 0 {
		error := errors.New("You cannot get the square root of a negative number.")
		return 0, error
	}
	return math.Sqrt(b), nil
}

func Percentage(b float64) float64 {
	return b / 100
}