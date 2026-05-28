// Shared data for the airport quarantine station dashboard mockup (⑦ Delivery).
// The flight board is a *station-level* live view spanning every monitored
// threat at once; the alert banner + the highlighted flight row are driven by
// the currently selected scenario.

export const STATION = {
  airport: '桃園國際機場',
  name: 'T1 檢疫站',
  workstation: 'A04',
  officer: '林檢疫官',
  version: 'v2.6.3',
};

// level: normal | low | mid | high
// scenario: links a row to a scenario id so the board can highlight the flight
// relevant to whichever scenario is currently selected.
export const FLIGHTS = {
  arrived: [
    { time: '13:20', code: 'CX465', dest: '香港 HKG', level: 'normal', gate: 'A12' },
    { time: '13:50', code: 'AK328', dest: '吉隆坡 KUL', level: 'mid', tag: 'M痘衛教', gate: 'A06', scenario: 'mpox_malaysia' },
    { time: '14:05', code: 'JL807', dest: '東京成田 NRT', level: 'normal', gate: 'A14' },
  ],
  upcoming: [
    { time: '14:45', code: 'TG632', dest: '曼谷 BKK', level: 'low', gate: 'A03' },
    { time: '15:30', code: 'BR716', dest: '河內 HAN', level: 'normal', gate: 'B03' },
    { time: '17:55', code: 'CI725', dest: '金邊 PNH', level: 'mid', tag: 'H5N1 監測', gate: 'B07', scenario: 'h5n1_cambodia' },
    { time: '18:15', code: 'MH366', dest: '吉隆坡 KUL', level: 'mid', tag: 'M痘衛教', gate: 'A06', scenario: 'mpox_malaysia' },
    { time: '21:30', code: 'EK367+CI105', dest: '杜拜 DXB', note: '轉自烏干達 EBB', level: 'high', tag: 'Ebola 強化篩查', gate: 'B12', scenario: 'ebola_bundibugyo' },
    { time: '23:55', code: 'PR890', dest: '宿霧 CEB', level: 'low', tag: '登革熱衛教', gate: 'A08', scenario: 'dengue_philippines' },
  ],
};

// Dark-theme badge styling per flight risk level (literal class strings so
// Tailwind can pick them up at build time).
export const FLIGHT_LEVELS = {
  normal: { label: '一般', cls: 'bg-slate-600/40 text-slate-300 border-slate-500/40' },
  low: { label: '低', cls: 'bg-yellow-500/15 text-yellow-200 border-yellow-500/30' },
  mid: { label: '中', cls: 'bg-amber-500/20 text-amber-200 border-amber-500/40' },
  high: { label: '高', cls: 'bg-rose-500/25 text-rose-200 border-rose-500/50' },
};

// Cross-disease differential quick-check reference shown at the station.
export const DIFFERENTIAL = [
  { d: 'Ebola', s: '出血傾向 + 高燒 + 東非' },
  { d: 'M痘', s: '皮疹 + 淋巴結 + 東南亞' },
  { d: 'H5N1', s: '呼吸症狀 + 禽鳥接觸' },
  { d: 'Andes', s: '呼吸窘迫 + 南美 + 鼠類' },
  { d: '登革熱', s: '高燒 + 後眼窩痛' },
];

export const REPORT_CONTACTS = [
  { k: '值班醫師', v: '分機 #1234' },
  { k: '疾管署 24h', v: '1922' },
  { k: '隔離室', v: 'T1-B2F' },
];

export const PRIORITY_LABELS = {
  critical: '最高關注',
  high: '高度關注',
  standard: '一般關注',
};

// Dark-theme score badge + dot per risk level.
export const EVENT_LEVELS = {
  high: { badge: 'bg-rose-500/25 text-rose-200 border border-rose-500/50', dot: 'bg-rose-500' },
  'medium-high': { badge: 'bg-orange-500/25 text-orange-200 border border-orange-500/50', dot: 'bg-orange-500' },
  medium: { badge: 'bg-amber-500/20 text-amber-200 border border-amber-500/40', dot: 'bg-amber-500' },
  low: { badge: 'bg-yellow-500/15 text-yellow-200 border border-yellow-500/30', dot: 'bg-yellow-400' },
};
