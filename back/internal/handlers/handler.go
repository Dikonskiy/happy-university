package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Dikonskiy/happy-university/back/internal/models"
	"github.com/Dikonskiy/happy-university/back/internal/repository"
	"github.com/Dikonskiy/happy-university/back/internal/token"
)

type Handler struct {
	Repo *repository.Repository
}

func NewHandler(repo *repository.Repository) *Handler {
	return &Handler{
		Repo: repo,
	}
}

func (h *Handler) HandleLogin(w http.ResponseWriter, r *http.Request) {
	// Parse the request body
	var person models.Person
	if err := json.NewDecoder(r.Body).Decode(&person); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Perform authentication (replace this with your authentication logic)
	// Example: check if username and password match in the database
	isAuthenticated := h.Repo.Authenticate(person.Name, person.Password)
	if !isAuthenticated {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	// Generate access and refresh tokens
	accessToken, refreshToken, err := token.GenerateTokens(person.Name)
	if err != nil {
		http.Error(w, "Failed to generate tokens", http.StatusInternalServerError)
		return
	}

	// Return tokens in the response
	response := map[string]string{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	}
	json.NewEncoder(w).Encode(response)
}
