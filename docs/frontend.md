# 前端頁面架構

## 頁面清單（65 pages total）

### 三語頁面（每頁 × 3）

| 路徑 | 檔案 | 資料來源 |
|---|---|---|
| `/[lang]/` | `index.astro` | `src/data/content.ts` → 需遷移到 content collection |
| `/[lang]/about/` | `about.astro` | `i18n/{lang}.ts` → `t.about.*` |
| `/[lang]/products/` | `products.astro` | `getCollection('products')` ✅ |
| `/[lang]/products/[slug]/` | `products/[slug].astro` | `getCollection('products')` + `render(entry)` ✅ |
| `/[lang]/partners/` | `partners.astro` | `i18n/{lang}.ts` → `t.partners.*` |
| `/[lang]/news/` | `news.astro` | `getCollection('news')` ✅ |
| `/[lang]/news/[slug]/` | `news/[slug].astro` | `getCollection('news')` + `render(entry)` ✅ |
| `/[lang]/blog/` | `blog.astro` | `getCollection('blog')` ✅ |
| `/[lang]/blog/[slug]/` | `blog/[slug].astro` | `getCollection('blog')` + `render(entry)` ✅ |
| `/[lang]/contact/` | `contact.astro` | `i18n/{lang}.ts` → `t.contact.*` |
| `/[lang]/privacy-policy/` | `privacy-policy.astro` | `i18n/{lang}.ts` → `t.privacy.*` |
| `/[lang]/terms-of-service/` | `terms-of-service.astro` | `i18n/{lang}.ts` → `t.terms.*` |
| `/[lang]/404/` | `404.astro` | `i18n/{lang}.ts` → `t.404.*` |

### 單一頁面

| 路徑 | 檔案 | 用途 |
|---|---|---|
| `/` | `index.astro` | 語言路由轉向（→ `/zh/`） |
| `/admin/` | `admin.astro` | Sveltia CMS 後台入口 |

### 支援的語言參數

```
[lang] ∈ { zh, ja, en }
```

在 `getStaticPaths()` 中定義。

## 資料流

```
                      ┌─────────────────────┐
                      │  i18n/{lang}.ts     │ ← UI 文字字典（導航、標題、按鈕）
                      │  靜態文字（zh/ja/en）│
                      └──────────┬──────────┘
                                 │
                      ┌──────────▼──────────┐
  Sveltia CMS 編輯 ──►│  src/content/*.md   │ ← 內容（產品、新聞、部落格）
                      │  動態內容（可編輯）  │
                      └──────────┬──────────┘
                                 │
                      ┌──────────▼──────────┐
                      │  Astro Build        │
                      │  getCollection()    │
                      │  render(entry)       │
                      └──────────┬──────────┘
                                 │
                      ┌──────────▼──────────┐
                      │  dist/ 靜態 HTML    │
                      │  65 pages           │
                      └─────────────────────┘
```

## Content Collection Schema

### Products

```yaml
title: 中文標題
title_ja: 日文標題
title_en: 英文標題
emoji: 🍍
description: 中文簡介
description_ja: 日文簡介
description_en: 英文簡介
features: [特色1, 特色2]   # 中文
features_ja: [特色1, 特色2]  # 日文
features_en: [Feature1, Feature2]  # 英文
image: /images/products/xxx.jpg
locale: zh
---
Markdown 內文（產地故事、營養價值等）
```

### News

```yaml
title: 標題
title_ja: 日文標題
title_en: English Title
date: 2026-03-15
excerpt: 摘要
excerpt_ja: 日文摘要
excerpt_en: English Excerpt
emoji: 🍍
image: /images/news/xxx.jpg
locale: zh
---
Markdown 內文（完整新聞內容）
```

### Blog

```yaml
title: 標題
title_ja: 日文標題
title_en: English Title
date: 2026-03-20
excerpt: 摘要
excerpt_ja: 日文摘要
excerpt_en: English Excerpt
emoji: 🍍
image: /images/blog/xxx.jpg
locale: zh
---
Markdown 內文（完整文章內容）
```

## 待修正

| 問題 | 位置 | 狀態 |
|---|---|---|
| 首頁仍用 `content.ts` 而非 content collection | `index.astro` | 📋 |
| `entry.id` slug 提取用 regex，可能脆弱 | `news.astro`, `blog.astro` | 📋 |
| ja.ts 殘留中文 / 語法問題 | `src/i18n/ja.ts` | 📋 |
| 產品圖片尚未上傳 | `public/images/products/` | 📋 |
