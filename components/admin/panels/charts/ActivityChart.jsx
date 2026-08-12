'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { ACTIVITY_SERIES, niceMax } from './series'

/* Stacked daily-activity bars. Each day column is one hover target with
   a tooltip listing every channel's count; segments keep a 2px surface
   gap and the stack's top edge is rounded. */

const CHART_HEIGHT = 180

export function ActivityChart({ buckets }) {
  const [hovered, setHovered] = useState(null)

  const max = niceMax(Math.max(1, ...buckets.map((b) => b.total)))
  const labelEvery = buckets.length > 14 ? 5 : buckets.length > 7 ? 2 : 1
  const hasAny = buckets.some((b) => b.total > 0)

  return (
    <div>
      {/* legend */}
      <div className="mb-4 flex flex-wrap gap-x-4 gap-y-1.5">
        {ACTIVITY_SERIES.map((s) => (
          <span key={s.key} className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      {!hasAny ? (
        <div className="flex items-center justify-center" style={{ height: CHART_HEIGHT }}>
          <p className="m-0 text-sm text-[var(--color-text-muted)]">No activity in this period yet.</p>
        </div>
      ) : (
        <div className="flex gap-3">
          {/* y axis labels */}
          <div className="relative w-8 shrink-0 select-none" style={{ height: CHART_HEIGHT }}>
            {[max, max / 2, 0].map((v, i) => (
              <span
                key={i}
                className="absolute right-0 -translate-y-1/2 font-mono text-[10px] text-[var(--color-text-muted)]"
                style={{ top: `${(1 - v / max) * 100}%` }}
              >
                {v}
              </span>
            ))}
          </div>

          <div className="relative flex-1">
            {/* recessive gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((f) => (
              <div
                key={f}
                className="pointer-events-none absolute inset-x-0"
                style={{ top: `${f * 100}%`, borderTop: '1px solid rgba(15,17,41,0.05)' }}
              />
            ))}

            <div className="flex items-end gap-[3px]" style={{ height: CHART_HEIGHT }}>
              {buckets.map((bucket, i) => {
                const isHovered = hovered === i
                const nonZero = ACTIVITY_SERIES.filter((s) => bucket.counts[s.key] > 0)
                const topKey = nonZero.length > 0 ? nonZero[nonZero.length - 1].key : null
                const alignLeft = i < buckets.length / 4
                const alignRight = i > (buckets.length * 3) / 4
                return (
                  <div
                    key={bucket.t}
                    className={cn(
                      'relative flex h-full flex-1 cursor-pointer flex-col justify-end rounded-md transition-colors',
                      isHovered && 'bg-black/[0.035]'
                    )}
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* stack: render top series last so DOM order matches visual order */}
                    {[...ACTIVITY_SERIES].reverse().map((s) => {
                      const count = bucket.counts[s.key]
                      if (count === 0) return null
                      const h = Math.max((count / max) * CHART_HEIGHT, 3)
                      return (
                        <div
                          key={s.key}
                          className="mx-auto w-full max-w-[26px]"
                          style={{
                            height: h,
                            background: s.color,
                            marginTop: 2,
                            borderRadius: s.key === topKey ? '4px 4px 0 0' : 0,
                          }}
                        />
                      )
                    })}

                    {/* tooltip */}
                    {isHovered && bucket.total > 0 && (
                      <div
                        className={cn(
                          'pointer-events-none absolute bottom-full z-10 mb-2 w-max rounded-xl border border-black/[0.08] bg-white px-3.5 py-2.5 shadow-lg',
                          alignLeft ? 'left-0' : alignRight ? 'right-0' : 'left-1/2 -translate-x-1/2'
                        )}
                      >
                        <p className="m-0 mb-1.5 text-xs font-bold text-text">{bucket.fullLabel}</p>
                        {ACTIVITY_SERIES.map((s) => (
                          <p key={s.key} className="m-0 flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
                            <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                            {s.label}
                            <span className="ml-auto pl-3 font-mono font-semibold text-text">{bucket.counts[s.key]}</span>
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* x labels */}
            <div className="mt-1.5 flex gap-[3px]">
              {buckets.map((bucket, i) => (
                <span
                  key={bucket.t}
                  className="flex-1 select-none text-center text-[10px] text-[var(--color-text-muted)]"
                >
                  {i % labelEvery === 0 ? bucket.label : ''}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
