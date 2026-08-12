'use client'

import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'
import { ListState } from './ListState'
import { fmtDuration } from './format'
import { ActivityChart } from './charts/ActivityChart'
import { SentimentBars } from './charts/SentimentBars'
import { HourHistogram } from './charts/HourHistogram'

/* Overview: activity across every channel, bucketed in the viewer's
   timezone from raw event timestamps fetched once for the last 30 days.
   The range chips re-bucket locally without refetching. */

const DAY_MS = 24 * 60 * 60 * 1000
const RANGES = [
  { id: 7, label: 'Last 7 days' },
  { id: 14, label: 'Last 14 days' },
  { id: 30, label: 'Last 30 days' },
]

function localMidnight(ts) {
  const d = new Date(ts)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

export function OverviewTab() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [days, setDays] = useState(14)

  useEffect(() => {
    fetch('/api/admin/analytics')
      .then(async (res) => {
        const body = await res.json()
        if (!res.ok || !body.ok) throw new Error(body.error || 'Could not load analytics.')
        setData(body)
        setStatus('ready')
      })
      .catch((err) => {
        setStatus('error')
        setError(err.message || 'Could not load analytics.')
      })
  }, [])

  const computed = useMemo(() => {
    if (!data) return null
    const start = localMidnight(Date.now()) - (days - 1) * DAY_MS
    const cutoff = start

    const buckets = Array.from({ length: days }, (_, i) => {
      const t = start + i * DAY_MS
      const d = new Date(t)
      return {
        t,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullLabel: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        counts: { calls: 0, chats: 0, leads: 0, messages: 0 },
        total: 0,
      }
    })

    const add = (key, ts) => {
      if (!ts || ts < cutoff) return
      const idx = Math.round((localMidnight(ts) - start) / DAY_MS)
      if (idx >= 0 && idx < days) {
        buckets[idx].counts[key] += 1
        buckets[idx].total += 1
      }
    }

    const sentiment = { Positive: 0, Neutral: 0, Negative: 0, Unknown: 0 }
    const hours = Array.from({ length: 24 }, () => 0)
    let callCount = 0
    let totalDuration = 0

    for (const call of data.calls || []) {
      add('calls', call.t)
      if (call.t >= cutoff) {
        sentiment[call.sentiment in sentiment ? call.sentiment : 'Unknown'] += 1
        hours[new Date(call.t).getHours()] += 1
        callCount += 1
        totalDuration += call.durationMs || 0
      }
    }
    for (const chat of data.chats || []) {
      if (!chat.hasMessages) continue
      add('chats', chat.t)
      if (chat.t >= cutoff) hours[new Date(chat.t).getHours()] += 1
    }
    for (const t of data.leads || []) add('leads', t)
    for (const t of data.messages || []) add('messages', t)

    return {
      buckets,
      sentiment,
      hours,
      avgDuration: callCount > 0 ? totalDuration / callCount : null,
      totalInRange: buckets.reduce((sum, b) => sum + b.total, 0),
    }
  }, [data, days])

  if (status !== 'ready') {
    return status === 'loading' ? (
      <div className="grid gap-4">
        <div className="h-72 animate-pulse rounded-2xl border border-black/[0.06] bg-white" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="h-52 animate-pulse rounded-2xl border border-black/[0.06] bg-white" />
          <div className="h-52 animate-pulse rounded-2xl border border-black/[0.06] bg-white" />
        </div>
      </div>
    ) : (
      <ListState status="error" error={error} onRetry={() => window.location.reload()} />
    )
  }

  const retellDown = data.calls === null && data.chats === null

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="m-0 text-sm text-[var(--color-text-secondary)]">
          <span className="font-mono font-bold text-text">{computed.totalInRange.toLocaleString('en-US')}</span> interactions
          {computed.avgDuration != null && (
            <>
              {' '}| avg call <span className="font-mono font-bold text-text">{fmtDuration(computed.avgDuration)}</span>
            </>
          )}
        </p>
        <div className="flex gap-1.5">
          {RANGES.map((range) => (
            <button
              key={range.id}
              type="button"
              onClick={() => setDays(range.id)}
              className={cn(
                'cursor-pointer rounded-full border px-3 py-1.5 text-xs font-semibold transition-all',
                days === range.id
                  ? 'border-transparent bg-primary text-white shadow-sm'
                  : 'border-black/10 bg-white text-[var(--color-text-secondary)] hover:bg-black/[0.03]'
              )}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
        <h2 className="m-0 mb-1 text-sm font-bold text-text">Daily activity</h2>
        <p className="m-0 mb-4 text-xs text-[var(--color-text-secondary)]">
          Calls, chats with messages, intake leads, and contact messages per day.
        </p>
        <ActivityChart buckets={computed.buckets} />
        {retellDown && (
          <p className="m-0 mt-3 text-xs text-[var(--color-text-muted)]">
            Voice and chat data is unavailable right now, so those bars may be missing.
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <h2 className="m-0 mb-1 text-sm font-bold text-text">Caller sentiment</h2>
          <p className="m-0 mb-4 text-xs text-[var(--color-text-secondary)]">
            How callers felt, from the AI call analysis.
          </p>
          <SentimentBars counts={computed.sentiment} />
        </div>

        <div className="rounded-2xl border border-black/[0.06] bg-white p-5">
          <h2 className="m-0 mb-1 text-sm font-bold text-text">Busiest hours</h2>
          <p className="m-0 mb-4 text-xs text-[var(--color-text-secondary)]">
            Calls and chats by hour of day, in your timezone.
          </p>
          <HourHistogram hours={computed.hours} />
        </div>
      </div>
    </div>
  )
}
