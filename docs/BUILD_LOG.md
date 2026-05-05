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

### 協作過程

**Human:** 「About 頁面的內容我想動態化，現在是吃 companyInfo，我想要支援多語言。」

**AI:** 建議廢除 `companyInfo`，About 頁面直接用 `t.about.*` 的 i18n 字典。將 `about.astro` 的 `companyInfo` 參照全部替換成翻譯 key。

**Human:** 「好，做吧。」

**AI:** 注意到 `companyInfo` 結構複雜，有些欄位（如 `certifications`）在 `i18n/zh.ts` 裡只有中文沒翻譯。決定把 `certifications`、`partners`、`sustainability` 全部搬到 i18n 字典。

**Human:** 「我想要翻譯日文版，請更新 ja.ts。」

**AI:** 產生了一個日文翻譯初稿，但夾雜了中文（`发展有限公司`、`也是如此です`、`其独有的`）。

**Human:** 「有殘留中文，請清理。」

**AI:** 修正了 ja.ts，但仍有殘留。

### 最終做法

About 頁面從 `i18n/{lang}.ts` 的 `t.about.*` 讀取所有欄位：
```astro
const t = useTranslations(Astro.params.lang);
const company = t.about;
---
<h1>{company.name}</h1>
<p>{company.description}</p>
```

### 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `src/pages/[lang]/about.astro` | 移除 `companyInfo` 依賴，改用 `t.about.*` |
| `src/i18n/zh.ts` | 加入 `about.certifications`、`about.partners` 等 |
| `src/i18n/ja.ts` | 同上，有殘留中文待清理 |
| `src/i18n/en.ts` | 同上 |

### 待處理

| 問題 | 狀態 |
|---|---|
| `ja.ts` 殘留中文（`发展有限公司`等） | ⏳ 待清理 |

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

## Phase 5：CMS 調試與成功模式

### 任務

讓 Sveltia CMS 正常運作，確認可以在本機環境開啟並讀取內容。

### 協作過程

**Human:** 「CMS 開不起來，空白畫面。」

**AI:** 檢查 `admin.astro`，懷疑是 Astro 的 `<script>` 處理問題。標準 Astro script 會被 Vite bundle，但 Sveltia CMS 是 CDN 的 ES module，需要原始 URL 不要被處理。

**Human:** 「有看到你說的 `type="module"` 的問題嗎？」

AI 確認 `<script>` 標籤帶有 `type="module"` 屬性時，Astro 不會處理它，保留原樣。但一開始忘記加 `type` 屬性，後來補上了。

**Human:** 「加了 type="module" 還是空白。」

AI 再次檢查，發現可能是路徑問題。建議把 `src/pages/admin.astro` 改成完全靜態的 HTML，不要讓 Astro 處理任何部分：
```astro
---
// 空的 frontmatter
---
<!doctype html>
<html>
<head>
  <link rel="cms-config-url" href="/admin/config.yml">
  <script type="module" src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
</head>
<body>Loading...</body>
</html>
```

**Human:** 「空白，而且 console 有錯誤。」

AI 懷疑路徑問題。嘗試把 `/admin/config.yml` 改成 `/admin/index.html` 在瀏覽器直接開。確定是路徑問題後，嘗試了各種方法。

**Human:** 「有看到 Sveltia CMS 有自己的 `index.html` 嗎？直接用那個。」

AI 找到了！Sveltia CMS 的 CDN 有提供一個 `index.html`，裡面已經有完整的 loading 畫面和 script 標籤。需要做的只是提供 `<link rel="cms-config-url">` 讓它找到 config。

**Human:** 「好，試試看。」

修改 `admin.astro`，把所有 HTML 改成 `<!-- -->` 注释，變成純粹的 shell：
```astro
---
---
<!-- <!doctype html> -->
<!-- <html lang="en"> -->
<!-- <head> -->
  <link rel="cms-config-url" href="/admin/config.yml">
  <title>Content Manager</title>
<!-- </head> -->
<!-- <body> -->
  <p>Loading Sveltia CMS...</p>
  <script type="module" src="https://unpkg.com/@sveltia/cms/dist/sveltia-cms.js"></script>
<!-- </body> -->
<!-- </html> -->
```

**Human:** 「還是不行，有看到錯誤訊息嗎？」

AI 請 Human 在瀏覽器 console 看錯誤，Human 貼了錯誤：
```
Failed to load module
```

AI 懷疑是 CORS 或路徑問題。參考了另一個網站 travel.minglab.tw 的實作，發現它們是用 `window.location.origin` 動態湊路徑。

**Human:** 「看錯誤，應該是路徑問題。」

AI 看了 Sveltia CMS 的文檔，發現文檔提到「File System Access API needs a local server (localhost)，not file:// protocol」。dev server 需要開著。

**Human:** 「dev server 有開著。」

AI 嘗試了另一個方式：不要從 Astro 頁面載入 CMS，直接提供一個 static HTML 檔案在 `public/admin/index.html`。但 Astro 會處理 `.astro` 檔案，或許干擾了 script 標籤。

**Human:** 「直接建立 `public/admin/index.html`。」

