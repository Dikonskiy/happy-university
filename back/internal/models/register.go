package models

type RegisterRequest struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Role     string `json:"role"`
	Password string `json:"password"`
}

type AttendanceRequest struct {
	CardId string `json:"card_id"`
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
