package models

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	Password string `json:"password"`
}

type AttendanceRequest struct {
	StudentId string `json:"student_id"`
	Password  string `json:"password"`
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
