import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Zap, Map, ChevronRight, ChevronLeft, Play, Square, SkipForward,
} from 'lucide-react';
import { SCENARIOS, SCENARIO_LIST } from './data/scenarios.js';
import { STAGES } from './data/stages.js';
import { Pill } from './components/ui.jsx';
import { levelColors } from './lib/ui.js';

import OverviewView from './components/stages/Overview.jsx';
import IngestionView from './components/stages/Ingestion.jsx';
import PipelineView from './components/stages/Pipeline.jsx';
import RiskView from './components/stages/Risk.jsx';
import HITL1View from './components/stages/Hitl1.jsx';
import AudienceView from './components/stages/Audience.jsx';
import HITL2View from './components/stages/Hitl2.jsx';
import DeliveryView from './components/stages/Delivery.jsx';
import CrossAgencyView from './components/stages/CrossAgency.jsx';
import RoadmapView from './components/stages/Roadmap.jsx';

const SEV_COLORS = {
  critical: 'bg-rose-100 text-rose-800 border-rose-300',
  high: 'bg-amber-100 text-amber-800 border-amber-300',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  low: 'bg-teal-100 text-teal-800 border-teal-300',
};

// Auto-demo: step through all pipeline stages (not overview/roadmap)
const DEMO_STAGES = STAGES.map((s) => s.id);
const DEMO_DELAY_MS = 3000;

