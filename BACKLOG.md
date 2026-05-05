---
kanban-plugin: basic
---
## Next
- [ ] 第一階段：硬體散熱 + ZRAM + Swap 設定 [added::2026-04-06] #樹莓派AI #優先級/高
- [ ] 第二階段：安裝 Ollama + Qwen 3.5 4B [added::2026-04-06] #樹莓派AI #優先級/高
- [ ] 補齊各個頁面的真實文案 (目前為假文案) [added::2026-04-03]

## In Progress
- [ ] 🛠️ 樹莓派 5 AI 指揮中心部署（SOP 見 `5_系統與技能備份/2026-04-06_樹莓派5_AI指揮中心部署_SOP.md`）[added::2026-04-06] #樹莓派AI #優先級/最高
- [ ] 調整 Header 的 Edge Glow 滾動特效 [added::2026-04-03]

## In Review

## Backlog
- [ ] 將 Home Assistant 的 API 串接到網站前端 [added::2026-04-03]
- [ ] Docker Compose 佈署（n8n + OpenClaw）[added::2026-04-06] #樹莓派AI
- [ ] OpenClaw 子代理設定（本地 qwen + 雲端 minimax）[added::2026-04-06] #樹莓派AI
- [ ] 部署 Astro 網站到 Cloudflare Pages [added::2026-04-03]

## Done
- [ ] 將荔枝全面替換為青森蘋果主題 [added::2026-04-03]
- [ ] 建立 /src/data/articles.ts [added::2026-04-03]

## Cancelled
- [ ] 實作 n8n + AI 自動翻譯抓取優質外文文章的工作流 [added::2026-04-03]
- [ ] 在樹莓派上安裝 OpenClaw，並設定 Gemma 4 作為本地輕量級代理 (Agent) [added::2026-04-03] #已被樹莓派5 AI指揮中心計畫取代

---

## 📊 專案進度摘要

### 🛠️ 樹莓派 5 AI 指揮中心（第一優先 ⭐）
**目標**：在樹莓派 5 (8GB) 上穩定執行 1 本地 (Qwen 4B) + 2 雲端 (MiniMax 27B)

| 階段 | 狀態 | 說明 |
|------|------|------|
| 1. 硬體散熱 | ⏳ 待做 | Active Cooler + 27W 電源 + NVMe SSD |
| 2. ZRAM + Swap | ⏳ 待做 | 系統效能優化 |
| 3. Ollama + Qwen 4B | ⏳ 待做 | Host 安裝，設定 OLLAMA_HOST=0.0.0.0 |
| 4. Docker Compose | ⏳ 待做 | n8n (2G) + OpenClaw |
| 5. 子代理設定 | ⏳ 待做 | 本地 qwen / 雲端 minimax |

**SOP 文件**：`5_系統與技能備份/2026-04-06_樹莓派5_AI指揮中心部署_SOP.md`

---

*最後更新：2026-04-06 00:50*
