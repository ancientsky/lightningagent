import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Bell, Stethoscope, Siren, CheckCircle2, Clock } from 'lucide-react';
import { SCENARIOS, SCENARIO_LIST } from '../data/scenarios.js';
import {
  STATION, FLIGHTS, FLIGHT_LEVELS, DIFFERENTIAL, REPORT_CONTACTS,
  PRIORITY_LABELS, EVENT_LEVELS,
} from '../data/airportStation.js';
import { useClock } from '../lib/hooks.js';

const pad = (n) => String(n).padStart(2, '0');

export default function AirportDashboard({ scenario }) {
  const { now, timeStr, dateStr, weekday } = useClock();
  const a = scenario.outputs.airport;
  const c = scenario.classification;
  const l3 = scenario.risk.layer3;

  // Other international threats currently on the station's watch (domestic
  // clusters and the scenario in focus are excluded).
  const otherEvents = SCENARIO_LIST
    .filter((id) => id !== scenario.id && !SCENARIOS[id].cluster)
    .map((id) => {
      const s = SCENARIOS[id];
      return { id, name: s.name, region: s.region, score: s.risk.layer3.finalScore, level: s.risk.layer3.level };
    });

  const next = new Date(now.getTime() + 90_000);
  const nextStr = `${pad(next.getHours())}:${pad(next.getMinutes())}`;
  const [a0, a1] = scenario.id.split('_');
  const trace = `${a0}_${(a1 || '').slice(0, 2)}-mpp7vs`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl overflow-hidden border border-slate-800 bg-[#0b1322] text-slate-200 shadow-lift"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-slate-800/80">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-teal-600 flex items-center justify-center text-white text-xs font-bold shrink-0">疾</div>
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-100 truncate">{STATION.airport} · {STATION.name}</div>
            <div className="text-[11px] text-slate-400 truncate">工作站 {STATION.workstation} · {STATION.officer}登入中</div>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <div className="text-right">
            <div className="font-mono text-lg text-slate-100 tabular-nums leading-none">{timeStr}</div>
            <div className="text-[11px] text-slate-400 mt-1">{dateStr} ({weekday})</div>
          </div>
          <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-[11px]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="motion-safe:animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-70" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            LIVE · 即時
          </span>
        </div>
      </div>

      {/* Alert banner */}
      <div className="px-4 sm:px-5 py-4 border-b-2 border-rose-600/70 bg-gradient-to-r from-rose-950/80 via-rose-900/25 to-transparent">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <span className="px-2.5 py-1 rounded-md bg-rose-600 text-white text-xs font-bold flex items-center gap-1">
            <Siren className="w-3.5 h-3.5" />{l3.levelLabel}風險
          </span>
          <span className="text-[11px] text-slate-300/90">
            {PRIORITY_LABELS[a.priority] || '關注'} · 風險評估 {l3.finalScore.toFixed(1)} / 5.0
            {a.notifyClass ? ` · ${a.notifyClass}` : ''}
          </span>
        </div>
        <div className="text-2xl font-semibold text-white leading-tight mb-0.5">{scenario.name}</div>
        <div className="text-sm text-slate-300 mb-3">{scenario.region} · {scenario.tagline}</div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
          <BannerStat label="病例 / 死亡" value={`${c.cases} / ${c.deaths}`} />
          <BannerStat label="致死率" value={`${(c.cfr * 100).toFixed(c.cfr < 0.01 ? 2 : 1)}%`} />
          <BannerStat label="傳播模式" value={c.transmissionMode} />
        </div>

        {(a.differentialKey || a.protocol) && (
          <div className="px-3 py-2 rounded-lg bg-rose-950/50 border border-rose-700/50 text-xs text-rose-100 leading-relaxed">
            <span className="font-semibold text-rose-300">鑑別重點：</span>
            {a.differentialKey}
            {a.protocol && (<><span className="text-rose-400 mx-1">→</span>{a.protocol}</>)}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Flights */}
        <div className="lg:col-span-2 p-4 sm:p-5 lg:border-r border-slate-800/80 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
              <Plane className="w-4 h-4 text-teal-400" />航班即時狀態
            </div>
            <span className="text-[11px] text-slate-500">桃園 T1 · 本日 · 自動由 FIDS 同步</span>
          </div>
          <FlightGroup title={`已抵達 (${FLIGHTS.arrived.length})`} icon={CheckCircle2} flights={FLIGHTS.arrived} currentId={scenario.id} />
          <FlightGroup title={`即將抵達 (${FLIGHTS.upcoming.length})`} icon={Clock} flights={FLIGHTS.upcoming} currentId={scenario.id} />
        </div>

        {/* Side panels */}
        <div className="p-4 sm:p-5 space-y-5">
          {/* Other events */}
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-100 mb-2.5">
              <Bell className="w-4 h-4 text-amber-400" />其他關注事件
            </div>
            <div className="space-y-1.5">
              {otherEvents.map((e) => {
                const lv = EVENT_LEVELS[e.level] || EVENT_LEVELS.medium;
                return (
                  <div key={e.id} className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-800/40 border border-slate-700/40">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${lv.dot}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs text-slate-200 truncate">{e.name}</div>
                      <div className="text-[11px] text-slate-500 truncate">{e.region}</div>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[11px] font-semibold tabular-nums ${lv.badge}`}>{e.score.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Differential quick-check */}
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-100 mb-2.5">
              <Stethoscope className="w-4 h-4 text-teal-400" />鑑別速查
            </div>
            <div className="px-3 py-2.5 rounded-lg bg-slate-800/40 border border-slate-700/40 space-y-1.5 text-[11px]">
              {DIFFERENTIAL.map((x) => (
                <div key={x.d}>
                  <span className="text-violet-300 font-medium">{x.d}:</span>{' '}
                  <span className="text-slate-300">{x.s}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Reporting window */}
          <div className="px-3 py-3 rounded-lg border border-rose-700/50 bg-rose-950/20">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 mb-2">
              <Siren className="w-3.5 h-3.5" />通報窗口
            </div>
            <div className="space-y-1.5">
              {REPORT_CONTACTS.map((ct) => (
                <div key={ct.k} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300">{ct.k}</span>
                  <span className="font-mono text-slate-100">{ct.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 px-4 sm:px-5 py-2.5 border-t border-slate-800/80 text-[11px] text-slate-500">
        <span>系統 {STATION.version} · 由 OASIS 多代理系統推送 · trace: {trace}</span>
        <span>下次更新 {nextStr} · IT 異常 #5566</span>
      </div>
    </motion.div>
  );
}

function FlightGroup({ title, icon: Icon, flights, currentId }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[11px] text-slate-500 uppercase tracking-wider mb-1.5">
        <Icon className="w-3 h-3" />{title}
      </div>
      <div className="space-y-1.5">
        {flights.map((f, i) => {
          const lv = FLIGHT_LEVELS[f.level] || FLIGHT_LEVELS.normal;
          const focus = f.scenario === currentId;
          return (
            <motion.div
              key={f.code + i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs ${
                focus ? 'bg-rose-950/40 border border-rose-600/60' : 'bg-slate-800/40 border border-slate-700/40'
              }`}
            >
              <span className="font-mono text-slate-400 w-10 shrink-0">{f.time}</span>
              <span className="font-mono text-teal-300 w-[92px] shrink-0 truncate">{f.code}</span>
              <Plane className="w-3 h-3 text-slate-500 shrink-0" />
              <span className="flex-1 min-w-0 truncate text-slate-200">
                {f.dest}
                {f.note && <span className="text-amber-300/90"> · {f.note}</span>}
              </span>
              <span className={`px-1.5 py-0.5 rounded border text-[10px] shrink-0 ${lv.cls}`}>{lv.label}</span>
              {f.tag && <span className="text-[11px] text-amber-300/90 shrink-0 hidden md:inline">{f.tag}</span>}
              <span className="font-mono text-[11px] text-slate-500 w-9 text-right shrink-0">{f.gate}</span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

const BannerStat = ({ label, value }) => (
  <div className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50">
    <div className="text-[11px] text-slate-400 mb-0.5">{label}</div>
    <div className="text-base text-slate-100 font-medium">{value}</div>
  </div>
);
