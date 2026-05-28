// Shared color maps & small derivations for the warm "Claude" palette
// (clay primary + teal accent), reused across views.

export const sevColors = {
  red: {
    bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-800',
    accent: 'text-rose-600', soft: 'bg-rose-100', dot: 'bg-rose-500', ring: 'ring-rose-300',
  },
  amber: {
    bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-800',
    accent: 'text-amber-600', soft: 'bg-amber-100', dot: 'bg-amber-500', ring: 'ring-amber-300',
  },
  yellow: {
    bg: 'bg-yellow-50', border: 'border-yellow-200', text: 'text-yellow-800',
    accent: 'text-yellow-600', soft: 'bg-yellow-100', dot: 'bg-yellow-400', ring: 'ring-yellow-300',
  },
};

export const levelColors = {
  high: 'bg-rose-100 text-rose-800 border-rose-300',
  'medium-high': 'bg-orange-100 text-orange-800 border-orange-300',
  medium: 'bg-amber-100 text-amber-800 border-amber-300',
  low: 'bg-yellow-100 text-yellow-800 border-yellow-300',
};

// Tints used by agent / ministry cards.
export const tintMap = {
  teal: { soft: 'bg-teal-50', border: 'border-teal-200', text: 'text-teal-700', accent: 'text-teal-600', strong: 'bg-teal-600', dot: 'bg-teal-500' },
  clay: { soft: 'bg-clay-50', border: 'border-clay-200', text: 'text-clay-700', accent: 'text-clay-600', strong: 'bg-clay-500', dot: 'bg-clay-500' },
  amber: { soft: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', accent: 'text-amber-600', strong: 'bg-amber-500', dot: 'bg-amber-500' },
  rose: { soft: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-700', accent: 'text-rose-600', strong: 'bg-rose-500', dot: 'bg-rose-500' },
};

export const pillColors = {
  stone: 'bg-stone-200/70 text-stone-700',
  clay: 'bg-clay-100 text-clay-700',
  teal: 'bg-teal-100 text-teal-800',
  red: 'bg-rose-100 text-rose-800',
  amber: 'bg-amber-100 text-amber-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  blue: 'bg-blue-100 text-blue-800',
  green: 'bg-emerald-100 text-emerald-800',
  purple: 'bg-purple-100 text-purple-800',
};

// Determine publish status for an audience based on HITL gate state.
export function getPublishStatus(scenario, audience, hitl1Decisions, hitl2Decisions) {
  const hitl1NeedsApproval = scenario.hitl1?.needed && !hitl1Decisions?.[scenario.id];
  const hitl2Gate = scenario.hitl2?.[audience];
  const hitl2Key = `${scenario.id}_${audience}`;
  const hitl2Decision = hitl2Decisions?.[hitl2Key];
  const hitl2IsManual = hitl2Gate?.mode === 'manual';

  if (hitl1NeedsApproval) return 'awaiting_hitl1';
  if (hitl2IsManual && !hitl2Decision) return 'awaiting_hitl2';
  if (hitl2Decision?.type === 'reject') return 'rejected';
  if (hitl2Decision?.type === 'revise') return 'revising';
  return 'published';
}
