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

func (h *Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var person models.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&person); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	isAuthenticated := h.Repo.Authenticate(person.Email, person.Password)
	if !isAuthenticated {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	role, err := h.Repo.GetRole(person.Email)
	if err != nil {
		http.Error(w, "failed to get role", http.StatusUnauthorized)
		h.Repo.Logerr.Log.Error("failed to get role", err)
		return
	}

	accessToken, refreshToken, err := token.GenerateTokens(person.Email, role)
	if err != nil {
		http.Error(w, "Failed to generate tokens", http.StatusInternalServerError)
		return
	}

	response := map[string]string{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	}
	json.NewEncoder(w).Encode(response)
}

func (h *Handler) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var person models.RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&person)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if person.Name == "" || person.Email == "" || person.Role == "" || person.Password == "" {
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	err = h.Repo.CreateUser(person.Name, person.Email, person.Role, person.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
}

func (h *Handler) ReadCardHandler(w http.ResponseWriter, r *http.Request) {
	var request models.AttendanceRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.Repo.UpdateAttendance(request.StudentId)
	if err != nil {
		http.Error(w, "Failed to update attendance", http.StatusInternalServerError)
		return
	}

	response := models.SuccessResponse{Message: "Attendance recorded successfully"}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "JSON marshaling error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)
}
