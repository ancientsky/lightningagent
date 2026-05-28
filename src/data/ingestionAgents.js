import { Globe, ScanText, AudioLines, ShieldCheck } from 'lucide-react';

// Multimodal ingestion agents (OASIS proposal slide 5). Each agent has its own
// simulated use case: input → processing steps → output, with a confidence score.
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
