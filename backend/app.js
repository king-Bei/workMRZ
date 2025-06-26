const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(helmet()); // 增加安全性
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 分鐘
    max: 100, // 每個 IP 最多 100 次請求
});
app.use(limiter); // 增加速率限制

const authRouter = require('./routes/auth');
const authenticateToken = require('./middlewares/auth');
const keyRouter = require('./routes/key');

app.use('/api/auth', authRouter);
app.use('/api/key', keyRouter);

// 其他 API 路由需加上 authenticateToken
// app.use('/api/secure', authenticateToken, secureRouter);

// 全局錯誤處理中間件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ error: 'Internal Server Error' });
});

module.exports = app;
