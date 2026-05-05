# Phase 7：前端頁面優化

## 任務

修復改造過程中遺留的四個前端問題。

## 最終做法

1. **首頁改用 content collection**：移除 `content.ts` 依賴，改用 `getCollection('products')`
2. **ja.ts 清理**：修正 7 處殘留中文/韓文/俄文
3. **slug 精確比對**：`startsWith` → `===` 精確匹配
4. **圖片 placeholder**：建立 4 個 SVG，更新 markdown 路徑

## 關鍵決策

| 決策 | 原因 |
|---|---|
| SVG placeholder | 可縮放、檔案小、不需外部圖床 |
| `===` 精確比對 | 避免部分匹配錯誤 |

## 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `src/pages/[lang]/index.astro` | ✅ 改用 `getCollection` |
| `src/i18n/ja.ts` | ✅ 7 處殘留清理 |
| `src/pages/[lang]/*/[_slug].astro` | ✅ `===` 精確比對 |
| `public/images/products/*.svg` | ✅ 4 個 placeholder |