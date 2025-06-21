const express = require('express');
const pool = require('../config/database');

const router = express.Router();

// 모든 재료 목록 가져오기
router.get('/', async (req, res) => {
    try {
        const [ingredients] = await pool.execute(
            'SELECT DISTINCT ingredient_name FROM food_ingredients ORDER BY ingredient_name'
        );

        res.json({
            ingredients: ingredients.map(item => item.ingredient_name)
        });

    } catch (error) {
        console.error('재료 목록 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 재료 검색 (자동완성용)
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.json({ ingredients: [] });
        }

        const [ingredients] = await pool.execute(
            'SELECT DISTINCT ingredient_name FROM food_ingredients WHERE ingredient_name LIKE ? ORDER BY ingredient_name LIMIT 10',
            [`%${q}%`]
        );

        res.json({
            ingredients: ingredients.map(item => item.ingredient_name)
        });

    } catch (error) {
        console.error('재료 검색 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router; 