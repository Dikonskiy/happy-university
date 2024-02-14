package app

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/Dikonskiy/happy-university/back/internal/config"
	"github.com/Dikonskiy/happy-university/back/internal/handlers"
	"github.com/Dikonskiy/happy-university/back/internal/logger"
	"github.com/Dikonskiy/happy-university/back/internal/models"
	"github.com/Dikonskiy/happy-university/back/internal/repository"
	"github.com/gorilla/mux"
)

type Application struct {
}

func NewApp() *Application {
	return &Application{}
}

var (
	Repo   *repository.Repository
	Hand   *handlers.Handler
	Logger *logger.Logger
	Cnfg   *models.Config
)

func init() {
	var err error
	Cnfg, err = config.NewConfig("config.json")
	if err != nil {
		log.Println("Failed to initialize the configuration:", err)
		return
	}

	Logger = logger.NewLogerr()
	Repo = repository.NewRepository(Cnfg.MysqlConnectionString, Logger)
	Hand = handlers.NewHandler(Repo)
}

func (a *Application) StartServer() {
	r := mux.NewRouter()

	err2 := Repo.CreateUser("user1", "password123")
	if err2 != nil {
		Logger.Log.Error("Error creating user:", err2)
		return
	}
	Logger.Log.Info("User created successfully")

	r.HandleFunc("/login", Hand.HandleLogin)

	server := &http.Server{
		Addr:         ":" + Cnfg.ListenPort,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		Handler:      r,
	}

	quit := make(chan os.Signal, 1)

	go shutdown(quit, *Logger)

	log.Println("Listening on port", Cnfg.ListenPort, "...")
	Logger.Log.Info("Listening on port", Cnfg.ListenPort, "...")
	log.Fatal(server.ListenAndServe())
}

func shutdown(quit chan os.Signal, logger logger.Logger) {
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	s := <-quit
	logger.Log.Info("caught signal",
		"signal", s.String(),
	)
	os.Exit(0)
}
