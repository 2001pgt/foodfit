-- 사용자(로그인) 테이블 생성
USE food_db;

-- 기존 테이블이 있다면 삭제
DROP TABLE IF EXISTS `users`;

-- users 테이블 생성
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 테이블 생성 확인
SHOW TABLES;
DESCRIBE users; 