const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'food_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    multipleStatements: true
});


async function setupDatabase() {
    let connection;
    try {
        // 데이터베이스 없이 연결
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD,
            multipleStatements: true
        });

        const dbName = process.env.DB_NAME || 'food_db';

        console.log(`기존 데이터베이스 '${dbName}' 삭제 중...`);
        await connection.query(`DROP DATABASE IF EXISTS ${dbName}`);
        console.log(`데이터베이스 '${dbName}' 삭제 완료.`);

        console.log(`새 데이터베이스 '${dbName}' 생성 중...`);
        await connection.query(`CREATE DATABASE ${dbName}`);
        console.log(`데이터베이스 '${dbName}' 생성 완료.`);
        
        await connection.changeUser({ database: dbName });
        console.log(`'${dbName}' 데이터베이스 사용.`);

        const createUsersTableSql = `
        CREATE TABLE users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(50) NOT NULL,
            user_id VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;
        console.log('users 테이블 생성 중...');
        await connection.query(createUsersTableSql);
        console.log('users 테이블 생성 완료.');

        const foodDbSql = fs.readFileSync(path.join(__dirname, '..', 'food_db.sql'), 'utf8');
        console.log('음식 데이터 임포트 중...');
        await connection.query(foodDbSql);
        console.log('음식 데이터 임포트 완료.');
        
        const createDislikedTableSql = `
        CREATE TABLE IF NOT EXISTS user_disliked_ingredients (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            ingredient_name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
        `;
        console.log('user_disliked_ingredients 테이블 생성 중...');
        await connection.query(createDislikedTableSql);
        console.log('user_disliked_ingredients 테이블 생성 완료.');


        console.log('데이터베이스 설정이 성공적으로 완료되었습니다.');

    } catch (error) {
        console.error('데이터베이스 설정 중 오류 발생:', error);
    } finally {
        if (connection) {
            await connection.end();
        }
        process.exit();
    }
}

setupDatabase(); 