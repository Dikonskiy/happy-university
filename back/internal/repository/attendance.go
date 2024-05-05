package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"math/rand"
	"strconv"
	"time"

	"github.com/Dikonskiy/happy-university/back/internal/models"
)

const (
	attendPercentage = 0.6
)

func (r *Repository) UpdateAttendance(studentID, course, room, generatedCode string) error {
	if generatedCode == "" {
		currentDateTime := time.Now()
		_, err := r.Db.Exec("INSERT INTO Attendance (student_id_card, course_code, check_in_time, attendance_date, room) VALUES (?, ?, ?, ?, ?)", studentID, course, currentDateTime, currentDateTime.Format("2006-01-02"), room)
		if err != nil {
			return err
		}
	} else {
		var expectedGeneratedCode int
		err := r.Db.QueryRow("SELECT generated_code FROM TeacherCode WHERE course_code = ?", course).Scan(&expectedGeneratedCode)
		if err != nil {
			println("1")
			println(course, expectedGeneratedCode)
			return err
		}

		generatedCodeInt, err := strconv.Atoi(generatedCode)
		if err != nil {
			println("3")
			return fmt.Errorf("failed to convert generated code to integer: %v", err)
		}

		if generatedCodeInt != expectedGeneratedCode {
			return fmt.Errorf("generated code does not match the expected code for the course")
		}

		currentDateTime := time.Now()
		_, err = r.Db.Exec("INSERT INTO Attendance (student_id_card, course_code, check_in_time, attendance_date, room) VALUES (?, ?, ?, ?, ?)", studentID, course, currentDateTime, currentDateTime.Format("2006-01-02"), room)
		if err != nil {
			return err
		}
	}

	return nil
}

func (r *Repository) AttendanceOut(studentID, course, room string) error {
	currentDateTime := time.Now()
	_, err := r.Db.Exec("UPDATE Attendance SET check_out_time = ? WHERE student_id_card = ? AND course_code = ? AND room = ?", currentDateTime, studentID, course, room)
	if err != nil {
		return err
	}

	return nil
}

func (r *Repository) GetAttendance(studentID, course, room string, date time.Time) (string, error) {
	var courseCode string
	err := r.Db.QueryRow("SELECT course_code FROM Student_Courses WHERE student_id_card = ? AND course_code = ?", studentID, course).Scan(&courseCode)
	if err != nil {
		return "", err
	}

	if course != courseCode {
		return "", errors.New("student is not enrolled in the specified course")
	}

	var startTimeStr, endTimeStr, scheduleRoom string
	err = r.Db.QueryRow("SELECT start_time, end_time, room FROM Schedule WHERE course_code = ? AND start_date <= ? AND end_date >= ? AND day_of_week = ?", course, date, date, date.Weekday().String()).Scan(&startTimeStr, &endTimeStr, &scheduleRoom)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", errors.New("no schedule found for the specified course on the provided date")
		}
		return "", err
	}

	if scheduleRoom != room {
		return "", errors.New("not lessons allowed this room")
	}

	startTime, err := time.Parse("15:04:05", startTimeStr)
	if err != nil {
		return "", err
	}

	endTime, err := time.Parse("15:04:05", endTimeStr)
	if err != nil {
		return "", err
	}

	formattedDate := date.Format("2006-01-02")

	var checkInTimeStr, checkOutTimeStr, attendanceRoom string
	err = r.Db.QueryRow("SELECT check_in_time, check_out_time, room FROM Attendance WHERE student_id_card = ? AND course_code = ? AND attendance_date = ?", studentID, course, formattedDate).Scan(&checkInTimeStr, &checkOutTimeStr, &attendanceRoom)
	if err != nil {
		if err == sql.ErrNoRows {
			return "absent", nil
		}
		return "", err
	}

	if attendanceRoom != room {
		return "", errors.New("not lessons allowed this room")
	}

	checkInTime, err := time.Parse("2006-01-02 15:04:05", checkInTimeStr)
	if err != nil {
		return "", err
	}

	checkOutTime, err := time.Parse("2006-01-02 15:04:05", checkOutTimeStr)
	if err != nil {
		return "", err
	}

	totalTime := checkOutTime.Sub(checkInTime)

	scheduleDuration := endTime.Sub(startTime)
	allowedTime := time.Duration(float64(scheduleDuration) * float64(attendPercentage))

	var status string
	if totalTime <= allowedTime {
		status = "absent"
	} else {
		status = "attend"
	}

	_, err = r.Db.Exec("UPDATE Attendance SET status = ? WHERE student_id_card = ? AND course_code = ? AND attendance_date = ?", status, studentID, course, date)
	if err != nil {
		return "", err
	}

	r.logerr.Log.Info("Get attendance from db successful")

	return status, nil
}

