package main

import (
	"api-calculadora/routes"

	"github.com/gin-gonic/gin"

	"github.com/gin-contrib/cors"
)

func main(){
	var router *gin.Engine = gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins: []string{"http://localhost:5173"},
		AllowMethods: []string{"POST"},
		AllowHeaders: []string{"Origin", "Content-Type", "Accept", "Access-Control-Allow-Origin"},
	}))

	router.SetTrustedProxies(nil)

	routes.CalculadoraRoutes(router)

	router.Run(":8080")
}