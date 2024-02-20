package models

import "time"

type Config struct {
	ListenPort            string `json:"listenPort"`
	MysqlConnectionString string `json:"mysqlConnectionString"`
}

type Person struct {
	PersonID int
	Name     string
	Email    string
	Role     string
	Password string
}

type Student struct {
	StudentID int
	Major     string
	Person    Person
}

type Teacher struct {
	TeacherID  int
	Department string
	Person     Person
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
