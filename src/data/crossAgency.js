import { Map, SprayCan, Shield, PackageCheck, Globe2 } from 'lucide-react';

// Cross-agency A2A/MCP orchestration (OASIS proposal slide 9). A coordinating
// agent acts as a hub, dispatching machine-to-machine tasks to the relevant
// ministries — compressing "公文旅行" into an instant message flow. Which
// ministries are involved depends on the scenario.
export const HUBS = {
  dengue_cluster: {
    name: '群聚情資 Agent',
    org: '疾管署',
    role: '協調中樞 · 即時派送',
    desc: '以 A2A / MCP 介接相關部會，把跨機關協調從紙本簽核變成即時訊息流。',
  },
  ebola_bundibugyo: {
    name: '國際疫情情資 Agent',
    org: '疾管署',
    role: '協調中樞 · 跨機關通報',
    desc: '高致死率境外移入威脅，即時以 A2A 通報外交部調升疫區旅遊警示燈號。',
  },
};
export const HUB = HUBS.dengue_cluster;

const ALL_AGENCIES = [
  {
    id: 'land',
    ministry: '財政部 國有財產署',
    unit: '國有房地圖資',
    role: '鎖定國有閒置房地孳生源、優先清除',
    icon: Map,
    tint: 'teal',
    protocol: 'MCP',
    call: 'mcp.npa.queryIdleNationalProperty({ area:"台南東區", radius_m:200 })',
    ackMs: 600,
    eta: '即時回傳圖資',
    result: {
      headline: '12 處孳生源熱點',
      fields: [
        ['國有閒置房屋', '7 處'],
        ['國有空地 / 畸零地', '5 處'],
        ['優先清除', '已依風險排序'],
      ],
    },
  },
  {
    id: 'env',
    ministry: '環境部',
    unit: '戶外噴藥執行',
    role: '依熱點規劃噴藥範圍與排程',
    icon: SprayCan,
    tint: 'clay',
    protocol: 'A2A',
    call: 'a2a.env.planSpraying({ hotspots:12, priority:"high" })',
    ackMs: 1100,
    eta: '今晚啟動第 1 梯',
    result: {
      headline: '噴藥計畫已生成',
      fields: [
        ['範圍', '約 8.4 公頃 / 3 里'],
        ['排程', '3 梯次 · 72 小時內'],
        ['作業隊', '6 組同步'],
      ],
    },
  },
  {
    id: 'mnd',
    ministry: '國防部 化學兵',
    unit: '人力 · 機具支援',
    role: 'Agent 估算劑量 / 人力 / 工時',
    icon: Shield,
    tint: 'amber',
    protocol: 'A2A',
    call: 'a2a.mnd.estimateResources({ area_ha:8.4, density:"urban" })',
    ackMs: 1500,
    eta: '明晨集結待命',
    result: {
      headline: 'Agent 估算結果',
      fields: [
        ['殺蟲劑', '約 180 公升'],
        ['人力', '45 人 · 3 班'],
        ['預估工時', '36 小時（3 日）'],
      ],
    },
  },
  {
    id: 'trade',
    ministry: '經濟部 國際貿易署',
    unit: '化學藥劑審批',
    role: '進口藥劑快速審批、補足缺口',
    icon: PackageCheck,
    tint: 'teal',
    protocol: 'MCP',
    call: 'mcp.trade.expediteImport({ sku:"deltamethrin", qty_l:200 })',
    ackMs: 1900,
    eta: '48 小時內到貨',
    result: {
      headline: '快速審批通過',
      fields: [
        ['品項', 'Deltamethrin 200 L'],
        ['審批', '一般 7 日 → 即時核章'],
        ['缺口', '已補足'],
      ],
    },
  },
  {
    id: 'mofa',
    ministry: '外交部',
    unit: '旅遊警示提升',
    role: '同步調升疫區旅遊警示燈號',
    icon: Globe2,
    tint: 'rose',
    protocol: 'A2A',
    call: 'a2a.mofa.setTravelAdvisory({ region:"Uganda", level:"red" })',
    ackMs: 1400,
    eta: '同步更新官網',
    result: {
      headline: '旅遊警示已調升',
      fields: [
        ['燈號', '橙 → 紅'],
        ['範圍', '烏干達 Kasese 區'],
        ['同步', '官網 / 領務系統'],
      ],
    },
  },
];

