// server/db/db.go
package db

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// This is the connection string for your LOCAL MongoDB server.
// const MONGO_URI = "mongodb://localhost:27017"

const DB_NAME = "snippet_vault"

var client *mongo.Client // We'll store our database connection here

// Connect initializes the connection to MongoDB
func Connect() *mongo.Client {
	MONGO_URI := os.Getenv("MONGODB_URI")
	if MONGO_URI == "" {
		log.Fatal("MONGO_URI environment variable not set")
	}

	// 1. Setup database connection
	c, err := mongo.NewClient(options.Client().ApplyURI(MONGO_URI))
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = c.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	// 2. Ping the database to test the connection
	err = c.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Could not connect to MongoDB. Is it running?")
	} else {
		log.Println("✅ Successfully connected to MongoDB!")
	}

	client = c
	return client
}

// GetCollection returns a handle to a specific collection
func GetCollection(collectionName string) *mongo.Collection {
	if client == nil {
		log.Fatal("MongoDB client is not initialized. Call db.Connect() first.")
	}
	return client.Database(DB_NAME).Collection(collectionName)
}
