---
project: une-liaison.com
status: in-progress
phase: CMS-backend
last_updated: 2026-05-05
---

# PLAN — Une Liaison 網站重構

## 架構總覽

```
une-liaison/
├── src/
│   ├── content/             ← Astro Content Collections（資料源）
│   │   ├── products/        ← 4 產品 × 3 語言 = 12 .md
│   │   ├── news/            ← 3 新聞 × 3 語言 = 9 .md
│   │   └── blog/            ← 4 文章 × 3 語言 = 12 .md
│   ├── content.config.ts    ← Collection schema（Astro v6 loader）
│   ├── pages/               ← 頁面路由
│   │   ├── [lang]/
│   │   │   ├── index.astro        首頁
│   │   │   ├── about.astro        關於我們
│   │   │   ├── products.astro     產品列表
│   │   │   ├── products/[slug].astro  產品詳情
│   │   │   ├── partners.astro     合作夥伴
│   │   │   ├── news.astro         新聞列表
│   │   │   ├── news/[slug].astro  新聞詳情
│   │   │   ├── blog.astro         部落格列表
│   │   │   ├── blog/[slug].astro  部落格詳情
│   │   │   ├── contact.astro      聯絡我們
│   │   │   ├── privacy-policy.astro
│   │   │   ├── terms-of-service.astro
│   │   │   └── 404.astro
│   │   ├── index.astro           語言路由轉向
│   │   └── admin.astro           CMS 後台入口
│   ├── i18n/                ← UI 文字字典（zh.ts / ja.ts / en.ts）
│   ├── layouts/Layout.astro
│   ├── components/          ← Header / Footer
│   └── styles/global.css    ← Tailwind v4
├── public/
│   └── admin/config.yml     ← Sveltia CMS 設定
└── docs/                    ← 本文件目錄
    ├── PLAN.md              總控文件
    ├── cms.md               CMS 設定流程
    └── frontend.md          前端頁面對照
```

## 進度

### ✅ Phase 1 — 三語 Content Collection 建立（已完成）

| 項目 | 狀態 |
|---|---|
| `src/content.config.ts` schema | ✅ |
| 產品 markdown（12 檔） | ✅ |
| 新聞 markdown（9 檔） | ✅ |
| 部落格 markdown（12 檔） | ✅ |
| i18n 字典移除 inline articles | ✅ |
| `src/data/articles.ts` 刪除 | ✅ |
| Build 65 pages | ✅ |

### ⏳ Phase 2 — CMS 後台整合（進行中）

| 項目 | 狀態 |
|---|---|
| `public/admin/config.yml` 設定 | ✅ |
| `src/pages/admin.astro` 入口 | ✅ |
| Sveltia CMS 可載入 | ✅ |
| Git repo 初始化 | ✅ |
| `locale: 'zh_TW'` 中文介面 | ✅ |
| "Work with Local Repository" 寫入本機 | ⏳ 待驗證 |
| 圖片上傳測試 | 📋 |
| CMS 編輯 → Astro 重建流程 | 📋 |

### 📋 Phase 3 — 前端頁面優化（待辦）

| 項目 | 狀態 |
|---|---|
| 首頁改用 content collection | 📋 |
| ja.ts 殘留中文清理 | 📋 |
| 產品/新聞/部落格 detail 頁 slug 確認 | 📋 |
| 圖片 placeholder | 📋 |

### 📋 Phase 4 — 部署（待辦）

| 項目 | 狀態 |
|---|---|
| Cloudflare Pages 部署 | 📋 |
| GitHub repo 建立 | 📋 |
| 正式域名綁定 | 📋 |

## 關鍵決策記錄

| 日期 | 決策 | 原因 |
|---|---|---|
| 05-05 | Astro v6: `render(entry)` 取代 `entry.render()` | v6 移除了舊 API |
| 05-05 | `src/content.config.ts` 取代 `src/content/config.ts` | v6 要求 loader-based |
| 05-05 | markdown 命名 `slug.lang.md`（如 `taiwan-pineapple.zh.md`） | Sveltia CMS i18n multiple_files 模式 |
| 05-05 | YAML frontmatter 全語言欄位放在同一檔 | CMS 每個 locale 編輯一個檔案 |
| 05-05 | 不用 proxy server | Sveltia CMS 新版用 File System Access API |
| 05-05 | `backend: github` 取代 `test-repo` | test-repo 只存 localStorage，不寫檔案 |
| 05-05 | script 不加 `type="module"` 但加 `type="module"` | 要 `type="module"` 才能執行 ES module，但有屬性的 script Astro 不處理 |
