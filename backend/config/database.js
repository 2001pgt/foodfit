const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '0000',
    database: process.env.DB_NAME || 'food_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// 연결 테스트
pool.getConnection()
    .then(connection => {
        console.log('데이터베이스 연결 성공!');
        connection.release();
    })
    .catch(err => {
        console.error('데이터베이스 연결 실패:', err);
    });

module.exports = pool; 