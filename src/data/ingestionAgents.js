import { Globe, ScanText, AudioLines, ShieldCheck } from 'lucide-react';

// Multimodal ingestion agents (OASIS proposal slide 5). Each agent has its own
// simulated use case: input → processing steps → output, with a confidence score.

// Shared icon/tint/blurb metadata per agent type
const AGENT_META = {
  web:  { id: 'web',  code: 'WEB',  name: '網頁爬取 Agent',   icon: Globe,         tint: 'teal', blurb: 'WHO · ECDC · US CDC · beaconbio 等 8 來源，結構化擷取疫情訊號。',         sources: ['WHO DON','ECDC Threats','US CDC HAN','ProMED-mail','beaconbio.org','Reuters Health','PAHO','NIDSS'] },
  ocr:  { id: 'ocr',  code: 'OCR',  name: 'OCR 圖像 Agent',   icon: ScanText,      tint: 'clay', blurb: '截圖、海報、公告影像的外文文字辨識，把圖片變成可分析文字。',                 sources: ['LINE 群組截圖','官方海報照片','報紙翻拍','記者會投影片'] },
  av:   { id: 'av',   code: 'AV',   name: '語音影音 Agent',   icon: AudioLines,    tint: 'amber', blurb: 'YouTube 短影片、podcast 自動轉錄 + 內容分析，攔截影音型不實訊息。',      sources: ['YouTube Shorts','TikTok','Podcast','直播剪輯'] },
  fact: { id: 'fact', code: 'FACT', name: '假新聞偵測 Agent', icon: ShieldCheck,   tint: 'rose', blurb: '跨來源交叉查證，標記矛盾與不實訊息，附信心分數供研判。',                   sources: ['社群平台','通訊軟體轉傳','內容農場','可疑新聞站'] },
};

