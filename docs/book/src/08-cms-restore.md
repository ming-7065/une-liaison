# Phase 8：CMS 補全

## 任務

補上遺漏的 CMS 入口檔案。

## 最終做法

`public/admin/index.html` 不存在（Phase 5 建立後可能遺失），重新建立：

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

## 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `public/admin/index.html` | ✅ 重新建立（CMS 入口） |