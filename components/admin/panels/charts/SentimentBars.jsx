'use client'

import { SENTIMENT_COLORS } from './series'

/* Horizontal bars for caller sentiment. Every row carries its label and
   count as text, so identity never rides on color alone. */

const ORDER = ['Positive', 'Neutral', 'Negative', 'Unknown']

export function SentimentBars({ counts }) {
  const rows = ORDER.filter((key) => key !== 'Unknown' || counts[key] > 0)
  const total = rows.reduce((sum, key) => sum + (counts[key] || 0), 0)
  const max = Math.max(1, ...rows.map((key) => counts[key] || 0))

  if (total === 0) {
    return <p className="m-0 py-8 text-center text-sm text-[var(--color-text-muted)]">No analyzed calls in this period yet.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {rows.map((key) => {
        const value = counts[key] || 0
        const pct = total > 0 ? Math.round((value / total) * 100) : 0
        return (
          <div key={key} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-[13px] font-medium text-[var(--color-text-secondary)]">{key}</span>
            <div className="h-5 flex-1 overflow-hidden rounded-md bg-black/[0.04]" title={`${key}: ${value} of ${total} calls`}>
              <div
                className="h-full rounded-md transition-all duration-500"
                style={{ width: `${(value / max) * 100}%`, background: SENTIMENT_COLORS[key], minWidth: value > 0 ? 4 : 0 }}
              />
            </div>
            <span className="w-16 shrink-0 text-right font-mono text-[13px] font-semibold text-text">
              {value}
              <span className="ml-1 font-normal text-[var(--color-text-muted)]">{pct}%</span>
            </span>
          </div>
        )
      })}
    </div>
  )
}
