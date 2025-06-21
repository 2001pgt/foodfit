-- users 테이블 수정 (email을 user_id로 변경)
USE food_db;

-- 기존 테이블 삭제
DROP TABLE IF EXISTS `users`;

-- 새로운 users 테이블 생성 (email 대신 user_id 사용)
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `user_id` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 테이블 생성 확인
SHOW TABLES;
DESCRIBE users; 