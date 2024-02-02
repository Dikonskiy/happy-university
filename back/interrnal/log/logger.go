package log

import (
	"log"
	"log/slog"
	"os"
)

type Logger struct {
	Log *slog.Logger
}

func NewLogerr(isProd bool) *Logger {
	infoLogFile, err := os.OpenFile("application.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		log.Fatal("Failed to open info log file:", err)
	}

	var logerr *slog.Logger

	logerr = slog.New(slog.NewJSONHandler(infoLogFile, nil))
	return &Logger{
		Log: logerr,
	}
}
