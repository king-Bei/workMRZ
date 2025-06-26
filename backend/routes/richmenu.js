const express = require('express');
const router = express.Router();
// const db = require('../models/db'); // 若需存取 DB
// const authenticateToken = require('../middlewares/auth'); // 若需 JWT 驗證

// 取得 RichMenu 列表
router.get('/list', /*authenticateToken,*/ async (req, res) => {
    // TODO: 依 service 查詢 DB 或 LINE API
    // const { service } = req.query;
    // const menus = await db.getRichMenus(service);
    // res.json(menus);
    res.json([]); // 範例回傳空陣列
});

// 建立 RichMenu
router.post('/create', /*authenticateToken,*/ async (req, res) => {
    // TODO: 解析 multipart/form-data，建立 RichMenu
    // const { service, json } = req.body;
    // const image = req.file;
    // 呼叫 LINE API 建立
    res.json({ success: true });
});

// 設定預設 RichMenu
router.post('/default', /*authenticateToken,*/ async (req, res) => {
    // TODO: 設定預設 RichMenu
    // const { service, richmenuId } = req.body;
    res.json({ success: true });
});

// 刪除 RichMenu
router.post('/delete', /*authenticateToken,*/ async (req, res) => {
    // TODO: 刪除 RichMenu
    // const { service, richmenuId } = req.body;
    res.json({ success: true });
});

module.exports = router;
