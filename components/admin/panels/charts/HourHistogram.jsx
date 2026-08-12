'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

/* When conversations happen: 24 hourly bars (calls + chats combined) in
   a single hue, peak hour a shade darker with a direct label. */

const CHART_HEIGHT = 120

function hourLabel(h) {
  if (h === 0) return '12 AM'
  if (h < 12) return `${h} AM`
  if (h === 12) return '12 PM'
  return `${h - 12} PM`
}

export function HourHistogram({ hours }) {
  const [hovered, setHovered] = useState(null)
  const max = Math.max(...hours)
  const peak = hours.indexOf(max)

  if (max === 0) {
    return <p className="m-0 py-8 text-center text-sm text-[var(--color-text-muted)]">No conversations in this period yet.</p>
  }

  return (
    <div>
      <div className="flex items-end gap-[2px]" style={{ height: CHART_HEIGHT }}>
        {hours.map((count, h) => {
          const isPeak = h === peak
          const isHovered = hovered === h
          return (
            <div
              key={h}
              className={cn(
                'relative flex h-full flex-1 cursor-pointer flex-col justify-end rounded transition-colors',
                isHovered && 'bg-black/[0.035]'
              )}
              onMouseEnter={() => setHovered(h)}
              onMouseLeave={() => setHovered(null)}
            >
              {isPeak && (
                <span className="mx-auto mb-1 select-none font-mono text-[10px] font-bold text-text">{count}</span>
              )}
              <div
                className="mx-auto w-full max-w-[14px] rounded-t"
                style={{
                  height: count > 0 ? Math.max((count / max) * (CHART_HEIGHT - 18), 3) : 2,
                  background: count > 0 ? (isPeak ? '#2a4688' : '#3859a8') : 'rgba(15,17,41,0.06)',
                  opacity: count > 0 && !isPeak ? 0.75 : 1,
                }}
              />
              {isHovered && (
                <div
                  className={cn(
                    'pointer-events-none absolute bottom-full z-10 mb-1.5 w-max rounded-lg border border-black/[0.08] bg-white px-2.5 py-1.5 text-xs shadow-lg',
                    h < 5 ? 'left-0' : h > 19 ? 'right-0' : 'left-1/2 -translate-x-1/2'
                  )}
                >
                  <span className="font-bold text-text">{hourLabel(h)}</span>
                  <span className="ml-2 text-[var(--color-text-secondary)]">
                    {count} {count === 1 ? 'conversation' : 'conversations'}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>
      <div className="mt-1.5 flex gap-[2px] select-none">
        {hours.map((_, h) => (
          <span key={h} className="flex-1 text-center text-[10px] text-[var(--color-text-muted)]">
            {h % 6 === 0 ? hourLabel(h).replace(' ', '') : ''}
          </span>
        ))}
      </div>
    </div>
  )
}
