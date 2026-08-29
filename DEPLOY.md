# 上線步驟：GitHub Pages ＋ GoDaddy 網域串接

目標：讓 **https://chnyaoind.com.tw** 顯示這個 repo 的網站內容。

整個流程分三步，**順序不能顛倒**：先設 DNS → 再設 GitHub → 最後開 HTTPS。

---

## 現況（2026-08-29 查詢）

```
chnyaoind.com.tw      →  3.33.130.190 / 15.197.148.33
www.chnyaoind.com.tw  →  CNAME 指向 chnyaoind.com.tw
```

那兩個 IP 是 **GoDaddy 的網域停放／轉址服務**，代表網域目前還沒指向任何真正的網站。
所以直接改設定即可，不會中斷現有服務。

---

## 步驟一：GoDaddy DNS 設定

登入 GoDaddy → **網域** → `chnyaoind.com.tw` → **DNS** 分頁 → **DNS 記錄**

### 1-1. 先備份現有記錄

改之前，先把畫面上現有的 16 筆記錄**截圖存檔**，或按右上「操作」→ 匯出。
萬一設錯還能還原。

### 1-2. 建立 4 筆 A 記錄（指向 GitHub Pages）

GitHub Pages 的固定 IP 有四個，四個都要建，缺一不可（這是 GitHub 官方指定的位址）：

| 類型 | 名稱 | 資料 | TTL |
|---|---|---|---|
| A | `@` | `185.199.108.153` | 600 秒 |
| A | `@` | `185.199.109.153` | 600 秒 |
| A | `@` | `185.199.110.153` | 600 秒 |
| A | `@` | `185.199.111.153` | 600 秒 |

做法：
- 已存在的那筆 `A / @` → 按「編輯」，把資料改成 `185.199.108.153`
- 其餘三筆 → 按左下「**新增記錄**」逐筆建立

> TTL 先設 600 秒（10 分鐘），等網站確定正常後再改回 1 小時。

### 1-3. 設定 www 的 CNAME

找到 `CNAME / www` 那筆，按「編輯」：

| 類型 | 名稱 | 資料 | TTL |
|---|---|---|---|
| CNAME | `www` | `你的GitHub帳號.github.io` | 600 秒 |

⚠️ 注意結尾是 `.github.io`，**不要**加上 repo 名稱。
例如帳號是 `chnyao` 就填 `chnyao.github.io`。

### 1-4. 關閉「轉址」

切到 **DNS → 轉址** 分頁，如果有啟用中的轉址規則，**全部刪除**。
轉址會蓋過 A 記錄，不刪的話 DNS 設了也沒用。

### 1-5. ⚠️ 這些不要動

| 記錄 | 為什麼不能動 |
|---|---|
| **MX 記錄** | 公司 Email 的收信設定，動到會**收不到信** |
| **TXT 記錄**（SPF / DKIM / 驗證） | 動到寄出去的信會被判垃圾信 |
| **名稱伺服器（NS）** | 維持 GoDaddy 預設即可 |

---

## 步驟二：GitHub Pages 設定

進入這個 repo → **Settings** → 左側 **Pages**

1. **Source**：選 `Deploy from a branch`
2. **Branch**：選 `main`，資料夾選 `/ (root)` → 按 **Save**
3. **Custom domain**：填 `chnyaoind.com.tw` → 按 **Save**

GitHub 會開始驗證 DNS。畫面出現 **DNS check successful ✅** 就代表步驟一設對了。

> repo 裡的 `CNAME` 檔已經寫好 `chnyaoind.com.tw`，
> 所以第 3 項通常會自動帶入，確認一下即可。

---

## 步驟三：開啟 HTTPS

DNS 驗證通過後（可能要等幾分鐘到幾小時），
回到 **Settings → Pages**，勾選 **✅ Enforce HTTPS**。

GitHub 會自動申請並續期 Let's Encrypt 憑證，**完全免費、不用自己管**。

> 如果這個選項是灰的不能勾，代表憑證還在簽發中，等一下再回來勾。

---

## 驗證

DNS 生效通常 10 分鐘～1 小時（最長 48 小時）。

用 PowerShell 檢查：

```bash
nslookup chnyaoind.com.tw 8.8.8.8
```

回傳的 IP 變成 `185.199.10x.153` 就代表生效了。

接著逐項確認：

- [ ] https://chnyaoind.com.tw 可以開啟首頁，網址列有鎖頭
- [ ] https://www.chnyaoind.com.tw 會自動轉到主網域
- [ ] `/about`、`/service`、`/process`、`/contact` 四頁都正常
- [ ] 圖片沒有破圖（若整站破圖 → 檢查 `.nojekyll` 檔是否還在）
- [ ] 隨便打一個不存在的網址，會出現 404 頁面
- [ ] 手機開啟版面正常
- [ ] 聯絡表單送得出去（記得先做 README 裡的 Formspree 設定）

---

## 常見問題

| 症狀 | 原因與處理 |
|---|---|
| 網址打不開、顯示 GoDaddy 停放頁 | DNS 還沒生效，或「轉址」沒關掉 |
| GitHub Pages 顯示 `DNS check unsuccessful` | 4 筆 A 記錄沒建齊，或名稱欄不是 `@` |
| 網頁能開但**全部圖片破圖** | `.nojekyll` 被刪了。Jekyll 會忽略 `_img` 這種底線開頭的資料夾 |
| CSS 跑掉、版面錯亂 | `resources/css/` 底下檔案缺漏，或路徑被改成相對路徑 |
| `Enforce HTTPS` 勾不了 | 憑證簽發中，等 15 分鐘～24 小時後再試 |
| www 打不開 | CNAME 資料填錯，要填 `帳號.github.io`，不含 repo 名稱 |
| 改了檔案但網站沒更新 | 忘記 `git push`；或 Actions 還在跑，等 1～2 分鐘 |
| 公司信箱收不到信 | 不小心動到 MX 記錄，用步驟 1-1 的備份還原 |
