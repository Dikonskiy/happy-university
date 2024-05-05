CREATE TABLE IF NOT EXISTS Students (
    student_id INT AUTO_INCREMENT PRIMARY KEY,
    student_name VARCHAR(255) NOT NULL,
    student_id_card VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) not null,
    pin_code int
);

CREATE TABLE IF NOT EXISTS Teachers (
    teacher_id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_name VARCHAR(255) NOT NULL,
    teacher_id_card VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) not null,
    pin_code int
);

CREATE TABLE IF NOT EXISTS Admins (
    admin_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_name VARCHAR(255) NOT NULL,
    admin_id_card VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) not null,
    pin_code int
);

CREATE TABLE IF NOT EXISTS Courses (
    course_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code varchar(7) not null,
    course_name VARCHAR(255) NOT NULL,
    teacher_id_card VARCHAR(20),
    term int,
    room varchar(7)
);

CREATE TABLE IF NOT EXISTS Attendance (
    attendance_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id_card INT NOT NULL,
    course_code varchar(7) NOT NULL,
    check_in_time DATETIME NOT NULL,
    check_out_time DATETIME,
    attendance_date DATE NOT NULL,
    status ENUM('attend', 'absent', 'manual', 'permitted'),
    room varchar(7),
    course_type ENUM('N', 'P') NOT NULL DEFAULT 'N'
);

CREATE TABLE IF NOT EXISTS Student_Courses (
    student_id_card varchar(255),
    course_code varchar(7)
);

CREATE TABLE IF NOT EXISTS Schedule (
    schedule_id INT AUTO_INCREMENT PRIMARY KEY,
    course_code varchar(7) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL,
    room varchar(7),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    course_type ENUM('N', 'P') NOT NULL DEFAULT 'N'
);

CREATE TABLE IF NOT EXISTS UserImages (
        id_card VARCHAR(20),
        Birthday TEXT,
        Image longblob
)

CREATE TABLE IF NOT EXISTS TeacherCode (
        teacher_id_card VARCHAR(20) not null,
        course_code varchar(7) NOT NULL,
        attendance_date date not null, 
        generated_code int
)

INSERT INTO Attendance (student_id_card, course_code, check_in_time, check_out_time, attendance_date, status, room)
SELECT 
    13488217 AS student_id_card,
    'INF 368' AS course_code,
    ADDTIME('2024-01-26 09:00:00', SEC_TO_TIME(FLOOR(RAND() * (2 * 3600)))) AS check_in_time,
    ADDTIME('2024-01-26 09:00:00', SEC_TO_TIME(FLOOR(RAND() * (2 * 3600)))) AS check_out_time,
    dt.d AS attendance_date,
    ELT(1 + FLOOR(RAND() * 4), 'attend', 'absent', 'manual', 'permitted') AS status,
    'F204' AS room
FROM (
    SELECT 
        DATE_ADD('2024-01-26', INTERVAL t4 + t16 + t64 + t256 + t1024 + t4096 DAY) AS d
    FROM 
        (SELECT 0 AS t4 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3) AS a4,
        (SELECT 0 AS t16 UNION ALL SELECT 4 UNION ALL SELECT 8 UNION ALL SELECT 12) AS a16,
        (SELECT 0 AS t64 UNION ALL SELECT 16 UNION ALL SELECT 32 UNION ALL SELECT 48) AS a64,
        (SELECT 0 AS t256 UNION ALL SELECT 64 UNION ALL SELECT 128 UNION ALL SELECT 192) AS a256,
        (SELECT 0 AS t1024 UNION ALL SELECT 256 UNION ALL SELECT 512 UNION ALL SELECT 768) AS a1024,
        (SELECT 0 AS t4096 UNION ALL SELECT 1024 UNION ALL SELECT 2048 UNION ALL SELECT 3072) AS a4096
    WHERE 
        DATE_ADD('2024-01-26', INTERVAL t4 + t16 + t64 + t256 + t1024 + t4096 DAY) BETWEEN '2024-01-26' AND '2024-05-17'
    AND 
        DAYOFWEEK(DATE_ADD('2024-01-26', INTERVAL t4 + t16 + t64 + t256 + t1024 + t4096 DAY)) = 6
) AS dt;
