const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 정적 파일 제공
app.use(express.static(path.join(__dirname, '../frontend')));

// 라우트 설정
const authRoutes = require('./routes/auth');
const recipesRoutes = require('./routes/recipes');
const ingredientsRoutes = require('./routes/ingredients');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipesRoutes);
app.use('/api/ingredients', ingredientsRoutes);
app.use('/api/user', userRoutes);

// 기본 라우트
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.get('/recipes', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/recipes.html'));
});

app.get('/recipe/:id', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/recipe-detail.html'));
});

app.get('/my-info', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/my-info.html'));
});

// 에러 핸들링
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
});

app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
}); 