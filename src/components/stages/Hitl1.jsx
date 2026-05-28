import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, CheckCircle2, Clock, Zap, AlertCircle, RotateCcw, ThumbsUp, SlidersHorizontal,
} from 'lucide-react';
import { Card, Pill, SectionLabel, ConfidenceBar, ManualVsAuto } from '../ui.jsx';
import { levelColors } from '../../lib/ui.js';

export default function HITL1View({ scenario, decisions, onDecision }) {
  const hitl1 = scenario.hitl1;
  const decision = decisions[scenario.id];
  const l3 = scenario.risk.layer3;

  if (!hitl1.needed) {
    return (
      <div className="space-y-5">
        <Card title="HITL ① 分流審查" icon={ShieldAlert} accent="text-teal-600">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <div className="text-sm font-medium text-emerald-800 mb-1">自動跳過人工審查</div>
              <div className="text-xs text-emerald-700">{hitl1.reason}</div>
            </div>
          </div>
          <ManualVsAuto
            manual="不論風險高低，所有案件都要排隊等人工初篩"
            auto="高信心、低風險案件自動放行，人力專注在真正需要判斷的案件"
            savings="人工注意力聚焦於邊界 / 高風險案件"
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <Card title="HITL ① 分流審查閘門" icon={ShieldAlert} accent="text-amber-600" className={hitl1.criticalChoice ? 'ring-1 ring-amber-300' : ''}>
        {hitl1.criticalChoice && (
          <div className="mb-4 flex items-center gap-2 p-2.5 rounded-xl bg-amber-100/70 border border-amber-200 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>本案為 <strong>HITL 真正決策點</strong> — Agent 提建議，最終由人類裁決。</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-paper-50 border border-paper-300">
            <SectionLabel>進入審查原因</SectionLabel>
            <p className="text-sm text-stone-700 mb-3">{hitl1.reason}</p>
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Pill color="amber"><Clock className="w-3 h-3 mr-1" />SLA {hitl1.sla}</Pill>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-clay-50/60 border border-clay-100">
            <SectionLabel>Agent 建議</SectionLabel>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-serif font-semibold text-stone-900">{l3.finalScore.toFixed(1)}</span>
              <div className={`px-2 py-1 rounded-md border text-xs font-medium ${levelColors[l3.level]}`}>{l3.levelLabel}風險</div>
            </div>
            <ConfidenceBar value={l3.confidence} />
          </div>
        </div>

        {/* Decision controls */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            {!decision ? (
              <motion.div key="buttons" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap gap-2">
                <button
                  onClick={() => onDecision(scenario.id, { type: 'approve', label: '同意 Agent 建議，依此等級進入後續分流' })}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-medium transition shadow-soft"
                >
                  <ThumbsUp className="w-4 h-4" /> 同意 Agent 建議
                </button>
                <button
                  onClick={() => onDecision(scenario.id, { type: 'adjust', label: '人工微調風險等級後放行' })}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-800 rounded-xl text-sm font-medium transition"
                >
                  <SlidersHorizontal className="w-4 h-4" /> 調整等級後放行
                </button>
              </motion.div>
            ) : (
              <motion.div key="decided" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-center gap-2 text-sm text-emerald-800">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{decision.label}</span>
                </div>
                <button onClick={() => onDecision(scenario.id, null)} className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700">
                  <RotateCcw className="w-3 h-3" /> 重設
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <ManualVsAuto
          manual="承辦逐則初篩、靠經驗判斷是否上呈，標準不一"
          auto="Agent 預先研判 + 附信心分數，人工只在需要時介入決策"
          savings="決策有依據、可追溯，SLA 明確"
        />
      </Card>
    </div>
  );
}
