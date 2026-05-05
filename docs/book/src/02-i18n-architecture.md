# Phase 1：三國語言 Content Collection 架構

## 任務

建立 Astro Content Collections，讓內容脫離程式碼，成為獨立的 Markdown 檔案，並支援三語 i18n。

## 協作過程

**Human:** 「我要把內容從 content.ts 移出，改成 Markdown 檔案放在 content/ 目錄，三個語言。」

**AI:** 建議用 Astro v6 的 `content.config.ts` + glob loader，一次定義三個 collection（products / news / blog）。

**Human:** 「三個 collection 太多了，有沒有辦法用一個 collection 含三個語言？」

**AI:** 建議一個 collection，filename 區分語言（如 `taiwan-pineapple.zh.md`），YAML frontmatter 內放 `_ja`、`_en` 後綴欄位。

**Human:** 「好，就這樣做。」

## 最終做法

```
src/content.config.ts       ← Astro v6 glob loader
src/content/
├── products/               ← 12 檔（4 products × 3 languages）
├── news/                    ← 9 檔（3 news × 3 languages）
└── blog/                    ← 12 檔（4 blog × 3 languages）
```

Collection schema：

```typescript
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

## 關鍵決策

| 決策 | 原因 |
|---|---|
| `content.config.ts` 放根目錄 | Astro v6 要求 loader-based config 必須在根目錄 |
| Filename `slug.lang.md` | Sveltia CMS i18n `multiple_files` 模式以副檔名判斷語言 |
| YAML 雙語欄位命名 `_ja` / `_en` | 避免與日文 `title` 欄位衝突 |

## 關鍵檔案

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