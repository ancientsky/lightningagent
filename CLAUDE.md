# CLAUDE.md

給未來在此 repo 工作的 Claude / coding agent 的指引。先讀這份，再動手。

## 專案一句話

疾管署「國際疫情情資 Multi-Agent AI 系統」的**互動式概念驗證原型**：Vite + React 18 + Tailwind v3 的單頁網站，展示一則疫情訊息走完 8 階段 agent 管線、4 受眾差異化發布、再到跨部會 A2A/MCP 應變。部署在 GitHub Pages（`https://ancientsky.github.io/lightningagent/`）。**所有數據皆為模擬展示用，非真實疫情。**

## 指令

```bash
npm install      # 安裝
npm run dev      # 開發伺服器
npm run build    # 產出 dist/（提交前務必跑一次確認可建置）
npm run preview  # 預覽建置產物
```

沒有測試套件、沒有 lint script。改完後的驗證方式是 **`npm run build` 必須成功**（無編譯錯誤）。

## 架構心智模型

- **資料與展示嚴格分離**。`src/data/*.js` 是純資料；`src/components/` 只負責呈現與動畫。**改內容（情境、部會、指標、路線圖）優先動 `data/`，通常不必碰元件。**
- **`App.jsx` 是殼層**，持有全部互動狀態：目前 `scenarioId`、`stageId`、`hitl1Decisions`、`hitl2Decisions`、auto-demo 計時器、roadmap 開關。各階段視圖是受控元件，靠 props 接收 `scenario` 與決策狀態。
- **情境驅動（scenario-driven）**：UI 依當前 `scenario` 物件上的旗標切換行為。關鍵旗標：
  - `crossAgency: true` — 該情境會「啟用」跨部會階段。
  - `cluster: {...}` — 標示這是本土群聚情境（目前只有 `dengue_cluster`），會額外顯示三幕敘事、LINE 通知、制式公文、「公文旅行 vs 即時訊息流」對照。

## 關鍵資料檔（改東西先看這裡）

| 檔案 | 內容 | 常見修改 |
| --- | --- | --- |
| `src/data/scenarios.js` | 6 個情境的完整資料（raw / translated / classification / entities / risk / hitl1 / hitl2 / audiences …）。`SCENARIOS` 物件 + `SCENARIO_LIST` 順序陣列。 | 新增/修改情境、調整疫情數據或受眾文案 |
| `src/data/stages.js` | 8 階段定義（id / 名稱 / 圖示）。 | 增刪階段、改階段名稱 |
| `src/data/ingestionAgents.js` | 多模態四路 agent（WEB/OCR/AV/FACT）模擬案例。`INGESTION_AGENTS`（預設）+ `INGESTION_AGENTS_DENGUE`（台南登革熱專屬）。 | 改擷取/查證示意內容 |
| `src/data/crossAgency.js` | 部會清單、A2A/MCP 呼叫與回應、`HUBS`（各情境協調中樞）、`SCENARIO_AGENCIES` 映射、`getAgencies()`、LINE 通知、制式公文。 | 增刪部會、改派送對象 |
| `src/data/roadmap.js` | 90 天 M1/M2/M3 里程碑與量化指標。 | 改路線圖或指標 |
| `src/lib/ui.js` | 共用色彩 map（`sevColors`/`levelColors`/`tintMap`/`pillColors`）與 `getPublishStatus()`（依 HITL 閘門推導發布狀態）。 | 改配色語意、發布狀態邏輯 |

### 跨部會派送的資料流（容易踩雷）

哪些部會會出現在跨部會階段，由 `crossAgency.js` 的 `SCENARIO_AGENCIES` 映射決定，再透過 `getAgencies(scenarioId)` 取出。例如：

```js
export const SCENARIO_AGENCIES = {
  dengue_cluster: ['land', 'env', 'mnd', 'trade'], // 國內病媒防治四部會
  ebola_bundibugyo: ['mofa'],                       // 境外移入 → 外交部旅遊警示
};
```

要把某部會「移到另一個情境」時，改這個映射即可，不要在元件裡 hardcode。各情境的協調中樞文案在 `HUBS`。

## 慣例

- **語言**：UI 與資料以**繁體中文**為主（疾管署語境）；程式碼註解可中英混用。沿用既有用語與全形標點。
- **配色**：Claude 暖色 — `paper`（背景）、`clay`（主強調）、teal（系統/agent 語意輔色）、紅/琥珀/黃（風險語意）。新元件透過 `lib/ui.js` 的色彩 map 取色，**不要散落 hardcode 顏色**。
- **動畫**：用 framer-motion（`AnimatePresence` 做階段轉場）與 Tailwind keyframes（見 `tailwind.config.js`：shimmer / flowdash / breathe …）。新增動畫請尊重 `prefers-reduced-motion`。
- **圖示**：lucide-react。
- **註解**：預設不寫；只在「為什麼」非顯而易見時加一行。

## 部署注意事項

- 推 `main` → `.github/workflows/deploy.yml` 自動 build 並部署。**這是唯一的部署路徑**。
- `vite.config.js` 的 `base: '/lightningagent/'` 不可亂動（Pages 子路徑依賴它）。
- `public/.nojekyll` 不可刪（防 Jekyll 處理 `_` 開頭資產）。
- **不要**再加任何 Jekyll workflow，曾與 Vite build 衝突造成空白頁。
- 除非使用者明確要求，**不要開 PR**。

## 工作守則

1. 改完一定 `npm run build` 確認可建置。
2. 改情境/部會/指標等內容 → 先找 `src/data/` 對應檔，多半不必動元件。
3. 提交訊息用繁體中文、簡潔描述「為什麼」，沿用既有風格（見 `git log`）。
4. 推送依使用者指定分支；無特別說明時推 `main`。
