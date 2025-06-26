const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// 確保資料夾存在
const dataDir = path.resolve(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('資料夾已建立:', dataDir);
}

const dbPath = path.resolve(dataDir, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Create Users table
    db.run(`
        CREATE TABLE IF NOT EXISTS Users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create RichMenus table
    db.run(`
        CREATE TABLE IF NOT EXISTS RichMenus (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            line_account_id TEXT NOT NULL,
            richmenu_id TEXT NOT NULL UNIQUE,
            name TEXT NOT NULL,
            is_default BOOLEAN DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Create UIDBindings table
    db.run(`
        CREATE TABLE IF NOT EXISTS UIDBindings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            line_account_id TEXT NOT NULL,
            uid TEXT NOT NULL UNIQUE,
            richmenu_id TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (richmenu_id) REFERENCES RichMenus (richmenu_id)
        )
    `);

    // Create Keys table
    db.run(`
        CREATE TABLE IF NOT EXISTS Keys (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            service TEXT NOT NULL UNIQUE,
            encrypted_key TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating Keys table:', err.message);
        } else {
            console.log('Keys table created or already exists.');
        }
    });

    // Add indexes
    db.run(`CREATE INDEX IF NOT EXISTS idx_line_account_id ON RichMenus (line_account_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_uid ON UIDBindings (uid)`);
});

module.exports = db;
