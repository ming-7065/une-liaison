# Phase 5：CMS 調試與成功模式

## 任務

讓 Sveltia CMS 正常運作，確認可以在本機環境開啟並讀取內容。

## 協作過程

**Human:** 「CMS 開不起來，空白畫面。」

**AI:** 檢查 `admin.astro`，懷疑是 Astro 的 `<script>` 處理問題。Sveltia CMS 是 CDN 的 ES module，需要原始 URL 不要被處理。

**Human:** 「加了 type="module" 還是空白。」

AI 嘗試了多種方式修改 `admin.astro`，陸續失敗。

**Human:** 「有看到 Sveltia CMS 有自己的 `index.html` 嗎？直接用那個。」

AI 找到了 Sveltia CMS 的 CDN 有提供 `index.html`。

**Human:** 「直接建立 `public/admin/index.html`。」

```html
<!doctype html>
<html>
<head>
  <link rel="cms-config-url" href="/admin/config.yml">
  <title>Sveltia CMS</title>
</head>
<body>
  <p>Loading...</p>
  <script type="module" src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
</body>
</html>
```

**Human:** 「可以了！CMS 出現了！」

## 成功關鍵

`public/admin/index.html` 繞過了 Astro 的處理，讓 Sveltia CMS 的 script 原始 URL 被正確載入。

## 成功模式

```
1. CMS 入口：用 static HTML（public/admin/index.html）而不是 .astro
2. 路徑：/admin/config.yml 讓 CMS 找到 collection 定義
3. 條件：dev server 運行中 + 專案根目錄有 .git（File System Access API 需要）
4. 瀏覽器：Chrome/Edge/Brave（File System Access API 僅支援 Chromium）
```

**Human:** 「現在試用『Work with Local Repository』功能，選擇專案目錄。」

Human 點了「Work with Local Repository」，選擇了 `/Users/yezhiming/une-liaison` 目錄。CMS 正確讀到了 33 個檔案。

## 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `public/admin/index.html` | ✅ 新建（成功關鍵） |
| `public/admin/config.yml` | ✅ 確認正確 |
| `.git/` | ✅ `git init` 完成 |