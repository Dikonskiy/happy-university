package repository

import (
	"database/sql"
	"time"

	"github.com/Dikonskiy/happy-university/back/internal/logger"
)

type Repository struct {
	Db     *sql.DB
	Logerr *logger.Logger
}

func NewRepository(MysqlConnectionString string, logerr *logger.Logger) *Repository {
	db, err := sql.Open("mysql", MysqlConnectionString)
	if err != nil {
		logerr.Log.Error("Failed initialize database connection")
		return nil
	}

	db.SetMaxOpenConns(39)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(3 * time.Minute)

	if err := db.Ping(); err != nil {
		db.Close()
		return nil
	}

	return &Repository{
		Db:     db,
		Logerr: logerr,
	}
}