// Which ministries each scenario dispatches to. Travel-advisory (外交部) belongs
// with the international Ebola threat; the domestic dengue cluster mobilises the
// four local ministries for vector control.
export const SCENARIO_AGENCIES = {
  dengue_cluster: ['land', 'env', 'mnd', 'trade'],
  ebola_bundibugyo: ['mofa'],
};

export function getAgencies(scenarioId) {
  return (SCENARIO_AGENCIES[scenarioId] || [])
    .map((id) => ALL_AGENCIES.find((a) => a.id === id))
    .filter(Boolean);
}

export const AGENCIES = ALL_AGENCIES;

// LINE 即時通知 — 各部會「人」的窗口（可勾選誰要收到通知）。
// A2A/MCP 是機器對機器，這一層是把同一則情資即時推給承辦窗口。
export const LINE_CONTACTS = [
  { id: 'land', ministry: '財政部 國有財產署', name: '王科長', role: '國有房地管理組', defaultOn: true },
  { id: 'env', ministry: '環境部', name: '李視察', role: '病媒蚊防治科', defaultOn: true },
  { id: 'mnd', ministry: '國防部 化學兵群', name: '陳少校', role: '災防支援組', defaultOn: false },
  { id: 'trade', ministry: '經濟部 國際貿易署', name: '林專員', role: '輸入管理組', defaultOn: false },
  { id: 'local', ministry: '臺南市政府 衛生局', name: '黃局長', role: '疾病管制科', defaultOn: true },
];

export const LINE_MESSAGE = {
  title: '【疾管署 · 群聚應變通報】',
  lines: [
    '臺南市東區登革熱本土群聚（DENV-2）',
    '確認 6 例 · 風險研判：高',
    '已啟動跨部會應變，請貴單位窗口確認任務並回報 ETA。',
  ],
  footer: '— OASIS 群聚情資 Agent 自動發送',
};

// 制式通知公文 — 由 agent 依群聚資料自動填入標準公文格式。
export const OFFICIAL_DOC = {
  org: '衛生福利部疾病管制署　函',
  meta: [
    ['發文日期', '中華民國 115 年 5 月 28 日'],
    ['發文字號', '疾管綜字第 1150528001 號'],
    ['速別', '最速件'],
    ['密等', '普通'],
    ['附件', '孳生源熱點清單、群聚個案地理分布圖'],
  ],
  to: '受文者：財政部國有財產署、環境部、國防部、經濟部國際貿易署、臺南市政府',
  subject: '主旨：為因應臺南市東區登革熱本土群聚疫情，請貴機關依權責協助跨機關應變事宜，請查照。',
  body: [
    '一、依傳染病防治法第 5 條及本署登革熱防治工作指引辦理。',
    '二、本署於 115 年 5 月 28 日確認臺南市東區登革熱本土群聚計 6 例（血清型 DENV-2），經三層風險研判為「高」風險，恐持續擴散。',
    '三、檢附孳生源熱點清單，請各機關配合辦理：（一）國有財產署提供國有閒置房地圖資；（二）環境部規劃並執行戶外噴藥；（三）國防部派遣化學兵支援人力機具；（四）國際貿易署協助化學藥劑快速審批。',
    '四、本案刻不容緩，相關協調同時透過 A2A / MCP 即時訊息流進行，本函為正式紀錄存查。',
  ],
  cc: '正本：如受文者；副本：本署疫情監測中心、臺南市政府衛生局',
};

export const FLOW_COMPARE = {
  before: {
    title: '舊做法的痛',
    points: [
      '公文旅行：每個部會各發一份函，紙本簽核一來一回好幾天',
      '人工協調：承辦電話打到手軟，資訊重複轉述、容易出錯',
      '劑量、人力、工時靠人工估算，易低估或延誤',
    ],
    metric: '數天',
  },
  after: {
    title: '我們要做的轉變',
    points: [
      '加快訊息流：群聚資訊一產生，即時推送給該知道的部會',
      '減少公文旅行：用 A2A / MCP 機器對機器交換，取代紙本往返',
      '減少人工：劑量、人力、工時由 agent 估算，承辦不再手算',
    ],
    metric: '即時',
  },
};
