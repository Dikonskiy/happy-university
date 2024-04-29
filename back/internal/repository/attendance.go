package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"time"

	"github.com/Dikonskiy/happy-university/back/internal/models"
)

const (
	attendPercentage = 0.6
)

func (r *Repository) UpdateAttendance(studentID, course, room string) error {
	var student models.Student
	err := r.Db.QueryRow("SELECT student_id, student_name, student_id_card, email FROM Students WHERE student_id_card = ?", studentID).Scan(&student.ID, &student.Name, &student.IdCard, &student.Email)
	if err != nil {
		return err
	}

	currentDateTime := time.Now()
	_, err = r.Db.Exec("INSERT INTO Attendance (student_id, course_code, check_in_time, attendance_date, room) VALUES (?, ?, ?, ?, ?)", student.ID, course, currentDateTime, currentDateTime.Format("2006-01-02"), room)
	if err != nil {
		return err
	}

	return nil
}

func (r *Repository) AttendanceOut(studentID, course, room string) error {
	var student models.Student
	err := r.Db.QueryRow("SELECT student_id FROM Students WHERE student_id_card = ?", studentID).Scan(&student.ID)
	if err != nil {
		return err
	}

	currentDateTime := time.Now()
	_, err = r.Db.Exec("UPDATE Attendance SET check_out_time = ? WHERE student_id = ? AND course_code = ? AND room = ?", currentDateTime, student.ID, course, room)
	if err != nil {
		return err
	}

	return nil
}

func (r *Repository) GetAttendance(studentID, course, room string, date time.Time) (string, error) {
	var student models.Student
	err := r.Db.QueryRow("SELECT student_id FROM Students WHERE student_id_card = ?", studentID).Scan(&student.ID)
	if err != nil {
		return "", err
	}

	var courseCode string
	err = r.Db.QueryRow("SELECT course_code FROM Student_Courses WHERE student_id_card = ? AND course_code = ?", studentID, course).Scan(&courseCode)
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
	err = r.Db.QueryRow("SELECT check_in_time, check_out_time, room FROM Attendance WHERE student_id = ? AND course_code = ? AND attendance_date = ?", student.ID, course, formattedDate).Scan(&checkInTimeStr, &checkOutTimeStr, &attendanceRoom)
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

	fmt.Println(status, student.ID, course, date)
	_, err = r.Db.Exec("UPDATE Attendance SET status = ? WHERE student_id = ? AND course_code = ? AND attendance_date = ?", status, student.ID, course, date)
	if err != nil {
		return "", err
	}

	r.logerr.Log.Info("Get attendance from db successful")

	return status, nil
}