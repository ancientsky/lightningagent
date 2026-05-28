import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  GitBranch, Zap, CheckCircle2, Clock, ArrowRight, RefreshCw,
  MessageCircle, Send, FileText, Sparkles, Check,
} from 'lucide-react';
import { Card, Pill, SectionLabel, ManualVsAuto } from '../ui.jsx';
import {
  HUB, AGENCIES, FLOW_COMPARE, LINE_CONTACTS, LINE_MESSAGE, OFFICIAL_DOC,
} from '../../data/crossAgency.js';

// Colors per tint
const tintStyles = {
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', pill: 'teal', dot: 'bg-teal-500', badge: 'text-teal-700' },
  clay: { bg: 'bg-clay-50/70', border: 'border-clay-200', pill: 'clay', dot: 'bg-clay-500', badge: 'text-clay-700' },
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', pill: 'amber', dot: 'bg-amber-500', badge: 'text-amber-700' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-200', pill: 'red', dot: 'bg-rose-500', badge: 'text-rose-700' },
};

function AgencyConsole({ agency, dispatched, runKey }) {
  const [phase, setPhase] = useState('idle'); // idle | ack | result
  const styles = tintStyles[agency.tint] || tintStyles.teal;

  useEffect(() => {
    if (!dispatched) { setPhase('idle'); return; }
    const t1 = setTimeout(() => setPhase('ack'), agency.ackMs);
    const t2 = setTimeout(() => setPhase('result'), agency.ackMs + 1200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [dispatched, agency.ackMs, runKey]);

  const Icon = agency.icon;

  return (
    <div className={`rounded-xl border p-3.5 transition ${styles.bg} ${styles.border}`}>
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${styles.bg} border ${styles.border}`}>
          <Icon className={`w-4 h-4 ${styles.badge}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-xs font-semibold text-stone-800 leading-snug">{agency.ministry}</div>
          <div className="text-[11px] text-stone-500">{agency.unit}</div>
        </div>
        <Pill color={styles.pill} size="xs">{agency.protocol}</Pill>
      </div>

      {/* Terminal-style call */}
      <div className="mb-3 px-2.5 py-2 rounded-lg bg-stone-900/90 font-mono text-[10px] text-teal-300 break-all">
        <span className="text-stone-500">$ </span>{agency.call}
      </div>

      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-[11px] text-stone-400">
            <Clock className="w-3 h-3" />等待派送…
          </motion.div>
        )}
        {phase === 'ack' && (
          <motion.div key="ack" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-[11px] text-amber-700">
            <Zap className="w-3 h-3 animate-pulse" />已收到任務，預計 {agency.eta}
          </motion.div>
        )}
        {phase === 'result' && (
          <motion.div key="result" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-1.5">
            <div className={`text-[11px] font-semibold flex items-center gap-1.5 ${styles.badge}`}>
              <CheckCircle2 className="w-3.5 h-3.5" />{agency.result.headline}
            </div>
            {agency.result.fields.map(([k, v], i) => (
              <div key={i} className="flex justify-between text-[11px] px-2 py-1 rounded bg-white/60 border border-white/80">
                <span className="text-stone-500">{k}</span>
                <span className="text-stone-800 font-medium">{v}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── POC: LINE 即時通知 各部會窗口（可勾選） ──
function LineNotify() {
  const [selected, setSelected] = useState(
    () => Object.fromEntries(LINE_CONTACTS.map((c) => [c.id, c.defaultOn]))
  );
  const [sent, setSent] = useState(false);
  const [readMap, setReadMap] = useState({});

  const chosen = LINE_CONTACTS.filter((c) => selected[c.id]);

  function toggle(id) {
    setSelected((p) => ({ ...p, [id]: !p[id] }));
    setSent(false);
    setReadMap({});
  }

  function send() {
    if (chosen.length === 0) return;
    setSent(true);
    setReadMap({});
    chosen.forEach((c, i) => {
      setTimeout(() => setReadMap((p) => ({ ...p, [c.id]: true })), 700 + i * 450);
    });
  }

  return (
    <Card title="LINE 即時通知 · 各部會窗口" icon={MessageCircle} accent="text-emerald-600">
      <p className="text-xs text-stone-500 mb-4">A2A / MCP 是機器對機器；這一層把同一則情資即時推給「人」的承辦窗口，可自由勾選通報對象。</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Contact picker */}
        <div>
          <SectionLabel>選擇通報窗口（{chosen.length} / {LINE_CONTACTS.length}）</SectionLabel>
          <div className="space-y-2">
            {LINE_CONTACTS.map((c) => {
              const on = selected[c.id];
              return (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className={`w-full flex items-center gap-3 p-2.5 rounded-xl border text-left transition ${on ? 'bg-emerald-50 border-emerald-300' : 'bg-paper-50 border-paper-300 hover:bg-paper-100'}`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 ${on ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-stone-300'}`}>
                    {on && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-stone-800">{c.ministry}</div>
                    <div className="text-[11px] text-stone-500">{c.name} · {c.role}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <button
            onClick={send}
            disabled={chosen.length === 0}
            className="mt-3 w-full flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-sm font-medium transition shadow-soft"
          >
            <Send className="w-4 h-4" />發送 LINE 通知給 {chosen.length} 個窗口
          </button>
        </div>

        {/* LINE chat mockup */}
        <div className="rounded-2xl overflow-hidden border border-paper-300 bg-[#8aabd4]/20">
          <div className="px-4 py-2.5 bg-emerald-600 text-white flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span className="text-xs font-medium">疾管署應變群組</span>
            <span className="ml-auto text-[10px] opacity-80">{chosen.length} 位成員</span>
          </div>
          <div className="p-3 space-y-2 min-h-[220px] bg-[#aebfd4]/25">
            {!sent ? (
              <div className="h-full flex items-center justify-center text-xs text-stone-500 py-12">
                勾選窗口後按「發送」即可預覽推播
              </div>
            ) : (
              <>
                {/* Outgoing bubble */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-[#9ee07a] px-3 py-2 text-[11px] text-stone-800 leading-relaxed shadow-sm">
                    <div className="font-semibold mb-1">{LINE_MESSAGE.title}</div>
                    {LINE_MESSAGE.lines.map((l, i) => <div key={i}>{l}</div>)}
                    <div className="mt-1 text-[10px] text-stone-600/80">{LINE_MESSAGE.footer}</div>
                  </div>
                </motion.div>
                {/* Read receipts */}
                <div className="flex flex-wrap gap-1.5 justify-end pt-1">
                  {chosen.map((c) => (
                    <motion.span
                      key={c.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border ${readMap[c.id] ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-white border-stone-200 text-stone-400'}`}
                    >
                      {readMap[c.id] ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {c.name} {readMap[c.id] ? '已讀' : '送出中'}
                    </motion.span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ManualVsAuto
        manual="承辦逐一打電話 / 傳真給各窗口，名單靠記憶，常漏通知或重複轉述"
        auto="一次勾選、即時群發 LINE，已讀回條一目了然，通報對象可彈性調整"
        savings="通報窗口從電話接力數十分鐘縮短至秒級群發"
      />
    </Card>
  );
}

// ── POC: 制式通知公文 自動生成 ──
function AutoDoc() {
  const [generated, setGenerated] = useState(false);

  const reveal = (i) => ({
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0 },
    transition: { delay: i * 0.12 },
  });

  return (
    <Card title="制式通知公文 · 自動生成" icon={FileText} accent="text-clay-500">
      <p className="text-xs text-stone-500 mb-4">即時訊息流之外，仍需正式公文存查。Agent 依群聚研判資料自動套入標準公文格式，承辦不必再從頭打字。</p>

      {!generated ? (
        <button
          onClick={() => setGenerated(true)}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-clay-300 text-clay-700 hover:bg-clay-50/60 transition text-sm font-medium"
        >
          <Sparkles className="w-4 h-4" />一鍵自動生成通知公文
        </button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border border-paper-300 bg-white p-5 font-serif text-stone-800"
        >
          <motion.div {...reveal(0)} className="text-center text-base font-semibold tracking-wide mb-4">{OFFICIAL_DOC.org}</motion.div>

          <motion.div {...reveal(1)} className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-stone-600 border-y border-paper-300 py-2.5 mb-3">
            {OFFICIAL_DOC.meta.map(([k, v], i) => (
              <div key={i} className="flex gap-1.5"><span className="text-stone-400 shrink-0">{k}：</span><span className="text-stone-700">{v}</span></div>
            ))}
          </motion.div>

          <motion.div {...reveal(2)} className="text-xs text-stone-600 mb-3">{OFFICIAL_DOC.to}</motion.div>
          <motion.div {...reveal(3)} className="text-sm font-medium text-stone-900 mb-3 leading-relaxed">{OFFICIAL_DOC.subject}</motion.div>

          <SectionLabel>說明</SectionLabel>
          <div className="space-y-2 mb-3">
            {OFFICIAL_DOC.body.map((p, i) => (
              <motion.p key={i} {...reveal(4 + i)} className="text-xs text-stone-700 leading-relaxed">{p}</motion.p>
            ))}
          </div>

          <motion.div {...reveal(8)} className="text-xs text-stone-500 border-t border-paper-300 pt-2.5">{OFFICIAL_DOC.cc}</motion.div>

          <motion.div {...reveal(9)} className="flex flex-wrap items-center justify-between gap-2 mt-4 pt-3 border-t border-paper-300 font-sans">
            <span className="flex items-center gap-1.5 text-[11px] text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" />Agent 已套用標準公文格式，待承辦核章</span>
            <button onClick={() => setGenerated(false)} className="flex items-center gap-1 text-[11px] text-stone-400 hover:text-stone-600">
              <RefreshCw className="w-3 h-3" />重新生成
            </button>
          </motion.div>
        </motion.div>
      )}

      <ManualVsAuto
        manual="承辦對著範本逐字填寫公文，格式、文號、附件一處出錯就退件重來"
        auto="Agent 依研判資料自動帶入受文者、主旨、說明與附件，格式一致、即時產出"
        savings="公文撰擬從 1～2 小時縮短至數秒，承辦只需核章"
      />
    </Card>
  );
}

export default function CrossAgencyView({ scenario }) {
  const [runKey, setRunKey] = useState(0);
  const [dispatched, setDispatched] = useState(false);
  const [dispatchedAgents, setDispatchedAgents] = useState({});

  const isCrossAgency = !!scenario.crossAgency;

  function handleDispatch() {
    setRunKey((k) => k + 1);
    setDispatched(false);
    setDispatchedAgents({});
    setTimeout(() => {
      setDispatched(true);
      AGENCIES.forEach((ag) => {
        setTimeout(() => {
          setDispatchedAgents((prev) => ({ ...prev, [ag.id]: true }));
        }, ag.ackMs - 200);
      });
    }, 600);
  }

  if (!isCrossAgency) {
    return (
      <div className="space-y-5">
        <Card title="⑧ 跨部會 A2A / MCP 協作" icon={GitBranch} accent="text-stone-500">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-paper-100 border border-paper-300">
            <GitBranch className="w-5 h-5 text-stone-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-stone-600 mb-1">本情境無跨部會應變需求</div>
              <div className="text-xs text-stone-500">跨部會 A2A / MCP 協調僅在本土群聚疫情（如：登革熱本土群聚）時啟動。請切換至「登革熱本土群聚」情境以體驗完整流程。</div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Cluster narrative */}
      {scenario.cluster && (
        <Card title="群聚疫情三幕" icon={GitBranch} accent="text-clay-500">
          <div className="space-y-3">
            {scenario.cluster.acts.map((act, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-3 p-3 rounded-xl bg-paper-50 border border-paper-300"
              >
                <div className="w-6 h-6 rounded-full bg-clay-100 border border-clay-200 flex items-center justify-center text-xs font-semibold text-clay-700 shrink-0">
                  {i + 1}
                </div>
                <div>
                  <div className="text-xs font-semibold text-stone-800 mb-0.5">{act.title}</div>
                  <div className="text-xs text-stone-600">{act.desc}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Hub + dispatch */}
      <Card title="⑧ 跨部會 A2A / MCP 協調中樞" icon={GitBranch} accent="text-clay-500">
        <p className="text-xs text-stone-500 mb-4">群聚情資 Agent 作為協調中樞，以 A2A / MCP 即時派送任務給五個部會 — 取代傳統紙本公文往返。</p>

        {/* Hub card */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-clay-50/80 border border-clay-200 mb-4">
          <div className="w-10 h-10 rounded-xl bg-clay-100 border border-clay-300 flex items-center justify-center shrink-0">
            <GitBranch className="w-5 h-5 text-clay-700" />
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-clay-900">{HUB.name}</div>
            <div className="text-xs text-clay-700">{HUB.org} · {HUB.role}</div>
          </div>
          <button
            onClick={handleDispatch}
            className="flex items-center gap-1.5 px-4 py-2 bg-clay-600 hover:bg-clay-700 text-white rounded-xl text-sm font-medium transition shadow-soft"
          >
            <Zap className="w-4 h-4" />
            {dispatched ? <><RefreshCw className="w-3 h-3" />重新派送</> : '啟動跨部會派送'}
          </button>
        </div>

        {/* Animated flow indicator */}
        {dispatched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700"
          >
            <Zap className="w-3.5 h-3.5 animate-pulse" />
            任務已派送 — 等待各部會 agent 回報…
          </motion.div>
        )}

        {/* Ministry consoles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {AGENCIES.map((ag) => (
            <AgencyConsole
              key={ag.id}
              agency={ag}
              dispatched={dispatched && !!dispatchedAgents[ag.id]}
              runKey={runKey}
            />
          ))}
        </div>

        <ManualVsAuto
          manual={FLOW_COMPARE.before.points.join('；')}
          auto={FLOW_COMPARE.after.points.join('；')}
          savings={`跨部會協調從 ${FLOW_COMPARE.before.metric} 壓縮至 ${FLOW_COMPARE.after.metric}`}
        />
      </Card>

      {/* POC: LINE notification to ministry contacts */}
      <LineNotify />

      {/* POC: auto-generated official document */}
      <AutoDoc />

      {/* Before vs after comparison */}
      <Card title="公文旅行 vs 即時訊息流" icon={ArrowRight} accent="text-stone-500">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200">
            <div className="text-sm font-semibold text-rose-800 mb-3">{FLOW_COMPARE.before.title}</div>
            <ul className="space-y-2">
              {FLOW_COMPARE.before.points.map((pt, i) => (
                <li key={i} className="text-xs text-rose-800 flex items-start gap-2">
                  <span className="text-rose-400 shrink-0 mt-0.5">✗</span>{pt}
                </li>
              ))}
            </ul>
            <div className="mt-3 text-center text-2xl font-serif font-semibold text-rose-700">{FLOW_COMPARE.before.metric}</div>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="text-sm font-semibold text-emerald-800 mb-3">{FLOW_COMPARE.after.title}</div>
            <ul className="space-y-2">
              {FLOW_COMPARE.after.points.map((pt, i) => (
                <li key={i} className="text-xs text-emerald-800 flex items-start gap-2">
                  <span className="text-emerald-500 shrink-0 mt-0.5">✓</span>{pt}
                </li>
              ))}
            </ul>
            <div className="mt-3 text-center text-2xl font-serif font-semibold text-emerald-700">{FLOW_COMPARE.after.metric}</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
