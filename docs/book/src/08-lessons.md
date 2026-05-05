# 成功模式總結

## 人機協作流程

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

## 關鍵決策

| 決策 | 價值 |
|---|---|
| Content Collection 而非寫死數組 | 內容可獨立管理、版本控制、協作 |
| Sveltia CMS + GitHub backend | 編輯內容等於 git commit，自動觸發 rebuild |
| `multiple_files` i18n 模式 | 三語編輯在同一介面，檔案分開好維護 |
| `public/admin/index.html` 而非 `.astro` | 繞過 build tool，CMS script 正確載入 |
| `git init` 讓 File System Access API 工作 | 不需要 proxy，本機直接寫檔案 |

## 正確做法

| 不要這樣做 | 應該這樣做 |
|---|---|
| `backend: test-repo` | `backend: github`（寫入 repo，不是 localStorage） |
| 在 `.astro` 頁面放 CMS script | 在 `public/admin/index.html` 放 CMS |
| `entry.render()` | `render(entry)` from `astro:content` |
| `src/content/config.ts`（v6 舊位置） | `src/content.config.ts`（v6 新位置） |
| `type="module"` + Astro bundle 處理 | `type="module"` + 有屬性的 script 保留原樣 |

## 最終成果

- **65 頁**靜態網站（3 languages × ~22 pages）
- **33 個 Markdown 檔案**（可透過 Sveltia CMS 編輯）
- **Sveltia CMS** 三語編輯介面
- **Content Collections** 架構
- **部署就緒**：push 到 GitHub → Cloudflare Pages 自動 build

## 部署路徑

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