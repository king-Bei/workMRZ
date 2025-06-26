const express = require('express');
const router = express.Router();
const { encrypt } = require('../middlewares/encrypt');
const authenticateToken = require('../middlewares/auth');
const db = require('../models/db'); // 引入資料庫

router.post('/', authenticateToken, (req, res) => {
    const { service, accessToken } = req.body;
    if (!service || !accessToken) {
        return res.status(400).json({ error: 'service and accessToken required' });
    }
    try {
        // 加密 accessToken
        const encrypted = encrypt(accessToken);

        // 儲存到資料庫
        db.run(
            `INSERT INTO Keys (service, encrypted_key) VALUES (?, ?)`,
            [service, encrypted],
            (err) => {
                if (err) {
                    console.error('Error inserting key into database:', err.message);
                    return res.status(500).json({ error: 'Database insertion failed' });
                }
                res.json({ service, encrypted });
            }
        );
    } catch (e) {
        res.status(500).json({ error: 'Encryption failed' });
    }
});

module.exports = router;
