import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Send, Plane, Briefcase, Mail, Megaphone, CheckCircle2, Clock,
  Shield, FileText, ChevronDown, ChevronUp,
} from 'lucide-react';
import { Card, Pill, ManualVsAuto } from '../ui.jsx';
import { getPublishStatus } from '../../lib/ui.js';
import AirportDashboard from '../AirportDashboard.jsx';
import ExecutiveBriefing from '../ExecutiveBriefing.jsx';

const CHANNEL_META = {
  airport: { icon: Plane, label: '機場檢疫站', tint: 'teal' },
  analyst: { icon: Briefcase, label: '內部入口網', tint: 'blue' },
  executive: { icon: Mail, label: '長官 Email + 簡訊', tint: 'amber' },
  public: { icon: Megaphone, label: '官網 + 媒體', tint: 'purple' },
};

// Map the publish-status string from getPublishStatus() to card styling.
const STATUS_PILL = {
  published: { tone: 'green', label: '已發布', card: 'bg-emerald-50 border-emerald-200', icon: 'text-emerald-600' },
  awaiting_hitl1: { tone: 'amber', label: '待 HITL①', card: 'bg-amber-50 border-amber-200', icon: 'text-amber-600' },
  awaiting_hitl2: { tone: 'amber', label: '待 HITL②', card: 'bg-amber-50 border-amber-200', icon: 'text-amber-600' },
  revising: { tone: 'amber', label: '退回修改', card: 'bg-amber-50 border-amber-200', icon: 'text-amber-600' },
  rejected: { tone: 'red', label: '已拒絕', card: 'bg-rose-50 border-rose-200', icon: 'text-rose-500' },
};

export default function DeliveryView({ scenario, hitl1Decisions, hitl2Decisions }) {
  const [auditOpen, setAuditOpen] = useState(false);

  const channels = Object.entries(scenario.delivery || {});
  const execStatus = getPublishStatus(scenario, 'executive', hitl1Decisions, hitl2Decisions);

  return (
    <div className="space-y-5">
      {/* Channel status */}
      <Card title="⑦ 遞送通道狀態" icon={Send} accent="text-clay-500">
        <p className="text-xs text-stone-500 mb-4">各通道依審核結果即時更新，審核中的通道顯示待決狀態。</p>
        <div className="space-y-3">
          {channels.map(([audience, ch]) => {
            const meta = CHANNEL_META[audience];
            if (!meta) return null;
            const Icon = meta.icon;
            const status = getPublishStatus(scenario, audience, hitl1Decisions, hitl2Decisions);
            const st = STATUS_PILL[status] || STATUS_PILL.published;

            return (
              <motion.div
                key={audience}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 }}
                className={`flex items-center gap-3 p-3 rounded-xl border ${st.card}`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${st.icon}`} />
                <div className="flex-1">
                  <div className="text-sm font-medium text-stone-800">{meta.label}</div>
                  <div className="text-xs text-stone-500">{ch.channel}</div>
                </div>
                <Pill color={st.tone}>{st.label}</Pill>
              </motion.div>
            );
          })}
        </div>

        <ManualVsAuto
          manual="各通道發布靠人工逐一操作，狀態分散在不同系統，難以追蹤"
          auto="單一 Agent 統一派送，即時回寫狀態，一個介面看全貌"
          savings="發布作業從多人協作數小時壓縮至分鐘級"
        />
      </Card>

      {/* Airport dashboard mockup — only for scenarios with airport context
          (skipped for domestic clusters where the case already slipped the border) */}
      {scenario.outputs?.airport && <AirportDashboard scenario={scenario} />}

      {/* Executive briefing mockup — lock-screen push + formal email */}
      {scenario.outputs?.executive && (
        <ExecutiveBriefing scenario={scenario} status={execStatus} />
      )}

      {/* Audit trail */}
      <Card title="審計追蹤" icon={Shield} accent="text-stone-500">
        <button
          onClick={() => setAuditOpen((v) => !v)}
          className="w-full flex items-center justify-between text-sm text-stone-600 hover:text-stone-800 transition"
        >
          <span className="flex items-center gap-2"><FileText className="w-4 h-4" />查看完整操作紀錄</span>
          {auditOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {auditOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 space-y-2"
          >
            {[
              { t: '00:00', who: 'WEB Agent', act: '訊息擷取完成', ok: true },
              { t: '00:04', who: 'OCR / AV / FACT Agent', act: '多模態查驗完成', ok: true },
              { t: '00:12', who: 'Pipeline Agent', act: '翻譯 / 分類 / 去重完成', ok: true },
              { t: '00:18', who: 'Risk Agent (三層)', act: `風險研判 ${scenario.risk?.layer3?.levelLabel}風險`, ok: true },
              { t: '00:20', who: '疫情官', act: 'HITL① 審查', ok: true },
              { t: '00:45', who: '4 路受眾 Agent', act: '差異化撰稿完成', ok: true },
              { t: '01:10', who: '疫情官 / 發言人', act: 'HITL② 審查完成', ok: true },
              { t: '01:12', who: 'Delivery Agent', act: '各通道發布', ok: true },
            ].map((row, i) => (
              <div key={i} className="flex items-center gap-3 text-xs">
                <span className="w-10 text-stone-400 font-mono shrink-0">+{row.t}</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <span className="text-stone-500 shrink-0">{row.who}</span>
                <span className="text-stone-700">{row.act}</span>
              </div>
            ))}
          </motion.div>
        )}
      </Card>
    </div>
  );
}
