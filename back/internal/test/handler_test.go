package test

import (
	"bytes"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Dikonskiy/happy-university/back/internal/logger"

	"github.com/Dikonskiy/happy-university/back/internal/handlers"
	"github.com/Dikonskiy/happy-university/back/internal/repository"
)

func TestLoginHandler(t *testing.T) {
	fakeRepo := &repository.Repository{}
	fakeLogger := logger.NewLogerr()

	// Создаем обработчик
	handler := handlers.NewHandler(fakeRepo, fakeLogger)
	// Создаем фейковый запрос
	body := []byte(`{"cardId": "someCardId", "password": "password123"}`)
	req, err := http.NewRequest("POST", "/login", bytes.NewBuffer(body))
	if err != nil {
		t.Fatal(err)
	}
	req.Header.Set("Content-Type", "application/json")

	// Создаем фейковый ResponseRecorder
	rr := httptest.NewRecorder()

	// Вызываем обработчик
	handler.LoginHandler(rr, req)

	// Проверяем статус код
	if rr.Code != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", rr.Code, http.StatusOK)
	}

	// Проверяем содержимое ответа
	expected := `{"access_token":"...","refresh_token":"..."}`
	if rr.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v", rr.Body.String(), expected)
	}
}

// Аналогично реализуйте тесты для других обработчиков (RegisterHandler, ReadCardInHandler и т. д.)
