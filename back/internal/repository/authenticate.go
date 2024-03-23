package repository

import (
	"database/sql"
	"errors"
	"math/rand"
	"strconv"
	"time"

	"github.com/Dikonskiy/happy-university/back/internal/models"
	tkn "github.com/Dikonskiy/happy-university/back/internal/token"
	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)

func (r *Repository) Authenticate(cardID, password string) bool {
	var storedPasswordHash string

	switch cardID[0] {
	case '1':
		err := r.Db.QueryRow("SELECT password FROM students WHERE student_id_card = ?", cardID).Scan(&storedPasswordHash)
		if err != nil {
			if err == sql.ErrNoRows {
				return false
			}
			panic(err)
		}

	case '2':
		err := r.Db.QueryRow("SELECT password FROM teachers WHERE teacher_id_card = ?", cardID).Scan(&storedPasswordHash)
		if err != nil {
			if err == sql.ErrNoRows {
				return false
			}
			panic(err)
		}
	case '3':
		err := r.Db.QueryRow("SELECT password FROM admins WHERE admin_id_card = ?", cardID).Scan(&storedPasswordHash)
		if err != nil {
			if err == sql.ErrNoRows {
				return false
			}
			panic(err)
		}
	}

	err := bcrypt.CompareHashAndPassword([]byte(storedPasswordHash), []byte(password))
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

func (r *Repository) GetRole(cardId string) string {
	switch cardId[0] {
	case '1':
		return "Student"
	case '2':
		return "Teacher"
	case '3':
		return "Admin"
	}
	return ""
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
	err := r.Db.QueryRow("SELECT student_id, student_name, student_id_card, email FROM Students WHERE student_id_card = ?", studentID).Scan(&student.ID, &student.Name, &student.IdCard, &student.Email)
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

func (r *Repository) AttendanceOut(studentID string) error {
	var student models.Student
	err := r.Db.QueryRow("SELECT student_id FROM Students WHERE student_id_card = ?", studentID).Scan(&student.ID)
	if err != nil {
		return err
	}

	currentDateTime := time.Now()
	_, err = r.Db.Exec("UPDATE Attendance SET check_out_time = ? WHERE student_id = ? AND attendance_date = ?", currentDateTime, student.ID, currentDateTime.Format("2006-01-02"))
	if err != nil {
		return err
	}

	return nil
}

func (r *Repository) GetRoleFromToken(tokenString string) (string, error) {
	token, err := jwt.ParseWithClaims(tokenString, &tkn.CustomClaims{}, func(token *jwt.Token) (interface{}, error) {
		return []byte("your_secret_key"), nil
	})
	if err != nil {
		return "", err
	}

	if !token.Valid {
		return "", errors.New("invalid token")
	}

	if claims, ok := token.Claims.(*tkn.CustomClaims); ok {
		return claims.Role, nil
	}

	return "", errors.New("invalid token claims")
}
