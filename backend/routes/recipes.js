const express = require('express');
const pool = require('../config/database');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// 모든 재료 목록 가져오기
router.get('/ingredients/list', async (req, res) => {
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

// 레시피 검색
router.get('/search', authMiddleware, async (req, res) => {
    const { ingredients } = req.query;
    if (!ingredients) {
        return res.status(400).json({ message: '재료를 입력해주세요.' });
    }

    const ingredientList = ingredients.split(',').map(item => item.trim()).filter(item => item);

    if (ingredientList.length === 0) {
        return res.status(400).json({ message: '재료를 올바르게 입력해주세요.' });
    }

    try {
        // 1. 로그인한 사용자의 기피 재료 목록 가져오기
        const [dislikedRows] = await pool.execute(
            'SELECT ingredient_name FROM user_disliked_ingredients WHERE user_id = ?',
            [req.user.userId]
        );
        const dislikedIngredients = dislikedRows.map(row => row.ingredient_name);

        const placeholders = ingredientList.map(() => 'fi.ingredient_name LIKE ?').join(' OR ');
        const queryParams = ingredientList.map(name => `%${name}%`);

        const query = `
            SELECT
                fr.id,
                fr.food_name,
                fr.recipe,
                COUNT(DISTINCT fi.ingredient_name) as matching_ingredients,
                total_ingredients.total_count as total_ingredients,
                (COUNT(DISTINCT fi.ingredient_name) * 100.0 / total_ingredients.total_count) as match_percentage
            FROM food_recipes fr
            JOIN food_ingredients fi ON fr.food_name = fi.food_name
            JOIN (
                SELECT food_name, COUNT(*) as total_count
                FROM food_ingredients
                GROUP BY food_name
            ) as total_ingredients ON fr.food_name = total_ingredients.food_name
            WHERE (${placeholders})
            ${dislikedIngredients.length > 0 ? `AND fr.food_name NOT IN (
                SELECT DISTINCT food_name
                FROM food_ingredients
                WHERE ${dislikedIngredients.map(() => 'ingredient_name LIKE ?').join(' OR ')}
            )` : ''}
            GROUP BY fr.id, fr.food_name, fr.recipe, total_ingredients.total_count
            HAVING match_percentage > 0
            ORDER BY match_percentage DESC, matching_ingredients DESC
            LIMIT 20
        `;

        const finalQueryParams = [...queryParams, ...dislikedIngredients.map(name => `%${name}%`)];

        const [recipes] = await pool.execute(query, finalQueryParams);

        res.json(recipes.map(recipe => ({
            ...recipe,
            match_percentage: Math.round(recipe.match_percentage)
        })));

    } catch (error) {
        console.error('레시피 검색 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

// 레시피 상세 정보
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // 레시피 기본 정보
        const [recipes] = await pool.execute(
            'SELECT * FROM food_recipes WHERE id = ?',
            [id]
        );

        if (recipes.length === 0) {
            return res.status(404).json({ message: '레시피를 찾을 수 없습니다.' });
        }

        const recipe = recipes[0];

        // 레시피 재료 정보 (food_name 기준)
        const [ingredients] = await pool.execute(
            'SELECT ingredient_name, quantity FROM food_ingredients WHERE food_name = ?',
            [recipe.food_name]
        );

        res.json({
            recipe: {
                ...recipe,
                ingredients,
            }
        });

    } catch (error) {
        console.error('레시피 상세 정보 오류:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
});

module.exports = router; 