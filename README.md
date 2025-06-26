# LINE RichMenu & UID 管理系統

## 專案結構（中英文說明）

```
richmenu-manager/
├── frontend/                # React 前端
│   ├── public/
│   └── src/
│       ├── App.js                  # 主控邏輯（登入/切頁/token）
│       ├── LoginPage.js            # 帳號密碼登入頁
│       ├── components/
│       │   └── ServiceSelector.js  # 多 LINE 帳號切換與新增
│       ├── RichMenuPage.js         # RichMenu 建立/查詢/預設/刪除
│       ├── UIDManagerPage.js       # UID 綁定/批次解除等
│       ├── Navbar.js               # 分頁切換與登出
│       └── api.js                  # API 工具（JWT 加入 header）
├── backend/                 # Node.js + Express 後端
│   ├── app.js                      # 主程式
│   ├── routes/
│   │   ├── auth.js                 # 登入（比對帳密 + 回傳 JWT）
│   │   ├── key.js                  # 金鑰加密/儲存/測試
│   │   ├── richmenu.js             # LINE RichMenu API Proxy
│   │   └── user.js                 # UID 綁定/解除 API
│   ├── middlewares/
│   │   ├── auth.js                 # JWT 驗證
│   │   └── encrypt.js              # AES 加密解密工具
│   ├── models/
│   │   └── db.js                   # SQLite DB or other DB 建立
│   └── .env                        # 主密鑰與管理員帳密設定
├── Dockerfile               # Cloud Run/Firebase Hosting 部署用
└── README.md
```

## 啟動方式

1. 複製 `.env` 範例，填入你的密鑰與帳密。
2. `cd backend && npm install`
3. `cd ../frontend && npm install && npm run build`
4. `cd ../backend && node app.js`  
   或用 Dockerfile 建置部署。

## 部署建議

- 前端建議用 Firebase Hosting 部署靜態檔案。
- 後端可用本專案 Dockerfile 於 Google Cloud Run 部署。
- `.env` 請用 Secret Manager 或 Cloud Run 環境變數注入，避免明文寫入映像。
- Dockerfile 會將 frontend build 輸出複製到 backend 的 public 目錄，後端可直接 serve 靜態檔案。

---

## 主要功能說明

- **登入驗證**：帳密存在 `.env`，登入成功回傳 JWT，前端請求需帶 token。
- **金鑰加密**：所有 accessToken 以 AES（`.env` 的 `MASTER_KEY`）加密儲存。
- **RichMenu/UID 管理**：可切換多服務、批次管理 UID、操作 RichMenu。

---

## 如何部署到 GitHub

1. **初始化 Git 倉庫（如果尚未初始化）**
    ```sh
    git init
    ```

2. **將所有檔案加入版本控制**
    ```sh
    git add .
    git commit -m "Initial commit"
    ```

3. **在 GitHub 建立新 repository（例如：`richmenu-manager`）**

4. **將遠端 repository 加入本地專案**
    ```sh
    git remote add origin https://github.com/你的帳號/richmenu-manager.git
    ```

5. **推送到 GitHub**
    ```sh
    git push -u origin master
    ```
    > 如果你的預設分支是 `main`，請改成 `git push -u origin main`

6. **後續開發推送**
    ```sh
    git add .
    git commit -m "你的修改說明"
    git push
    ```

---

## 注意事項

- 請**勿將 `.env` 等敏感資訊推送到 GitHub 公開倉庫**，可將 `.env` 加入 `.gitignore`。
- 若要自動部署（如 GitHub Actions、Vercel、Cloud Run），可參考各平台官方文件。

---
