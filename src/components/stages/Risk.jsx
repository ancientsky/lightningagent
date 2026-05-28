import React from 'react';
import { motion } from 'framer-motion';
import {
  Layers, Brain, Sparkles, Gauge, ListChecks, ArrowRight, AlertTriangle, Zap,
} from 'lucide-react';
import { Card, Pill, SectionLabel, ConfidenceBar, CountUp } from '../ui.jsx';
import { levelColors } from '../../lib/ui.js';

const timeSensitivity = {
  immediate: { label: '立即', color: 'red' },
  'within 4h': { label: '4 小時內', color: 'amber' },
  'within 24h': { label: '24 小時內', color: 'amber' },
  routine: { label: '例行', color: 'yellow' },
};

export default function RiskView({ scenario }) {
  const { layer1, layer2, layer3 } = scenario.risk;
  const ts = timeSensitivity[layer3.timeSensitivity] || { label: layer3.timeSensitivity, color: 'stone' };

  return (
    <div className="space-y-5">
      {/* Layer 1 */}
      <Card title="第一層 · 加權規則評分" icon={Layers} accent="text-teal-600">
        <SectionLabel>{layer1.formula}</SectionLabel>
        <div className="space-y-2.5">
          {layer1.components.map((comp, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-24 sm:w-28 text-xs text-stone-600 shrink-0">{comp.name}</div>
              <div className="flex-1 h-5 bg-stone-100 rounded-lg overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-lg"
                  initial={{ width: 0 }}
                  animate={{ width: `${(comp.value / 5) * 100}%` }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: 'easeOut' }}
                />
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-stone-500">權重 {(comp.weight * 100).toFixed(0)}%</span>
              </div>
              <div className="w-8 text-xs font-semibold text-stone-700 text-right tabular-nums">{comp.value.toFixed(1)}</div>
              <div className="hidden md:block w-28 text-[10px] text-stone-400 shrink-0">{comp.reason}</div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-stone-500">加權分數</span>
          <span className="text-2xl font-serif font-semibold text-stone-900"><CountUp value={layer1.score} decimals={1} /></span>
          <span className="text-stone-400 text-xs">/ 5.0</span>
        </div>
      </Card>

      {/* Layer 2 */}
      <Card title="第二層 · LLM 推理調整" icon={Brain} accent="text-clay-500">
        <div className="flex items-center gap-2 mb-2">
          <Pill color="clay"><Sparkles className="w-3 h-3 mr-1" />{layer2.model}</Pill>
          {layer2.flag && <Pill color="amber">{layer2.flag === 'low_confidence_borderline' ? '低信心邊界' : layer2.flag === 'cross_agency_required' ? '需跨部會' : layer2.flag}</Pill>}
        </div>
        <div className="text-sm text-stone-700 leading-relaxed bg-clay-50/60 rounded-xl p-4 border border-clay-100">
          {layer2.reasoning}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div className="flex items-center gap-2 p-3 rounded-xl bg-paper-50 border border-paper-300">
            <span className="text-xs text-stone-500">建議調整</span>
            <span className={`text-lg font-semibold ${layer2.adjustment > 0 ? 'text-rose-600' : 'text-stone-600'}`}>
              {layer2.adjustment >= 0 ? '+' : ''}{layer2.adjustment.toFixed(1)}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-paper-50 border border-paper-300">
            <ConfidenceBar value={layer2.confidence} label="推理信心" />
          </div>
        </div>
      </Card>

      {/* Layer 3 — final */}
      <Card title="第三層 · 最終研判" icon={Gauge} accent="text-clay-500" className="ring-1 ring-clay-200">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xs text-stone-400">{layer1.score.toFixed(1)}</div>
            <ArrowRight className="w-4 h-4 text-stone-300" />
            <div className="text-5xl font-serif font-semibold text-stone-900">
              <CountUp value={layer3.finalScore} decimals={1} />
            </div>
            <div className="flex flex-col gap-1">
              <div className={`px-2 py-1 rounded-md border text-xs font-medium ${levelColors[layer3.level]}`}>{layer3.levelLabel}風險</div>
              <Pill color={ts.color}><Zap className="w-3 h-3 mr-1" />{ts.label}</Pill>
            </div>
          </div>
          <div className="flex-1 sm:border-l sm:border-paper-300 sm:pl-4">
            <ConfidenceBar value={layer3.confidence} />
            <div className="text-xs text-stone-500 mt-2">SOP 對應：{layer3.sopMatch}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div>
            <SectionLabel>關鍵因子</SectionLabel>
            <ul className="space-y-1.5">
              {layer3.keyFactors.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 mt-0.5 shrink-0" />{f}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel>建議行動</SectionLabel>
            <ul className="space-y-1.5">
              {layer3.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
                  <ListChecks className="w-3.5 h-3.5 text-teal-600 mt-0.5 shrink-0" />{a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
