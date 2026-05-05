# Daily Log — 2026-05-05

## Goal
Rebuild une-liaison.com with full CMS backend: trilingual products/news/blog with editable markdown content, image upload, detail pages, and Sveltia CMS admin panel (Chinese-only backend).

## What Was Done Today

### Completed

1. **Astro Content Collections setup** — Created `src/content.config.ts` with loaders for `products`, `news`, `blog` collections using the Astro v6 glob loader pattern.

2. **Product markdown files** — Created 12 files (4 products × 3 locales):
   - `src/content/products/taiwan-pineapple.{zh,ja,en}.md`
   - `src/content/products/taiwan-mango.{zh,ja,en}.md`
   - `src/content/products/aomori-apple.{zh,ja,en}.md`
   - `src/content/products/dragon-fruit.{zh,ja,en}.md`

3. **News markdown files** — Created 9 files (3 articles × 3 locales):
   - `src/content/news/2026-03-15-pineapple-record.{zh,ja,en}.md`
   - `src/content/news/2026-03-01-mango-season.{zh,ja,en}.md`
   - `src/content/news/2026-02-20-team-hiring.{zh,ja,en}.md`

4. **Blog markdown files** — Created 12 files (4 articles × 3 locales):
   - `src/content/blog/taiwan-pineapple-secret.{zh,ja,en}.md`
   - `src/content/blog/mango-irwin.{zh,ja,en}.md`
   - `src/content/blog/fuji-apple.{zh,ja,en}.md`
   - `src/content/blog/dragon-fruit-tropical.{zh,ja,en}.md`

5. **Sveltia CMS config** — Created `public/admin/config.yml` with:
   - `i18n: structure: multiple_files` — each locale = separate file (`.zh.md`, `.ja.md`, `.en.md`)
   - `locales: [zh, ja, en]`, `default_locale: zh`
   - Collections: `products`, `news`, `blog` — all with `i18n: true`
   - `local_backend: true` (test-repo mode, no GitHub needed yet)
   - `media_folder: public/images` with image upload support
   - Hidden `locale` field with `{{locale}}` default + `i18n: duplicate`
   - All labels in Chinese for the Chinese-only CMS backend

6. **Detail pages** — Created:
   - `src/pages/[lang]/news/[slug].astro` — news article detail
   - `src/pages/[lang]/blog/[slug].astro` — blog article detail

7. **Updated list pages** to read from content collections:
   - `news.astro` — now uses `getCollection('news')` filtered by locale, sorted by date, links to detail pages
   - `blog.astro` — now uses `getCollection('blog')` filtered by locale, sorted by date, links to detail pages
   - `products.astro` — now uses `getCollection('products')` filtered by locale
   - `products/[slug].astro` — now uses `render()` from `astro:content`, shows image + full markdown body

8. **Simplified i18n files** — Removed `articles` arrays from `zh.ts`, `ja.ts`, `en.ts` news/blog sections (content moved to markdown).

9. **Deleted orphaned file** — `src/data/articles.ts` (no longer referenced).

10. **Build successful** — 65 pages built (`npm run build`).

### Key Technical Decisions

- **Astro v6 content API**: Used `render(entry)` from `astro:content` (not `entry.render()`) — the legacy API was removed in v6.
- **File naming convention**: `slug.locale.md` e.g. `taiwan-pineapple.zh.md` — the `.` in the filename is part of the entry ID.
- **YAML quoting**: All title/excerpt fields containing colons or special chars are wrapped in double quotes to avoid YAML parse errors.
- **`getStaticPaths`**: Hardcoded slugs list per collection — avoids dynamic slug enumeration issues with Astro content collections.

### Build Output
```
65 pages built in 1.10s
```

---

## Remaining Work

1. **Fix `entry.id` slug extraction in news.astro / blog.astro** — The current code uses `entry.id.replace(/\.zh$|\.ja$|\.en$/, '')` but this is fragile. For news entries where the ID is `2026-03-15-pineapple-record.zh.md`, the `.zh` suffix IS part of the locale marker. Need to properly extract the slug by removing the `.{locale}` suffix. Currently working but needs cleanup.

2. **Product detail pages** — The `products/[slug].astro` page uses `entry.id.startsWith(slug)` which may have issues since `entry.id` includes locale suffix. Need to verify the slug matching works correctly across all 3 locales.

3. **CMS image paths** — `image: /images/products/taiwan-pineapple.jpg` in markdown frontmatter references images that don't exist yet in `public/images/`. Need placeholder images or the user needs to upload via CMS.

4. **Update `src/pages/index.astro`** — The root index page still uses the old `src/data/content.ts` products array instead of content collections.

5. **Ja.ts cleanup** — Still has some Chinese characters and grammar issues noted in previous context:
   - Line 60: `发展有限公司` (Chinese)
   - Line 66: `也是如此です` grammar
   - Line 103: `其独有的`

6. **`src/data/content.ts`** — The `products` array in `content.ts` is now only referenced by the root `index.astro`. Should migrate that page to content collections as well.

7. **Verify detail page links** — Confirm that news.astro and blog.astro are correctly linking to `/zh/news/slug` etc.

8. **CMS admin testing** — Test `/admin` in dev mode (`npx astro dev`) to verify Sveltia CMS loads and can edit content.

---

## File Summary

| Files Created/Modified | Count |
|---|---|
| Content config | 1 (`src/content.config.ts`) |
| Product markdown | 12 |
| News markdown | 9 |
| Blog markdown | 12 |
| Sveltia CMS config | 1 (`public/admin/config.yml`) |
| Detail pages created | 2 |
| List pages updated | 4 |
| i18n files simplified | 3 |
| Files deleted | 1 |
| **Total** | **~45 new/modified files** |
