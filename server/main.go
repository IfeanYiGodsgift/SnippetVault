// server/main.go
package main

import (
	"snippet-vault/server/db"     // Handles DB connection
	"snippet-vault/server/routes" // Handles API route setup

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Connect to the database
	db.Connect()

	// Create a new Gin router
	router := gin.Default()

	// This allows all origins (e.g., localhost:5173) to talk to our API
	router.Use(cors.Default())

	// Set up all API routes
	routes.SetupRoutes(router)

	// Run the server
	router.Run(":8080")
}
