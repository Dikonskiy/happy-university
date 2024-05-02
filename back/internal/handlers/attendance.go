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

	err = h.Repo.UpdateAttendance(cardID, request.Course, request.Room)
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

	res := models.GetCoursesResponse{Courses: courses}

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

	h.logerr.Log.Info("Get courses is successfull")

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

// func (h *Handler) GetCourseScheduleHandler(w http.ResponseWriter, r *http.Request) {
// 	var req models.GetAttendanceRequest
// 	err := json.NewDecoder(r.Body).Decode(&req)
// 	if err != nil {
// 		h.logerr.Log.Error("failed to parse request body", err)
// 		http.Error(w, "failed to parse request body", http.StatusBadRequest)
// 		return
// 	}

// 	if req.CourseCode == "" || req.Room == "" {
// 		http.Error(w, "course code and room are required fields", http.StatusBadRequest)
// 		return
// 	}

// 	var schedule []models.CourseSchedule
// 	if !req.Date.IsZero() {
// 		// If date is not zero value, use the provided date for querying schedules
// 		dateStr := req.Date.Format("2006-01-02") // Format the date as "YYYY-MM-DD"
// 		date, err := time.Parse("2006-01-02", dateStr)
// 		if err != nil {
// 			http.Error(w, "failed to parse date: "+err.Error(), http.StatusBadRequest)
// 			return
// 		}

// 		schedule, err = h.Repo.GetCourseSchedule(req.CourseCode, date)
// 		if err != nil {
// 			http.Error(w, "failed to get course schedule: "+err.Error(), http.StatusInternalServerError)
// 			return
// 		}
// 	} else {
// 		// If date is zero value, return schedules for the entire week
// 		// Get the current date
// 		currentDate := time.Now()

// 		// Calculate the start date (Monday) of the current week
// 		monday := currentDate.AddDate(0, 0, -int(currentDate.Weekday())+1)

// 		// Get schedules for the entire week (Monday to Tuesday of the next week)
// 		schedule, err = h.Repo.GetCourseSchedule(req.CourseCode, monday)
// 		if err != nil {
// 			http.Error(w, "failed to get course schedule: "+err.Error(), http.StatusInternalServerError)
// 			return
// 		}
// 	}

// 	// Convert the schedule to JSON
// 	scheduleJSON, err := json.Marshal(schedule)
// 	if err != nil {
// 		http.Error(w, "failed to marshal schedule to JSON: "+err.Error(), http.StatusInternalServerError)
// 		return
// 	}

// 	// Write the JSON response
// 	w.Header().Set("Content-Type", "application/json")
// 	w.WriteHeader(http.StatusOK)
// 	w.Write(scheduleJSON)
// }

func (h *Handler) AfterRegHandler(w http.ResponseWriter, r *http.Request) {
	cardID, err := extractCardIDFromToken(r)
	if err != nil {
		h.logerr.Log.Error("Failed to extract card ID from token", err)
		http.Error(w, "Failed to extract card ID from token", http.StatusUnauthorized)
		return
	}

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

	// Save image data to the database
	err = h.Repo.AfterReg(cardID, imageData, req.Birthday)
	if err != nil {
		h.logerr.Log.Error("Failed to save image data to database", err)
		http.Error(w, "Failed to save image data to database", http.StatusInternalServerError)
		return
	}

	// Respond with success
	w.WriteHeader(http.StatusOK)

}

func (h *Handler) GetImageHandler(w http.ResponseWriter, r *http.Request) {
	cardID, err := extractCardIDFromToken(r)
	if err != nil {
		h.logerr.Log.Error("Failed to extract card ID from token", err)
		http.Error(w, "Failed to extract card ID from token", http.StatusUnauthorized)
		return
	}

	imageData, err := h.Repo.GetImageData(cardID)
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
	cardID, err := extractCardIDFromToken(r)
	if err != nil {
		h.logerr.Log.Error("Failed to extract card ID from token", err)
		http.Error(w, "Failed to extract card ID from token", http.StatusUnauthorized)
		return
	}

	imageData, err := h.Repo.GetBirthday(cardID)
	if err != nil {
		h.logerr.Log.Error("Failed to get image data from database", err)
		http.Error(w, "Failed to get image data from database", http.StatusInternalServerError)
		return
	}

	encodedImage := base64.StdEncoding.EncodeToString(imageData)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{"image": encodedImage})

}
