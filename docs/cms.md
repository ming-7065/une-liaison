# CMS 後台設定流程

## 技術棧

- **CMS**: Sveltia CMS（Decap CMS 替代品，MIT 開源）
- **載入方式**: CDN（`unpkg.com/@sveltia/cms/dist/sveltia-cms.js`）
- **後端**: GitHub（`backend: github`）
- **本機開發**: File System Access API（需 Chrome-based 瀏覽器）
- **內容格式**: Markdown + YAML frontmatter

## 檔案結構

```
public/admin/
  config.yml       ← CMS collection 定義、i18n 設定
src/pages/
  admin.astro      ← CMS 入口頁（載入 CDN script）
src/content/
  products/*.md    ← CMS 編輯的產品內容
  news/*.md        ← CMS 編輯的新聞內容
  blog/*.md        ← CMS 編輯的部落格內容
```

## admin.astro（CMS 入口頁）

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <link href="/admin/config.yml" type="text/yaml" rel="cms-config-url" />
    <title>Content Manager — Une Liaison</title>
  </head>
  <body>
    <p>Loading CMS...</p>
    <script type="module" src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
  </body>
</html>
```

關鍵點：
- `<link rel="cms-config-url">` 告訴 CMS 去哪裡讀 config.yml
- `<script type="module">` — Sveltia CMS 是 ES module，必須有這個屬性
- 有屬性的 `<script>` Astro 不會透過 Vite 處理，原始保留

## config.yml 結構

```yaml
i18n:
  structure: multiple_files     # 每個 locale 獨立一個檔案
  locales: [zh, ja, en]         # 內容編輯可切換的三種語言
  default_locale: zh

locale: 'zh_TW'                 # CMS 介面語言（按鈕、選單）

backend:
  name: github                  # 支援 github/gitlab/gitea
  repo: une-liaison/une-liaison
  branch: main

media_folder: public/images     # 圖片存放路徑（相對專案根目錄）
public_folder: /images          # 圖片公開 URL 路徑

collections:
  - name: products
    label: 台灣水果
    folder: src/content/products
    i18n: true                  # 啟用多語系編輯
    fields:
      - { name: title, label: 標題, widget: string, i18n: true }
      - { name: body, label: 詳細介紹, widget: markdown, i18n: true }
      # ... 更多欄位
```

### 欄位 i18n 屬性

| 值 | 行為 |
|---|---|
| `true` | 每個語言可獨立編輯 |
| `duplicate` | 只在預設語言可編輯，其他語言唯讀共用 |
| `false` | 不出現在非預設語言 |

## 本機開發流程

### 需求

- Chrome / Edge / Brave（Chromium-based 瀏覽器）
- 專案根目錄有 `.git`（`git init`）
- 專案 dev server 運行中

### 步驟

1. `cd ~/une-liaison && npx astro dev`
2. 開 Chrome → `http://localhost:4321/admin/index.html`
3. 點「Work with Local Repository」
4. 選擇 `/Users/yezhiming/une-liaison` 目錄
5. CMS 會直接讀寫 `src/content/` 內的 markdown 檔案
6. 編輯完後用 `git diff` → `git commit` 提交變更

### 注意

- 非 Chromium 瀏覽器（Safari、Firefox）不支援 File System Access API
- 不需要 proxy server（Sveltia CMS 新版捨棄了舊版 Decap CMS 的 proxy 模式）
- CMS 不會自動做 git commit，需手動 git 操作

## 部署流程（規劃中）

1. 內容編輯者在 CMS 編輯內容
2. CMS 透過 GitHub API commit 到 repo
3. Cloudflare Pages 偵測到 push → 自動 rebuild
4. 靜態頁面部署到 CDN
