package models

import "time"

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	Password string `json:"password"`
	PinCode  int    `json:"pin_code"`
}

type RegisterResponse struct {
	CardId string `json:"card_id"`
}

type AttendanceRequest struct {
	Room   string `json:"room"`
	Course string `json:"course"`
}

type SuccessResponse struct {
	Message string `json:"message"`
}

type ErrorResponse struct {
	Error string `json:"error"`
}

type Tokens struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
}

type LoginRequest struct {
	CardId   string `json:"card_id"`
	Password string `json:"password"`
}

type GetRoleRequest struct {
	AccessToken string `json:"access_token"`
}

type GetRoleResponse struct {
	Role string `json:"role"`
}

type RefreshRequest struct {
	RefreshToken string `json:"refresh_token"`
}

type RefreshResponse struct {
	AccessToken string `json:"access_token"`
}

type GetCoursesResponse struct {
	Courses []string `json:"card_id"`
}

type GetUserDataResponse struct {
	CardId string `json:"card_id"`
	Name   string `json:"name"`
	Email  string `json:"email"`
}

type GetAttendanceRequest struct {
	CourseCode string    `json:"course_code"`
	Room       string    `json:"room"`
	Date       time.Time `json:"date"`
}

type GetAttendanceResponse struct {
	Status string `json:"status"`
}

type CheckPinCode struct {
	CardId  string `json:"card_id"`
	PinCode int    `json:"pin_code"`
}

type CheckPinCodeResponse struct {
	Correct bool `json:"correct"`
}
