-- 올바른 사용자 테이블 생성 (코드에 맞게 수정)
CREATE DATABASE IF NOT EXISTS food_db;
USE food_db;

-- 기존 테이블이 있다면 삭제
DROP TABLE IF EXISTS users;

-- users 테이블 생성 (코드에 맞는 구조)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    user_id VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 기본 음식 데이터베이스도 필요하다면 food_db.sql 실행
-- SOURCE food_db.sql;

-- 사용자 싫어하는 재료 테이블
CREATE TABLE IF NOT EXISTS user_disliked_ingredients (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    ingredient_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 테이블 확인
SHOW TABLES;
DESCRIBE users; 