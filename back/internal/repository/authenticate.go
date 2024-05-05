package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"math/rand"
	"strconv"

	"github.com/Dikonskiy/happy-university/back/internal/models"
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

func (r *Repository) CreateUser(name, email, role, password string) (string, error) {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}

	var cardID string
	switch role {
	case "student":
		cardID = generateCardID(role)
		_, err = r.Db.Query("INSERT INTO Students (student_name, student_id_card, email, password) VALUES (?, ?, ?, ?)", name, cardID, email, string(hashedPassword))
		if err != nil {
			return "", err
		}
	case "teacher":
		cardID = generateCardID(role)
		_, err = r.Db.Query("INSERT INTO Teachers (teacher_name, teacher_id_card, email, password) VALUES (?, ?, ?, ?)", name, cardID, email, string(hashedPassword))
		if err != nil {
			return "", err
		}
	case "admin":
		cardID = generateCardID(role)
		_, err = r.Db.Query("INSERT INTO Admins (admin_name, admin_id_card, email, password) VALUES (?, ?, ?, ?)", name, cardID, email, string(hashedPassword))
		if err != nil {
			return "", err
		}
	default:
		return "", errors.New("unsupported role")
	}

	// sender.Sender(email, cardID)

	return cardID, nil
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

func (r *Repository) GetCourses(cardId string) ([]models.GetCoursesResponse, error) {
	var query string
	var idType string

	if cardId[0] == '1' {
		query = `SELECT sc.course_code, c.course_name 
		         FROM student_courses sc 
		         JOIN Courses c ON sc.course_code = c.course_code
		         WHERE sc.student_id_card LIKE ?`
		idType = "student"
	} else if cardId[0] == '2' {
		query = "SELECT course_code, course_name FROM courses WHERE teacher_id_card LIKE ?"
		idType = "teacher"
	} else {
		return nil, errors.New("invalid card ID")
	}

	rows, err := r.Db.Query(query, cardId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courses []models.GetCoursesResponse

	for rows.Next() {
		var course models.GetCoursesResponse
		if err := rows.Scan(&course.Code, &course.Name); err != nil {
			return nil, err
		}
		courses = append(courses, course)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	if len(courses) == 0 {
		return nil, fmt.Errorf("no courses found for the given %s ID card", idType)
	}

	return courses, nil
}

func (r *Repository) GetUserData(cardId string) (string, string, error) {
	var name, email string

	switch cardId[0] {
	case '1':
		err := r.Db.QueryRow("SELECT student_name, email FROM Students WHERE student_id_card = ?", cardId).Scan(&name, &email)
		if err != nil {
			return "", "", err
		}
	case '2':
		err := r.Db.QueryRow("SELECT teacher_name, email FROM Teachers WHERE teacher_id_card = ?", cardId).Scan(&name, &email)
		if err != nil {
			return "", "", err
		}
	case '3':
		err := r.Db.QueryRow("SELECT admin_name, email FROM Admins WHERE admin_id_card = ?", cardId).Scan(&name, &email)
		if err != nil {
			return "", "", err
		}
	}
	return name, email, nil
}

func (r *Repository) SavePinCode(pinCode int, cardId string) error {
	switch cardId[0] {
	case '1':
		_, err := r.Db.Exec("UPDATE Students SET pin_code = ? WHERE student_id_card = ?", pinCode, cardId)
		if err != nil {
			return err
		}
	case '2':
		_, err := r.Db.Exec("UPDATE Teachers SET pin_code = ? WHERE teacher_id_card = ?", pinCode, cardId)
		if err != nil {
			return err
		}
	case '3':
		_, err := r.Db.Exec("UPDATE Admins SET pin_code = ? WHERE admin_id_card = ?", pinCode, cardId)
		if err != nil {
			return err
		}
	default:
		return errors.New("invalid card ID")
	}

	return nil
}

func (r *Repository) CheckPinCode(cardID string, pinCode int) (bool, error) {
	var storedPinCode int

	switch cardID[0] {
	case '1':
		err := r.Db.QueryRow("SELECT pin_code FROM Students WHERE student_id_card = ?", cardID).Scan(&storedPinCode)
		if err != nil {
			if err == sql.ErrNoRows {
				return false, err
			}
			panic(err)
		}

	case '2':
		err := r.Db.QueryRow("SELECT pin_code FROM Teachers WHERE teacher_id_card = ?", cardID).Scan(&storedPinCode)
		if err != nil {
			if err == sql.ErrNoRows {
				return false, err
			}
			panic(err)
		}
	case '3':
		err := r.Db.QueryRow("SELECT pin_code FROM Admins WHERE admin_id_card = ?", cardID).Scan(&storedPinCode)
		if err != nil {
			if err == sql.ErrNoRows {
				return false, err
			}
			panic(err)
		}
	}

	return storedPinCode == pinCode, nil
}

func (r *Repository) UpdatePassword(cardID, newPassword string) error {
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(newPassword), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	switch cardID[0] {
	case '1':
		_, err := r.Db.Exec("UPDATE Students SET password = ? WHERE student_id_card = ?", hashedPassword, cardID)
		if err != nil {
			return err
		}
	case '2':
		_, err := r.Db.Exec("UPDATE Teachers SET password = ? WHERE teacher_id_card = ?", hashedPassword, cardID)
		if err != nil {
			return err
		}
	case '3':
		_, err := r.Db.Exec("UPDATE Admins SET password = ? WHERE admin_id_card = ?", hashedPassword, cardID)
		if err != nil {
			return err
		}
	default:
		return errors.New("invalid card ID")
	}

	return nil
}
