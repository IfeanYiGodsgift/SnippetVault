// server/routes/routes.go
package routes

import (
	"snippet-vault/server/handlers" // Import our new handlers

	"github.com/gin-gonic/gin"
)

// SetupRoutes configures all the routes for the server
func SetupRoutes(router *gin.Engine) {
	// Test route
	router.GET("/", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Snippet Vault API is running and connected to MongoDB!",
		})
	})

	// Snippet routes
	// When a POST request comes to /snippets, call the CreateSnippet handler
	router.POST("/snippets", handlers.CreateSnippet)

	// When a GET request comes to /snippets, call the GetAllSnippets handler
	router.GET("/snippets", handlers.GetAllSnippets)

	// When a GET request comes to /search, call the SearchSnippets handler
	router.GET("/search", handlers.SearchSnippets)

	// When a GET request comes to /snippets/lang/:language, call the GetSnippetsByLanguage handler
	router.GET("/snippets/lang/:language", handlers.GetSnippetsByLanguage)

	// When a DELETE request comes to /snippets/:id, call the DeleteSnippet handler
	router.DELETE("/snippets/:id", handlers.DeleteSnippet)
}
