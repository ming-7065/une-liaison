# Phase 4：Content Collection 遷移與 Astro v6 修正

## 任務

把所有產品、新聞、部落格從 `content.ts` / `articles.ts` 數組遷移到 Markdown 檔案，建立完整的 detail 頁面。

## 協作過程

**Human:** 「現在要真的遷移內容了。之前 content.ts 裡有很多資料，要轉成 33 個 markdown 檔案。」

**AI:** 列出遷移項目：
- 4 products × 3 languages = 12 files
- 3 news × 3 languages = 9 files
- 4 blog posts × 3 languages = 12 files
- 總共 33 個 markdown 檔案

**Human:** 「好，請開始。」

AI 陸續建立所有 Markdown 檔案。

**Human:** 「我要有 detail 頁面，可以點進去看產品/新聞/部落格的完整內容。」

**AI:** 建立動態路由：
- `src/pages/[lang]/products/[slug].astro`
- `src/pages/[lang]/news/[slug].astro`
- `src/pages/[lang]/blog/[slug].astro`

**Human:** 「Astro 报错 `entry.render()` 是舊 API。」

AI 查了，發現 Astro v6 移除了 `entry.render()`，改成 `render(entry)` 從 `astro:content` 匯入。

**Human:** 「那就改成新的方式。」

## 最終做法

```astro
import { render } from 'astro:content';
const { Content } = await render(entry);
```

## 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `src/content/products/*.md` | ✅ 12 檔新建 |
| `src/content/news/*.md` | ✅ 9 檔新建 |
| `src/content/blog/*.md` | ✅ 12 檔新建 |
| `src/pages/[lang]/products/[slug].astro` | ✅ 新建 |
| `src/pages/[lang]/news/[slug].astro` | ✅ 新建 |
| `src/pages/[lang]/blog/[slug].astro` | ✅ 新建 |
| `src/pages/[lang]/products.astro` | ✅ 更新 |
| `src/pages/[lang]/news.astro` | ✅ 更新 |
| `src/pages/[lang]/blog.astro` | ✅ 更新 |