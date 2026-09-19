package routes

import (
	"api-calculadora/handlers"

	"github.com/gin-gonic/gin"
)

func CalculadoraRoutes(route *gin.Engine){
	api := route.Group("/api/v1/calculator")
	{
		api.POST("/add", handlers.Add)
		api.POST("/subtract", handlers.Subtract)
		api.POST("/multiply", handlers.Multiply)
		api.POST("/divide", handlers.Divide)
		api.POST("/pow", handlers.Pow)
		api.POST("/percentage", handlers.Percentage)
		api.POST("/sqrt", handlers.Sqrt)
	}
}