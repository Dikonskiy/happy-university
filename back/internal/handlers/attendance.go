package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/Dikonskiy/happy-university/back/internal/models"
)

func (h *Handler) ReadCardInHandler(w http.ResponseWriter, r *http.Request) {
	var request models.AttendanceRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		h.logerr.Log.Error("Invalid request body", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.Repo.UpdateAttendance(request.CardId, request.Course, request.Room)
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
	var request models.AttendanceRequest
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		h.logerr.Log.Error("Invalid request body", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	err = h.Repo.AttendanceOut(request.CardId, request.Course, request.Room)
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
	var req models.GetCoursesRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.logerr.Log.Error("Failed to decode request body", err)
		http.Error(w, "failed to decode request body", http.StatusBadRequest)
		return
	}

	courses, err := h.Repo.GetCourses(req.CardId)
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
	var req models.GetUserDataRequest

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.logerr.Log.Error("Failed to decode request body", err)
		http.Error(w, "failed to decode request body", http.StatusBadRequest)
		return
	}

	name, email, err := h.Repo.GetUserData(req.CardId)

	if err != nil {
		h.logerr.Log.Error("failed to get data from userDB", err)
		http.Error(w, "failed to get data from userDB", http.StatusInternalServerError)
		return
	}

	res := models.GetUserDataResponse{
		CardId: req.CardId,
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
	var req models.GetAttendanceRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		h.logerr.Log.Error("Failed to decode request body", err)
		http.Error(w, "failed to decode request body", http.StatusBadRequest)
		return
	}

	status, err := h.Repo.GetAttendance(req.CardId, req.CourseCode, req.Room, req.Date)
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
