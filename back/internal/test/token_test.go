package test

import (
	"testing"

	"github.com/Dikonskiy/happy-university/back/internal/token"
)

func TestGenerateTokens(t *testing.T) {
	cardId := "12345"
	role := "admin"

	accessToken, refreshToken, err := token.GenerateTokens(cardId, role)
	if err != nil {
		t.Fatalf("Ошибка при генерации токенов: %v", err)
	}

	if accessToken == "" {
		t.Error("AccessToken не должен быть пустым")
	}

	if refreshToken == "" {
		t.Error("RefreshToken не должен быть пустым")
	}
}
