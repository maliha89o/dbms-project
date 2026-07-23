-- PostgreSQL (matches PG_DATABASE in .env)
-- Run this first, from a different database (e.g. `psql -U postgres`), then connect to it:
--   CREATE DATABASE gackend;
--   \c gackend
CREATE TABLE IF NOT EXISTS courses(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    instructor VARCHAR(255)
);

-- MySQL (matches MYSQL_DATABASE in .env). Run this against the MySQL server/database.
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    age INT,
    mobile VARCHAR(20),
    work VARCHAR(255),
    `add` VARCHAR(255),
    decription TEXT
);


/*
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    fullName VARCHAR(50),
    courseName VARCHAR(50),
	credit INT,
	isActive BOOLEAN
);


SELECT *
FROM pg_tables
WHERE schemaname='public';
 */