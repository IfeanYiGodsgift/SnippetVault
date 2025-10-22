# === Stage 1: The "Build" Stage (The "Kitchen") ===
# Use an official Go image. 1.21-alpine is small and has Go.
FROM golang:1.25-alpine AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the module files first. This lets Docker cache
# our dependencies.
COPY go.mod go.sum ./
RUN go mod download

# Copy all the rest of our .go source code
COPY . .

# Build the app, creating a static binary.
# CGO_ENABLED=0 is important for a tiny, static file.
RUN CGO_ENABLED=0 GOOS=linux go build -o /snippet-vault-server .

# === Stage 2: The "Final" Stage (The "Serving Box") ===
# Use a minimal, non-Go image. alpine is tiny.
FROM alpine:latest

# Set the working directory
WORKDIR /root/

# Copy *only* the compiled binary from the "build" stage.
# Nothing else comes over (no source code, no Go tools).
COPY --from=build /snippet-vault-server .

# Expose port 8080 (the port our Go app listens on)
EXPOSE 8080

# The command to run when the container starts
CMD ["./snippet-vault-server"]