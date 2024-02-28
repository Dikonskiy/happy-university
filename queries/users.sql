CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT null,
    email varchar(255) not null unique,
    role varchar(255) not null,
    password VARCHAR(255) NOT NULL
);
	