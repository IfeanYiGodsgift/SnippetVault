// server/models/snippet.go
package models

import "go.mongodb.org/mongo-driver/bson/primitive"

// Snippet defines the structure of our code snippet document
type Snippet struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Title    string             `json:"title" bson:"title" binding:"required"`
	Language string             `json:"language" bson:"language" binding:"required"`
	Tags     []string           `json:"tags" bson:"tags"` // This field is optional
	Code     string             `json:"code" bson:"code" binding:"required"`
}
