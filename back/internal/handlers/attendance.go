package handlers

import (
	"encoding/base64"
	"encoding/json"
	"errors"
	"net/http"
	"strings"

	"github.com/Dikonskiy/happy-university/back/internal/models"
	tkn "github.com/Dikonskiy/happy-university/back/internal/token"
	"github.com/dgrijalva/jwt-go"
)

func (h *Handler) ReadCardInHandler(w http.ResponseWriter, r *http.Request) {
	cardID, err := extractCardIDFromToken(r)
	if err != nil {
		h.logerr.Log.Error("Failed to extract card ID from token", err)
		http.Error(w, "Failed to extract card ID from token", http.StatusUnauthorized)
		return
	}

	var request models.AttendanceRequest
	err = json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		h.logerr.Log.Error("Invalid request body", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.Repo.UpdateAttendance(cardID, request.Course, request.Room, request.GeneratedCode)
	if err != nil {
		h.logerr.Log.Error("Failed to update attendance", err)
		http.Error(w, "Failed to update attendance", http.StatusInternalServerError)
		return
	}

	response := models.SuccessResponse{Message: "Attendance recorded successfully"}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		h.logerr.Log.Error("JSON marshaling error", err)
		http.Error(w, "JSON marshaling error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)
	h.logerr.Log.Info("Read card Entry in process successful", err)
}

func (h *Handler) ReadCardOutHandler(w http.ResponseWriter, r *http.Request) {
	cardID, err := extractCardIDFromToken(r)
	if err != nil {
		h.logerr.Log.Error("Failed to extract card ID from token", err)
		http.Error(w, "Failed to extract card ID from token", http.StatusUnauthorized)
		return
	}

	var request models.AttendanceRequest
	err = json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		h.logerr.Log.Error("Invalid request body", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.Repo.AttendanceOut(cardID, request.Course, request.Room)
	if err != nil {
		h.logerr.Log.Error("Failed to update attendance", err)
		http.Error(w, "Failed to update attendance", http.StatusInternalServerError)
		return
	}

	response := models.SuccessResponse{Message: "Attendance recorded successfully"}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		h.logerr.Log.Error("JSON marshaling error", err)
		http.Error(w, "JSON marshaling error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonResponse)
	h.logerr.Log.Info("Read card Entry out process successful", err)
}

func (h *Handler) GetCoursesHandler(w http.ResponseWriter, r *http.Request) {
	h.logerr.Log.Info("Start Get Courses")
	cardID, err := extractCardIDFromToken(r)
	if err != nil {
		h.logerr.Log.Error("Failed to extract card ID from token", err)
		http.Error(w, "Failed to extract card ID from token", http.StatusUnauthorized)
		return
	}

	courses, err := h.Repo.GetCourses(cardID)
	if err != nil {
		h.logerr.Log.Error("Failed to get courses from db", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var res []models.GetCoursesResponse
	for _, course := range courses {
		res = append(res, models.GetCoursesResponse{Code: course.Code, Name: course.Name})
	}

	if err := json.NewEncoder(w).Encode(res); err != nil {
		h.logerr.Log.Error("failed to encode response", err)
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
		return
	}

	h.logerr.Log.Info("Get courses is successfull")
}

func (h *Handler) GetUserDataHandler(w http.ResponseWriter, r *http.Request) {
	cardID, err := extractCardIDFromToken(r)
	if err != nil {
		h.logerr.Log.Error("Failed to extract card ID from token", err)
		http.Error(w, "Failed to extract card ID from token", http.StatusUnauthorized)
		return
	}

	name, email, err := h.Repo.GetUserData(cardID)

	if err != nil {
		h.logerr.Log.Error("failed to get data from userDB", err)
		http.Error(w, "failed to get data from userDB", http.StatusInternalServerError)
		return
	}

	res := models.GetUserDataResponse{
		CardId: cardID,
		Name:   name,
		Email:  email,
	}

	if err := json.NewEncoder(w).Encode(res); err != nil {
		h.logerr.Log.Error("failed to encode response", err)
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
		return
	}

	h.logerr.Log.Info("Get user data is successfull")

}

func (h *Handler) GetAttendanceHandler(w http.ResponseWriter, r *http.Request) {
	cardID, err := extractCardIDFromToken(r)
	if err != nil {
		h.logerr.Log.Error("Failed to extract card ID from token", err)
		http.Error(w, "Failed to extract card ID from token", http.StatusUnauthorized)
		return
	}

	var req models.GetAttendanceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.logerr.Log.Error("Failed to decode request body", err)
		http.Error(w, "failed to decode request body", http.StatusBadRequest)
		return
	}

	status, err := h.Repo.GetAttendance(cardID, req.CourseCode, req.Room, req.Date)
	if err != nil {
		h.logerr.Log.Error("failed to get status from Attendance", err)
		http.Error(w, "failed to get status from Attendance", http.StatusInternalServerError)
		return
	}

	res := models.GetAttendanceResponse{
		Status: status,
	}

	if err := json.NewEncoder(w).Encode(res); err != nil {
		h.logerr.Log.Error("failed to encode response", err)
		http.Error(w, "failed to encode response", http.StatusInternalServerError)
		return
	}

	h.logerr.Log.Info("Get attendance is successfull")
}

func extractCardIDFromToken(r *http.Request) (string, error) {
	authHeader := r.Header.Get("Authorization")
	tokenString := strings.Replace(authHeader, "Bearer", "", 1)

	token, err := jwt.ParseWithClaims(tokenString, &tkn.CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("your_secret_key"), nil
	})
	if err != nil {
		return "", err
	}

	claims, ok := token.Claims.(*tkn.CustomClaims)
	if !ok || !token.Valid {
		return "", errors.New("extract token invalid token")
	}

	cardID := claims.CardId

	return cardID, nil
}

func (h *Handler) AfterRegHandler(w http.ResponseWriter, r *http.Request) {
	var req models.AfterRegRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.logerr.Log.Error("Failed to decode request body", err)
		http.Error(w, "failed to decode request body", http.StatusBadRequest)
		return
	}

	imageData, err := base64.StdEncoding.DecodeString(req.Image)
	if err != nil {
		h.logerr.Log.Error("Failed to decode base64 image data", err)
		http.Error(w, "Failed to decode base64 image data", http.StatusBadRequest)
		return
	}

	err = h.Repo.AfterReg(req.CardID, imageData, req.Birthday)
	if err != nil {
		h.logerr.Log.Error("Failed to save image data to database", err)
		http.Error(w, "Failed to save image data to database", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)

}

func (h *Handler) GetImageHandler(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterResponse
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.logerr.Log.Error("Failed to decode request body", err)
		http.Error(w, "failed to decode request body", http.StatusBadRequest)
		return
	}

	imageData, err := h.Repo.GetImageData(req.CardId)
	if err != nil {
		h.logerr.Log.Error("Failed to get image data from database", err)
		http.Error(w, "Failed to get image data from database", http.StatusInternalServerError)
		return
	}

	encodedImage := base64.StdEncoding.EncodeToString(imageData)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"image": encodedImage})

}

func (h *Handler) GetBirthdayHandler(w http.ResponseWriter, r *http.Request) {
	var req models.RegisterResponse
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.logerr.Log.Error("Failed to decode request body", err)
		http.Error(w, "failed to decode request body", http.StatusBadRequest)
		return
	}

	birthday, err := h.Repo.GetBirthday(req.CardId)
	if err != nil {
		h.logerr.Log.Error("Failed to get image data from database", err)
		http.Error(w, "Failed to get image data from database", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"birthday": birthday})

}

