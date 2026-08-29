# 晟曜實業有限公司 官方網站（靜態版）

正式網址：**https://chnyaoind.com.tw**
託管方式：**GitHub Pages**（免費、免主機、免資料庫）

---

## 這是什麼

原始網站是 PHP + MySQL 的動態網站（含 `/admin` 後台）。
本 repo 是把它**轉成純靜態 HTML** 的版本，可以直接由 GitHub Pages 提供服務。

轉換來源：`晟曜實業_chnyao_20260202_網站後台原始碼.zip`
原始 PHP 程式碼與資料庫備份另存於私有 repo（見文末）。

### 頁面

| 網址 | 檔案 | 說明 |
|---|---|---|
| `/` | `index.html` | 首頁（Banner、關於晟曜、為什麼選擇晟曜、服務流程） |
| `/about` | `about/index.html` | 公司簡介 |
| `/service` | `service/index.html` | 服務項目 |
| `/process` | `process/index.html` | 服務流程 |
| `/contact` | `contact/index.html` | 聯絡我們（含表單、地圖） |
| 任何不存在的網址 | `404.html` | 找不到頁面 |

每一頁都是獨立資料夾加 `index.html`，所以網址是乾淨的 `/about` 而不是 `/about.html`。

### 目錄結構

```
├── index.html              # 首頁
├── about/index.html        # 公司簡介
├── service/index.html      # 服務項目
├── process/index.html      # 服務流程
├── contact/index.html      # 聯絡我們
├── 404.html                # 找不到頁面
├── CNAME                   # 綁定 chnyaoind.com.tw（不可刪除）
├── .nojekyll               # 讓 _img 資料夾能被讀取（不可刪除）
├── robots.txt
├── sitemap.xml
├── resources/
│   ├── css/                # style.css、bootstrap
│   ├── js/                 # jquery、common、script、contact-form
│   └── _img/               # 網站設計圖檔
└── storage/upload/         # 原後台上傳的 Banner 與各頁主視覺
```

---

## 從動態版轉成靜態版，有哪些變化

| 項目 | 原本（PHP 版） | 現在（靜態版） |
|---|---|---|
| 後台 `/admin` | 可登入改內容 | ❌ **已移除**，改內容要直接編輯 HTML 檔 |
| 資料庫 MySQL | 存 Banner、頁面、聯絡紀錄 | ❌ 不再需要 |
| 首頁 Banner 輪播 | 後台可換圖、加多張 | 內容已寫死在 `index.html`（目前一張，就是原網站上線中的那張） |
| 聯絡表單 | 存進資料庫並寄信 | ⚠️ 改用前端送出，**需設定一次**，見下方說明 |
| 表單驗證碼 | Google reCAPTCHA | 改用隱藏的蜜罐欄位擋機器人 |
| 主機費用 | 需付費 PHP 主機 | **免費** |

> 原本後台有 4 筆 Banner，其中 3 筆已被標記刪除，實際上線只顯示 1 筆。
> 靜態版忠實呈現線上狀態，只放那 1 筆。

---

## ⚠️ 聯絡表單需要設定一次

目前表單是「**開啟郵件軟體**」模式：使用者按送出後，會開啟他電腦的郵件軟體，
收件人、主旨、內容都已填好，他按寄出即可。**不用設定，現在就能用**，
但如果對方電腦沒設定郵件軟體就會沒反應。

**建議改用 Formspree**，使用者按送出就直接寄到公司信箱，體驗最好：

1. 到 https://formspree.io 用 `cyler.chung@chnyaoind.com` 註冊（免費方案每月 50 封）
2. 建立 New Form，收件信箱填 `cyler.chung@chnyaoind.com`
3. 它會給一段像 `https://formspree.io/f/abcdwxyz` 的網址
4. 打開 `resources/js/contact-form.js`，把網址貼進第一行設定：

   ```js
   var FORM_ENDPOINT = 'https://formspree.io/f/abcdwxyz';
   ```

5. 存檔 → `git commit` → `git push`，約 1 分鐘後生效

---

## 要改網站內容時

所有文字、圖片都直接寫在 HTML 檔裡，用記事本或 VS Code 打開就能改。

**改完後推上 GitHub 就會自動更新網站：**

```bash
git add .
git commit -m "更新公司簡介文字"
git push
```

約 1～2 分鐘後 https://chnyaoind.com.tw 就會看到新版本。

### 幾個要注意的地方

- **選單和頁尾在 5 個 HTML 檔裡各有一份。** 改電話、地址、Email 這種共用資訊時，
  5 個檔案（含 `404.html` 共 6 個）都要一起改，否則會不一致。
- **換圖片**：把新圖放進 `resources/_img/` 對應資料夾，再改 HTML 裡的 `src` 路徑。
- **`CNAME` 和 `.nojekyll` 不要刪**。刪了網域會失效、圖片會全部破圖。
- 路徑一律用 `/` 開頭的絕對路徑（例如 `/resources/css/style.css`），不要改成相對路徑。

---

## 本機預覽

因為頁面用的是 `/` 開頭的絕對路徑，**直接用瀏覽器開啟 HTML 檔會破圖**，
要起一個本機伺服器才看得到正確畫面：

```bash
npx --yes serve -l 4173 .
```

然後打開 http://localhost:4173

---

## GitHub Pages 設定

repo 的 **Settings → Pages**：

- Source：`Deploy from a branch`
- Branch：`main` / `/ (root)`
- Custom domain：`chnyaoind.com.tw`
- ✅ Enforce HTTPS

> ⚠️ GitHub Pages 免費方案**只能用在公開（Public）repo**。
> 這個 repo 是公開的，裡面只有前台的 HTML 與圖片，沒有任何程式碼、金鑰或客戶資料。

網域 DNS 設定步驟見 [DEPLOY.md](DEPLOY.md)。

---

## 相關 repo

| Repo | 內容 | 可見性 |
|---|---|---|
| 本 repo | 靜態網站，實際對外服務 | Public |
| `chnyao-website` | 原始 PHP 程式碼、資料庫備份、後台系統 | **Private**（含金鑰與客戶個資，不可公開） |
