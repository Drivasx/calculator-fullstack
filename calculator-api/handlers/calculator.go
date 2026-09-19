package handlers

import (
	"api-calculadora/models"
	"api-calculadora/service"
	"github.com/gin-gonic/gin"
	"net/http"
)

func Add(c *gin.Context) {
	var op models.Operation
	if err := c.ShouldBindJSON(&op); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	res := service.Add(*op.A, *op.B)

	c.JSON(http.StatusOK, gin.H{"result": res})
}

func Subtract(c *gin.Context) {
	var op models.Operation

	if err := c.ShouldBindJSON(&op); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	res := service.Subtract(*op.A, *op.B)

	c.JSON(http.StatusOK, gin.H{"result": res})
}

func Multiply(c *gin.Context) {
	var op models.Operation

	if err := c.ShouldBindJSON(&op); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	res := service.Multiply(*op.A, *op.B)

	c.JSON(http.StatusOK, gin.H{"result": res})
}

func Divide(c *gin.Context) {
	var op models.Operation

	if err := c.ShouldBindJSON(&op); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	res, err := service.Divide(*op.A, *op.B)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": res})
}

func Pow(c *gin.Context) {
	var op models.Operation

	if err := c.ShouldBindJSON(&op); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	res := service.Pow(*op.A, *op.B)

	c.JSON(http.StatusOK, gin.H{"result": res})
}

func Sqrt(c *gin.Context) {
	var op models.UnaryOperation

	if err := c.ShouldBindJSON(&op); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	res, err := service.Sqrt(*op.B)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"result": res})
}

func Percentage(c *gin.Context) {
	var op models.UnaryOperation

	if err := c.ShouldBindJSON(&op); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	res := service.Percentage(*op.B)

	c.JSON(http.StatusOK, gin.H{"result": res})
}
