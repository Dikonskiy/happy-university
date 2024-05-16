package test

import (
	"io/ioutil"
	"log/slog"
	"os"
	"testing"

	"github.com/Dikonskiy/happy-university/back/internal/logger"
)

func TestNewLogger(t *testing.T) {
	// Создание временного файла для журнала
	tempLogFile, err := ioutil.TempFile("", "test_application.log")
	if err != nil {
		t.Fatalf("Отрицательно удалось создать временный файл журнала: %v", err)
	}
	defer os.Remove(tempLogFile.Name())

	// Создание нового логгера
	logger := logger.NewLogerr()
	if logger == nil {
		t.Fatal("Ошибка при создании логгера")
	}

	// Проверка, что логгер создан успешно
	if logger.Log == nil {
		t.Error("Ошибка: Log не должен быть пустым")
	}

	// Проверка, что созданный логгер имеет правильный тип
	if _, ok := logger.Log.Handler().(*slog.JSONHandler); !ok {
		t.Error("Ошибка: тип обработчика логгера должен быть slog.JSONHandler")
	}

	// Проверка, что файл журнала был создан
	if _, err := os.Stat(tempLogFile.Name()); os.IsNotExist(err) {
		t.Error("Ошибка: файл журнала не был создан")
	}
}
