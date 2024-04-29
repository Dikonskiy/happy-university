package repository

import (
	"database/sql"
	"errors"
	"math/rand"
	"strconv"

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

func (r *Repository) GetCourses(studentIDCard string) ([]string, error) {
	rows, err := r.Db.Query("SELECT course_code FROM student_courses WHERE student_id_card LIKE ?", studentIDCard)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var courses []string

	for rows.Next() {
		var courseCode string
		if err := rows.Scan(&courseCode); err != nil {
			return nil, err
		}
		courses = append(courses, courseCode)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	if len(courses) == 0 {
		return nil, errors.New("no courses found for the given student ID card")
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
