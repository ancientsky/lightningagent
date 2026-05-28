import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Briefcase, Mail, Megaphone, FileText, Stethoscope, ListChecks, Quote,
} from 'lucide-react';
import { Card, Pill, SectionLabel, ManualVsAuto } from '../ui.jsx';

const META = {
  airport: { name: '機場檢疫官', icon: Plane, tint: 'teal', desc: '即時儀表板 + 告警' },
  analyst: { name: '分析師 / 協力單位', icon: Briefcase, tint: 'blue', desc: '完整分析 + 技術摘要' },
  executive: { name: '長官 / 高層', icon: Mail, tint: 'amber', desc: 'Email 摘要 + 一鍵核可' },
  public: { name: '民眾', icon: Megaphone, tint: 'purple', desc: '白話衛教 + 1922' },
};

export default function AudienceView({ scenario }) {
  const available = scenario.audiences.filter((a) => scenario.outputs[a]);
  const [active, setActive] = useState(available[0]);
  const out = scenario.outputs[active];
  const meta = META[active];

  return (
    <div className="space-y-5">
      <Card title="受眾差異化撰稿 — 同一則疫情，四種版本" icon={FileText} accent="text-clay-500">
        <p className="text-xs text-stone-500 mb-4">這正是 multi-agent 相對單一 LLM 的核心價值：不同受眾需要的「版本」完全不同。</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {available.map((a) => {
            const m = META[a];
            const Icon = m.icon;
            const on = a === active;
            return (
              <button
                key={a}
                onClick={() => setActive(a)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition ${on ? 'bg-white border-clay-200 text-clay-700 shadow-soft' : 'bg-paper-50 border-paper-300 text-stone-500 hover:bg-paper-100'}`}
              >
                <Icon className={`w-4 h-4 ${on ? 'text-clay-600' : 'text-stone-400'}`} />
                {m.name}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="rounded-2xl border border-paper-300 overflow-hidden"
          >
            <div className="px-4 py-3 bg-paper-50 border-b border-paper-300 flex items-center gap-2">
              <meta.icon className="w-4 h-4 text-clay-600" />
              <span className="text-sm font-medium text-stone-800">{out.title}</span>
              {out.priority && <Pill color={out.priority === 'critical' ? 'red' : out.priority === 'high' ? 'amber' : out.priority === 'low' ? 'stone' : 'teal'} size="xs">{out.priority}</Pill>}
            </div>
            <div className="p-4">
              {active === 'airport' && <AirportDraft out={out} />}
              {active === 'analyst' && <AnalystDraft out={out} />}
              {active === 'executive' && <ExecutiveDraft out={out} />}
              {active === 'public' && <PublicDraft out={out} />}
            </div>
          </motion.div>
        </AnimatePresence>

        <ManualVsAuto
          manual="一份新聞稿改寫成各版本，靠承辦手動調語氣，常常顧此失彼"
          auto="四個專屬 Agent 同時產出，語氣、深度、通道各自最佳化"
          savings="撰稿從 2 小時縮短至約 10 分鐘"
        />
      </Card>
    </div>
  );
}

function AirportDraft({ out }) {
  return (
    <div className="space-y-3 text-xs">
      {out.flights?.length > 0 && (
        <div>
          <SectionLabel>關注航班</SectionLabel>
          <div className="space-y-1.5">
            {out.flights.map((f, i) => (
              <div key={i} className="flex flex-wrap items-center gap-2 p-2 rounded-lg bg-paper-50 border border-paper-300">
                <Pill color="teal" size="xs">{f.code}</Pill>
                <span className="text-stone-600">{f.route}</span>
                <span className="text-stone-400">· {f.eta}</span>
                <span className="ml-auto text-clay-600 font-medium">{f.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div>
        <SectionLabel>症狀提示</SectionLabel>
        <div className="flex items-center gap-2 mb-2 text-stone-500"><Stethoscope className="w-3.5 h-3.5" /><span>{out.differentialKey}</span></div>
        <div className="flex flex-wrap gap-1.5">
          {out.symptoms.map((s, i) => <Pill key={i} color="stone" size="xs">{s}</Pill>)}
        </div>
      </div>
      <div className="p-2.5 rounded-lg bg-teal-50 border border-teal-100 text-teal-800">{out.protocol}</div>
    </div>
  );
}

function AnalystDraft({ out }) {
  return (
    <div className="space-y-3">
      {out.sections.map((s, i) => (
        <div key={i}>
          <div className="text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1.5"><ListChecks className="w-3.5 h-3.5 text-blue-500" />{s.h}</div>
          <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line pl-5">{s.b}</p>
        </div>
      ))}
    </div>
  );
}

function ExecutiveDraft({ out }) {
  return (
    <div className="space-y-3 text-xs">
      <div className="p-3 rounded-lg bg-amber-50 border border-amber-100 text-stone-700">{out.summary}</div>
      {out.decisions?.length > 0 ? (
        <div className="space-y-2">
          {out.decisions.map((d, i) => (
            <div key={i} className="p-2.5 rounded-lg bg-paper-50 border border-paper-300">
              <div className="font-medium text-stone-800 mb-1">{d.q}</div>
              <div className="flex flex-wrap gap-x-3 gap-y-1">
                <span className="text-emerald-700">建議：{d.rec}</span>
                <span className="text-stone-500">{d.risk}</span>
              </div>
            </div>
          ))}
        </div>
      ) : <div className="text-stone-400 italic">例行知會，無待決事項。</div>}
      {out.deadline && <div className="text-rose-600 font-medium">⏰ {out.deadline}</div>}
    </div>
  );
}

function PublicDraft({ out }) {
  return (
    <div className="text-xs">
      <div className="flex items-start gap-2 text-stone-700 leading-relaxed whitespace-pre-line">
        <Quote className="w-4 h-4 text-purple-400 shrink-0" />
        <div>{out.body}</div>
      </div>
      {out.autoApproved && (
        <div className="mt-3 p-2 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">{out.approvalRule}</div>
      )}
    </div>
  );
}
