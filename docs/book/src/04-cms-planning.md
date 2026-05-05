# Phase 3：CMS 後台規劃與 Sveltia CMS 選擇

## 任務

選擇並設定 CMS 後台，讓非技術人員可以透過 GUI 編輯 Markdown 內容。

## 協作過程

**Human:** 「我要加一個 CMS 後台，讓我可以編輯內容，不要直接改 code。」

**AI:** 推薦 Sveltia CMS（Sveltia 是 Decap CMS 的開源重寫，UI 更現代）。

**Human:** 「選 Sveltia CMS。」

**AI:** 說明 Sveltia CMS 支援 i18n `multiple_files` 模式，三語編輯在同一介面，每個語言寫成獨立的 `.zh.md`、`.ja.md`、`.en.md` 檔案。

**AI:** 說明有兩種本機開發模式：
1. **Proxy 模式**（舊版）：需架 proxy server
2. **File System Access API 模式**（新版）：需要 Chrome + `.git` 目錄

**Human:** 「不要 proxy server，太複雜。用新的 API 模式。」

**AI:** 需要 `git init` 初始化專案。

**Human:** 「好。」

## 最終做法

```
public/admin/config.yml     ← Sveltia CMS 設定檔
src/pages/admin.astro        ← CMS 入口頁
.git/                        ← git init 新建
```

config.yml 核心設定：

```yaml
i18n:
  structure: multiple_files
  locales: [zh, ja, en]
  default_locale: zh

locale: 'zh_TW'              # CMS 介面語言

backend:
  name: github
  repo: une-liaison/une-liaison
  branch: main

collections:
  - name: products
    folder: src/content/products
    i18n: true
```

## 關鍵檔案

| 檔案 | 狀態 |
|---|---|
| `public/admin/config.yml` | ✅ 新建 |
| `src/pages/admin.astro` | ✅ 新建 |
| `.git/` | ✅ `git init` |
| `docs/cms.md` | ✅ 新建 |