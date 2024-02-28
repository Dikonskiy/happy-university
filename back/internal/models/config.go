package models

import "time"

type Config struct {
	ListenPort            string `json:"listenPort"`
	MysqlConnectionString string `json:"mysqlConnectionString"`
}

type Student struct {
	ID       int
	Name     string
	IdCard   string
	Email    string
	Password string
}

type Teacher struct {
	ID       int
	Name     string
	IdCard   string
	Email    string
	Password string
}

type Admin struct {
	ID       int
	Name     string
	IdCard   string
	Email    string
	Password string
}

type Course struct {
	CourseID string
	Name     string
	Teacher  Teacher
}

type Attendance struct {
	AttendanceID int
	Student      Student
	Course       Course
	Date         time.Time
}
