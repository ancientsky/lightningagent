// 90-day delivery roadmap & quantified outcomes (OASIS proposal slide 10).
export const MILESTONES = [
  {
    id: 'm1',
    tag: 'M1',
    span: 'Day 0–30',
    title: 'Sprint 0 · 快速見效',
    items: ['AI 翻譯潤稿', '訊息自動摘要', '版面自動排版'],
    accent: 'teal',
  },
  {
    id: 'm2',
    tag: 'M2',
    span: 'Day 30–60',
    title: 'HITL 流程上線',
    items: ['雙閘門正式接上', '跨部會試行', '真實 user testing'],
    accent: 'amber',
  },
  {
    id: 'm3',
    tag: 'M3',
    span: 'Day 60–90',
    title: '4 受眾 + 跨部會',
    items: ['機場 · 長官 · 民眾 · 媒體', 'A2A/MCP 部會介接', '群聚應變全鏈打通'],
    accent: 'clay',
  },
];

export const METRICS = [
  { id: 'speed', from: '4–8h', to: '30min', mult: 16, label: '新聞 → 發布速度', desc: '一則疫情從進來到 4 受眾全發布' },
  { id: 'attention', from: '200', to: '20', mult: 10, label: '疫情官注意力', desc: '從每日篩 200 則，校準成 20 則高風險情資' },
  { id: 'draft', from: '2h', to: '10min', mult: 12, label: '研判 + 撰稿', desc: '單件研判與差異化撰稿工時' },
  { id: 'a2a', from: '公文數天', to: '即時', mult: null, label: '跨部會訊息流', desc: '以 A2A / MCP 取代紙本公文往返' },
];

export const ROADMAP_INTRO = '會動，還要會落地。把它切成三個 sprint，每一個月都交付看得見的成果。';