export default function App() {
  const [scenarioId, setScenarioId] = useState(SCENARIO_LIST[0]);
  const [stageId, setStageId] = useState('overview');
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [hitl1Decisions, setHitl1Decisions] = useState({});
  const [hitl2Decisions, setHitl2Decisions] = useState({});
  const [demoRunning, setDemoRunning] = useState(false);
  const demoTimer = useRef(null);
  const stageNavRef = useRef(null);

  const scenario = SCENARIOS[scenarioId];

  // Reset stage when scenario changes
  useEffect(() => {
    setStageId('overview');
    setShowRoadmap(false);
  }, [scenarioId]);

  // Scroll stage nav into view on mobile when stage changes
  useEffect(() => {
    stageNavRef.current?.querySelector('[data-active="true"]')?.scrollIntoView({ inline: 'center', behavior: 'smooth' });
  }, [stageId]);

  const stopDemo = useCallback(() => {
    clearTimeout(demoTimer.current);
    setDemoRunning(false);
  }, []);

  const runDemo = useCallback(() => {
    setShowRoadmap(false);
    setDemoRunning(true);
    let idx = 0;
    const step = () => {
      if (idx >= DEMO_STAGES.length) {
        setDemoRunning(false);
        return;
      }
      setStageId(DEMO_STAGES[idx]);
      idx++;
      demoTimer.current = setTimeout(step, DEMO_DELAY_MS);
    };
    step();
  }, []);

  useEffect(() => () => clearTimeout(demoTimer.current), []);

  function onHitl1Decision(id, decision) {
    setHitl1Decisions((prev) => ({ ...prev, [id]: decision }));
  }
  function onHitl2Decision(key, decision) {
    setHitl2Decisions((prev) => ({ ...prev, [key]: decision }));
  }

  const currentStageIdx = STAGES.findIndex((s) => s.id === stageId);

  function goPrev() {
    if (currentStageIdx > 0) setStageId(STAGES[currentStageIdx - 1].id);
  }
  function goNext() {
    if (currentStageIdx < STAGES.length - 1) setStageId(STAGES[currentStageIdx + 1].id);
  }

  return (
    <div className="min-h-screen bg-paper-50">
      {/* ── Header ── */}
      <header className="sticky top-0 z-30 bg-paper-50/90 backdrop-blur border-b border-paper-300 shadow-soft">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-clay-600 flex items-center justify-center shadow-soft">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="text-sm font-semibold text-stone-900 leading-none">OASIS</div>
              <div className="text-[10px] text-stone-400 leading-none mt-0.5">國際疫情情資 Multi-Agent</div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Roadmap button */}
          <button
            onClick={() => { setShowRoadmap((v) => !v); stopDemo(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-medium transition ${showRoadmap ? 'bg-clay-100 border-clay-300 text-clay-800' : 'bg-paper-100 border-paper-300 text-stone-600 hover:bg-paper-200'}`}
          >
            <Map className="w-3.5 h-3.5" />90 天路線圖
          </button>

          {/* Auto demo */}
          {!demoRunning ? (
            <button
              onClick={() => { setShowRoadmap(false); runDemo(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-clay-600 hover:bg-clay-700 text-white text-xs font-medium transition shadow-soft"
            >
              <Play className="w-3.5 h-3.5" />自動演示
            </button>
          ) : (
            <button
              onClick={stopDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-100 hover:bg-rose-200 border border-rose-300 text-rose-800 text-xs font-medium transition"
            >
              <Square className="w-3.5 h-3.5" />停止
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* ── Roadmap view ── */}
        <AnimatePresence mode="wait">
          {showRoadmap && (
            <motion.div key="roadmap" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
              <RoadmapView />
            </motion.div>
          )}
        </AnimatePresence>

        {!showRoadmap && (
          <>
            {/* ── Scenario picker ── */}
            <section>
              <h2 className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-3">選擇情境</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                {SCENARIO_LIST.map((sid) => {
                  const sc = SCENARIOS[sid];
                  const on = sid === scenarioId;
                  return (
                    <button
                      key={sid}
                      onClick={() => { setScenarioId(sid); stopDemo(); }}
                      className={`rounded-xl border p-2.5 text-left transition text-xs font-medium leading-snug ${on ? 'bg-white border-clay-300 shadow-soft text-clay-800 ring-1 ring-clay-200' : 'bg-paper-50 border-paper-300 text-stone-600 hover:bg-paper-100'}`}
                    >
                      <div className={`inline-block px-1.5 py-0.5 rounded-md border text-[10px] font-semibold mb-1.5 ${SEV_COLORS[sc.severity] || 'bg-stone-100 text-stone-600 border-stone-300'}`}>
                        {sc.severityLabel}
                      </div>
                      <div className="font-semibold text-stone-800 leading-tight mb-0.5">{sc.shortName}</div>
                      <div className="text-[10px] text-stone-500 leading-snug">{sc.region}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Stage nav ── */}
            <nav ref={stageNavRef} className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              {STAGES.map((stage) => {
                const Icon = stage.icon;
                const on = stage.id === stageId && !showRoadmap;
                const isCrossAgency = stage.crossAgencyStage && !scenario.crossAgency;
                return (
                  <button
                    key={stage.id}
                    data-active={on}
                    onClick={() => { setStageId(stage.id); setShowRoadmap(false); stopDemo(); }}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium whitespace-nowrap shrink-0 transition ${on ? 'bg-white border-clay-300 text-clay-800 shadow-soft' : isCrossAgency ? 'bg-paper-50 border-paper-200 text-stone-400' : 'bg-paper-50 border-paper-300 text-stone-600 hover:bg-paper-100'}`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${on ? 'text-clay-600' : isCrossAgency ? 'text-stone-300' : 'text-stone-400'}`} />
                    {stage.name}
                  </button>
                );
              })}
            </nav>

            {/* ── Auto demo progress bar ── */}
            {demoRunning && (
              <div className="h-1 rounded-full bg-paper-200 overflow-hidden">
                <motion.div
                  className="h-full bg-clay-500 rounded-full"
                  initial={{ width: '0%' }}
                  animate={{ width: `${((currentStageIdx + 1) / DEMO_STAGES.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
            )}

            {/* ── Stage content ── */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`${scenarioId}-${stageId}`}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                {stageId === 'overview' && <OverviewView scenario={scenario} onStageClick={(id) => { setStageId(id); stopDemo(); }} />}
                {stageId === 'ingestion' && <IngestionView scenario={scenario} />}
                {stageId === 'pipeline' && <PipelineView scenario={scenario} />}
                {stageId === 'risk' && <RiskView scenario={scenario} />}
                {stageId === 'hitl1' && (
                  <HITL1View
                    scenario={scenario}
                    decisions={hitl1Decisions}
                    onDecision={onHitl1Decision}
                  />
                )}
                {stageId === 'audience' && <AudienceView scenario={scenario} />}
                {stageId === 'hitl2' && (
                  <HITL2View
                    scenario={scenario}
                    hitl2Decisions={hitl2Decisions}
                    onHitl2Decision={onHitl2Decision}
                  />
                )}
                {stageId === 'delivery' && (
                  <DeliveryView
                    scenario={scenario}
                    hitl2Decisions={hitl2Decisions}
                  />
                )}
                {stageId === 'crossagency' && <CrossAgencyView scenario={scenario} />}
              </motion.div>
            </AnimatePresence>

            {/* ── Prev / Next navigation ── */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={goPrev}
                disabled={currentStageIdx <= 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-paper-300 text-sm text-stone-600 hover:bg-paper-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />上一步
              </button>
              <span className="text-xs text-stone-400">{currentStageIdx + 1} / {STAGES.length}</span>
              <button
                onClick={goNext}
                disabled={currentStageIdx >= STAGES.length - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-paper-300 text-sm text-stone-600 hover:bg-paper-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                下一步<ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="mt-12 border-t border-paper-300 bg-paper-100 py-6 text-center">
        <p className="text-xs text-stone-400">OASIS · 國際疫情情資 Multi-Agent AI 系統 · PoC 互動原型</p>
        <p className="text-xs text-stone-400 mt-1">疾病管制署 · 概念驗證展示，非正式系統</p>
      </footer>
    </div>
  );
}