func (h *Handler) GenerateAttendanceCodeHandler(w http.ResponseWriter, r *http.Request) {
	cardID, err := extractCardIDFromToken(r)
	if err != nil {
		h.logerr.Log.Error("Failed to extract card ID from token", err)
		http.Error(w, "Failed to extract card ID from token", http.StatusUnauthorized)
		return
	}

	var req models.GenerateAttendanceCodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.logerr.Log.Error("Failed to decode request body", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	code, err := h.Repo.GenerateAttendanceCode(cardID, req.CourseCode)
	if err != nil {
		h.logerr.Log.Error("Failed to generate attendance code", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	response := struct {
		Code int `json:"code"`
	}{
		Code: code,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
	h.logerr.Log.Info("Attendance code generated", "code", code)
}

func (h *Handler) GetStudentsByCourseHandler(w http.ResponseWriter, r *http.Request) {
	var req models.GenerateAttendanceCodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	cardIds, err := h.Repo.GetStudentsByCourse(req.CourseCode)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	resp := models.GetStudentsByCourseResponse{
		CardIds: cardIds,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *Handler) GetDatesHandler(w http.ResponseWriter, r *http.Request) {
	var req models.GenerateAttendanceCodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	dates, err := h.Repo.GetLessonDatesByCourse(req.CourseCode, req.CourseType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var resp []models.LessonDate
	for _, date := range dates {
		resp = append(resp, models.LessonDate{
			Date:       date.Date,
			StartTime:  date.StartTime,
			CourseType: date.CourseType,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(resp); err != nil {
		http.Error(w, "Failed to encode response", http.StatusInternalServerError)
		return
	}
}

func (h *Handler) GetStatusHandler(w http.ResponseWriter, r *http.Request) {
	cardID, err := extractCardIDFromToken(r)
	if err != nil {
		h.logerr.Log.Error("Failed to extract card ID from token", err)
		http.Error(w, "Failed to extract card ID from token", http.StatusUnauthorized)
		return
	}

	var req models.GenerateAttendanceCodeRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	statuses, err := h.Repo.GetStatus(cardID, req.CourseCode, req.CourseType)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	var resp []models.AttendanceStatus
	for _, status := range statuses {
		resp = append(resp, models.AttendanceStatus{
			Date:   status.Date,
			Status: status.Status,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
