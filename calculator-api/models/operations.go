package models

type Operation struct {
	A *float64 `json:"a" binding:"required"`
	B *float64 `json:"b" binding:"required"`
}

type UnaryOperation struct {
	B *float64 `json:"b" binding:"required"`
}