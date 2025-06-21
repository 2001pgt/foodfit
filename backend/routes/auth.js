const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const pool = require('../config/database');

const router = express.Router();

// 회원가입
router.post('/register', [
    body('username').isLength({ min: 2 }).withMessage('이름은 최소 2자 이상이어야 합니다.'),
    body('user_id').isLength({ min: 4 }).withMessage('아이디는 최소 4자 이상이어야 합니다.'),
    body('password').isLength({ min: 6 }).withMessage('비밀번호는 최소 6자 이상이어야 합니다.')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { username, user_id, password } = req.body;
        // 아이디 중복 확인
        const [existingUsers] = await pool.execute(
            'SELECT * FROM users WHERE user_id = ?',
            [user_id]
        );
        if (existingUsers.length > 0) {
            return res.status(400).json({ message: '이미 존재하는 아이디입니다.' });
        }
        // 비밀번호 해시화
        const hashedPassword = await bcrypt.hash(password, 10);
        // 사용자 생성
        const [result] = await pool.execute(
            'INSERT INTO users (username, user_id, password) VALUES (?, ?, ?)',
            [username, user_id, hashedPassword]
        );
        res.status(201).json({ message: '회원가입이 완료되었습니다.' });
    } catch (error) {
        console.error('회원가입 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 로그인
router.post('/login', [
    body('user_id').notEmpty().withMessage('아이디를 입력해주세요.'),
    body('password').notEmpty().withMessage('비밀번호를 입력해주세요.')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { user_id, password } = req.body;
        // 사용자 찾기
        const [users] = await pool.execute(
            'SELECT * FROM users WHERE user_id = ?',
            [user_id]
        );
        if (users.length === 0) {
            return res.status(400).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
        }
        const user = users[0];
        // 비밀번호 확인
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
        }
        // JWT 토큰 생성
        const token = jwt.sign(
            { userId: user.id, username: user.username, user_id: user.user_id },
            process.env.JWT_SECRET || 'your_secret_key_here',
            { expiresIn: '24h' }
        );
        res.json({ 
            message: '로그인이 완료되었습니다.',
            token,
            user: {
                id: user.id,
                username: user.username,
                user_id: user.user_id
            }
        });
    } catch (error) {
        console.error('로그인 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router; 