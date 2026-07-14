'use client'

import { useEffect, useState } from 'react'
import { Award, Check } from 'lucide-react'

/* JotilEducation — credential ceremony. When the slide becomes active the
   certificate assembles itself: the card rises in, the seal stamps down with
   a ripple, the verified check pops, a shine sweeps across, and the text
   lines fade in one after another. Plays once per visit; fully static under
   reduced motion. */

const BRAND = '#3859a8'
const NAVY = '#22396E'
const BLUE = '#3B82F6'
const GREEN = '#12a06b'
const MONO = { fontFamily: 'var(--font-jetbrains), ui-monospace, monospace' }
const EASE = 'cubic-bezier(0.22,0.61,0.36,1)'

const CSS = `
@keyframes jed-credin {
  from { opacity: 0; transform: translateY(20px) scale(0.97); }
  to { opacity: 1; transform: none; }
}
@keyframes jed-seal {
  0% { opacity: 0; transform: scale(0.4); }
  60% { transform: scale(1.1); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes jed-ripple {
  0% { opacity: 0.7; transform: scale(1); }
  100% { opacity: 0; transform: scale(1.5); }
}
@keyframes jed-vpop {
  0% { opacity: 0; transform: scale(0.3); }
  60% { transform: scale(1.15); }
  100% { opacity: 1; transform: scale(1); }
}
@keyframes jed-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes jed-shine {
  0% { left: -70%; }
  100% { left: 130%; }
}
`

export function EducationScreen({ isActive, onAction, onStep, progressRef }) {
  const [started, setStarted] = useState(false)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (isActive) setStarted(true)
  }, [isActive])

  /* Static final state under reduced motion; hidden until the slide first
     activates so the ceremony plays from the top; animated once started. */
  const anim = (name, dur, delay) =>
    reduced
      ? {}
      : started
        ? { animation: `${name} ${dur}s ${delay}s ${EASE} both` }
        : { opacity: 0 }

  return (
    <div
      className="relative flex h-full w-full items-center justify-center"
      style={{
        background:
          'radial-gradient(600px 300px at 50% -10%, rgba(59,130,246,0.10), transparent 65%), linear-gradient(180deg, #ffffff, #f6f8fc)',
      }}
    >
      <style>{CSS}</style>

      {/* Brand tag */}
      <div className="absolute left-6 top-5 flex items-center gap-2.5 text-[15px] font-bold" style={{ color: BRAND }}>
        <span
          className="grid h-[26px] w-[26px] place-items-center rounded-[8px]"
          style={{ background: `linear-gradient(160deg, ${BLUE}, ${BRAND})` }}
        >
          <span className="h-[6px] w-[6px] rounded-full bg-white" />
        </span>
        JotilEducation
      </div>

      {/* Issued status */}
      <div
        className="absolute right-6 top-5 flex items-center gap-2 text-[13.5px] font-bold uppercase tracking-[0.06em]"
        style={{ color: GREEN }}
      >
        <span className="h-[7px] w-[7px] rounded-full" style={{ background: GREEN, boxShadow: '0 0 8px rgba(18,160,107,0.6)' }} />
        Credential issued
      </div>

      {/* Credential card */}
      <div
        className="relative w-[560px] overflow-hidden rounded-[22px] px-10 pb-7 pt-9 text-center"
        style={{
          background: 'linear-gradient(170deg, #ffffff, #f7f9ff)',
          border: '1px solid #e4e8f4',
          boxShadow: '0 24px 54px -30px rgba(15,17,41,0.4), inset 0 1px 0 rgba(255,255,255,0.9)',
          ...anim('jed-credin', 0.8, 0.25),
        }}
      >
        {/* Top accent bar */}
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[4px]"
          style={{ background: `linear-gradient(90deg, ${BRAND}, ${BLUE}, ${BRAND})` }}
        />

        {/* Shine sweep */}
        {started && !reduced && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute bottom-0 top-0 w-[60%]"
            style={{
              left: '-70%',
              background: 'linear-gradient(105deg, transparent, rgba(255,255,255,0.65), transparent)',
              transform: 'skewX(-18deg)',
              animation: `jed-shine 1.5s 1.1s ${EASE}`,
            }}
          />
        )}

        {/* Seal */}
        <div
          className="relative mx-auto grid h-[88px] w-[88px] place-items-center rounded-full text-white"
          style={{
            background: `radial-gradient(circle at 34% 30%, ${BLUE}, ${BRAND} 52%, ${NAVY})`,
            boxShadow: '0 14px 30px -10px rgba(56,89,168,0.65), inset 0 2px 3px rgba(255,255,255,0.4)',
            ...anim('jed-seal', 0.6, 0.6),
          }}
        >
          {started && !reduced && (
            <span
              aria-hidden="true"
              className="absolute inset-[-6px] rounded-full"
              style={{ border: `2px solid ${BLUE}`, opacity: 0, animation: `jed-ripple 1s 1.05s ${EASE}` }}
            />
          )}
          <Award size={44} strokeWidth={2} />
          <span
            className="absolute bottom-[-2px] right-[-2px] grid h-[30px] w-[30px] place-items-center rounded-full text-white"
            style={{ background: GREEN, border: '3px solid #ffffff', ...anim('jed-vpop', 0.5, 1.25) }}
          >
            <Check size={16} strokeWidth={3.5} />
          </span>
        </div>

        <p
          className="mt-4 text-[13.5px] font-semibold tracking-[0.24em] text-text-secondary"
          style={{ ...MONO, ...anim('jed-fade', 0.7, 0.9) }}
        >
          JOTILLABS&nbsp;&middot;&nbsp;CERTIFIED
        </p>
        <p
          className="mt-2.5 text-[38px] font-semibold leading-[1.08] tracking-[-0.01em] text-text"
          style={{ fontFamily: 'var(--font-fraunces), Fraunces, serif', ...anim('jed-fade', 0.7, 1.0) }}
        >
          AI at the Front Desk
        </p>
        <p className="mt-2 text-[16px] font-medium text-text-secondary" style={anim('jed-fade', 0.7, 1.1)}>
          Front-desk track&nbsp;&middot;&nbsp;18 lessons&nbsp;&middot;&nbsp;live role-play
        </p>

        <div
          className="my-4 h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(15,17,41,0.10), transparent)',
            ...anim('jed-fade', 0.7, 1.15),
          }}
        />

        <div className="flex items-center justify-between gap-3" style={anim('jed-fade', 0.7, 1.2)}>
          <div className="text-left">
            <p className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-text-secondary">Issued to</p>
            <p className="mt-0.5 text-[17px] font-bold text-text">Front desk team</p>
          </div>
          <div>
            <span
              className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[14.5px] font-bold"
              style={{ color: GREEN, background: 'rgba(18,160,107,0.09)', border: '1px solid rgba(18,160,107,0.25)' }}
            >
              <Check size={14} strokeWidth={2.5} />
              Verified
            </span>
            <p className="mt-1.5 text-right text-[13.5px] font-medium text-text-secondary" style={MONO}>
              JL-4F2A&nbsp;&middot;&nbsp;Jul 2026
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
