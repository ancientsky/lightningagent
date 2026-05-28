import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ShieldAlert, XCircle, RefreshCw, Lightbulb } from 'lucide-react';
import { pillColors } from '../lib/ui.js';

export const Pill = ({ children, color = 'stone', size = 'sm', className = '' }) => {
  const sizeClass = size === 'xs' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-0.5';
  return (
    <span className={`inline-flex items-center rounded-md font-medium ${pillColors[color]} ${sizeClass} ${className}`}>
      {children}
    </span>
  );
};

export const Card = ({ title, children, icon: Icon, accent = 'text-clay-500', className = '', delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: 'easeOut' }}
    className={`card-base p-5 ${className}`}
  >
    {title && (
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className={`w-4 h-4 ${accent}`} />}
        <h3 className="text-sm font-semibold text-stone-700">{title}</h3>
      </div>
    )}
    {children}
  </motion.div>
);

export const SectionLabel = ({ children }) => (
  <div className="text-[11px] uppercase tracking-wider text-stone-400 font-semibold mb-2">{children}</div>
);

export const ConfidenceBar = ({ value, label = '信心度' }) => {
  const pct = Math.round(value * 100);
  const color = value >= 0.85 ? 'bg-emerald-500' : value >= 0.7 ? 'bg-amber-500' : 'bg-rose-500';
  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-stone-500 min-w-[48px]">{label}</span>
      <div className="flex-1 h-1.5 bg-stone-200/70 rounded-full overflow-hidden">
        <motion.div
          className={`h-full ${color} rounded-full`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs font-semibold text-stone-700 min-w-[36px] text-right tabular-nums">{pct}%</span>
    </div>
  );
};

export const ManualVsAuto = ({ manual, auto, savings }) => (
  <div className="mt-3 p-3 rounded-xl bg-paper-100 border border-paper-300">
    <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1.5">
      <Lightbulb className="w-3 h-3" />
      <span>跟現行流程比較</span>
    </div>
    <div className="grid grid-cols-2 gap-3 text-xs">
      <div>
        <div className="text-stone-400 mb-0.5">現行 (人工)</div>
        <div className="text-stone-600">{manual}</div>
      </div>
      <div>
        <div className="text-clay-600 mb-0.5">本系統 (Agent)</div>
        <div className="text-clay-700 font-medium">{auto}</div>
      </div>
    </div>
    {savings && <div className="mt-2 text-[11px] text-emerald-700 font-medium">→ {savings}</div>}
  </div>
);

// Animated number that counts up to a numeric value on mount.
export function CountUp({ value, decimals = 0, duration = 1100, className = '', suffix = '', prefix = '' }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef();
  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setDisplay(value);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {prefix}{display.toFixed(decimals)}{suffix}
    </span>
  );
}

// Small "agent working" indicator — three breathing dots.
export const AgentThinking = ({ label = '處理中', tint = 'text-teal-600' }) => (
  <span className={`inline-flex items-center gap-1.5 text-xs ${tint}`}>
    <span className="flex gap-0.5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-current"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -2, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
    {label}
  </span>
);

export const PublishStatusBanner = ({ status, audience, scenario }) => {
  const hitl2Gate = scenario.hitl2?.[audience];
  const config = {
    published: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', label: '已發布', detail: '通道推送完成、可被受眾接收', icon: CheckCircle2 },
    awaiting_hitl1: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', label: '待 HITL ① 通過', detail: '請至「④ HITL 分流審查」階段審核；通過後此通道才會發布', icon: Clock },
    awaiting_hitl2: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', label: '待 HITL ② 核准', detail: `請至「⑥ 發布審查」核准；等待 ${hitl2Gate?.reviewer || '審查者'} · SLA ${hitl2Gate?.sla || '—'}`, icon: ShieldAlert },
    rejected: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800', label: '已拒絕發布', detail: 'HITL ② 決定不發布；下方為已產生但未上架的草稿', icon: XCircle },
    revising: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800', label: '退回修改中', detail: 'Agent 將重新撰稿；下方為原始草稿', icon: RefreshCw },
  }[status];
  if (!config) return null;
  const Icon = config.icon;
  const isPub = status === 'published';
  return (
    <div className={`mb-4 px-4 py-2.5 rounded-xl border ${config.bg} ${config.border} flex items-center gap-3`}>
      <Icon className={`w-5 h-5 ${config.text} shrink-0`} />
      <div className="flex-1">
        <div className={`text-sm font-medium ${config.text}`}>{config.label}</div>
        <div className={`text-xs ${config.text} opacity-75`}>{config.detail}</div>
      </div>
      {!isPub && <Pill color="stone">下方為已產生草稿</Pill>}
    </div>
  );
};
