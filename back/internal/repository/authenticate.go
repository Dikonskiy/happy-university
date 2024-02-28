package repository

import (
	"database/sql"
	"errors"
	"math/rand"
	"strconv"
	"time"

	"github.com/Dikonskiy/happy-university/back/internal/models"
	"golang.org/x/crypto/bcrypt"
)

func (r *Repository) Authenticate(cardID, password string) bool {
	var storedPasswordHash string
	err := r.Db.QueryRow("SELECT password FROM users WHERE email = ?", cardID).Scan(&storedPasswordHash)
	if err != nil {
		if err == sql.ErrNoRows {
			return false
		}
		panic(err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedPasswordHash), []byte(password))
	if err != nil {
		return false
	}

	return true
}

func (r *Repository) CreateUser(name, email, role, password string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	switch role {
	case "student":
		cardID := generateCardID(role)
		_, err = r.Db.Query("INSERT INTO Students (student_name, student_id_card, email, password) VALUES (?, ?, ?, ?)", name, cardID, email, string(hashedPassword))
		if err != nil {
			return err
		}
	case "teacher":
		cardID := generateCardID(role)
		_, err = r.Db.Query("INSERT INTO Teachers (teacher_name, teacher_id_card, email, password) VALUES (?, ?, ?, ?)", name, cardID, email, string(hashedPassword))
		if err != nil {
			return err
		}
	case "admin":
		cardID := generateCardID(role)
		_, err = r.Db.Query("INSERT INTO Admins (admin_name, admin_id_card, email, password) VALUES (?, ?, ?, ?)", name, cardID, email, string(hashedPassword))
		if err != nil {
			return err
		}
	default:
		return errors.New("unsupported role")
	}

	return nil
}

func (r *Repository) GetRole(email string) (string, error) {
	var role string
	err := r.Db.QueryRow("SELECT role FROM users WHERE email = ?", email).Scan(&role)
	if err != nil {
		return "", err
	}

	return role, nil
}

func generateCardID(role string) string {
	var prefix string

	switch role {
	case "student":
		prefix = "1"
	case "teacher":
		prefix = "2"
	case "admin":
		prefix = "3"
	}

	randomNumber := rand.Intn(9000000) + 1000000

	return prefix + strconv.Itoa(randomNumber)
}

func (r *Repository) UpdateAttendance(studentID string) error {
	var student models.Student
	err := r.Db.QueryRow("SELECT student_id, student_name, student_id_card, email FROM Students WHERE student_id = ?", studentID).Scan(&student.ID, &student.Name, &student.IdCard, &student.Email)
	if err != nil {
		return err
	}

	currentDateTime := time.Now()
	_, err = r.Db.Exec("INSERT INTO Attendance (student_id, course_id, check_in_time, attendance_date) VALUES (?, ?, ?, ?)", student.ID, 1, currentDateTime, currentDateTime.Format("2006-01-02"))
	if err != nil {
		return err
	}

	return nil
}
