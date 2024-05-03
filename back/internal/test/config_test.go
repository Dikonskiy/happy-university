package test

import (
	"encoding/json"
	"io/ioutil"
	"os"
	"testing"

	"github.com/Dikonskiy/happy-university/back/internal/config"
	"github.com/Dikonskiy/happy-university/back/internal/models"
)

func TestNewConfig(t *testing.T) {
	// Создание временного файла для тестирования
	tempFile := "temp_config.json"
	defer os.Remove(tempFile)

	// Запись в файл данных конфигурации
	configData := `{"listenPort": "8080", "mysqlConnectionString": "root:admin@tcp(127.0.0.1:3306)/happy-university"}`
	err := ioutil.WriteFile(tempFile, []byte(configData), 0644)
	if err != nil {
		t.Fatalf("Ошибка создания временного файла: %v", err)
	}

	// Вызов тестируемой функции
	cfg, err := config.NewConfig(tempFile)
	if err != nil {
		t.Fatalf("Ошибка при создании конфигурации: %v", err)
	}

	// Считывание данных из файла config.json
	expectedConfigData, err := ioutil.ReadFile("../../../config.json")
	if err != nil {
		t.Fatalf("Ошибка чтения файла config.json: %v", err)
	}

	// Преобразование данных из файла в структуру models.Config
	var expected models.Config
	err = json.Unmarshal(expectedConfigData, &expected)
	if err != nil {
		t.Fatalf("Ошибка при разборе данных из файла config.json: %v", err)
	}

	// Проверка полученной конфигурации
	if *cfg != expected {
		t.Fatalf("Ожидалась конфигурация %+v, получена %+v", expected, *cfg)
	}
}
