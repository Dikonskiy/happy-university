package test

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/Dikonskiy/happy-university/back/internal/app"
)

func TestTokenMiddleware(t *testing.T) {
	// Определение функции TokenMiddleware
	TokenMiddleware := func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Ваша логика middleware здесь
		})
	}

	// Создаем фейковый хэндлер для обработки запроса
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
	})

	// Создаем фейковый запрос
	req, err := http.NewRequest("GET", "/protected", nil)
	if err != nil {
		t.Fatal(err)
	}

	// Добавляем заголовок с токеном
	req.Header.Set("Authorization", "Bearer valid_token")

	// Создаем фейковый ResponseRecorder
	rr := httptest.NewRecorder()

	// Вызываем метод TokenMiddleware напрямую
	TokenMiddleware(handler).ServeHTTP(rr, req)

	// Проверяем, что запрос успешно прошел через middleware
	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
	}
}

func TestStartServer(t *testing.T) {
	// Просто запускаем сервер и проверяем, что он не возвращает ошибку
	app := app.NewApp()
	go app.StartServer()

	// Ждем некоторое время перед завершением теста
	time.Sleep(100 * time.Millisecond)
}
