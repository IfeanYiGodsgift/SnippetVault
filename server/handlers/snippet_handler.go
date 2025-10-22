// server/handlers/snippet_handler.go
package handlers

import (
	"context"
	"time"

	"snippet-vault/server/db"
	"snippet-vault/server/models"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

// CreateSnippet is the handler function for creating a new snippet
func CreateSnippet(c *gin.Context) {
	var newSnippet models.Snippet

	if err := c.ShouldBindJSON(&newSnippet); err != nil {
		c.JSON(400, gin.H{"error": "Invalid request data"})
		return
	}

	if newSnippet.Title == "" || newSnippet.Language == "" {
		c.JSON(400, gin.H{"error": "Title and Language are required fields"})
		return
	}

	// Get the collection using our db package
	collection := db.GetCollection("snippets")

	var existingSnippet models.Snippet
	checkCtx, checkCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer checkCancel()

	// Find one document where the title matches, case-insensitive
	filter := bson.M{"title": bson.M{"$regex": "^" + newSnippet.Title + "$", "$options": "i"}}

	err := collection.FindOne(checkCtx, filter).Decode(&existingSnippet)

	if err == nil {
		// If err is nil, a document was found
		c.JSON(409, gin.H{"error": "A snippet with this title already exists"})
		return
	} else if err != mongo.ErrNoDocuments {
		// If the error is NOT "NoDocuments", it's a real database error
		c.JSON(500, gin.H{"error": "Failed to check for duplicate title"})
		return
	}
	// If err IS mongo.ErrNoDocuments, we are good to continue

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	res, err := collection.InsertOne(ctx, newSnippet)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to create snippet"})
		return
	}

	c.JSON(201, gin.H{
		"message": "Snippet created successfully!",
		"id":      res.InsertedID,
	})
}

// GetAllSnippets is the handler for fetching all snippets
func GetAllSnippets(c *gin.Context) {
	// 1. Get the collection
	collection := db.GetCollection("snippets")

	// 2. Create a context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 3. Find all snippets in the database.
	// We pass an empty filter (bson.M{}) to get everything.
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch snippets"})
		return
	}
	defer cursor.Close(ctx) // Make sure to close the cursor

	// 4. Create a slice to hold the results
	var snippets []models.Snippet

	// 5. Iterate over the cursor and decode each snippet
	if err = cursor.All(ctx, &snippets); err != nil {
		c.JSON(500, gin.H{"error": "Failed to decode snippets"})
		return
	}

	// 6. Return the list of snippets
	c.JSON(200, snippets)
}

// SearchSnippets searches by title, language, OR tags
func SearchSnippets(c *gin.Context) {
	// 1. Get the search query
	query := c.Query("q")
	if query == "" {
		c.JSON(400, gin.H{"error": "Search query 'q' is required"})
		return
	}

	// 2. Get the collection
	collection := db.GetCollection("snippets")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 3. Create a case-insensitive regex
	regexQuery := bson.M{"$regex": query, "$options": "i"}

	// 4. Create an "$or" filter to search multiple fields
	filter := bson.M{
		"$or": []bson.M{
			{"title": regexQuery},
			{"language": regexQuery},
			{"tags": regexQuery},
			{"code": regexQuery}, // This checks if the query matches any item in the 'tags' array
		},
	}

	// 5. Find the matching snippets
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch snippets"})
		return
	}
	defer cursor.Close(ctx)

	// 6. Decode the results
	var snippets []models.Snippet
	if err = cursor.All(ctx, &snippets); err != nil {
		c.JSON(500, gin.H{"error": "Failed to decode snippets"})
		return
	}

	// 7. Return the results
	c.JSON(200, snippets)
}

// GetSnippetsByLanguage finds all snippets for a specific language
func GetSnippetsByLanguage(c *gin.Context) {
	// 1. Get the language from the URL parameter
	lang := c.Param("language")

	// 2. Get the collection
	collection := db.GetCollection("snippets")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 3. Create an exact-match filter (case-sensitive)
	filter := bson.M{"language": lang}

	// 4. Find the matching snippets
	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to fetch snippets"})
		return
	}
	defer cursor.Close(ctx)

	// 5. Decode the results
	var snippets []models.Snippet
	if err = cursor.All(ctx, &snippets); err != nil {
		c.JSON(500, gin.H{"error": "Failed to decode snippets"})
		return
	}

	// 6. Return the results
	c.JSON(200, snippets)
}

// DeleteSnippet is the handler for deleting a single snippet by its ID
func DeleteSnippet(c *gin.Context) {
	// 1. Get the ID from the URL parameter
	idParam := c.Param("id")

	// 2. Convert the string ID to a MongoDB ObjectID
	id, err := primitive.ObjectIDFromHex(idParam)
	if err != nil {
		c.JSON(400, gin.H{"error": "Invalid snippet ID format"})
		return
	}

	// 3. Get the collection
	collection := db.GetCollection("snippets")
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// 4. Create the filter to find the document by its _id
	filter := bson.M{"_id": id}

	// 5. Delete the document
	res, err := collection.DeleteOne(ctx, filter)
	if err != nil {
		c.JSON(500, gin.H{"error": "Failed to delete snippet"})
		return
	}

	// 6. Check if anything was actually deleted
	if res.DeletedCount == 0 {
		c.JSON(404, gin.H{"error": "Snippet not found"})
		return
	}

	// 7. Return a success message
	c.JSON(200, gin.H{"message": "Snippet deleted successfully"})
}
