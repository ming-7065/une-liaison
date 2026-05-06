# AGENTS.md — Une Liaison 專案規範

> 本文件為 AI 協作規範，每次 session 啟動時自動讀取。

---

## 專案資訊

| 項目 | 內容 |
|------|------|
| 專案名 | une-liaison |
| 類型 | 三語企業形象 + 產品展示 + 新聞 + 部落格 |
| 站點 | https://une-liaison.pages.dev |
| 語言 | 中文 / 日文 / 英文 |
| CMS | Sveltia CMS（GitHub backend） |

---

## 技術棧

- **Astro v6** — 靜態生成
- **Tailwind CSS v4** — 樣式
- **Markdown Content Collections** — 三語 i18n（glob loader）
- **Sveltia CMS** — 客戶後台（CDN 載入，GitHub backend）
- **Cloudflare Pages** — 自動部署（GitHub Actions + wrangler CLI）

---

## Dev / Build 指令

```sh
npm run dev      # http://localhost:4321
npm run build    # 輸出到 dist/（80 頁）
```

---

## CMS 技術規範

| 規則 | 原因 |
|------|------|
| `<link rel="cms-config-url" href="/admin/config.yml" type="text/yaml">`，**`type` 不可省略** | Sveltia CMS 讀取 `<link>` 的 `type` 屬性來判定 config 類型，省略會得到空字串，拋出「not a valid file type」 |
| `backend: github`（不是 test-repo） | test-repo 只存 localStorage，不寫入 repo |
| `public/admin/index.html`（不是 `.astro`） | Astro 會處理 `.astro` 的 `<script>`，破壞 CDN module 載入 |
| Collection 必須加 `extension: 'md'` + `format: 'frontmatter'` | Sveltia CMS 正確辨識檔案格式 |
| CMS 改動必須同步前台頁面 | 只改 `config.yml` 移除欄位，前台 `.astro` 仍引用該欄位 → 線上看不到變化 |
| 確認「移除/保留」清單後再動手 | 避免方向搞反（如：照片設 hidden、emoji 留著） |

---

## 程式碼規範

| # | 規則 | 違反後果 |
|---|------|---------|
| 1 | 禁止 `global.css` 有 `!important` 全局 `transition-duration` | 所有 per-element duration 設定失效，除錯極難 |
| 2 | slug 精確比對用 `===`，不用 `startsWith` | 避免 `taiwan-pineapple` 誤匹配 `taiwan-pineapple-special` |
| 3 | Astro v6 `render(entry)` from `astro:content`，不用 `entry.render()` | v6 移除了 legacy API |
| 4 | Content Collection config 放 `src/content.config.ts`（根目錄） | Astro v6 loader-based config 必須在根目錄 |
| 5 | `public/admin/index.html` 繞過 Astro build tool | static HTML，CDN script 保留原樣 |

---

## 審計指令

每建完新頁面或 push 前執行：

```sh
# 1. shadow 公式審計 — 應該只有 1 種
grep -rn "shadow-\[" src/ --include="*.astro"

# 2. transition 時間審計 — 不應該有 300ms/500ms
grep -rn "duration-300\|duration-500" src/ --include="*.astro"

# 3. global.css !important 檢查
grep -rn "!important" src/styles/global.css

# 4. 交付前全站審計
chmod +x audit.sh && ./audit.sh
```

---

## 部署路徑

```
編輯內容（CMS GUI / 本地 Markdown）
    ↓
git commit → git push
    ↓
GitHub Actions 偵測 push
    ↓
npm run build → 80 pages
    ↓
wrangler pages deploy dist/
    ↓
Cloudflare CDN 部署完成 ✅
```