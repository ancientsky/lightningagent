import React from 'react';
import { Megaphone, MessageCircle, Globe, ChevronLeft, Info, Printer } from 'lucide-react';
import { Card, PublishStatusBanner } from './ui.jsx';
import { useClock } from '../lib/hooks.js';

const pad = (n) => String(n).padStart(2, '0');

// Split the news body into paragraph / bullet-list blocks.
function parseBody(body) {
  const blocks = [];
  let bullets = [];
  const flush = () => { if (bullets.length) { blocks.push({ type: 'ul', items: bullets }); bullets = []; } };
  body.split('\n').forEach((raw) => {
    const line = raw.trim();
    if (line.startsWith('•')) bullets.push(line.replace(/^•\s*/, ''));
    else { flush(); if (line) blocks.push({ type: 'p', text: line }); }
  });
  flush();
  return blocks;
}

export default function PublicBroadcast({ scenario, status }) {
  const { now, dateStr, hmStr } = useClock();
  const p = scenario.outputs.public;
  const sms = p.sms || p.title;
  const blocks = parseBody(p.body || '');

  const dateSlash = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())}`;
  const [a0, a1] = scenario.id.split('_');
  const trace = `${a0}_${(a1 || '').slice(0, 2)}-mpp7vs`;
  const bracketTag = p.title.match(/^【(.*?)】/)?.[1] || '疫情通報';
  const secondTag = scenario.cluster ? '本土防治' : '旅遊建議';

  return (
    <Card title="民眾端實際畫面 · 雙版本 Mockup (疾管家LINE@ + 官網新聞稿)" icon={Megaphone} accent="text-clay-500">
      <p className="text-xs text-stone-500 -mt-1 mb-4">檢視民眾實際看到的格式 · 隨情境切換、隨 HITL 決策更新狀態</p>

      <PublishStatusBanner status={status} audience="public" scenario={scenario} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* ── 疾管家 LINE@ ── */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-2">
            <MessageCircle className="w-3.5 h-3.5" />疾管家 LINE@ 推播 · <span className="text-[#06C755] font-medium">官方帳號</span>
          </div>
          <div className="mx-auto max-w-[280px] rounded-[2rem] bg-stone-900 border-[6px] border-stone-800 shadow-lift overflow-hidden">
            <div className="flex items-center justify-between px-5 pt-3 pb-1 text-[10px] text-stone-300 font-mono bg-white">
              <span className="text-stone-700">{hmStr}</span>
              <span className="flex items-center gap-1 text-stone-700">
                <span className="flex gap-0.5 items-end">
                  {[2, 3, 4, 5].map((h) => <span key={h} className="w-0.5 bg-stone-600 rounded-sm" style={{ height: h }} />)}
                </span>
                5G
                <span className="ml-1 inline-block w-4 h-2 border border-stone-500 rounded-sm relative"><span className="absolute inset-0.5 bg-stone-600 rounded-[1px]" /></span>
              </span>
            </div>
            {/* LINE chat header */}
            <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-stone-200">
              <ChevronLeft className="w-4 h-4 text-stone-400 shrink-0" />
              <div className="w-8 h-8 rounded-full bg-[#06C755] flex items-center justify-center text-white text-xs font-bold shrink-0">疾</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-stone-800 leading-tight">疾管家</div>
                <div className="text-[10px] text-stone-400 leading-tight">衛生福利部疾病管制署</div>
              </div>
              <Info className="w-4 h-4 text-stone-400 shrink-0" />
            </div>
            {/* chat body */}
            <div className="px-3 py-4 bg-[#9bbbd4] min-h-[280px] space-y-1.5">
              <div className="text-center text-[10px] text-white/90 mb-2">今天 {hmStr}</div>
              <div className="max-w-[88%]">
                <div className="rounded-2xl rounded-tl-md bg-white p-3 text-xs text-stone-700 leading-relaxed shadow-sm">
                  {sms}
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-white/90">
                  <span>{[...sms].length} 字</span><span>·</span><span>已讀 {hmStr}</span>
                </div>
                <button type="button" className="mt-2 w-full py-2 rounded-xl bg-white text-[#06A24A] text-xs font-medium shadow-sm hover:bg-stone-50 transition flex items-center justify-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" />查看完整通報
                </button>
              </div>
            </div>
          </div>
          {p.pushTarget && <p className="text-[11px] text-stone-500 mt-2 text-center">推送對象：{p.pushTarget}</p>}
          <p className="text-[11px] text-stone-400 mt-1 text-center">自動篩選自疾管署檢疫資料庫，僅推送給相關旅客，避免擾民。</p>
        </div>

        {/* ── CDC website news ── */}
        <div>
          <div className="flex items-center gap-1.5 text-[11px] text-stone-500 mb-2">
            <Globe className="w-3.5 h-3.5" />疾管署官網新聞稿 · <span className="text-stone-400 truncate">https://www.cdc.gov.tw/Bulletin/Detail/…</span>
          </div>
          <div className="rounded-xl border border-paper-300 overflow-hidden shadow-soft bg-white">
            {/* browser chrome */}
            <div className="flex items-center gap-2 px-3 py-2 bg-paper-100 border-b border-paper-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="flex-1 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white border border-paper-300 text-[11px] text-stone-500 min-w-0">
                <span className="text-emerald-600">🔒</span>
                <span className="truncate font-mono">www.cdc.gov.tw/Bulletin/Detail/{scenario.id}</span>
              </div>
            </div>
            {/* CDC header */}
            <div className="px-4 py-3 flex items-center gap-2 border-b border-paper-200">
              <div className="px-1.5 py-1 rounded bg-teal-700 text-white text-[10px] font-bold tracking-wide">CDC</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold text-teal-800 leading-tight">衛生福利部 疾病管制署</div>
                <div className="text-[9px] text-stone-400 leading-tight">Taiwan Centers for Disease Control</div>
              </div>
              <div className="hidden md:flex items-center gap-2.5 text-[10px] text-stone-500">
                <span>首頁</span><span className="text-teal-700 font-medium">國際疫情</span><span>傳染病介紹</span><span>1922 專線</span>
              </div>
            </div>
            {/* article */}
            <div className="px-4 py-3">
              <div className="text-[10px] text-stone-400 mb-2 truncate">首頁 › 國際疫情通報 › {p.title}</div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[10px]">{bracketTag}</span>
                <span className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px]">{secondTag}</span>
              </div>
              <h4 className="text-base font-semibold text-stone-900 font-serif mb-2 leading-snug">{p.title}</h4>
              <div className="text-[10px] text-stone-400 mb-3 pb-3 border-b border-paper-200">
                發布日期：{dateSlash}　·　更新時間：{hmStr}　·　資料來源：疾病管制署 OASIS 系統
              </div>
              <div className="space-y-2 text-xs text-stone-700 leading-relaxed">
                {blocks.map((b, i) => b.type === 'ul' ? (
                  <ul key={i} className="space-y-1 pl-1">
                    {b.items.map((it, j) => (
                      <li key={j} className="flex gap-1.5"><span className="text-clay-500 shrink-0">•</span><span>{it}</span></li>
                    ))}
                  </ul>
                ) : (
                  <p key={i}>{b.text}</p>
                ))}
              </div>
              {/* share row */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-paper-200">
                <span className="text-[11px] text-stone-400">分享：</span>
                <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-[11px]">LINE</span>
                <span className="px-2 py-1 rounded bg-blue-50 text-blue-700 text-[11px]">Facebook</span>
                <span className="px-2 py-1 rounded bg-paper-100 text-stone-600 text-[11px]">Email</span>
                <span className="px-2 py-1 rounded bg-paper-100 text-stone-600 text-[11px] flex items-center gap-1"><Printer className="w-3 h-3" />列印</span>
                <span className="ml-auto text-[10px] text-stone-400">資料維護：疫情監測科 · 撥打 1922</span>
              </div>
            </div>
            {/* footer */}
            <div className="flex items-center justify-between px-4 py-2 bg-paper-50 border-t border-paper-200 text-[10px] text-stone-400">
              <span>© 衛生福利部疾病管制署</span>
              <span className="font-mono">trace: {trace}</span>
            </div>
          </div>
        </div>
      </div>

      <p className="text-xs text-stone-500 mt-4">
        疾管家 LINE@ 只推給相關旅客（精準推送、簡短易讀）；官網新聞稿是完整版（民眾主動查閱、可深入閱讀）。
        兩者分工互補：急用即時推播、深度資訊用官網。發言人或副署長拒絕發布時，下方草稿仍保留以供討論修訂，符合「Agent 提建議、人類決策」的治理原則。
      </p>
    </Card>
  );
}
