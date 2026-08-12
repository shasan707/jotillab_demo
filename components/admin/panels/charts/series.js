/* Chart series definitions for the admin Overview.
   Categorical palette validated (light surface): lightness band, chroma
   floor, CVD separation, normal-vision floor, and contrast all pass.
   Hues are assigned in this fixed order and never cycled. */

export const ACTIVITY_SERIES = [
  { key: 'calls', label: 'Calls', color: '#3859a8' },
  { key: 'chats', label: 'Chats', color: '#0D9488' },
  { key: 'leads', label: 'Leads', color: '#D97706' },
  { key: 'messages', label: 'Messages', color: '#7C3AED' },
]

/* Status palette for sentiment; always paired with a text label. */
export const SENTIMENT_COLORS = {
  Positive: '#15803D',
  Neutral: '#64748B',
  Negative: '#DC2626',
  Unknown: '#94A3B8',
}

/* Smallest "nice" axis ceiling >= n, divisible by 4 so quarter
   gridlines land on integers. */
export function niceMax(n) {
  if (n <= 4) return 4
  const candidates = [8, 12, 16, 20, 24, 32, 40, 60, 80, 100, 160, 200, 320, 400, 600, 800, 1000]
  for (const c of candidates) {
    if (c >= n) return c
  }
  return Math.ceil(n / 500) * 500
}
