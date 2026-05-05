# 前言

本文記錄 une-liaison.com 網站改造的完整過程，從 2026-05-05 開始的 Phase 0 到 Phase 6。

## 改造目標

將原本內容寫死在程式碼裡的半成品 Astro 網站，改造成：

1. **三語 CMS 內容管理** — Sveltia CMS 後台，編輯內容自動 commit 到 GitHub
2. **Content Collections** — 33 個 Markdown 檔案，三語內容分開管理
3. **65 頁靜態網站** — 一次 build 產生所有頁面，部署到 CDN

## 最終成果

| 項目 | 數量 |
|---|---|
| 頁面數 | 65 頁 |
| Markdown 內容檔 | 33 個 |
| 語言 | 中文 / 日文 / 英文 |
| CMS | Sveltia CMS |
| 部署方式 | GitHub → Cloudflare Pages |

## 文件結構

本文有三種格式：

- **Markdown（主體）** — `docs/BUILD_LOG.md`
- **Obsidian** — `docs/obsidian/BUILD_LOG.md`（含 callouts、wiki-links、YAML frontmatter）
- **mdBook** — `docs/book/`（章節式目錄結構）
- **HTML** — `docs/BUILD_LOG.html`（網頁閱讀版）