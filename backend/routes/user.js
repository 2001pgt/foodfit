const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authMiddleware = require('../middleware/auth');

// 사용자의 기피 재료 목록 조회
router.get('/disliked-ingredients', authMiddleware, async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, ingredient_name FROM user_disliked_ingredients WHERE user_id = ? ORDER BY created_at DESC', [req.user.userId]);
        res.json(rows);
    } catch (error) {
        console.error('기피 재료 조회 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 기피 재료 추가
router.post('/disliked-ingredients', authMiddleware, async (req, res) => {
    const { ingredient_name } = req.body;
    
    if (!ingredient_name) {
        return res.status(400).json({ message: '재료명을 입력해주세요.' });
    }

    try {
        // 이미 등록된 기피 재료인지 확인
        const [existing] = await db.query(
            'SELECT id FROM user_disliked_ingredients WHERE user_id = ? AND ingredient_name = ?',
            [req.user.userId, ingredient_name]
        );

        if (existing.length > 0) {
            return res.status(400).json({ message: '이미 등록된 기피 재료입니다.' });
        }

        // 기피 재료 추가
        await db.query(
            'INSERT INTO user_disliked_ingredients (user_id, ingredient_name) VALUES (?, ?)',
            [req.user.userId, ingredient_name]
        );

        res.json({ message: '기피 재료가 등록되었습니다.' });
    } catch (error) {
        console.error('기피 재료 추가 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 기피 재료 삭제
router.delete('/disliked-ingredients/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM user_disliked_ingredients WHERE id = ? AND user_id = ?',
            [id, req.user.userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: '기피 재료를 찾을 수 없습니다.' });
        }

        res.json({ message: '기피 재료가 삭제되었습니다.' });
    } catch (error) {
        console.error('기피 재료 삭제 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router; 