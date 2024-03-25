package repository

import (
	"database/sql"

	"github.com/Dikonskiy/happy-university/back/internal/logger"
	_ "github.com/go-sql-driver/mysql"
)

type Repository struct {
	Db     *sql.DB
	logerr *logger.Logger
}

func NewRepository(MysqlConnectionString string, logerr *logger.Logger) *Repository {
	db, err := sql.Open("mysql", MysqlConnectionString)
	if err != nil {
		logerr.Log.Error("Failed initialize database connection", err)
		return nil
	}

	if err := db.Ping(); err != nil {
		db.Close()
		logerr.Log.Error("Failed to ping database:", err)
		return nil
	}

	return &Repository{
		Db:     db,
		logerr: logerr,
	}
}
