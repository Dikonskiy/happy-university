package handlers

import "github.com/Dikonskiy/happy-university/back/internal/repository"

type Handler struct {
	Repo *repository.Repository
}

func NewHandler() *Handler {
	return &Handler{}
}