建立 `public/admin/index.html`：
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

成功關鍵：`public/admin/index.html` 繞過了 Astro 的處理，讓 Sveltia CMS 的 script 原始 URL 被正確載入。

**Human:** 「現在試用『Work with Local Repository』功能，選擇專案目錄。」

Human 點了「Work with Local Repository」，選擇了 `/Users/yezhiming/une-liaison` 目錄。CMS 正確讀到了 `src/content/products/taiwan-pineapple.zh.md` 等 33 個檔案。

### 成功模式

```
1. CMS 入口：用 static HTML（public/admin/index.html）而不是 .astro
2. 路徑：`/admin/config.yml` 讓 CMS 找到 collection 定義
3. 條件：dev server 運行中 + 專案根目錄有 .git（File System Access API 需要）
4. 瀏覽器：Chrome/Edge/Brave（File System Access API 僅支援 Chromium）
```

### 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `public/admin/index.html` | ✅ 新建（成功關鍵，繞過 Astro script 處理） |
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

修復改造過程中遺留的四個前端問題。

### 協作過程

**Human:** 「Phase 7 還有四個待辦，先總結再處理。」

**AI:** 列出四項：
1. 首頁仍用 `content.ts`（舊數組）而非 content collection
2. `ja.ts` 有殘留中文
3. detail 頁 slug 用 `startsWith` 比對，可能匹配錯誤
4. 產品圖片 placeholder 缺失

**Human:** 「一次做完再存檔。」

### 最終做法

1. **首頁改用 content collection**：移除 `import { products } from '../../data/content'`，改用 `getCollection('products')` + `filter(locale === lang)` + `slice(0, 4)`
2. **ja.ts 清理**：修正 7 處殘留中文/韓文/俄文（`发展有限公司` → `発展`、`목적` → `目的`、`Поједина` → `お問い合わせ` 等）
3. **slug 精確比對**：所有 detail 頁從 `e.id.startsWith(slug)` 改為 `e.id === `${slug}.${lang}``
4. **圖片 placeholder**：建立 4 個 SVG（taiwan-pineapple / taiwan-mango / aomori-apple / dragon-fruit），更新所有 product markdown 的 `image:` 路徑從 `.jpg` 改 `.svg`

### 關鍵決策

| 決策 | 原因 |
|---|---|
| SVG 而非 JPG placeholder | SVG 可縮放、檔案小、不需外部圖床 |
| `===` 精確比對而非 `startsWith` | 避免 `taiwan-pineapple` 同時匹配 `taiwan-pineapple` 和 `taiwan-pineapple-special` |

### 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `src/pages/[lang]/index.astro` | ✅ 改用 `getCollection` |
| `src/i18n/ja.ts` | ✅ 7 處殘留中文清理 |
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

## Phase 9：部署準備

### 任務

更新部署設定，從 GitHub Pages 改為 Cloudflare Pages。

### 最終做法

1. **更新 `.github/workflows/deploy.yml`**：改用 `cloudflare/pages-action@v1`
2. **更新 `astro.config.mjs`**：加入 `site: 'https://une-liaison.com'`
3. **新建 `wrangler.toml`**：Cloudflare Workers 設定

### 待辦（需手動完成）

| 項目 | 狀態 |
|---|---|
| GitHub Repo 建立（`gimmi520/une-liaison`） | ⏳ 待手動 |
| Cloudflare Pages 專案建立 | ⏳ 待手動 |
| DNS 網域指向 | ⏳ 待手動 |
| Secrets 設定（`CLOUDFLARE_ACCOUNT_ID`） | ⏳ 待手動 |

### 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `.github/workflows/deploy.yml` | ✅ Cloudflare Pages |
| `astro.config.mjs` | ✅ 加入 site URL |
| `wrangler.toml` | ✅ 新建 |

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

### 正確做法

| 不要這樣做 | 應該這樣做 |
|---|---|
| `backend: test-repo` | `backend: github`（寫入 repo，不是 localStorage） |
| 在 `.astro` 頁面放 CMS script | 在 `public/admin/index.html` 放 CMS |
| `entry.render()` | `render(entry)` from `astro:content` |
| `src/content/config.ts`（v6 舊位置） | `src/content.config.ts`（v6 新位置） |
| `type="module"` + Astro bundle 處理 | `type="module"` + 有屬性的 script 保留原樣 |

### 最終成果

- **65 頁**靜態網站（3 languages × ~22 pages）
- **33 個 Markdown 檔案**（可透過 Sveltia CMS 編輯）
- **Sveltia CMS** 三語編輯介面
- **Content Collections** 架構（未來可擴充欄位、加入更多 collection）
- **部署就緒**：push 到 GitHub → Cloudflare Pages 自動 build
- **技能庫歸檔**：BUILD_LOG_SOP.md + une-liaison/PROJECT_NOTES.md

### 部署路徑

```
編輯內容（CMS GUI）
    ↓
Save → GitHub API commit
    ↓
Cloudflare Pages 偵測 push
    ↓
npm run build → 65 pages
    ↓
CDN 部署完成 ✅
```