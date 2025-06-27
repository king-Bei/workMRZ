const express = require('express');
const router = express.Router();
// const db = require('../models/db'); // 若需存取 DB
// const authenticateToken = require('../middlewares/auth'); // 若需 JWT 驗證

// 單一 UID 綁定 RichMenu
router.post('/bind', /*authenticateToken,*/ async (req, res) => {
    // const { uid, richmenuId, service } = req.body;
    // TODO: 呼叫 LINE API 綁定，並記錄到 DB
    res.json({ success: true });
});

// 單一 UID 解除綁定
router.post('/unbind', /*authenticateToken,*/ async (req, res) => {
    // const { uid, service } = req.body;
    // TODO: 呼叫 LINE API 解除綁定，並更新 DB
    res.json({ success: true });
});

// （可擴充：批次綁定/解除）

module.exports = router;
