CREATE TABLE IF NOT EXISTS Students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_id_card VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) not null
);

CREATE TABLE IF NOT EXISTS Teachers (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_name VARCHAR(255) NOT NULL,
    teacher_id_card VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) not null
);

CREATE TABLE IF NOT EXISTS Admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(255) NOT NULL,
    admin_id_card VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) not null
);

CREATE TABLE IF NOT EXISTS Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code varchar(7) not null,
    course_name VARCHAR(255) NOT NULL,
    teacher_id INT,
    term int,
    FOREIGN KEY (teacher_id) REFERENCES Teachers(teacher_id)
);

CREATE TABLE IF NOT EXISTS Attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    course_code varchar(7) NOT NULL,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME,
    attendance_date DATE NOT NULL,
    status ENUM('attend', 'absent') NOT NULL,
    FOREIGN KEY (student_id) REFERENCES Students(student_id)
);

CREATE TABLE IF NOT EXISTS Student_Courses (
    student_id_card varchar(255),
    course_code varchar(7),
);

CREATE TABLE IF NOT EXISTS Schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code varchar(7) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);