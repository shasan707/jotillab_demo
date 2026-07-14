'use client'

import { useEffect, useRef, useState } from 'react'
import {
  Lightbulb, LayoutTemplate, MonitorSmartphone, CodeXml,
  Database, SearchCheck, Package, Check, Calendar,
} from 'lucide-react'

/* JotilDevs — live 7-step delivery pipeline (Ideation -> Delivery).
   Dynamic: the active phase advances on its own, energy flows along the
   completed track, the active node pulses with a dashed ring and orbiting
   dot, and the progress ring / phase readout update live.
   Interactive: click or tap any step to jump the project there (auto-play
   resumes a few seconds later). Frozen at "Development" under reduced motion. */

const BRAND = '#3859a8'
const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }

const STEPS = [
  { n: '01', label: 'Ideation', icon: Lightbulb },
  { n: '02', label: 'Wireframe / Mockups', icon: LayoutTemplate },
  { n: '03', label: 'Prototype', icon: MonitorSmartphone },
  { n: '04', label: 'Development', icon: CodeXml },
  { n: '05', label: 'Data / Content', icon: Database },
  { n: '06', label: 'Quality Assurance', icon: SearchCheck },
  { n: '07', label: 'Delivery', icon: Package },
]

const CSS = `
@keyframes jds-spin { to { transform: rotate(360deg); } }
@keyframes jds-pulse {
  0%, 100% { box-shadow: 0 6px 18px rgba(59,130,246,0.45), 0 0 0 0 rgba(59,130,246,0.35); }
  50% { box-shadow: 0 6px 18px rgba(59,130,246,0.45), 0 0 0 9px rgba(59,130,246,0); }
}
@keyframes jds-flow { to { background-position: -18px 0; } }
@keyframes jds-dot-travel {
  0% { left: -4%; opacity: 0; }
  12% { opacity: 1; }
  88% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}
@keyframes jds-blink {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(0.55); opacity: 0.6; }
}
`

