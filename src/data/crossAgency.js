import { Map, SprayCan, Shield, PackageCheck, Globe2 } from 'lucide-react';

// Cross-agency A2A/MCP orchestration (OASIS proposal slide 9). The cluster
// intelligence agent acts as a hub, dispatching machine-to-machine tasks to
// five ministries — compressing "公文旅行" into an instant message flow.
export const HUB = {
  name: '群聚情資 Agent',
  org: '疾管署',
  role: '協調中樞 · 即時派送',
  desc: '以 A2A（agent-to-agent）或 MCP 介接五個部會，把跨機關協調從紙本簽核變成即時訊息流。',
};

export const AGENCIES = [
  {
    id: 'land',
    ministry: '內政部 國土管理署',
    unit: '空屋空地圖資',
    role: '鎖定孳生源熱點、優先清除',
    icon: Map,
    tint: 'teal',
    protocol: 'MCP',
    call: 'mcp.land.queryVacantLots({ area:"台南東區", radius_m:200 })',
    ackMs: 600,
    eta: '即時回傳圖資',
    result: {
      headline: '12 處孳生源熱點',
      fields: [
        ['空屋', '7 處'],
        ['空地 / 畸零地', '5 處'],
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
    call: 'a2a.mofa.setTravelAdvisory({ region:"Tainan", level:"orange" })',
    ackMs: 2300,
    eta: '同步更新官網',
    result: {
      headline: '旅遊警示已調升',
      fields: [
        ['燈號', '黃 → 橙'],
        ['範圍', '台南市東區'],
        ['同步', '官網 / 領務系統'],
      ],
    },
  },
];

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
