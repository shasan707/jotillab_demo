'use client'

import { ClipboardList, TrendingDown, Timer, Zap, ArrowRight } from 'lucide-react'

/* JotilConsult — static audit summary panel. One clean frozen moment: three
   metric tiles, a prioritized findings list, and a savings indicator.
   No animation. */

const BRAND = '#3859a8'
const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }

const METRICS = [
  { icon: Timer, figure: '14 hrs/wk', label: 'recoverable time' },
  { icon: TrendingDown, figure: '$4.2k/mo', label: 'operational leak' },
  { icon: Zap, figure: '9', label: 'quick wins found' },
]

const FINDINGS = [
  { priority: 'High', label: 'Missed after-hours calls never get a follow-up', value: '$1.9k/mo' },
  { priority: 'High', label: 'Leads wait 3+ hours for a first reply', value: '$1.4k/mo' },
  { priority: 'Medium', label: 'Appointment reminders sent by hand every morning', value: '6 hrs/wk' },
]

function PriorityChip({ level }) {
  const high = level === 'High'
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide"
      style={
        high
          ? { background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)', color: '#DC2626' }
          : { background: 'rgba(245,158,11,0.10)', border: '1px solid rgba(245,158,11,0.28)', color: '#b45309' }
      }
    >
      {level}
    </span>
  )
}

export function ConsultScreen({ isActive, onAction, onStep, progressRef }) {
  return (
    <div className="flex h-full w-full flex-col bg-white text-[12px]">
      {/* Panel top bar */}
      <div className="flex items-center justify-between border-b border-black/5 bg-[#F8FAFF] px-5 py-2.5">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-md"
            style={{ background: 'rgba(56,89,168,0.10)', border: '1px solid rgba(56,89,168,0.18)' }}
          >
            <ClipboardList size={13} strokeWidth={1.8} style={{ color: BRAND }} />
          </span>
          <span className="text-[13px] font-semibold text-text">Operations audit</span>
          <span className="text-[11px] text-text-secondary" style={MONO}>Meridian Dental</span>
        </div>
        <span
          className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
          style={{ background: 'rgba(56,89,168,0.08)', border: '1px solid rgba(56,89,168,0.18)', color: BRAND }}
        >
          Week 2 of 3
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 px-6 py-4">
        {/* Metric tiles */}
        <div className="grid grid-cols-3 gap-3">
          {METRICS.map(({ icon: Icon, figure, label }) => (
            <div
              key={label}
              className="rounded-xl bg-white px-4 py-3"
              style={{ border: '1px solid rgba(15,17,41,0.06)', boxShadow: '0 4px 14px rgba(56,89,168,0.07)' }}
            >
              <div
                className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg"
                style={{ background: 'rgba(56,89,168,0.08)' }}
              >
                <Icon size={14} strokeWidth={1.8} style={{ color: BRAND }} />
              </div>
              <p className="text-[17px] font-bold leading-none text-text" style={MONO}>{figure}</p>
              <p className="mt-1 text-[10.5px] text-text-secondary">{label}</p>
            </div>
          ))}
        </div>

        {/* Prioritized findings */}
        <div
          className="flex-1 rounded-xl bg-white"
          style={{ border: '1px solid rgba(15,17,41,0.06)', boxShadow: '0 4px 14px rgba(56,89,168,0.07)' }}
        >
          <div className="flex items-center justify-between border-b border-black/5 px-4 py-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Fix first
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: BRAND }}>
              Full roadmap
              <ArrowRight size={11} strokeWidth={2.2} />
            </span>
          </div>
          <div className="divide-y divide-black/[0.04]">
            {FINDINGS.map((f, i) => (
              <div key={f.label} className="flex items-center gap-3 px-4 py-2.5">
                <span className="w-4 shrink-0 text-[11px] font-bold text-text-secondary" style={MONO}>
                  {i + 1}
                </span>
                <PriorityChip level={f.priority} />
                <span className="min-w-0 flex-1 truncate text-[12px] text-text">{f.label}</span>
                <span className="shrink-0 text-[11px] font-semibold" style={{ ...MONO, color: BRAND }}>
                  {f.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Savings indicator */}
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: 'linear-gradient(160deg, #f5f8fd, #e8eefb)', border: '1px solid rgba(56,89,168,0.10)' }}
        >
          <div className="mb-1.5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-text">Projected first-quarter recovery</span>
            <span className="text-[12px] font-bold" style={{ ...MONO, color: '#12a06b' }}>$11,300</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgba(56,89,168,0.10)' }}>
            <div
              className="h-full rounded-full"
              style={{ width: '72%', background: `linear-gradient(90deg, ${BRAND}, #12a06b)` }}
            />
          </div>
          <p className="mt-1.5 text-[10.5px] text-text-secondary">72% of the leak is addressable in the first three fixes</p>
        </div>
      </div>
    </div>
  )
}
