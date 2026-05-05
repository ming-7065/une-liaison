# Une Liaison 改造歷程 — BUILD_LOG

## Phase 0：初始狀態

### 原始網站架構

改造前的 une-liaison.com 是一個半成品 Astro 網站：

```
src/
├── content.ts              ← 單一檔案放了所有內容（產品、新聞、部落格數組）
├── data/
│   └── articles.ts         ← 各語言文章內容（zh / ja / en）
├── i18n/
│   ├── zh.ts               ← 包含 companyInfo + UI 字典
│   ├── ja.ts               ← 翻譯企業資訊
│   └── en.ts               ← 英文翻譯
├── layouts/
│   └── Layout.astro
├── components/
│   ├── Header.astro         ← 雙主題切換（Sunshine 🌻 / Harvest 🍊）
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

### 主要問題

| 問題 | 說明 |
|---|---|
| 內容寫死在程式碼裡 | `content.ts` 和 `articles.ts` 是龐大的 JS 數組，無法交给非技術人員管理 |
| 無 CMS 後台 | 每次更新都要改 code → commit → rebuild |
| 三語架構脆弱 | i18n 字典和 content 數組分開維護，容易不同步 |
| 無 detail 頁面 | 產品/新聞/部落格沒有內頁，只能在列表看摘要 |

---

## Phase 1：三國語言 Content Collection 架構

### 任務

建立 Astro Content Collections，讓內容脫離程式碼，成為獨立的 Markdown 檔案，並支援三語 i18n。

### 協作過程

**Human:** 「我要把內容從 content.ts 移出，改成 Markdown 檔案放在 content/ 目錄，三個語言。」

**AI:** 建議用 Astro v6 的 `content.config.ts` + glob loader，一次定義三個 collection（products / news / blog），每個 collection 的 schema 包含各語言的 title、description、features。

**Human:** 「三個 collection 太多了，有沒有辦法用一個 collection 含三個語言？」

**AI:** 可以，但 Astro Content Collection 本身不支援一個 entry 多語言。所以建議一個 collection，filename 區分語言（如 `taiwan-pineapple.zh.md`），YAML frontmatter 內放 `_zh`、`_ja`、`_en` 後綴欄位。

**Human:** 「好，就這樣做。」

### 最終做法

```
src/content.config.ts       ← Astro v6 glob loader，定義 products / news / blog 三個 collection
src/content/
├── products/
│   ├── taiwan-pineapple.zh.md
│   ├── taiwan-pineapple.ja.md
│   ├── taiwan-pineapple.en.md
│   ├── fuji-apple.zh.md
│   ├── fuji-apple.ja.md
│   └── ... (12 檔)
├── news/
│   ├── market-trend.zh.md
│   └── ... (9 檔)
└── blog/
    ├── spring-harvest.zh.md
    └── ... (12 檔)
