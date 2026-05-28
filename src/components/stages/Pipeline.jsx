import React from 'react';
import { motion } from 'framer-motion';
import {
  Languages, Tag, Hash, GitBranch, Layers, CheckCircle2, Link2, AlertCircle, Clock, Search,
} from 'lucide-react';
import { Card, Pill, SectionLabel, ConfidenceBar } from '../ui.jsx';

export default function PipelineView({ scenario }) {
  const c = scenario.classification;
  return (
    <div className="space-y-5">
      {/* Translation */}
      <Card title="翻譯 Agent" icon={Languages} accent="text-teal-600">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SectionLabel>原文（{scenario.raw.lang.toUpperCase()}）</SectionLabel>
            <div className="text-xs text-stone-600 leading-relaxed bg-paper-50 rounded-xl p-3 border border-paper-300 max-h-44 overflow-y-auto">
              {scenario.raw.rawText}
            </div>
          </div>
          <div>
            <SectionLabel>中文（{scenario.translated.model}）</SectionLabel>
            <div className="text-xs text-stone-700 leading-relaxed bg-teal-50/50 rounded-xl p-3 border border-teal-100 max-h-44 overflow-y-auto">
              {scenario.translated.text}
            </div>
            <div className="mt-2"><ConfidenceBar value={scenario.translated.confidence} label="翻譯信心" /></div>
          </div>
        </div>
      </Card>

      {/* Classification */}
      <Card title="疾病分類 Agent" icon={Tag} accent="text-clay-500">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ['疾病', c.disease],
            ['亞型 / 株', c.subtype],
            ['ICD', c.icd],
            ['地區', c.region],
          ].map(([k, v]) => (
            <div key={k} className="p-3 rounded-xl bg-paper-50 border border-paper-300">
              <div className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">{k}</div>
              <div className="text-sm text-stone-800 font-medium">{v}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
          <Stat label="病例" value={c.cases.toLocaleString()} />
          <Stat label="死亡" value={c.deaths.toLocaleString()} />
          <Stat label="致死率 CFR" value={`${(c.cfr * 100).toFixed(c.cfr < 0.01 ? 2 : 1)}%`} />
          <Stat label="傳播模式" value={c.transmissionMode} small />
        </div>
      </Card>

      {/* Entity extraction */}
      <Card title="實體擷取 Agent" icon={Hash} accent="text-teal-600">
        <SectionLabel>擷取 {scenario.entities.length} 個關鍵實體</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {scenario.entities.map((e, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-paper-50 border border-paper-300"
            >
              <span className="text-[10px] text-stone-400 min-w-[52px] uppercase">{e.type}</span>
              <span className="text-xs text-stone-700 font-medium">{e.value}</span>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Dedup */}
      <Card title="去重 / 比對 Agent" icon={GitBranch} accent="text-clay-500">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <SectionLabel>歷史相似事件</SectionLabel>
            <div className="space-y-2">
              {scenario.dedup.similarPast.map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-paper-50 border border-paper-300">
                  <span className="text-stone-400 min-w-[56px]">{p.date}</span>
                  <span className="text-stone-700 flex-1">{p.location}</span>
                  <span className="text-stone-500">{p.cases.toLocaleString()}例/{p.deaths}死</span>
                  <Pill color="stone" size="xs">相似 {(p.sim * 100).toFixed(0)}%</Pill>
                </div>
              ))}
            </div>
          </div>
          <div>
            <SectionLabel>多源報導佐證</SectionLabel>
            <div className="space-y-2">
              {scenario.dedup.sourceCorroboration.map((s, i) => (
                <div key={i} className="flex items-center gap-2 text-xs p-2.5 rounded-xl bg-paper-50 border border-paper-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="text-stone-700 flex-1">{s.source}</span>
                  <span className="text-stone-400 flex items-center gap-1"><Clock className="w-3 h-3" />{s.timestamp}</span>
                  <Pill color="green" size="xs">{(s.sim * 100).toFixed(0)}%</Pill>
                </div>
              ))}
            </div>
          </div>
        </div>

        {scenario.dedup.mergeDecision && (
          <Note icon={Link2} tint="blue" text={scenario.dedup.mergeDecision} title="去重決策：合併事件" />
        )}
        {scenario.dedup.seasonalPattern && (
          <Note icon={Layers} tint="green" text={scenario.dedup.seasonalPattern} title="季節模式比對" />
        )}
        {scenario.dedup.escalationLink && (
          <Note icon={AlertCircle} tint="amber" text={scenario.dedup.escalationLink} title="溯源連結：漏網個案" />
        )}
      </Card>

      {/* RAG context retrieval over historical reports */}
      {scenario.rag && (
        <Card title="情境檢索 (RAG over 歷年報告)" icon={Search} accent="text-purple-600">
          <div className="space-y-2.5">
            {[
              ['歷史背景', scenario.rag.historical],
              ['台灣連結', scenario.rag.taiwanLink],
              ['SOP 參照', scenario.rag.sop],
            ].map(([k, v], i) => (
              <motion.div
                key={k}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-3 rounded-xl bg-purple-50/60 border border-purple-100"
              >
                <div className="text-xs font-semibold text-purple-700 mb-1">{k}</div>
                <div className="text-xs text-stone-700 leading-relaxed">{v}</div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

const Stat = ({ label, value, small }) => (
  <div className="p-3 rounded-xl bg-paper-50 border border-paper-300">
    <div className="text-[10px] uppercase tracking-wider text-stone-400 mb-1">{label}</div>
    <div className={`${small ? 'text-xs' : 'text-lg font-serif'} text-stone-800 font-medium`}>{value}</div>
  </div>
);

const noteTint = {
  blue: 'bg-blue-50 border-blue-200 text-blue-800',
  green: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  amber: 'bg-amber-50 border-amber-200 text-amber-800',
};
const Note = ({ icon: Icon, tint, text, title }) => (
  <div className={`mt-3 p-3 rounded-xl border flex items-start gap-2 text-xs ${noteTint[tint]}`}>
    <Icon className="w-4 h-4 mt-0.5 shrink-0" />
    <span><strong>{title}：</strong>{text}</span>
  </div>
);
