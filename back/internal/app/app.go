package app

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/Dikonskiy/happy-university/back/internal/config"
	"github.com/Dikonskiy/happy-university/back/internal/handlers"
	"github.com/Dikonskiy/happy-university/back/internal/logger"
	"github.com/Dikonskiy/happy-university/back/internal/models"
	"github.com/Dikonskiy/happy-university/back/internal/repository"
	tkn "github.com/Dikonskiy/happy-university/back/internal/token"
	"github.com/dgrijalva/jwt-go"
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

	Logger = logger.NewLogerr()
	Repo = repository.NewRepository(Cnfg.MysqlConnectionString, Logger)
	Hand = handlers.NewHandler(Repo, Logger)
}

func (a *Application) StartServer() {
	r := mux.NewRouter()

	r.Use(cors.AllowAll().Handler)
	r.Use(TokenMiddleware)

	r.HandleFunc("/login", Hand.LoginHandler)
	r.HandleFunc("/register", Hand.RegisterHandler)
	r.HandleFunc("/access-token", Hand.RefreshTokenHandler)
	r.HandleFunc("/card-entry-in", Hand.ReadCardInHandler)
	r.HandleFunc("/card-entry-out", Hand.ReadCardOutHandler)
	r.HandleFunc("/get-role", Hand.GetRoleHandler)
	r.HandleFunc("/get-courses", Hand.GetCoursesHandler)

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

func TokenMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.URL.Path == "/login" || r.URL.Path == "/register" || r.URL.Path == "/access-token" {
			next.ServeHTTP(w, r)
			return
		}

		tokenString := r.Header.Get("Authorization")
		if tokenString == "" {
			Logger.Log.Error("tokenString is missing")
			http.Error(w, "Authorization token is missing", http.StatusUnauthorized)
			return
		}
		tokenString = strings.TrimPrefix(tokenString, "Bearer")

		token, err := jwt.ParseWithClaims(tokenString, &tkn.CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
			return []byte("your_secret_key"), nil
		})

		if err != nil {
			Logger.Log.Error("invalid token", err)
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(*tkn.CustomClaims)
		if !ok || !token.Valid {
			Logger.Log.Error("invalid token claims")
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		if time.Now().Unix() > claims.ExpiresAt {
			Logger.Log.Error("token has expired")
			http.Error(w, "Token has expired", http.StatusUnauthorized)
			return
		}

		next.ServeHTTP(w, r)
	})
}