export const INGESTION_AGENTS = [
  {
    id: 'web',
    code: 'WEB',
    name: '網頁爬取 Agent',
    icon: Globe,
    tint: 'teal',
    blurb: 'WHO · ECDC · US CDC · beaconbio 等 8 來源，結構化擷取疫情訊號。',
    sources: ['WHO DON', 'ECDC Threats', 'US CDC HAN', 'ProMED-mail', 'beaconbio.org', 'Reuters Health', 'PAHO', 'NIDSS'],
    demo: {
      label: '模擬案例 · 烏干達伊波拉',
      inputKind: 'HTML',
      input: 'beaconbio.org › Uganda Ministry of Health confirms 12 cases of Ebola Bundibugyo virus in Kasese district …',
      steps: ['抓取頁面 DOM', '去除導覽 / 廣告雜訊', '抽取正文 + metadata', '結構化為疫情訊號'],
      output: {
        title: '結構化訊號',
        fields: [
          ['疾病', 'Ebola (BDBV)'],
          ['地點', 'Kasese, 烏干達'],
          ['病例', '12 例 / 3 死'],
          ['來源時間', '2026-05-28 08:14Z'],
        ],
      },
      confidence: 0.96,
    },
  },
  {
    id: 'ocr',
    code: 'OCR',
    name: 'OCR 圖像 Agent',
    icon: ScanText,
    tint: 'clay',
    blurb: '截圖、海報、公告影像的外文文字辨識，把圖片變成可分析文字。',
    sources: ['LINE 群組截圖', '官方海報照片', '報紙翻拍', '記者會投影片'],
    demo: {
      label: '模擬案例 · 西語衛生公告海報照片',
      inputKind: 'IMAGE',
      input: '[ 影像 ] Ministerio de Salud — Alerta: brote de hantavirus Andes en El Bolsón (民眾於 LINE 群組轉傳之海報照片)',
      ocrRaw: 'MINISTERIO DE SALUD\nALERTA EPIDEMIOLÓGICA\nBrote de hantavirus (ANDV) — El Bolsón, Río Negro\n7 casos confirmados · 2 fallecidos',
      steps: ['影像前處理 / 去歪斜', 'OCR 文字辨識（西語）', '翻譯為中文', '比對既有訊號去重'],
      output: {
        title: '辨識 + 翻譯結果',
        fields: [
          ['原文語言', '西班牙語'],
          ['辨識內容', 'ANDV 疫情警示海報'],
          ['擷取訊號', 'El Bolsón 7 例 / 2 死'],
          ['關聯事件', '已比對 → Andes hantavirus'],
        ],
      },
      confidence: 0.91,
    },
  },
  {
    id: 'av',
    code: 'AV',
    name: '語音影音 Agent',
    icon: AudioLines,
    tint: 'amber',
    blurb: 'YouTube 短影片、podcast 自動轉錄 + 內容分析，攔截影音型不實訊息。',
    sources: ['YouTube Shorts', 'TikTok', 'Podcast', '直播剪輯'],
    demo: {
      label: '模擬案例 · 瘋傳短影片',
      inputKind: 'VIDEO',
      input: '[ 短影片 0:42 ] 「機場已經淪陷！吉隆坡來的班機全部帶原 M痘，政府不敢講…」（轉發 3.2 萬次）',
      transcript: '…我跟你說啦，剛從吉隆坡回來的全都中了，機場根本不篩檢，這個病會空氣傳染，口罩都沒用…',
      steps: ['抽取音軌 / 自動轉錄', '語者 + 情緒分析', '事實主張抽取', '與權威來源比對'],
      output: {
        title: '內容分析',
        fields: [
          ['抽取主張', 'mpox「空氣傳染」「全機帶原」'],
          ['查證結果', '與事實不符（接觸傳染為主）'],
          ['風險標記', '影音型不實訊息 · 高擴散'],
          ['建議', '納入闢謠素材、知會風險溝通'],
        ],
      },
      confidence: 0.88,
    },
  },
  {
    id: 'fact',
    code: 'FACT',
    name: '假新聞偵測 Agent',
    icon: ShieldCheck,
    tint: 'rose',
    blurb: '跨來源交叉查證，標記矛盾與不實訊息，附信心分數供研判。',
    sources: ['社群平台', '通訊軟體轉傳', '內容農場', '可疑新聞站'],
    demo: {
      label: '模擬案例 · 社群瘋傳貼文',
      inputKind: 'CLAIM',
      claim: '「台南登革熱已經死了上百人，政府蓋牌不敢公布！」',
      crossCheck: [
        { src: 'NIDSS 法定傳染病系統', verdict: '本土群聚 14 例 · 0 死', match: false },
        { src: '台南市衛生局公告', verdict: '已啟動孳生源清除', match: false },
        { src: 'WHO / PAHO', verdict: '無對應通報', match: false },
      ],
      steps: ['抽取可查證主張', '多來源交叉比對', '矛盾偵測', '產生信心分數與判定'],
      output: {
        title: '查證判定',
        fields: [
          ['判定', '不實 — 死亡數誇大'],
          ['正確事實', '14 例本土 · 0 死亡'],
          ['矛盾來源', '3 / 3 權威來源不符'],
          ['建議', '即時闢謠 + 導流官網正確資訊'],
        ],
      },
      confidence: 0.93,
    },
  },
];

