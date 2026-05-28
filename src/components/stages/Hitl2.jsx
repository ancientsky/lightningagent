import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileCheck, Plane, Briefcase, Mail, Megaphone, CheckCircle2, XCircle, RefreshCw, RotateCcw, Zap,
} from 'lucide-react';
import { Card, Pill, ManualVsAuto } from '../ui.jsx';

const META = {
  airport: { name: '機場檢疫站', icon: Plane },
  analyst: { name: '內部入口網', icon: Briefcase },
  executive: { name: '長官 Email + 簡訊', icon: Mail },
  public: { name: '官網 + 媒體', icon: Megaphone },
};

export default function HITL2View({ scenario, hitl2Decisions, onHitl2Decision }) {
  return (
    <div className="space-y-5">
      <Card title="HITL ② 發布審查 — 差異化閘門" icon={FileCheck} accent="text-clay-500">
        <p className="text-xs text-stone-500 mb-4">不同通道風險不同，審核強度也不同：低風險自動發布，對外稿件需人工核可。</p>
        <div className="space-y-3">
          {Object.entries(scenario.hitl2).map(([audience, gate]) => {
            const meta = META[audience];
            if (!meta) return null;
            const Icon = meta.icon;
            const key = `${scenario.id}_${audience}`;
            const decided = hitl2Decisions[key];

            if (gate.mode === 'skipped') {
              return (
                <div key={audience} className="flex items-center gap-3 p-3 rounded-xl bg-paper-100 border border-paper-300">
                  <Icon className="w-5 h-5 text-stone-400" />
                  <div className="flex-1"><div className="text-sm font-medium text-stone-500">{meta.name}</div></div>
                  <Pill color="stone">{gate.label}</Pill>
                </div>
              );
            }

            if (gate.mode === 'auto') {
              return (
                <div key={audience} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <Icon className="w-5 h-5 text-emerald-600" />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-stone-800">{meta.name}</div>
                    <div className="text-xs text-stone-600">{gate.label}</div>
                  </div>
                  <Pill color="green">自動發布</Pill>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1"><Zap className="w-3 h-3" />{gate.delay}</span>
                </div>
              );
            }

            return (
              <div key={audience} className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                <div className="flex items-start gap-3 mb-3">
                  <Icon className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-stone-800">{meta.name}</span>
                      <Pill color="amber">需人工審核</Pill>
                      <Pill color="stone" size="xs">SLA {gate.sla}</Pill>
                    </div>
                    <div className="text-xs text-stone-600">{gate.label} · 審查者：{gate.reviewer}</div>
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  {!decided ? (
                    <motion.div key="b" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap gap-2">
                      <Btn onClick={() => onHitl2Decision(key, { type: 'approve' })} tone="emerald" icon={CheckCircle2}>核准發布</Btn>
                      <Btn onClick={() => onHitl2Decision(key, { type: 'revise' })} tone="amber" icon={RefreshCw}>退回修改</Btn>
                      <Btn onClick={() => onHitl2Decision(key, { type: 'reject' })} tone="rose" icon={XCircle}>拒絕發布</Btn>
                    </motion.div>
                  ) : (
                    <motion.div key="d" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-white border border-paper-300">
                      <span className="text-xs flex items-center gap-1.5">
                        {decided.type === 'approve' && <span className="text-emerald-700 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4" />已核准，準備發布</span>}
                        {decided.type === 'revise' && <span className="text-amber-700 flex items-center gap-1.5"><RefreshCw className="w-4 h-4" />已退回，Agent 將重新撰稿</span>}
                        {decided.type === 'reject' && <span className="text-rose-700 flex items-center gap-1.5"><XCircle className="w-4 h-4" />已拒絕，不會發布</span>}
                      </span>
                      <button onClick={() => onHitl2Decision(key, null)} className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-600"><RotateCcw className="w-3 h-3" />重設</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <ManualVsAuto
          manual="所有對外稿件走簽呈往返多日，簽核流程不透明"
          auto="差異化閘門、SLA 明確，自動稿件秒級發布"
          savings="對外稿件審核從多日縮短至 2 小時內"
        />
      </Card>
    </div>
  );
}

const toneMap = {
  emerald: 'bg-emerald-100 hover:bg-emerald-200 border-emerald-300 text-emerald-800',
  amber: 'bg-amber-100 hover:bg-amber-200 border-amber-300 text-amber-800',
  rose: 'bg-rose-100 hover:bg-rose-200 border-rose-300 text-rose-800',
};
const Btn = ({ onClick, tone, icon: Icon, children }) => (
  <button onClick={onClick} className={`flex items-center gap-1.5 px-3 py-2 border rounded-lg text-xs font-medium transition ${toneMap[tone]}`}>
    <Icon className="w-3.5 h-3.5" />{children}
  </button>
);
