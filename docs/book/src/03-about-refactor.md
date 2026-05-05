# Phase 2：About 頁面與 i18n 字典整理

## 任務

重構 About 頁面，讓它從 i18n 字典讀取動態資料，不再綁死在 `companyInfo` 物件。

## 協作過程

**Human:** 「About 頁面的內容我想動態化，現在是吃 companyInfo，我想要支援多語言。」

**AI:** 建議廢除 `companyInfo`，About 頁面直接用 `t.about.*` 的 i18n 字典。

**Human:** 「好，做吧。」

**AI:** 注意到 `companyInfo` 結構複雜，決定把 `certifications`、`partners`、`sustainability` 全部搬到 i18n 字典。

**Human:** 「我想要翻譯日文版，請更新 ja.ts。」

**AI:** 產生了一個日文翻譯初稿，但夾雜了中文（`发展有限公司`、`也是如此です`、`其独有的`）。

**Human:** 「有殘留中文，請清理。」

**AI:** 修正了 ja.ts，但仍有殘留。

## 最終做法

About 頁面從 `i18n/{lang}.ts` 的 `t.about.*` 讀取所有欄位：

```astro
const t = useTranslations(Astro.params.lang);
const company = t.about;
---
<h1>{company.name}</h1>
<p>{company.description}</p>
```

## 關鍵檔案

| 檔案 | 變更 |
|---|---|
| `src/pages/[lang]/about.astro` | 移除 `companyInfo` 依賴，改用 `t.about.*` |
| `src/i18n/zh.ts` | 加入 `about.certifications`、`about.partners` 等 |
| `src/i18n/ja.ts` | 同上 |
| `src/i18n/en.ts` | 同上 |

## 待處理

- `ja.ts` 殘留中文（`发展有限公司`等）— 待清理