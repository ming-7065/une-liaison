# Phase 0：初始狀態

改造前的 une-liaison.com 是一個半成品 Astro 網站。

## 原始架構

```
src/
├── content.ts              ← 所有內容寫在這裡（產品、新聞、部落格數組）
├── data/
│   └── articles.ts         ← 各語言文章內容
├── i18n/
│   ├── zh.ts               ← 包含 companyInfo + UI 字典
│   ├── ja.ts               ← 翻譯企業資訊
│   └── en.ts               ← 英文翻譯
├── layouts/
│   └── Layout.astro
├── components/
│   ├── Header.astro         ← 雙主題切換（Sunshine / Harvest）
│   └── Footer.astro
└── pages/
    ├── index.astro          ← 根目錄轉向 /zh/
    └── [lang]/
        ├── index.astro      ← 首頁（吃 content.ts）
        ├── about.astro
        ├── products.astro   ← 產品列表（寫死）
        ├── news.astro       ← 新聞列表（吃 content.ts）
        ├── blog.astro       ← 部落格列表（吃 content.ts）
        └── contact.astro
```

## 主要問題

| 問題 | 說明 |
|---|---|
| 內容寫死在程式碼裡 | `content.ts` 和 `articles.ts` 是龐大的 JS 數組，無法交给非技術人員管理 |
| 無 CMS 後台 | 每次更新都要改 code → commit → rebuild |
| 三語架構脆弱 | i18n 字典和 content 數組分開維護，容易不同步 |
| 無 detail 頁面 | 產品/新聞/部落格沒有內頁，只能在列表看摘要 |

## 改造起點

改造開始時，網站已有基本的頁面結構和三語路由，但內容管理方式完全不可擴展。