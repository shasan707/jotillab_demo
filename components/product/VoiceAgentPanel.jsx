'use client'

import { useEffect, useRef, useState } from 'react'
import { Mic, X } from 'lucide-react'
import { useReducedMotion } from 'framer-motion'

/**
 * Voice AI agent panel — a self-contained dark "device" card embedded in the
 * light product hero. Faithful to a glassmorphic voice-assistant mock:
 *  - a live transcript that types in word by word, the most recent word lit
 *  - a continuously FLOWING multi-layer waveform (animated SVG, rAF-driven)
 *  - a mic button and an ambient blue glow around it
 *
 * Motion (typewriter + wave) suspends under prefers-reduced-motion: the
 * transcript shows in full and the waveform renders one static frame.
 */

const TRANSCRIPTS = [
  'Hi, do you have any openings this Saturday morning for a cleaning?',
  "I'd like to reschedule my appointment to sometime next week.",
  'Can someone call me back about a quote for the kitchen today?',
]

const WAVES = [
  { amp: 26, freq: 0.055, speed: 0.05, color: '#ffffff', width: 2.4, opacity: 0.95 },
  { amp: 21, freq: 0.07, speed: 0.07, color: '#7FB0FF', width: 2, opacity: 0.85 },
  { amp: 17, freq: 0.045, speed: 0.038, color: '#3B82F6', width: 2, opacity: 0.7 },
]

const W = 340
const H = 110
const STEP = 4

function buildPath(wave, phase) {
  const mid = H / 2
  const env = (x) => Math.exp(-Math.pow((x - W / 2) / (W * 0.26), 2)) // center-weighted
  let d = ''
  for (let x = 0; x <= W; x += STEP) {
    const y = mid + Math.sin(x * wave.freq + phase * (wave.speed / 0.05)) * wave.amp * env(x)
    d += `${x === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(2)} `
  }
  return d.trim()
}

function Waveform({ reduced }) {
  const pathRefs = useRef([])

  useEffect(() => {
    if (reduced) {
      pathRefs.current.forEach((p, i) => p && p.setAttribute('d', buildPath(WAVES[i], 0)))
      return
    }
    let raf
    let phase = 0
    const tick = () => {
      phase += 1
      pathRefs.current.forEach((p, i) => {
        if (p) p.setAttribute('d', buildPath(WAVES[i], phase))
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width="100%"
      height={H}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <defs>
        <filter id="wave-glow" x="-20%" y="-60%" width="140%" height="220%">
          <feGaussianBlur stdDeviation="3.2" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#wave-glow)" fill="none" strokeLinecap="round">
        {WAVES.map((wave, i) => (
          <path
            key={i}
            ref={(el) => (pathRefs.current[i] = el)}
            stroke={wave.color}
            strokeWidth={wave.width}
            opacity={wave.opacity}
            d={buildPath(wave, 0)}
          />
        ))}
      </g>
    </svg>
  )
}

function useTranscript(reduced) {
  const [line, setLine] = useState(0)
  const [count, setCount] = useState(reduced ? 999 : 0)

  useEffect(() => {
    if (reduced) return
    let cancelled = false
    const timeouts = []
    const wait = (ms) => new Promise((r) => timeouts.push(setTimeout(r, ms)))

    async function run() {
      while (!cancelled) {
        const words = TRANSCRIPTS[line].split(' ')
        setCount(0)
        await wait(500)
        for (let i = 1; i <= words.length; i++) {
          if (cancelled) return
          setCount(i)
          await wait(190)
        }
        await wait(2600)
        if (cancelled) return
        setLine((l) => (l + 1) % TRANSCRIPTS.length)
        return // effect re-runs on `line` change
      }
    }
    run()
    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [line, reduced])

  const words = TRANSCRIPTS[line].split(' ')
  const shown = reduced ? words.length : count
  return { words, shown }
}

export function VoiceAgentPanel() {
  const reduced = useReducedMotion()
  const { words, shown } = useTranscript(reduced)
  const complete = shown >= words.length

  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      {/* Ambient arcs glowing up from below the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 bottom-[-14%] h-[55%]"
        style={{
          background:
            'radial-gradient(60% 100% at 50% 100%, rgba(59,130,246,0.55), transparent 70%)',
          filter: 'blur(36px)',
        }}
      />

      {/* The device card */}
      <div
        className="relative overflow-hidden rounded-[26px] px-6 pt-6 pb-7"
        style={{
          background:
            'linear-gradient(180deg, rgba(20,28,56,0.92) 0%, rgba(12,18,40,0.96) 100%)',
          border: '1px solid rgba(120,150,255,0.18)',
          boxShadow:
            '0 30px 80px rgba(10,16,40,0.45), inset 0 1px 0 rgba(255,255,255,0.08)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
        }}
      >
        {/* faint dotted texture */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255,255,255,0.07) 1px, transparent 1px)',
            backgroundSize: '16px 16px',
            maskImage: 'radial-gradient(120% 80% at 50% 60%, #000 30%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(120% 80% at 50% 60%, #000 30%, transparent 80%)',
          }}
        />

        {/* Close affordance (decorative) */}
        <span
          aria-hidden="true"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full"
          style={{ background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <X size={13} strokeWidth={2} className="text-white/70" />
        </span>

        {/* Transcript */}
        <p
          className="relative min-h-[84px] pr-8 text-[19px] leading-[1.45] tracking-[-0.01em]"
          style={{ fontFamily: 'var(--font-display)' }}
          aria-live="polite"
        >
          {words.map((word, i) => {
            const isShown = i < shown
            const isCurrent = i === shown - 1 && !complete
            return (
              <span
                key={i}
                style={{
                  color: isCurrent ? '#ffffff' : isShown ? 'rgba(199,210,240,0.55)' : 'transparent',
                  fontWeight: isCurrent ? 700 : 500,
                  transition: 'color 0.25s ease',
                }}
              >
                {word}{' '}
              </span>
            )
          })}
          {!complete && (
            <span className="inline-flex items-center gap-[3px] align-middle">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="inline-block h-[5px] w-[5px] rounded-full"
                  style={{
                    background: '#ffffff',
                    animation: reduced ? 'none' : 'typing-dot 1.2s ease-in-out infinite',
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              ))}
            </span>
          )}
        </p>

        {/* Flowing waveform */}
        <div className="relative mt-4 mb-6">
          <Waveform reduced={reduced} />
        </div>

        {/* Mic button + glow */}
        <div className="relative flex justify-center">
          <span
            aria-hidden="true"
            className="absolute -z-0 h-28 w-28 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59,130,246,0.7), transparent 65%)',
              filter: 'blur(18px)',
              bottom: '-30%',
            }}
          />
          <button
            type="button"
            aria-label="Voice input demo"
            className="relative flex h-16 w-16 items-center justify-center rounded-full transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            style={{
              background: 'linear-gradient(180deg, #ffffff, #eaf0ff)',
              boxShadow: '0 10px 30px rgba(59,130,246,0.5), inset 0 1px 0 rgba(255,255,255,0.9)',
            }}
          >
            {!reduced && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: 'rgba(255,255,255,0.30)', animationDuration: '2.4s' }}
              />
            )}
            <Mic size={22} strokeWidth={2} className="relative text-[#1b2547]" />
          </button>
        </div>
      </div>
    </div>
  )
}
