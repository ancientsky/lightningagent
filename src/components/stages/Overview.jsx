import React from 'react';
import { motion } from 'framer-motion';
import {
  AlertTriangle, Clock, Globe, Workflow, Users, TrendingUp, ChevronRight,
  Plane, Activity, Network,
} from 'lucide-react';
import { Card, Pill, ConfidenceBar, CountUp } from '../ui.jsx';
import { sevColors, levelColors } from '../../lib/ui.js';
import { STAGES, AUDIENCE_LABELS } from '../../data/stages.js';

export default function OverviewView({ scenario, onStageJump }) {
  const sev = sevColors[scenario.colorClass];

  return (
    <div className="space-y-5">
      {/* Hero */}
      <Card>
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 16 }}
            className={`w-14 h-14 rounded-2xl ${sev.soft} flex items-center justify-center shrink-0`}
          >
            <AlertTriangle className={`w-7 h-7 ${sev.accent}`} />
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl font-serif font-semibold text-stone-900">{scenario.name}</h2>
              <Pill color={scenario.colorClass}>{scenario.severityLabel}</Pill>
              <span className="text-sm text-stone-500">· {scenario.region}</span>
            </div>
            <p className="text-sm text-stone-600">{scenario.tagline}</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-3 text-xs text-stone-500">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(scenario.raw.fetchedAt).toLocaleString('zh-TW')}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {scenario.raw.source}</span>
            </div>
          </div>
        </div>

        {scenario.cluster && (
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
            {scenario.cluster.acts.map((a, i) => (
              <motion.div
                key={a.n}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.12 }}
                className="relative p-3 rounded-xl bg-amber-50 border border-amber-200"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center">{a.n}</span>
                  <span className="text-xs font-semibold text-amber-800">{a.title}</span>
                </div>
                <p className="text-[11px] text-stone-600 leading-relaxed">{a.body}</p>
                {i < 2 && <ChevronRight className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-400 z-10" />}
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Pipeline quick overview */}
      <Card title="管線快速概覽" icon={Workflow} accent="text-teal-600">
        <div className="space-y-2">
          {STAGES.slice(1).map((s, idx) => {
            const Icon = s.icon;
            const willHitl = (s.id === 'hitl1' && scenario.hitl1.needed) ||
              (s.id === 'hitl2' && Object.values(scenario.hitl2).some((g) => g.mode === 'manual'));
            const skipped = (s.id === 'hitl1' && !scenario.hitl1.needed);
            const crossActive = s.id === 'crossagency' && scenario.crossAgency;
            return (
              <motion.button
                key={s.id}
                onClick={() => onStageJump(s.id)}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                whileHover={{ x: 3 }}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-paper-100 border border-paper-300 transition text-left"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${skipped ? 'bg-stone-100' : crossActive ? 'bg-clay-100' : 'bg-teal-50'}`}>
                  <Icon className={`w-4 h-4 ${skipped ? 'text-stone-400' : crossActive ? 'text-clay-600' : 'text-teal-600'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-stone-800">{s.name}</div>
                  <div className="text-xs text-stone-500">{s.desc}</div>
                </div>
                {crossActive && <Pill color="clay">本情境啟動</Pill>}
                {willHitl && <Pill color="amber">需 HITL</Pill>}
                {skipped && <Pill color="stone">自動跳過</Pill>}
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </motion.button>
            );
          })}
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="本事件涉及受眾" icon={Users} accent="text-teal-600">
          <div className="flex flex-wrap gap-2">
            {['airport', 'analyst', 'executive', 'public'].map((a) => {
              const included = scenario.audiences.includes(a);
              return (
                <div key={a} className={`px-3 py-2 rounded-lg border text-xs ${included ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-paper-100 border-paper-300 text-stone-400'}`}>
                  {AUDIENCE_LABELS[a]} {included ? '✓' : '—'}
                </div>
              );
            })}
          </div>
          <div className="mt-3 text-xs text-stone-500">
            {scenario.audiences.length} / 4 受眾 · 由分流協調 Agent 依 SOP 決定
            {scenario.crossAgency && <span className="text-clay-600"> · 另觸發跨部會應變</span>}
          </div>
        </Card>

        <Card title="最終風險指標" icon={TrendingUp} accent="text-clay-500">
          <div className="flex items-baseline gap-3 mb-3">
            <div className="text-4xl font-serif font-semibold text-stone-900">
              <CountUp value={scenario.risk.layer3.finalScore} decimals={1} />
            </div>
            <div className={`px-2 py-1 rounded-md border text-xs font-medium ${levelColors[scenario.risk.layer3.level]}`}>
              {scenario.risk.layer3.levelLabel}風險
            </div>
          </div>
          <ConfidenceBar value={scenario.risk.layer3.confidence} />
          <div className="mt-3 text-xs text-stone-500">
            SOP 對應：{scenario.risk.layer3.sopMatch}
          </div>
        </Card>
      </div>
    </div>
  );
}
