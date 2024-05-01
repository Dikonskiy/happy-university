package handlers

import (
	"encoding/json"
	"errors"
	"net/http"
	"time"

	"github.com/Dikonskiy/happy-university/back/internal/logger"
	"github.com/Dikonskiy/happy-university/back/internal/models"
	"github.com/Dikonskiy/happy-university/back/internal/repository"
	tkn "github.com/Dikonskiy/happy-university/back/internal/token"
	"github.com/dgrijalva/jwt-go"
)

type Handler struct {
	Repo   *repository.Repository
	logerr *logger.Logger
}

func NewHandler(repo *repository.Repository, logerr *logger.Logger) *Handler {
	return &Handler{
		Repo:   repo,
		logerr: logerr,
	}
}

func (h *Handler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	var person models.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&person); err != nil {
		h.logerr.Log.Error("Invalid request body", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	isAuthenticated := h.Repo.Authenticate(person.CardId, person.Password)
	if !isAuthenticated {
		h.logerr.Log.Error("Invalid username or password")
		http.Error(w, "Invalid username or password", http.StatusUnauthorized)
		return
	}

	role := h.Repo.GetRole(person.CardId)

	accessToken, refreshToken, err := tkn.GenerateTokens(person.CardId, role)
	if err != nil {
		h.logerr.Log.Error("Failed to generate tokens", err)
		http.Error(w, "Failed to generate tokens", http.StatusInternalServerError)
		return
	}

	response := map[string]string{
		"access_token":  accessToken,
		"refresh_token": refreshToken,
	}
	w.Header().Set("Content-Type", "application/json")

	json.NewEncoder(w).Encode(response)
	h.logerr.Log.Info("Login process successful")
}

func (h *Handler) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	var person models.RegisterRequest
	err := json.NewDecoder(r.Body).Decode(&person)
	if err != nil {
		h.logerr.Log.Error("Failed to decode body", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	if person.Name == "" || person.Email == "" || person.Role == "" || person.Password == "" {
		h.logerr.Log.Error("Missing required fields")
		http.Error(w, "Missing required fields", http.StatusBadRequest)
		return
	}

	cardID, err := h.Repo.CreateUser(person.Name, person.Email, person.Role, person.Password)
	if err != nil {
		h.logerr.Log.Error("Failed to create user in db", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = h.Repo.SavePinCode(person.PinCode, cardID)
	if err != nil {
		h.logerr.Log.Error("Failed to save pinCode", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := models.RegisterResponse{
		CardId: cardID,
	}

	responseJSON, err := json.Marshal(response)
	if err != nil {
		h.logerr.Log.Error("Failed to marsheling response", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(responseJSON)
	h.logerr.Log.Info("Registration process successful")
}

func (h *Handler) RefreshTokenHandler(w http.ResponseWriter, r *http.Request) {
	var refreshReq models.RefreshRequest
	err := json.NewDecoder(r.Body).Decode(&refreshReq)
	if err != nil {
		h.logerr.Log.Error("Failed to decode request body", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	token, err := jwt.Parse(refreshReq.RefreshToken, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			h.logerr.Log.Error("Failed to jwt signing")
			return nil, errors.New("failed to jwt signing")
		}
		return []byte("your_secret_key"), nil
	})

	if err != nil {
		h.logerr.Log.Error("Failed to parse jwt token", err)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		if claims["type"].(string) != "refresh" {
			h.logerr.Log.Error("Invalid token type")
			http.Error(w, "Invalid token type", http.StatusUnauthorized)
			return
		}

		if time.Unix(int64(claims["exp"].(float64)), 0).Before(time.Now()) {
			h.logerr.Log.Error("Refresh token expired")
			http.Error(w, "Refresh token expired", http.StatusUnauthorized)
			return
		}
		accessToken, err := tkn.GenerateToken(claims["card_id"].(string), claims["role"].(string), tkn.AccessToken, time.Minute*1)

		if err != nil {
			h.logerr.Log.Error("Error to generate access token", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		refreshRes := models.RefreshResponse{
			AccessToken: accessToken,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(refreshRes)
	} else {
		h.logerr.Log.Error("Invalid token")
		http.Error(w, "Invalid token", http.StatusUnauthorized)
		return
	}

	h.logerr.Log.Info("Access token generated successfully")
}

func (h *Handler) CheckPinCodeHandler(w http.ResponseWriter, r *http.Request) {
	var req models.CheckPinCode
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		h.logerr.Log.Error("Failed to decode request body", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	isCorrect, err := h.Repo.CheckPinCode(req.CardId, req.PinCode)
	if err != nil {
		h.logerr.Log.Error("Failed to check the pin code", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := models.CheckPinCodeResponse{
		Correct: isCorrect,
	}

	responseJSON, err := json.Marshal(response)
	if err != nil {
		h.logerr.Log.Error("Failed to marshal response", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(responseJSON)
}

func (h *Handler) UpdatePasswordHandler(w http.ResponseWriter, r *http.Request) {
	var req models.UpdatePassword
	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		h.logerr.Log.Error("Failed to decode request body", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	err = h.Repo.UpdatePassword(req.CardId, req.Password)
	if err != nil {
		h.logerr.Log.Error("Failed to update password", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	h.logerr.Log.Info("Password changed successfully")

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Password changed successfully"))
}
