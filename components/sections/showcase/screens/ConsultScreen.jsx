'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

/* JotilConsult — live operations audit. Six findings stream in, each scored
   by how much operational capacity it can recover. The list keeps re-ranking
   itself as the analysis refines the numbers (FLIP reorder via Framer Motion
   layout animations), the top two get a "Quick win" badge, and the summary
   column counts the recoverable total up and down in sync. A soft scan band
   sweeps the findings while the audit runs. Static sorted snapshot under
   reduced motion. */

const BRAND = '#3859a8'
const BLUE = '#3B82F6'
const CYAN = '#06b6d4'
const GREEN = '#12a06b'
const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }

/* pct = share of total operational capacity this finding can recover.
   Live ticks wander each value within +-2 of its base so the ranking keeps
   shuffling but the headline total stays believable however long it runs. */
const INITIAL = [
  { id: 'sch', name: 'Manual scheduling', cat: 'Support', grp: 'sup', base: 4, pct: 4 },
  { id: 'fol', name: 'Missed follow-ups', cat: 'Sales', grp: 'sales', base: 9, pct: 9 },
  { id: 'rep', name: 'Reports built by hand', cat: 'Analytics', grp: 'sup', base: 3, pct: 3 },
  { id: 'inv', name: 'Manual invoicing', cat: 'Finance', grp: 'ops', base: 7, pct: 7 },
  { id: 'lead', name: 'Slow lead response', cat: 'Sales', grp: 'sales', base: 6, pct: 6 },
  { id: 'dup', name: 'Duplicate data entry', cat: 'Operations', grp: 'ops', base: 5, pct: 5 },
]

const CSS = `
@keyframes jcs-scan {
  0% { transform: translateY(-80px); }
  55%, 100% { transform: translateY(420px); }
}
@keyframes jcs-ping {
  0% { box-shadow: 0 0 0 0 rgba(59,130,246,0.5); }
  70% { box-shadow: 0 0 0 7px rgba(59,130,246,0); }
  100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
}
`

