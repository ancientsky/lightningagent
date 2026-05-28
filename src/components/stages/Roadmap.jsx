import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Zap, Target, ArrowRight } from 'lucide-react';
import { Card, CountUp, SectionLabel } from '../ui.jsx';
import { MILESTONES, METRICS, ROADMAP_INTRO } from '../../data/roadmap.js';

const accentStyles = {
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', tag: 'bg-teal-100 text-teal-800 border-teal-300', dot: 'bg-teal-500', line: 'bg-teal-200' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', tag: 'bg-amber-100 text-amber-800 border-amber-300', dot: 'bg-amber-500', line: 'bg-amber-200' },
  clay: { bg: 'bg-clay-50/70', border: 'border-clay-200', tag: 'bg-clay-100 text-clay-800 border-clay-200', dot: 'bg-clay-500', line: 'bg-clay-200' },
};

export default function RoadmapView() {
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="space-y-8" ref={ref}>
      {/* Intro */}
      <div className="text-center px-4 py-6">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-clay-100 border border-clay-200 text-clay-700 text-xs font-medium mb-4">
          <Map className="w-3.5 h-3.5" />90 天落地路線圖
        </div>
        <h2 className="text-2xl font-serif font-semibold text-stone-900 mb-2">會動，還要會落地</h2>
        <p className="text-stone-500 text-sm max-w-lg mx-auto">{ROADMAP_INTRO}</p>
      </div>

      {/* Timeline */}
      <Card title="三階段 Sprint" icon={Target} accent="text-clay-500">
        <div className="relative">
          {/* Vertical connector line */}
          <div className="absolute left-[22px] top-6 bottom-6 w-0.5 bg-paper-300" />

          <div className="space-y-6">
            {MILESTONES.map((m, i) => {
              const s = accentStyles[m.accent] || accentStyles.teal;
              return (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: i * 0.18, duration: 0.5 }}
                  className="flex gap-4"
                >
                  {/* Dot */}
                  <div className={`w-11 h-11 rounded-full border-2 ${s.bg} ${s.border} flex items-center justify-center shrink-0 z-10`}>
                    <div className={`w-3 h-3 rounded-full ${s.dot}`} />
                  </div>
                  {/* Content */}
                  <div className={`flex-1 p-4 rounded-xl ${s.bg} ${s.border} border`}>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 rounded-md border text-xs font-semibold ${s.tag}`}>{m.tag}</span>
                      <span className="text-xs text-stone-500">{m.span}</span>
                      <span className="text-sm font-semibold text-stone-800">{m.title}</span>
                    </div>
                    <ul className="space-y-1">
                      {m.items.map((item, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-stone-700">
                          <Zap className="w-3 h-3 text-stone-400 shrink-0" />{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Quantified metrics */}
      <Card title="量化成效指標" icon={Zap} accent="text-teal-600">
        <p className="text-xs text-stone-500 mb-5">每一個數字都有對應的功能交付，不是口號。</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {METRICS.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 + i * 0.12 }}
              className="p-4 rounded-xl bg-paper-50 border border-paper-300"
            >
              <div className="text-xs text-stone-500 mb-3">{m.label}</div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-stone-400 line-through text-sm">{m.from}</div>
                <ArrowRight className="w-4 h-4 text-stone-300 shrink-0" />
                <div className="text-2xl font-serif font-semibold text-clay-700">{m.to}</div>
                {m.mult && (
                  <div className="ml-auto px-2 py-1 rounded-lg bg-teal-100 border border-teal-200 text-teal-800 text-sm font-semibold">
                    {inView ? <><CountUp value={m.mult} decimals={0} duration={1200} />×</> : `${m.mult}×`}
                  </div>
                )}
                {!m.mult && (
                  <div className="ml-auto px-2 py-1 rounded-lg bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold">A2A</div>
                )}
              </div>
              <div className="text-xs text-stone-500">{m.desc}</div>
            </motion.div>
          ))}
        </div>
      </Card>

      {/* Vision statement */}
      <div className="text-center px-4 py-8 rounded-2xl bg-gradient-to-b from-paper-50 to-paper-100 border border-paper-300">
        <div className="text-3xl font-serif font-semibold text-stone-900 mb-3">從「公文旅行」到「即時訊息流」</div>
        <p className="text-stone-500 text-sm max-w-md mx-auto">
          90 天內，讓台灣國際疫情情資系統跟上 AI Agent 時代——不是換掉人，是讓人做更有價值的決策。
        </p>
      </div>
    </div>
  );
}
