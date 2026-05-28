import React from 'react';
import { Mail, Bell, Siren, FileText } from 'lucide-react';
import { Card, Pill, PublishStatusBanner } from './ui.jsx';
import { useClock } from '../lib/hooks.js';
import { PRIORITY_LABELS } from '../data/airportStation.js';

const FROM = '疾管署 OASIS 緊急應變系統 <oasis-alert@cdc.gov.tw>';
const TO = '副署長、疫情監測科長';
const CC = '署長辦公室';
const SYSTEM = 'OASIS 多代理事件管理系統 v2.6.3';
const REVIEWER = '王副研究員';
const CN_NUM = ['一', '二', '三', '四', '五', '六'];

export default function ExecutiveBriefing({ scenario, status }) {
  const { now, timeStr, dateStr, weekday, hmStr } = useClock();
  const e = scenario.outputs.executive;
  const c = scenario.classification;
  const conf = Math.round((c.confidence ?? 0.9) * 100);
  const reviewConf = Math.round((scenario.risk?.layer3?.confidence ?? 0.85) * 100);
  const corroboration = scenario.dedup?.sourceCorroboration?.[0]?.source;

  const [a0, a1] = scenario.id.split('_');
  const trace = `${a0}_${(a1 || '').slice(0, 2)}-mpp7vs`;
  const prioLabel = e.priority === 'standard' ? '一般' : '高優先';
  const subjectBody = e.title.replace(/^【.*?】/, '');
  const dateLong = `${now.getMonth() + 1}月${now.getDate()}日`;

  return (
    <Card title="長官端實際畫面 · 雙版本 Mockup (推播 + Email)" icon={Mail} accent="text-amber-600">
      <p className="text-xs text-stone-500 -mt-1 mb-4">檢視長官實際收到的格式 · 隨上方情境切換更新內容與優先序</p>

      <PublishStatusBanner status={status} audience="executive" scenario={scenario} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* ── Lock-screen push ── */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-2">
            <Bell className="w-3.5 h-3.5" />手機推播 (lock screen) · <span className="text-rose-600 font-medium">強制顯示</span>
          </div>
          <div className="mx-auto max-w-[280px] rounded-[2rem] bg-stone-900 border-[6px] border-stone-800 shadow-lift overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[10px] text-stone-300 font-mono">
              <span>{hmStr}</span>
              <span className="flex items-center gap-1">
                <span className="flex gap-0.5 items-end">
                  {[2, 3, 4, 5].map((h) => <span key={h} className="w-0.5 bg-stone-300 rounded-sm" style={{ height: h }} />)}
                </span>
                5G
                <span className="ml-1 inline-block w-4 h-2 border border-stone-300 rounded-sm relative"><span className="absolute inset-0.5 bg-stone-300 rounded-[1px]" /></span>
              </span>
            </div>
            <div className="text-center pt-4 pb-5 text-stone-100">
              <div className="text-xs text-stone-400">星期{weekday}，{dateLong}</div>
              <div className="text-6xl font-extralight tracking-tight tabular-nums leading-none mt-1">{hmStr}</div>
            </div>
            <div className="px-3 pb-3 space-y-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-950/40 border border-rose-700/50 text-rose-200 text-xs">
                <Siren className="w-3.5 h-3.5 shrink-0" />{PRIORITY_LABELS[e.priority] || '關注'} · 1 件警示
              </div>
              <div className="rounded-xl bg-stone-800/90 border border-rose-700/40 p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-md bg-rose-600 flex items-center justify-center text-white text-[10px] font-bold shrink-0">疾</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] text-stone-200 font-medium leading-none">疾管署 緊急通報</div>
                    <div className="text-[10px] text-stone-500 mt-0.5">剛剛</div>
                  </div>
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                </div>
                <div className="text-xs text-stone-100 font-medium mb-1 leading-snug">{e.title}</div>
                <div className="text-[11px] text-stone-400 leading-relaxed line-clamp-3">{e.summary}</div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button type="button" className="py-1.5 rounded-lg bg-stone-700 hover:bg-stone-600 text-stone-200 text-xs transition">詳閱</button>
                  <button type="button" className="py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs transition">召開會議</button>
                </div>
              </div>
              <div className="text-center text-[10px] text-stone-500 pt-1 pb-2">向上滑動以查看詳情</div>
            </div>
          </div>
          <p className="text-[11px] text-stone-500 mt-2 text-center">高風險事件強制 push 並可繞過勿擾模式，附「召開會議」一鍵按鈕。</p>
        </div>

        {/* ── Formal email ── */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-2">
            <Mail className="w-3.5 h-3.5" />正式 Email 公文 · <span className="text-stone-400">內含完整內容、附件、決策按鈕</span>
          </div>
          <div className="rounded-xl border border-paper-300 overflow-hidden shadow-soft bg-white">
            {/* window chrome */}
            <div className="flex items-center justify-between px-4 py-2 bg-paper-100 border-b border-paper-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[11px] text-stone-500">收件匣 · 疾管署 OASIS 通報</span>
              <span className="text-[11px] text-stone-400 font-mono">{timeStr}</span>
            </div>
            {/* headers */}
            <div className="px-4 py-3 border-b border-paper-200 space-y-1 text-[11px]">
              <HeaderRow k="寄件者" v={FROM} />
              <HeaderRow k="收件者" v={TO} />
              <HeaderRow k="副本" v={CC} />
              <HeaderRow k="日期" v={`${dateStr} (星期${weekday}) ${hmStr}`} />
              <div className="flex gap-2">
                <span className="text-stone-400 w-12 shrink-0">主旨</span>
                <span className="text-stone-800 font-medium flex-1 flex items-center gap-1.5 flex-wrap">
                  {e.title}<Pill color="red" size="xs">{prioLabel}</Pill>
                </span>
              </div>
            </div>
            {/* body */}
            <div className="px-4 py-3 space-y-3 text-xs text-stone-700 leading-relaxed">
              <div className="text-[11px] text-stone-400 text-center">— 此郵件由 OASIS 多代理系統依分流規則自動產生 —</div>
              <div>副署長 鈞鑒：</div>
              <div>
                <span className="text-stone-500">主旨：</span>
                <div className="pl-3 mt-1 font-medium text-stone-800">{subjectBody}</div>
              </div>
              <div>
                <span className="text-stone-500">說明：</span>
                <div className="pl-3 mt-1">{e.summary}</div>
              </div>
              {e.decisions?.length > 0 && (
                <div>
                  <span className="text-stone-500">建議事項：</span>
                  <div className="mt-1.5 space-y-2">
                    {e.decisions.map((d, i) => (
                      <div key={i} className="border-l-2 border-amber-300 pl-3 py-0.5">
                        <div className="font-medium text-stone-800">{CN_NUM[i]}、{d.q}</div>
                        <div className="text-emerald-700 mt-0.5">建議：{d.rec}</div>
                        {d.risk && <div className="text-stone-500">考量：{d.risk}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {e.deadline && (
                <div className="px-3 py-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
                  <strong>時限：</strong>{e.deadline}
                </div>
              )}
              <div className="pt-2 border-t border-paper-200 space-y-1 text-[11px] text-stone-500">
                <div>系統：{SYSTEM}</div>
                <div>追蹤碼：<span className="font-mono text-stone-600">{trace}</span></div>
                <div>原始來源：{scenario.raw.source}{corroboration ? ` · ${corroboration}` : ''} · 多源比對 (信心 {conf}%)</div>
                <div>分析師審查：已通過 ({REVIEWER} · 信心 {reviewConf}%)</div>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] pt-1">
                <span className="text-stone-400 flex items-center gap-1"><FileText className="w-3 h-3" />附件：</span>
                <span className="text-clay-600">分析師詳版報告.pdf <span className="text-stone-400">(12 KB)</span></span>
                {e.sopDoc && <span className="text-clay-600">· {e.sopDoc}</span>}
              </div>
            </div>
            {/* action buttons */}
            <div className="flex flex-wrap items-center gap-2 px-4 py-3 border-t border-paper-200 bg-paper-50">
              <button type="button" className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition shadow-soft">核准建議方向</button>
              <button type="button" className="px-3 py-1.5 rounded-lg border border-paper-300 text-stone-600 hover:bg-paper-100 text-xs transition">回覆討論</button>
              <button type="button" className="px-3 py-1.5 rounded-lg border border-paper-300 text-stone-600 hover:bg-paper-100 text-xs transition">召集會議</button>
              <span className="ml-auto text-[10px] text-stone-400">點選決策後系統將自動記錄並通知相關單位</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-stone-500 mt-4">
        正式 Email 含完整事件脈絡、決策事項與時限。長官可一鍵核准方向，系統會自動產生回函並通知執行單位，省去傳統簽呈往返。
      </p>
    </Card>
  );
}

const HeaderRow = ({ k, v }) => (
  <div className="flex gap-2">
    <span className="text-stone-400 w-12 shrink-0">{k}</span>
    <span className="text-stone-700 flex-1 break-words">{v}</span>
  </div>
);