export function ConsultScreen({ isActive, onAction, onStep, progressRef }) {
  const [items, setItems] = useState(INITIAL)
  const [sorted, setSorted] = useState(false)
  const [bumpId, setBumpId] = useState(null)
  const [reduced, setReduced] = useState(false)
  const totalRef = useRef(null)
  const shownTotal = useRef(0)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  /* First ranking pass shortly after the cards settle in
     (immediately under reduced motion). */
  useEffect(() => {
    if (reduced) {
      setSorted(true)
      return
    }
    const t = setTimeout(() => setSorted(true), 1400)
    return () => clearTimeout(t)
  }, [reduced])

  /* Live refinement: nudge one finding, re-rank, highlight it. */
  useEffect(() => {
    if (!isActive || reduced || !sorted) return
    const id = setInterval(() => {
      setItems((prev) => {
        const i = Math.floor(Math.random() * prev.length)
        const delta = Math.round(Math.random() * 3 - 1) // -1..+2
        const next = prev.map((d, j) =>
          j === i
            ? { ...d, pct: Math.max(Math.max(1, d.base - 2), Math.min(d.base + 2, d.pct + delta)) }
            : d
        )
        setBumpId(next[i].id)
        return next
      })
    }, 3800)
    return () => clearInterval(id)
  }, [isActive, reduced, sorted])

  useEffect(() => {
    if (!bumpId) return
    const t = setTimeout(() => setBumpId(null), 700)
    return () => clearTimeout(t)
  }, [bumpId])

  /* Count the headline total toward its new value whenever the data moves. */
  const total = items.reduce((a, d) => a + d.pct, 0)
  useEffect(() => {
    const node = totalRef.current
    if (!node) return
    const target = sorted ? total : 0
    const from = shownTotal.current
    shownTotal.current = target
    if (reduced || from === target) {
      node.textContent = `${target}%`
      return
    }
    let raf
    let start = null
    const dur = 900
    const step = (ts) => {
      if (start === null) start = ts
      const p = Math.min((ts - start) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      node.textContent = `${Math.round(from + (target - from) * e)}%`
      if (p < 1) raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [total, sorted, reduced])

  const ranked = sorted ? [...items].sort((a, b) => b.pct - a.pct) : items
  const maxPct = Math.max(...items.map((d) => d.pct))
  const groups = items.reduce(
    (g, d) => ({ ...g, [d.grp]: (g[d.grp] || 0) + d.pct }),
    {}
  )

  return (
    <div className="flex h-full w-full flex-col bg-[#f6f8fc] text-[12px]">
      <style>{CSS}</style>

      {/* Header */}
      <div className="flex items-center justify-between px-6 pb-0.5 pt-3">
        <div>
          <p className="text-[17px] font-extrabold leading-tight tracking-[-0.02em] text-text">Northwind Audit</p>
          <p className="mt-0.5 text-[12.5px] text-text-secondary">Operations audit, 6 findings</p>
        </div>
        <span
          className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-[11.5px] font-bold tracking-[0.06em]"
          style={{ color: BLUE, background: 'rgba(59,130,246,0.09)', border: '1px solid rgba(59,130,246,0.22)' }}
        >
          <span
            className="h-[7px] w-[7px] rounded-full"
            style={{ background: BLUE, animation: reduced ? 'none' : 'jcs-ping 1.8s ease-out infinite' }}
          />
          ANALYZING
        </span>
      </div>

      {/* Body */}
      <div className="grid min-h-0 flex-1 grid-cols-[1.6fr_1fr] gap-4 px-6 pb-4 pt-1.5">
        {/* Findings list */}
        <div className="relative overflow-hidden rounded-xl">
          {!reduced && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 z-10 h-[70px]"
              style={{
                background: 'linear-gradient(180deg, rgba(59,130,246,0), rgba(59,130,246,0.10), rgba(59,130,246,0))',
                animation: 'jcs-scan 4s cubic-bezier(0.22,0.61,0.36,1) infinite',
              }}
            />
          )}
          <div className="flex h-full flex-col justify-between gap-[7px]">
            {ranked.map((d, i) => {
              const top = sorted && i < 2
              const bumped = bumpId === d.id
              return (
                <motion.div
                  key={d.id}
                  layout={!reduced}
                  transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                  initial={reduced ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl bg-white px-3.5 py-[6px]"
                  style={{
                    border: bumped ? '1px solid rgba(59,130,246,0.45)' : '1px solid rgba(15,17,41,0.07)',
                    boxShadow: bumped
                      ? '0 0 0 3px rgba(59,130,246,0.10)'
                      : '0 1px 2px rgba(15,17,41,0.04)',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                  }}
                >
                  <span
                    className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-lg text-[13px] font-bold"
                    style={{
                      ...MONO,
                      background: top ? BLUE : 'rgba(56,89,168,0.07)',
                      color: top ? '#ffffff' : '#4A4D6A',
                    }}
                  >
                    {sorted ? i + 1 : '-'}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13.5px] font-bold text-text">{d.name}</span>
                      {top && (
                        <span
                          className="shrink-0 rounded-full px-2 py-[1px] text-[10.5px] font-bold"
                          style={{ color: GREEN, background: 'rgba(18,160,107,0.09)', border: '1px solid rgba(18,160,107,0.25)' }}
                        >
                          Quick win
                        </span>
                      )}
                    </div>
                    <p className="mt-px text-[11.5px] font-semibold text-text-secondary">{d.cat}</p>
                    <div className="mt-1 h-[5px] overflow-hidden rounded-full" style={{ background: 'rgba(15,17,41,0.06)' }}>
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${Math.round((d.pct / maxPct) * 100)}%`,
                          background: `linear-gradient(90deg, ${BLUE}, ${CYAN})`,
                          transition: 'width 0.6s cubic-bezier(0.22,0.61,0.36,1)',
                        }}
                      />
                    </div>
                  </div>
                  <div className="shrink-0 text-right" style={MONO}>
                    <p className="text-[16px] font-bold leading-none text-text">{d.pct}%</p>
                    <p className="mt-0.5 text-[10.5px] text-text-secondary">recoverable</p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Summary */}
        <div
          className="flex flex-col rounded-2xl p-4"
          style={{
            background: 'linear-gradient(180deg, #ffffff, #fafbff)',
            border: '1px solid rgba(15,17,41,0.07)',
            boxShadow: '0 4px 14px rgba(56,89,168,0.07)',
          }}
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">
            Recoverable capacity
          </p>
          <p ref={totalRef} className="mt-2 text-[40px] font-bold leading-none tracking-[-0.03em]" style={{ ...MONO, color: BRAND }}>
            0%
          </p>
          <p className="mt-1.5 text-[13px] font-medium text-text-secondary">of operational time</p>

          <div className="my-3.5 h-px" style={{ background: 'rgba(15,17,41,0.06)' }} />

          <div className="flex flex-col gap-2.5">
            {[
              { label: 'Sales', key: 'sales', dot: BLUE },
              { label: 'Finance & ops', key: 'ops', dot: CYAN },
              { label: 'Support & analytics', key: 'sup', dot: 'rgba(56,89,168,0.30)' },
            ].map((row) => (
              <div key={row.key} className="flex items-center gap-2.5 text-[12.5px] font-medium text-text-secondary">
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: row.dot }} />
                {row.label}
                <span className="ml-auto text-[13px] font-semibold text-text" style={MONO}>
                  {sorted ? groups[row.key] || 0 : 0}%
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto flex items-center gap-2 pt-3 text-[12px] font-medium text-text-secondary">
            <Check size={15} strokeWidth={2.5} style={{ color: GREEN }} className="shrink-0" />
            Top 2 flagged as quick wins
          </div>
        </div>
      </div>
    </div>
  )
}