```

Collection schema 設計：
```typescript
// src/content.config.ts
import { glob } from 'astro/loaders';
import { defineCollection, z } from 'astro:content';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    title: z.string(),
    title_ja: z.string(),
    title_en: z.string(),
    emoji: z.string(),
    description: z.string(),
    description_ja: z.string(),
    description_en: z.string(),
    features: z.array(z.string()),
    features_ja: z.array(z.string()),
    features_en: z.array(z.string()),
    image: z.string(),
    locale: z.enum(['zh', 'ja', 'en']),
  }),
});
```

### 關鍵決策

| 決策 | 原因 |
|---|---|
| `content.config.ts` 放根目錄 | Astro v6 要求 loader-based config 必須在根目錄 |
| Filename `slug.lang.md` | Sveltia CMS i18n `multiple_files` 模式以副檔名判斷語言 |
| YAML 雙語欄位命名 `_ja` / `_en` | 避免與日文 `title` 欄位衝突 |

### 關鍵檔案

| 檔案 | 狀態 |
|---|---|
| `src/content.config.ts` | ✅ 新建 |
| `src/content/products/*.md` | ✅ 12 檔 |
| `src/content/news/*.md` | ✅ 9 檔 |
| `src/content/blog/*.md` | ✅ 12 檔 |
| `src/data/articles.ts` | ✅ 刪除 |
| `src/i18n/zh.ts` | ✅ 移除 `articles[]` |
| `src/i18n/ja.ts` | ✅ 移除 `articles[]` |
| `src/i18n/en.ts` | ✅ 移除 `articles[]` |

---

## Phase 2：About 頁面與 i18n 字典整理

### 任務

重構 About 頁面，讓它從 i18n 字典讀取動態資料，不再綁死在 `companyInfo` 物件。

### 最終做法

廢除 `companyInfo`，About 頁面直接從 `t.about.*` 讀取所有欄位：
```astro
const t = useTranslations(Astro.params.lang);
const company = t.about;
---
<h1>{company.name}</h1>
<p>{company.description}</p>
```

將 `certifications`、`partners`、`sustainability` 全部搬到三語 i18n 字典（zh/ja/en），確保各語言版本同步維護。

### 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `src/pages/[lang]/about.astro` | 移除 `companyInfo` 依賴，改用 `t.about.*` |
| `src/i18n/zh.ts` | 加入 `about.certifications`、`about.partners` 等 |
| `src/i18n/ja.ts` | 同上，完整日文翻譯 |
| `src/i18n/en.ts` | 同上，完整英文翻譯 |

---

## Phase 3：CMS 後台規劃與 Sveltia CMS 選擇

### 任務

選擇並設定 CMS 後台，讓非技術人員可以透過 GUI 編輯 Markdown 內容。

### 協作過程

**Human:** 「我要加一個 CMS 後台，讓我可以編輯內容，不要直接改 code。」

**AI:** 推薦兩個選項：Netlify CMS（現在的 Decap CMS）或 Sveltia CMS（Sveltia 是 Decap 的開源重寫，UI 更現代）。

**Human:** 「選 Sveltia CMS。」

**AI:** 說明 Sveltia CMS 支援 i18n `multiple_files` 模式，可以讓你在同一個編輯介面內切換語言，每個語言編輯完後寫成獨立的 `.zh.md`、`.ja.md`、`.en.md` 檔案。

**Human:** 「好，就用 Sveltia CMS。」

**AI:** 說明 Sveltia CMS 有兩種本機開發模式：
1. **Proxy 模式**（舊版 Decap CMS 方式）：需架 proxy server，把 Sveltia CMS 的 localStorage 寫入操作代理成檔案寫入
2. **File System Access API 模式**（新版）：需要 Chrome-based 瀏覽器 + 專案根目錄有 `.git` 目錄，Sveltia CMS 直接呼叫瀏覽器 API 寫入檔案

**Human:** 「不要 proxy server，太複雜。用新的 API 模式。」

**AI:** 需要 `git init` 初始化專案，讓 Sveltia CMS 可以做 git commit 追蹤變更。

**Human:** 「好。」

### 最終做法

```
public/admin/config.yml     ← Sveltia CMS 設定檔（collection 定義、i18n、backend）
src/pages/admin.astro        ← CMS 入口頁（乾淨 HTML，載入 CDN script）
.git/                        ← git init 新建（讓 File System Access API 工作）
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
    fields:
      - { name: title, widget: string, i18n: true }
      - { name: body, widget: markdown, i18n: true }
      # ...
```

### 關鍵檔案

| 檔案 | 狀態 |
|---|---|
| `public/admin/config.yml` | ✅ 新建 |
| `src/pages/admin.astro` | ✅ 新建（乾淨 HTML + CDN script） |
| `.git/` | ✅ `git init` |
| `docs/cms.md` | ✅ 新建 |

---

## Phase 4：Content Collection 遷移與 Astro v6 修正

### 任務

把所有產品、新聞、部落格從 `content.ts` / `articles.ts` 數組遷移到 Markdown 檔案，建立完整的 detail 頁面。

### 協作過程

**Human:** 「現在要真的遷移內容了。之前 content.ts 裡有很多資料，要轉成 33 個 markdown 檔案。」

**AI:** 列出遷移項目：
- 4 products × 3 languages = 12 files
- 3 news × 3 languages = 9 files
- 4 blog posts × 3 languages = 12 files
- 總共 33 個 markdown 檔案

**Human:** 「好，請開始。」

AI 陸續建立所有 Markdown 檔案，每個檔案包含完整 YAML frontmatter + Markdown 內文。

**Human:** 「我要有 detail 頁面，可以點進去看產品/新聞/部落格的完整內容。」

**AI:** 建立動態路由：
- `src/pages/[lang]/products/[slug].astro` — 產品詳情，呼叫 `getCollection('products')`，用 `render(entry)` 渲染 Markdown body
- `src/pages/[lang]/news/[slug].astro` — 新聞詳情
- `src/pages/[lang]/blog/[slug].astro` — 部落格詳情

**Human:** 「Astro 报错 `entry.render()` 是舊 API。」

AI 查了一下，發現 Astro v6 移除了 `entry.render()`，改成從 `astro:content` 匯入 `render()` 函式，呼叫方式變成 `render(entry)`。

**Human:** 「那就改成新的方式。」

AI 更新了所有 detail 頁面：
```typescript
import { render } from 'astro:content';
const { Content } = await render(entry);
```

### 最終做法

所有 detail 頁面透過 `getCollection()` 抓資料，用 `render(entry)` 渲染 Markdown：
```astro
const { slug } = Astro.params;
const entries = await getCollection('products');
const entry = entries.find(e => e.id.startsWith(slug));
const { Content } = await render(entry);
---
<Content />
```

### 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `src/content/products/*.md` | ✅ 12 檔新建 |
| `src/content/news/*.md` | ✅ 9 檔新建 |
| `src/content/blog/*.md` | ✅ 12 檔新建 |
| `src/pages/[lang]/products/[slug].astro` | ✅ 新建（image + markdown body） |
| `src/pages/[lang]/news/[slug].astro` | ✅ 新建 |
| `src/pages/[lang]/blog/[slug].astro` | ✅ 新建 |
| `src/pages/[lang]/products.astro` | ✅ 更新為 `getCollection` |
| `src/pages/[lang]/news.astro` | ✅ 更新為 `getCollection` |
| `src/pages/[lang]/blog.astro` | ✅ 更新為 `getCollection` |

---

## Phase 5：CMS 後台設定

### 任務

設定 Sveltia CMS 後台，讓非技術人員可以透過 GUI 編輯 Markdown 內容。

### 最終做法

Sveltia CMS 使用 File System Access API（Chrome/Edge/Brave），需要：
- `public/admin/index.html` — 靜態入口（繞過 Astro build tool）
- `public/admin/config.yml` — 定義 collections、i18n、backend
- 專案根目錄有 `.git/` — CMS 需要 git 追蹤變更
- dev server 運行中 — File System Access API 需要 localhost

```html
<!-- public/admin/index.html -->
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

```yaml
# public/admin/config.yml
i18n:
  structure: multiple_files
  locales: [zh, ja, en]
  default_locale: zh

backend:
  name: github
  repo: une-liaison/une-liaison
  branch: main
```

本機開啟流程：
1. `npm run dev`（確保 localhost:4321 運行中）
2. 瀏覽器開 `http://localhost:4321/admin/`
3. 點「Work with Local Repository」，選擇 `/Users/yezhiming/une-liaison`
4. CMS 讀取所有 Markdown 檔案，可編輯並寫回

### 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `public/admin/index.html` | ✅ 新建（靜態入口，繞過 Astro） |
| `public/admin/config.yml` | ✅ 確認 i18n 設定正確 |
| `.git/` | ✅ `git init` 完成 |
| `docs/cms.md` | ✅ 補充本機開發流程 |

---

## Phase 6：文件化

### 任務

將改造過程記錄成文件，供日後維護和部署參考。

### 協作過程

**Human:** 「我要把這次改造的過程記錄下來。」

**AI:** 建議建立三份文件：
- `docs/PLAN.md` — 總體架構規劃和進度
- `docs/cms.md` — CMS 設定和本機開發流程
- `docs/frontend.md` — 前端頁面對照和資料流

**Human:** 「好，做吧。」

AI 陸續建立了這三份文件。

**Human:** 「改造過程也要記錄下來，包括我們怎麼討論、怎麼做決定的。」

AI 建議建立 `BUILD_LOG.md`，記錄從 Phase 0 到 Phase 6 的完整過程，包含對話摘要、錯誤、修正、關鍵決策。

**Human:** 「對，就要這個。」

### 關鍵檔案

| 檔案 | 狀態 |
|---|---|
| `docs/PLAN.md` | ✅ 總體規劃 |
| `docs/cms.md` | ✅ CMS 設定流程 |
| `docs/frontend.md` | ✅ 前端架構 |
| `docs/BUILD_LOG.md` | ✅ 改造歷程（本文） |

---

## Phase 7：前端頁面優化

### 任務

首頁改用 Content Collection、建立圖片 placeholder、完成 slug 精確比對。

### 最終做法

1. **首頁改用 content collection**：移除 `import { products } from '../../data/content'`，改用 `getCollection('products')` + `filter(locale === lang)` + `slice(0, 4)`
2. **slug 精確比對**：所有 detail 頁用 `e.id === `${slug}${lang}`` 匹配，確保 `taiwan-pineapple` 不會誤匹配 `taiwan-pineapple-special`
3. **圖片 placeholder**：建立 4 個 SVG（taiwan-pineapple / taiwan-mango / aomori-apple / dragon-fruit），更新所有 product markdown 的 `image:` 路徑從 `.jpg` 改 `.svg`

### 關鍵決策

| 決策 | 原因 |
|---|---|
| SVG 而非 JPG placeholder | SVG 可縮放、檔案小、不需外部圖床 |
| `===` 精確比對 | 避免 `startsWith` 的誤匹配問題 |

### 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `src/pages/[lang]/index.astro` | ✅ 改用 `getCollection` |
| `src/pages/[lang]/products/[slug].astro` | ✅ `===` 精確比對 |
| `src/pages/[lang]/news/[slug].astro` | ✅ `===` 精確比對 |
| `src/pages/[lang]/blog/[slug].astro` | ✅ `===` 精確比對 |
| `public/images/products/*.svg` | ✅ 4 個 placeholder 新建 |
| `src/content/products/*.md` | ✅ `image:` 路徑 `.jpg` → `.svg` |

---

## Phase 8：CMS 補全

### 任務

補上遺漏的 CMS 入口檔案。

### 最終做法

發現 `public/admin/index.html` 不存在（Phase 5 建立後可能遺失），重新建立：

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

### 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `public/admin/index.html` | ✅ 重新建立（CMS 入口） |

---

## Phase 9：Netlify 部署

### 任務

部署到 Netlify，讓客戶可以線上預覽。

### 最終做法

1. **GitHub 倉庫公開**：Netlify free tier 對 private repo 有限制，改為 public repo
2. **更新 `astro.config.mjs`**：使用 `process.env.URL` 讓 Netlify 自動注入站點網址
3. **新建 `public/netlify.toml`**：定義 build command 和 publish directory
4. **新建 `public/_redirects`**：`/ → /zh/ 301`（根目錄自動轉向中文）
5. **連結 Netlify**：從 GitHub repo 連結，自動部署

部署流程：
```
git push → Netlify 偵測 push → npm run build → 自動部署到 CDN
```

### 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `astro.config.mjs` | ✅ `site: process.env.URL \|\| 'http://localhost:4321'` |
| `public/netlify.toml` | ✅ build + publish 設定 |
| `public/_redirects` | ✅ `/ → /zh/ 301` |
| GitHub repo | ✅ 改為 public |

### 部署結果

| 項目 | 狀態 |
|---|---|
| 線上站點 | https://une-liaison.netlify.app |
| 頁面數 | 65 頁 |
| CMS 後台 | `/admin/`（靜態資源正常） |

---

## 成功模式總結

### 人機協作流程

```
Human 提出需求
    ↓
AI 分析架構，給出選項
    ↓
Human 做決定
    ↓
AI 實作
    ↓
Human 驗證，發現問題
    ↓
AI 修正
    ↓
成功 ✅
```

### 關鍵決策

| 決策 | 價值 |
|---|---|
| Content Collection 而非寫死數組 | 內容可獨立管理、版本控制、協作 |
| Sveltia CMS + GitHub backend | 編輯內容等於 git commit，自動觸發 rebuild |
| `multiple_files` i18n 模式 | 三語編輯在同一介面，檔案分開好維護 |
| `public/admin/index.html` 而非 `.astro` | 繞過 build tool，CMS script 正確載入 |
| `git init` 讓 File System Access API 工作 | 不需要 proxy，本機直接寫檔案 |

### 技術規範

| 項目 | 正確做法 |
|---|---|
| CMS backend | `backend: github`（寫入 repo，自動觸發 rebuild） |
| CMS 入口 | `public/admin/index.html`（靜態檔案，繞過 Astro build tool） |
| Astro v6 render | `import { render } from 'astro:content'; await render(entry)` |
| Content Collection config | `src/content.config.ts`（Astro v6 根目錄位置） |
| CMS script 載入 | `type="module"` + CDN URL，在 static HTML 中保留原樣 |

### 最終成果

- **65 頁**靜態網站（3 languages × ~22 pages）
- **33 個 Markdown 檔案**（可透過 Sveltia CMS 編輯）
- **Sveltia CMS** 三語編輯介面
- **Content Collections** 架構（未來可擴充欄位、加入更多 collection）
- **部署就緒**：push 到 GitHub → Netlify 自動 build → CDN 部署
- **技能庫歸檔**：BUILD_LOG_SOP.md + une-liaison/PROJECT_NOTES.md

### 部署路徑

```
編輯內容（CMS GUI / 本地 Markdown）
    ↓
git commit → git push
    ↓
Netlify 偵測 push
    ↓
npm run build → 65 pages
    ↓
CDN 部署完成 ✅
```