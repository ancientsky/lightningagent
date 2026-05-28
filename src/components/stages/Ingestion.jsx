import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, RefreshCw, ArrowRight, CheckCircle2, Layers, Image as ImageIcon,
  Play, FileText, MessageSquareWarning,
} from 'lucide-react';
import { Card, Pill, SectionLabel, ConfidenceBar, AgentThinking } from '../ui.jsx';
import { tintMap } from '../../lib/ui.js';
import { INGESTION_AGENTS } from '../../data/ingestionAgents.js';

const SOURCES = [
  { name: 'beaconbio.org', highlight: true }, { name: 'WHO DON' }, { name: 'ECDC' },
  { name: 'US CDC HAN' }, { name: 'ProMED-mail' }, { name: 'Reuters Health' },
  { name: 'PAHO' }, { name: 'NIDSS 法傳' },
];

function AgentDemo({ agent }) {
  const tint = tintMap[agent.tint];
  const steps = agent.demo.steps;
  const [revealed, setRevealed] = useState(0);
  const [done, setDone] = useState(false);
  const [runId, setRunId] = useState(0);

  useEffect(() => {
    setRevealed(0);
    setDone(false);
    const timers = [];
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setRevealed(i + 1), 500 + i * 650));
    });
    timers.push(setTimeout(() => setDone(true), 500 + steps.length * 650 + 300));
    return () => timers.forEach(clearTimeout);
  }, [agent.id, runId]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Input panel */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <SectionLabel>{agent.demo.label}</SectionLabel>
          <button
            onClick={() => setRunId((n) => n + 1)}
            className="text-[11px] flex items-center gap-1 text-stone-500 hover:text-clay-600 transition"
          >
            <RefreshCw className="w-3 h-3" /> 重跑
          </button>
        </div>

        <InputBlock agent={agent} tint={tint} />

        {/* Processing steps */}
        <div className="rounded-xl border border-paper-300 bg-paper-50 p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold">Agent 處理流程</span>
            {!done ? <AgentThinking tint={tint.accent} /> : <span className="text-[11px] text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> 完成</span>}
          </div>
          <ol className="space-y-1.5">
            {steps.map((s, i) => {
              const active = i < revealed;
              return (
                <li key={i} className="flex items-center gap-2 text-xs">
                  <motion.span
                    initial={false}
                    animate={{ scale: active ? 1 : 0.7, opacity: active ? 1 : 0.4 }}
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${active ? `${tint.strong} text-white` : 'bg-stone-200 text-stone-400'}`}
                  >
                    {active ? '✓' : i + 1}
                  </motion.span>
                  <span className={active ? 'text-stone-700' : 'text-stone-400'}>{s}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Output panel */}
      <div>
        <SectionLabel>擷取結果 · 附信心分數</SectionLabel>
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="out"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`rounded-xl border ${tint.border} ${tint.soft} p-4`}
            >
              <div className={`text-sm font-semibold ${tint.text} mb-3`}>{agent.demo.output.title}</div>
              <div className="space-y-2 mb-4">
                {agent.demo.output.fields.map(([k, v]) => (
                  <div key={k} className="flex items-start gap-2 text-xs">
                    <span className="text-stone-400 min-w-[64px]">{k}</span>
                    <span className="text-stone-700 font-medium flex-1">{v}</span>
                  </div>
                ))}
              </div>
              <ConfidenceBar value={agent.demo.confidence} />
            </motion.div>
          ) : (
            <motion.div key="wait" className="rounded-xl border border-paper-300 p-4 space-y-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-4 rounded skeleton-shimmer" style={{ width: `${90 - i * 12}%` }} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function InputBlock({ agent, tint }) {
  const d = agent.demo;
  if (d.inputKind === 'IMAGE') {
    return (
      <div className="rounded-xl border border-paper-300 overflow-hidden">
        <div className="bg-stone-800 text-stone-300 text-[10px] px-3 py-1.5 flex items-center gap-1.5">
          <ImageIcon className="w-3 h-3" /> 輸入影像
        </div>
        <div className="p-3 bg-gradient-to-br from-stone-100 to-stone-200">
          <div className="rounded-lg bg-white border border-stone-300 p-3 text-[11px] text-stone-600 font-mono leading-relaxed">
            {d.input}
          </div>
          <div className="mt-2 text-[10px] text-stone-500">OCR 還原：</div>
          <pre className="mt-1 text-[10px] text-stone-700 whitespace-pre-wrap font-mono bg-white/70 rounded p-2 border border-stone-200">{d.ocrRaw}</pre>
        </div>
      </div>
    );
  }
  if (d.inputKind === 'VIDEO') {
    return (
      <div className="rounded-xl border border-paper-300 overflow-hidden">
        <div className="bg-stone-800 text-stone-300 text-[10px] px-3 py-1.5 flex items-center gap-1.5">
          <Play className="w-3 h-3" /> 輸入影音
        </div>
        <div className="p-3">
          <div className="relative rounded-lg bg-stone-900 text-stone-100 text-[11px] p-3 mb-2">
            <span className="absolute top-2 right-2 text-[9px] bg-rose-500 px-1.5 py-0.5 rounded">● 瘋傳</span>
            {d.input}
          </div>
          <div className="text-[10px] text-stone-500 mb-1">自動轉錄：</div>
          <div className="text-[11px] text-stone-700 italic bg-paper-100 rounded p-2 border border-paper-300">「{d.transcript}」</div>
        </div>
      </div>
    );
  }
  if (d.inputKind === 'CLAIM') {
    return (
      <div className="rounded-xl border border-paper-300 overflow-hidden">
        <div className="bg-stone-800 text-stone-300 text-[10px] px-3 py-1.5 flex items-center gap-1.5">
          <MessageSquareWarning className="w-3 h-3" /> 待查證主張
        </div>
        <div className="p-3">
          <div className="rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs p-3 mb-3">{d.claim}</div>
          <div className="text-[10px] text-stone-500 mb-1.5">跨來源交叉比對：</div>
          <div className="space-y-1.5">
            {d.crossCheck.map((c) => (
              <div key={c.src} className="flex items-center gap-2 text-[11px]">
                <span className={`w-1.5 h-1.5 rounded-full ${c.match ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <span className="text-stone-500 min-w-[120px]">{c.src}</span>
                <span className="text-stone-700">{c.verdict}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
  // HTML
  return (
    <div className="rounded-xl border border-paper-300 overflow-hidden">
      <div className="bg-stone-800 text-stone-300 text-[10px] px-3 py-1.5 flex items-center gap-1.5">
        <FileText className="w-3 h-3" /> 輸入網頁
      </div>
      <div className="p-3 text-[11px] text-stone-700 font-mono leading-relaxed bg-white">{d.input}</div>
    </div>
  );
}

export default function IngestionView() {
  const [active, setActive] = useState('web');
  const agent = INGESTION_AGENTS.find((a) => a.id === active);

  return (
    <div className="space-y-5">
      <Card title="資料來源即時連線" icon={Globe} accent="text-teal-600">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {SOURCES.map((s) => (
            <div key={s.name} className={`px-2.5 py-2 rounded-lg border text-xs flex items-center gap-2 ${s.highlight ? 'bg-teal-50 border-teal-200 text-teal-700' : 'bg-paper-100 border-paper-300 text-stone-600'}`}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="truncate">{s.name}</span>
            </div>
          ))}
        </div>
        <div className="mt-3 text-xs text-stone-500">8 來源 · LIVE 串接 — 假訊息不只藏在文字裡，也在圖片、影音與跨國雜訊中。</div>
      </Card>

      <Card title="多模態擷取 — 四路 Agent 分頭擷取與查證" icon={Layers} accent="text-clay-500">
        <div className="flex flex-wrap gap-2 mb-4">
          {INGESTION_AGENTS.map((a) => {
            const t = tintMap[a.tint];
            const on = a.id === active;
            const Icon = a.icon;
            return (
              <button
                key={a.id}
                onClick={() => setActive(a.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition ${on ? `${t.soft} ${t.border} ${t.text} shadow-soft` : 'bg-paper-50 border-paper-300 text-stone-500 hover:bg-paper-100'}`}
              >
                <Icon className={`w-4 h-4 ${on ? t.accent : 'text-stone-400'}`} />
                <span className="hidden sm:inline">{a.name}</span>
                <span className="sm:hidden">{a.code}</span>
              </button>
            );
          })}
        </div>

        <div className="mb-4 flex items-start gap-2">
          <Pill color={agent.tint === 'clay' ? 'clay' : agent.tint === 'rose' ? 'red' : agent.tint}>{agent.code}</Pill>
          <p className="text-xs text-stone-600 flex-1">{agent.blurb}</p>
        </div>

        <AgentDemo key={agent.id} agent={agent} />
      </Card>

      <Card title="統一情資池" icon={ArrowRight} accent="text-teal-600">
        <p className="text-sm text-stone-600">
          四路訊號（網頁 / OCR / 語音影音 / 假新聞偵測）匯流後進入統一情資池，再交給下游的分類、風險研判、HITL 雙閘門與差異化撰稿。
          <span className="text-clay-600 font-medium"> 多模態，是看清全貌的關鍵。</span>
        </p>
      </Card>
    </div>
  );
}
