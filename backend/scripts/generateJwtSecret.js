const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// 生成隨機 JWT 金鑰
const generateJwtSecret = () => {
    return crypto.randomBytes(32).toString('hex'); // 32 bytes 隨機字串
};

// `.env` 文件路徑
const envPath = path.resolve(__dirname, '../.env');

// 更新 `.env` 文件
const updateEnvFile = (key, value) => {
    let envContent = '';
    if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf-8');
    }

    const regex = new RegExp(`^${key}=.*`, 'm');
    if (regex.test(envContent)) {
        // 更新已存在的鍵值
        envContent = envContent.replace(regex, `${key}=${value}`);
    } else {
        // 新增鍵值
        envContent += `\n${key}=${value}`;
    }

    fs.writeFileSync(envPath, envContent, 'utf-8');
    console.log(`Updated ${key} in .env file.`);
};

// 執行生成並更新
const jwtSecret = generateJwtSecret();
updateEnvFile('JWT_SECRET', jwtSecret);
console.log('Generated JWT_SECRET:', jwtSecret);
