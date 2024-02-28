package app

import (
	"fmt"
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
	"github.com/rs/cors"
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

	fmt.Println(Cnfg.MysqlConnectionString)
	Logger = logger.NewLogerr()
	Repo = repository.NewRepository(Cnfg.MysqlConnectionString, Logger)
	Hand = handlers.NewHandler(Repo)
}

func (a *Application) StartServer() {
	r := mux.NewRouter()

	r.Use(cors.AllowAll().Handler)

	r.HandleFunc("/login", Hand.LoginHandler)
	r.HandleFunc("/register", Hand.RegisterHandler)
	r.HandleFunc("/card-entry", Hand.ReadCardHandler)

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
