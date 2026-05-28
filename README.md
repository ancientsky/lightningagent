# OASIS · 國際疫情情資 Multi-Agent AI 系統（互動式 PoC）

> 疾病管制署「國際疫情情資 Multi-Agent AI 系統」概念驗證原型。
> 以可點按的互動網站，展示一則疫情訊息從**進來**到**多受眾發布**、再到**跨部會應變**的完整 agent 管線。
>
> 線上展示：**https://ancientsky.github.io/lightningagent/**
> （概念驗證展示，非正式系統）

---

## 這是什麼

把一個 2,940 行的單檔 React artifact，重寫成模組化、響應式（RWD）、Claude 暖色視覺風格、帶科技感動畫的網站。內容對應 OASIS 提案投影片，涵蓋：

- **8 階段 agent 管線**：多模態收集 → 處理 → 風險研判 → HITL① 分流審查 → 受眾撰稿 → HITL② 發布審查 → 遞送與審計 → 跨部會協作。
- **6 個真實情境**：Ebola Bundibugyo（烏干達）、Andes 漢他病毒、H5N1（柬埔寨）、Mpox（馬來西亞）、登革熱（菲律賓）、**登革熱本土群聚（台南）**。
- **多模態擷取**：四路 agent 分頭擷取與查證 — 網頁（WEB）、圖像 OCR、語音／影音轉錄（AV）、假新聞偵測（FACT），各附信心分數。
- **HITL 雙閘門**：可實際點按的人工審查決策，決策會影響下游各受眾的發布狀態。
- **跨部會 A2A / MCP 協作**：以「群聚情資 Agent」為協調中樞，把「公文旅行」壓縮成「即時訊息流」；附 LINE 即時通知與制式公文自動生成示意。
- **90 天三階段路線圖**：M1／M2／M3 與量化指標（16×／10×／12×／「公文數天 → 即時」）。
- **Auto Demo**：自動依序走完整條管線。

---

## 技術棧

| 項目 | 選型 |
| --- | --- |
| 建置工具 | Vite 5 |
| UI 框架 | React 18（JSX） |
| 樣式 | Tailwind CSS v3（PostCSS 正式建置，含自訂 `paper` / `clay` 暖色盤） |
| 動畫 | framer-motion |
| 圖示 | lucide-react |
| 部署 | GitHub Actions → GitHub Pages |

設計系統為 Claude 風格暖紙感（cream 背景）＋ 陶土／珊瑚色（clay）主強調，疾管署 teal 作為「系統／agent」語意輔色；尊重 `prefers-reduced-motion`。

---

## 本機開發

需求：Node 20+。

```bash
npm install        # 安裝相依套件
npm run dev        # 啟動開發伺服器（Vite，預設 http://localhost:5173）
npm run build      # 產出靜態 bundle 到 dist/
npm run preview    # 本機預覽已建置的產物
```

> 注意：`vite.config.js` 將 `base` 設為 `/lightningagent/`（GitHub Pages 專案站台子路徑）。本機 `npm run dev` 仍可正常運作；`npm run preview` 會以該子路徑提供服務。

---

## 專案結構

```
.
├─ index.html                  # 入口 HTML（載入 Google Fonts、掛載 #root）
├─ vite.config.js              # base: '/lightningagent/'
├─ tailwind.config.js          # paper / clay 色盤、字體、keyframes 動畫
├─ postcss.config.js
├─ public/.nojekyll            # 阻止 GitHub Pages 的 Jekyll 處理
├─ .github/workflows/deploy.yml# Actions：build → upload dist → deploy Pages
└─ src/
   ├─ main.jsx                 # React 進入點
   ├─ App.jsx                  # 殼層：scenario / stage / HITL / auto-demo 狀態
   ├─ index.css                # Tailwind 指令 + 字體 / 動畫
   ├─ data/                    # 純資料（與展示層分離）
   │  ├─ scenarios.js          # 6 情境的完整疫情資料
   │  ├─ stages.js             # 8 階段定義
   │  ├─ ingestionAgents.js    # 多模態 agent 模擬案例（含台南登革熱專屬一組）
   │  ├─ crossAgency.js        # 部會 A2A/MCP 協調、LINE 通知、制式公文資料
   │  └─ roadmap.js            # 90 天里程碑與量化指標
   ├─ lib/
   │  ├─ ui.js                 # 共用色彩 map、getPublishStatus()
   │  └─ hooks.js              # useClock()（LIVE mockup 時鐘）
   └─ components/
      ├─ ui.jsx                # Pill / Card / ConfidenceBar / AgentThinking …
      └─ stages/               # 各階段視圖
         ├─ Overview.jsx
         ├─ Ingestion.jsx      # 多模態四路 agent
         ├─ Pipeline.jsx
         ├─ Risk.jsx
         ├─ Hitl1.jsx
         ├─ Audience.jsx
         ├─ Hitl2.jsx
         ├─ Delivery.jsx
         ├─ CrossAgency.jsx    # 跨部會協作（依情境驅動）
         └─ Roadmap.jsx
```

**資料／展示分離**：`src/data/` 是純資料模組，所有疫情數據、風險研判、HITL 邏輯與部會資料都在這裡；`src/components/` 只負責呈現與動畫。要改情境內容或新增部會，多半只動 `data/`。

---

## 部署（GitHub Actions → Pages）

推送到 `main` 會觸發 `.github/workflows/deploy.yml`：checkout → setup-node(20) → `npm ci` → `npm run build` → 上傳 `dist/` → 部署到 GitHub Pages。

**首次需一次性設定**（無法以程式代為開啟）：
Repo **Settings → Pages → Source** 設為 **「GitHub Actions」**。
完成後網址為 `https://ancientsky.github.io/lightningagent/`。

> 早期曾有 GitHub 自動加入的 Jekyll workflow 與 Vite build 衝突（部署到未建置的原始碼），已移除；現僅 `deploy.yml` 一條部署路徑，並以 `public/.nojekyll` 關閉 Jekyll 處理。

---

## 備註

本專案為**概念驗證互動原型**，所有疫情數據、部會回應、信心分數等皆為**模擬展示資料**，非真實疫情或正式系統輸出。
