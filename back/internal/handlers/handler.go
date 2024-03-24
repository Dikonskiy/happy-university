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
	var person models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&person); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	isAuthenticated := h.Repo.Authenticate(person.CardId, person.Password)
	if !isAuthenticated {
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	role := h.Repo.GetRole(person.CardId)

	accessToken, refreshToken, err := token.GenerateTokens(person.CardId, role)
	if err != nil {
		http.Error(w, "Failed to generate tokens", http.StatusInternalServerError)
		return
	}

	h.Repo.Logerr.Log.Info("from login" + accessToken)

	response := map[string]string{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	}
	w.Header().Set("Content-Type", "application/json")

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

	cardID, err := h.Repo.CreateUser(person.Name, person.Email, person.Role, person.Password)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := models.RegisterResponse{
		CardId: cardID,
	}

	responseJSON, err := json.Marshal(response)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
}

func (h *Handler) ReadCardInHandler(w http.ResponseWriter, r *http.Request) {
	var request models.AttendanceRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.Repo.UpdateAttendance(request.CardId, request.Course)
	if err != nil {
		h.Repo.Logerr.Log.Error("Failed to update attendance", err)
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

func (h *Handler) ReadCardOutHandler(w http.ResponseWriter, r *http.Request) {
	var request models.AttendanceRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.Repo.AttendanceOut(request.CardId, request.Course)
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

func (h *Handler) GetRoleHandler(w http.ResponseWriter, r *http.Request) {
	var req models.GetRoleRequest
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Failed to parse request body", http.StatusBadRequest)
		return
	}

	role, err := h.Repo.GetRoleFromToken(req.AccessToken)
	if err != nil {
		http.Error(w, "Failed to get role from token: "+err.Error(), http.StatusUnauthorized)
		return
	}

	res := models.GetRoleResponse{
		Role: role,
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(res)
	if err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}
