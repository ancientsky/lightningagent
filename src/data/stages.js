import {
  Activity, Database, Network, Brain, ShieldAlert, Users, FileCheck, Send, GitBranch,
} from 'lucide-react';

// The per-scenario agent pipeline. Cross-agency orchestration is appended as the
// final stage and only fully "activates" for scenarios flagged crossAgency.
export const STAGES = [
  { id: 'overview', name: '系統總覽', icon: Activity, desc: '架構與情境' },
  { id: 'ingestion', name: '① 多模態收集', icon: Database, desc: '四路擷取 + 查證' },
  { id: 'pipeline', name: '② 處理管線', icon: Network, desc: '分類、擷取、去重' },
  { id: 'risk', name: '③ 風險評估', icon: Brain, desc: '三層推理 Agent' },
  { id: 'hitl1', name: '④ HITL 分流審查', icon: ShieldAlert, desc: '人工把關決策' },
  { id: 'audience', name: '⑤ 受眾撰稿', icon: Users, desc: '四個專屬 Agent' },
  { id: 'hitl2', name: '⑥ 發布審查', icon: FileCheck, desc: '差異化審核閘門' },
  { id: 'delivery', name: '⑦ 遞送與審計', icon: Send, desc: '通道與追蹤' },
  { id: 'crossagency', name: '⑧ 跨部會協作', icon: GitBranch, desc: 'A2A / MCP 協調', crossAgencyStage: true },
];

export const AUDIENCE_LABELS = {
  airport: '機場檢疫',
  analyst: '分析師 / 協力',
  executive: '長官',
  public: '民眾',
};
