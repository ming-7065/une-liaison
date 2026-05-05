# Phase 9：部署準備

## 任務

更新部署設定，從 GitHub Pages 改為 Cloudflare Pages。

## 最終做法

1. **更新 `.github/workflows/deploy.yml`**：改用 `cloudflare/pages-action@v1`
2. **更新 `astro.config.mjs`**：加入 `site: 'https://une-liaison.com'`
3. **新建 `wrangler.toml`**：Cloudflare Workers 設定

## 待辦（需手動完成）

| 項目 | 狀態 |
|---|---|
| GitHub Repo 建立 | ⏳ 待手動 |
| Cloudflare Pages 專案建立 | ⏳ 待手動 |
| DNS 網域指向 | ⏳ 待手動 |
| Secrets 設定 | ⏳ 待手動 |

## 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `.github/workflows/deploy.yml` | ✅ Cloudflare Pages |
| `astro.config.mjs` | ✅ 加入 site URL |
| `wrangler.toml` | ✅ 新建 |