func (r *Repository) GetCourseSchedule(courseCode string, date time.Time) ([]models.CourseSchedule, error) {
	var schedule []models.CourseSchedule

	startDate := date.AddDate(0, 0, -int(date.Weekday())+2)
	endDate := startDate.AddDate(0, 0, 6)

	rows, err := r.Db.Query("SELECT student_id_card, course_code, start_date, end_date, day_of_week, room, start_time, end_time FROM Schedule WHERE course_code = ? AND start_date >= ? AND end_date <= ?", courseCode, startDate, endDate)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var cardID, courseName, room string
		var startDate, endDate, startTime, endTime time.Time
		var dayOfWeek string

		err := rows.Scan(&cardID, &courseName, &startDate, &endDate, &dayOfWeek, &room, &startTime, &endTime)
		if err != nil {
			return nil, err
		}

		if dayOfWeek == "Tuesday" {
			dateStr := startDate.Format("2006-01-02")
			startTimeStr := startTime.Format("15:04:05")
			endTimeStr := endTime.Format("15:04:05")

			scheduleItem := models.CourseSchedule{
				CardID:     cardID,
				CourseName: courseName,
				Date:       dateStr,
				Time:       fmt.Sprintf("%s - %s", startTimeStr, endTimeStr),
				Status:     "",
			}

			schedule = append(schedule, scheduleItem)
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return schedule, nil
}

func (r *Repository) AfterReg(cardId string, image []byte, birthday string) error {
	_, err := r.Db.Exec("INSERT INTO UserImages (id_card, Image, Birthday) VALUES (?, ?, ?)", cardId, image, birthday)
	if err != nil {
		return err
	}
	return nil

}

func (r *Repository) GetImageData(cardID string) ([]byte, error) {
	var imageData []byte
	err := r.Db.QueryRow("SELECT Image FROM UserImages WHERE id_card = ?", cardID).Scan(&imageData)
	if err != nil {
		if err == sql.ErrNoRows {
			return nil, nil
		}
		return nil, err
	}
	return imageData, nil
}

func (r *Repository) GetBirthday(cardID string) (string, error) {
	var birthday string
	err := r.Db.QueryRow("SELECT Birthday FROM UserImages WHERE id_card = ?", cardID).Scan(&birthday)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", nil
		}
		return "", err
	}
	return birthday, nil
}

func (r *Repository) GenerateAttendanceCode(cardID string, courseCode string) (int, error) {
	if cardID[0] != '2' {
		return 0, fmt.Errorf("only teachers are allowed to generate attendance codes")
	}

	var teacherIDCard string
	err := r.Db.QueryRow("SELECT teacher_id_card FROM Courses WHERE course_code = ?", courseCode).Scan(&teacherIDCard)
	if err != nil {
		return 0, fmt.Errorf("failed to retrieve teacher ID card for the specified course: %v", err)
	}

	if teacherIDCard != cardID {
		return 0, fmt.Errorf("teacher is not assigned to the specified course")
	}

	code := rand.Intn(900000) + 100000

	today := time.Now().Format("2006-01-02")

	_, err = r.Db.Exec("INSERT INTO TeacherCode (teacher_id_card, course_code, attendance_date, generated_code) VALUES (?, ?, ?, ?)", cardID, courseCode, today, code)
	if err != nil {
		return 0, err
	}

	return code, nil
}

func (r *Repository) GetStudentsByCourse(courseCode string) ([]string, error) {
	rows, err := r.Db.Query("SELECT student_id_card FROM Student_Courses WHERE course_code = ?", courseCode)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var studentIDs []string

	for rows.Next() {
		var studentIDCard string
		if err := rows.Scan(&studentIDCard); err != nil {
			return nil, err
		}
		studentIDs = append(studentIDs, studentIDCard)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	if len(studentIDs) == 0 {
		return nil, errors.New("no students found for the given course code")
	}

	return studentIDs, nil
}

func (r *Repository) GetLessonDatesByCourse(courseCode, courseType string) ([]models.LessonDate, error) {
	rows, err := r.Db.Query("SELECT start_date, end_date, day_of_week, start_time, course_type FROM Schedule WHERE course_code = ? and course_type = ?", courseCode, courseType)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var lessonDates []models.LessonDate

	for rows.Next() {
		var startDateStr, endDateStr, dayOfWeek, startTimeStr, courseType string

		if err := rows.Scan(&startDateStr, &endDateStr, &dayOfWeek, &startTimeStr, &courseType); err != nil {
			return nil, err
		}

		startDate, err := time.Parse("2006-01-02", startDateStr)
		if err != nil {
			return nil, err
		}

		endDate, err := time.Parse("2006-01-02", endDateStr)
		if err != nil {
			return nil, err
		}

		startTime, err := time.Parse("15:04:05", startTimeStr)
		if err != nil {
			return nil, err
		}

		currentDate := startDate
		for currentDate.Before(endDate) || currentDate.Equal(endDate) {
			if currentDate.Weekday().String() == dayOfWeek {
				lessonDates = append(lessonDates, models.LessonDate{
					Date:       currentDate.Format("02.01.2006"),
					StartTime:  startTime.Format("15:04"),
					CourseType: courseType,
				})
			}
			currentDate = currentDate.AddDate(0, 0, 1)
		}
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return lessonDates, nil
}