export function DevsScreen({ isActive, onAction, onStep, progressRef }) {
  const [active, setActive] = useState(3) // start on Development, like the reference
  const [reduced, setReduced] = useState(false)
  const pauseUntil = useRef(0)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  // Auto-advance the project while on screen; pause briefly after a manual tap.
  useEffect(() => {
    if (!isActive || reduced) return
    const id = setInterval(() => {
      if (Date.now() < pauseUntil.current) return
      setActive((v) => (v + 1) % STEPS.length)
    }, 2600)
    return () => clearInterval(id)
  }, [isActive, reduced])

  useEffect(() => {
    onStep?.(active)
  }, [active, onStep])

  const pick = (i) => {
    pauseUntil.current = Date.now() + 6000
    setActive(i)
  }

  const progress = Math.round(((active + 0.5) / STEPS.length) * 100)
  const R = 9
  const CIRC = 2 * Math.PI * R

  return (
    <div className="flex h-full w-full flex-col bg-white text-[12px]">
      <style>{CSS}</style>

      {/* Header: project + live readouts */}
      <div className="flex items-center justify-between border-b border-black/5 bg-[#F8FAFF] px-5 py-2.5">
        <div className="min-w-0">
          <p className="text-[16px] font-bold leading-tight text-text">Client portal</p>
          <p className="text-[13px] text-text-secondary">Custom software development</p>
        </div>
        <div className="flex items-stretch overflow-hidden rounded-xl border border-black/5 bg-white shadow-sm">
          {/* Progress ring */}
          <div className="flex items-center gap-1.5 border-r border-black/5 px-3 py-1.5">
            <span className="text-[14px] font-bold text-text" style={MONO}>{progress}%</span>
            <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
              <circle cx="11" cy="11" r={R} fill="none" stroke="rgba(56,89,168,0.15)" strokeWidth="3" />
              <circle
                cx="11" cy="11" r={R} fill="none" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC * (1 - progress / 100)}
                transform="rotate(-90 11 11)"
                style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)' }}
              />
            </svg>
          </div>
          {/* Current phase */}
          <div className="flex items-center gap-1.5 border-r border-black/5 px-3 py-1.5">
            <span className="text-[14px] font-semibold text-text">{STEPS[active].label.split(' /')[0]}</span>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#3B82F6', animation: reduced ? 'none' : 'jds-blink 1.4s ease-in-out infinite' }} />
          </div>
          {/* Target date */}
          <div className="flex items-center gap-1.5 px-3 py-1.5">
            <span className="text-[14px] font-semibold text-text" style={MONO}>Aug 15, 2026</span>
            <Calendar size={12} strokeWidth={1.8} style={{ color: BRAND }} />
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="bg-dot-grid relative flex flex-1 items-center px-6">
        <div className="flex w-full items-start">
          {STEPS.map((step, i) => {
            const Icon = step.icon
            const done = i < active
            const isNow = i === active
            return (
              <div key={step.n} className="flex min-w-0 flex-1 items-start">
                {/* Node column */}
                <div className="flex w-full min-w-0 flex-col items-center">
                  <button
                    type="button"
                    onClick={() => pick(i)}
                    aria-label={`${step.label} phase`}
                    aria-current={isNow ? 'step' : undefined}
                    className="relative flex h-[52px] w-[52px] shrink-0 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    {/* Dashed halo + orbiting dot on the active node */}
                    {isNow && (
                      <>
                        <span
                          aria-hidden="true"
                          className="absolute inset-[-7px] rounded-full"
                          style={{
                            border: '1.5px dashed rgba(59,130,246,0.55)',
                            animation: reduced ? 'none' : 'jds-spin 9s linear infinite',
                          }}
                        />
                        <span
                          aria-hidden="true"
                          className="absolute inset-[-14px] rounded-full"
                          style={{ animation: reduced ? 'none' : 'jds-spin 3.5s linear infinite' }}
                        >
                          <span className="absolute left-1/2 top-0 h-[5px] w-[5px] -translate-x-1/2 rounded-full" style={{ background: '#3B82F6' }} />
                        </span>
                      </>
                    )}
                    <span
                      className="flex h-full w-full items-center justify-center rounded-full transition-all duration-300"
                      style={
                        isNow
                          ? {
                              background: 'linear-gradient(150deg, #3B82F6, #2a4688)',
                              boxShadow: '0 6px 18px rgba(59,130,246,0.45)',
                              animation: reduced ? 'none' : 'jds-pulse 2s ease-in-out infinite',
                            }
                          : {
                              background: '#ffffff',
                              border: done ? '2px solid rgba(59,130,246,0.55)' : '2px solid rgba(15,17,41,0.10)',
                              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 3px 10px rgba(15,17,41,0.08)',
                            }
                      }
                    >
                      <Icon
                        size={21}
                        strokeWidth={1.6}
                        style={{ color: isNow ? '#ffffff' : done ? BRAND : '#4A4D6A' }}
                      />
                    </span>
                  </button>

                  <p className="mt-2 text-[18px] font-bold leading-none" style={{ ...MONO, color: isNow ? '#3B82F6' : '#0f1129' }}>
                    {step.n}
                  </p>
                  <p className="mt-1.5 min-h-[32px] px-0.5 text-center text-[14px] font-semibold leading-tight text-text">
                    {step.label}
                  </p>

                  {/* Status marker */}
                  <span className="mt-1 flex h-[16px] w-[16px] items-center justify-center">
                    {done ? (
                      <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full" style={{ background: '#3B82F6' }}>
                        <Check size={9} strokeWidth={3.2} color="#fff" />
                      </span>
                    ) : isNow ? (
                      <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full" style={{ border: '1.5px solid rgba(59,130,246,0.6)' }}>
                        <span className="h-[7px] w-[7px] rounded-full" style={{ background: '#3B82F6', animation: reduced ? 'none' : 'jds-blink 1.2s ease-in-out infinite' }} />
                      </span>
                    ) : (
                      <span className="h-[15px] w-[15px] rounded-full" style={{ border: '1.5px solid rgba(15,17,41,0.14)' }} />
                    )}
                  </span>
                </div>

                {/* Connector to the next node (skips the last) */}
                {i < STEPS.length - 1 && (
                  <div className="relative mt-[25px] h-[3px] w-full min-w-[10px] shrink-[2] basis-[46px] rounded-full" style={{ marginLeft: -14, marginRight: -14 }}>
                    {i < active ? (
                      <>
                        {/* Energy flowing along the completed track */}
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 rounded-full"
                          style={{
                            background: 'repeating-linear-gradient(90deg, #3B82F6 0 10px, #06b6d4 10px 18px)',
                            backgroundSize: '18px 100%',
                            animation: reduced ? 'none' : 'jds-flow 0.9s linear infinite',
                          }}
                        />
                        {/* Bright packet on the segment feeding the active step */}
                        {i === active - 1 && !reduced && (
                          <span
                            aria-hidden="true"
                            className="absolute top-1/2 h-[9px] w-[9px] -translate-y-1/2 rounded-full"
                            style={{
                              background: '#ffffff',
                              boxShadow: '0 0 8px 3px rgba(59,130,246,0.75)',
                              animation: 'jds-dot-travel 1.3s ease-in-out infinite',
                            }}
                          />
                        )}
                      </>
                    ) : (
                      <span aria-hidden="true" className="absolute inset-0 rounded-full" style={{ background: 'rgba(15,17,41,0.10)' }} />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Footer status line */}
      <div className="flex items-center justify-between border-t border-black/5 bg-[#F8FAFF] px-5 py-2">
        <span className="text-[13px] font-semibold text-text">
          Phase {STEPS[active].n} of 07 · {STEPS[active].label}
        </span>
        <span className="text-[13px] text-text-secondary" style={MONO}>
          {active} of 7 phases complete
        </span>
      </div>
    </div>
  )
}
