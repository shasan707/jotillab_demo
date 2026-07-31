/* Shared blog category constants. Lives in data/ (no fs imports) because the
   admin editor form imports it client-side. */

export const BLOG_CATEGORIES = [
  'Voice AI',
  'SMS & Messaging',
  'Business Strategy',
  'AI Tools',
  'Use Cases',
  'Getting Started',
]

export const CATEGORY_COLORS = {
  'Voice AI': 'bg-blue-50 text-blue-700 border-blue-100',
  'SMS & Messaging': 'bg-violet-50 text-violet-700 border-violet-100',
  'Business Strategy': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'AI Tools': 'bg-amber-50 text-amber-700 border-amber-100',
  'Use Cases': 'bg-cyan-50 text-cyan-700 border-cyan-100',
  'Getting Started': 'bg-indigo-50 text-indigo-700 border-indigo-100',
}

export function categoryClass(category) {
  return CATEGORY_COLORS[category] ?? 'bg-slate-50 text-slate-700 border-slate-100'
}