// ── 登革熱本土群聚情境專用 demo（台南東區 DENV-2 群聚）──
export const INGESTION_AGENTS_DENGUE = [
  {
    ...AGENT_META.web,
    demo: {
      label: '模擬案例 · 台南東區登革熱群聚通報',
      inputKind: 'HTML',
      input: 'nidss.cdc.gov.tw › 法定傳染病統計 › 登革熱 › 台南市東區本土群聚，DENV-2 血清型，累計 6 例確診，最近發病日 2026-05-27 …',
      steps: ['抓取 NIDSS 法傳頁面 DOM', '去除導覽 / 表格雜訊', '抽取病例數 / 血清型 / 地點', '結構化為疫情訊號'],
      output: {
        title: '結構化訊號',
        fields: [
          ['疾病', '登革熱 DENV-2（第二型）'],
          ['地點', '台南市東區（裕農里 / 東光里）'],
          ['病例', '6 例本土 · 0 死亡'],
          ['最近發病日', '2026-05-27'],
        ],
      },
      confidence: 0.97,
    },
  },
  {
    ...AGENT_META.ocr,
    demo: {
      label: '模擬案例 · 台南市衛生局警示公告截圖',
      inputKind: 'IMAGE',
      input: '[ 影像 ] 台南市政府衛生局 — 登革熱疫情警戒：東區確認本土群聚（LINE 群組轉傳之官方海報掃描圖）',
      ocrRaw: '臺南市政府衛生局\n登革熱疫情警戒通知\n【本土群聚確認】東區裕農里、東光里\n累計 6 例確診・血清型 DENV-2\n請民眾清除積水容器，發現症狀速就醫\n通報專線：06-2679751',
      steps: ['影像前處理 / 去歪斜', 'OCR 文字辨識（繁體中文）', '結構化重要欄位', '比對既有訊號去重'],
      output: {
        title: '辨識 + 擷取結果',
        fields: [
          ['來源', '台南市政府衛生局官方公告'],
          ['辨識內容', '東區登革熱群聚警戒通知'],
          ['擷取訊號', '6 例 DENV-2・裕農里 / 東光里'],
          ['關聯事件', '已比對 → dengue_cluster 同一事件'],
        ],
      },
      confidence: 0.94,
    },
  },
  {
    ...AGENT_META.av,
    demo: {
      label: '模擬案例 · 台南登革熱瘋傳短影片',
      inputKind: 'VIDEO',
      input: '[ 短影片 1:03 ] 「台南東區根本疫區！政府說 6 例是騙人的，我們里長說已經至少 50 人發燒，衛生局根本蓋牌！」（轉發 8.7 萬次）',
      transcript: '…我就住在裕農里，你知道嗎，昨天我鄰居也中了，隔壁棟三個人同時倒，政府說只有 6 例你信嗎？我問里長，他說至少 50 個，都被壓下來沒公布，什麼 DENV-2 根本已經突變了，會傳染給你家貓狗…',
      steps: ['抽取音軌 / 自動轉錄', '語者 + 情緒分析', '可查證主張抽取', '與 NIDSS / 衛生局資料比對'],
      output: {
        title: '內容分析',
        fields: [
          ['抽取主張', '「50 人發燒」「病例遭壓件」「可傳貓狗」'],
          ['查證結果', '官方通報 6 例、無動物傳染紀錄，主張不實'],
          ['風險標記', '影音型不實訊息 · 極高擴散（8.7 萬次轉發）'],
          ['建議', '即時闢謠 + 知會台南市衛生局發聲明'],
        ],
      },
      confidence: 0.91,
    },
  },
  {
    ...AGENT_META.fact,
    demo: {
      label: '模擬案例 · 台南登革熱死亡蓋牌謠言',
      inputKind: 'CLAIM',
      claim: '「台南東區登革熱死亡人數已超過 50 人，衛生局黑箱作業刻意不公布！政府都在說謊！」',
      crossCheck: [
        { src: 'NIDSS 法定傳染病系統', verdict: '台南市東區本土群聚 6 例・0 死亡', match: false },
        { src: '台南市衛生局公告', verdict: '確認 6 例 DENV-2，孳生源清除進行中', match: false },
        { src: 'WHO / PAHO 通報', verdict: '未收到台灣登革熱死亡異常通報', match: false },
      ],
      steps: ['抽取可查證主張', 'NIDSS + 衛生局 + WHO 三源交叉比對', '矛盾偵測', '產生信心分數與判定'],
      output: {
        title: '查證判定',
        fields: [
          ['判定', '不實 — 死亡數嚴重誇大'],
          ['正確事實', '6 例本土・0 死亡（NIDSS 即時資料）'],
          ['矛盾來源', '3 / 3 權威來源皆不符'],
          ['建議', '即時發布闢謠公告 + LINE 官方帳號導流正確資訊'],
        ],
      },
      confidence: 0.96,
    },
  },
];
