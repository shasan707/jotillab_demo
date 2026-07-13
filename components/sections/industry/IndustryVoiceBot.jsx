'use client'

import { useState } from 'react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Mic, AudioLines } from 'lucide-react'

/* Interactive AI-bot moment shown between the hero and the demo video.
   Pure CSS recreation of the original WebGL orb look (no libraries): an
   organic glowing ring in purple / blue / cyan with a soft bloom, a bright
   highlight travelling around the rim, and a gentle morphing wobble.
   Tap or click to wake it: everything speeds up and breathes; the icon
   flips from mic to waveform. Tap again to rest. */

const RING_GRADIENT =
  'conic-gradient(from 210deg, #22396E 0deg, #3859a8 90deg, #3B82F6 180deg, #06b6d4 265deg, #22396E 360deg)'

const CSS = `
@keyframes jvb-spin { to { transform: rotate(360deg); } }
@keyframes jvb-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.04); }
}
/* Organic wobble: the inner face drifts slightly off-center so the ring
   reads thicker on one side and thinner on the other, like the shader. */
@keyframes jvb-wobble {
  0%, 100% { transform: translate(0.8%, -0.6%) scale(1); }
  25% { transform: translate(-0.7%, 0.5%) scale(1.008); }
  50% { transform: translate(0.5%, 0.9%) scale(0.995); }
  75% { transform: translate(-0.9%, -0.4%) scale(1.005); }
}
`

export function IndustryVoiceBot() {
  const [awake, setAwake] = useState(false)

  return (
    <section className="py-8">
      <style>{CSS}</style>
      <div className="mx-auto max-w-3xl px-6 text-center">
        <AnimatedSection>
          <button
            type="button"
            onClick={() => setAwake((v) => !v)}
            aria-pressed={awake}
            aria-label={awake ? 'Let the assistant rest' : 'Wake the assistant'}
            className="relative mx-auto block h-[150px] w-[150px] cursor-pointer rounded-full border-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4 sm:h-[190px] sm:w-[190px]"
            style={{ touchAction: 'manipulation', animation: awake ? 'jvb-breathe 2.2s ease-in-out infinite' : 'none' }}
          >
            {/* Outer bloom (blurred copy of the ring) */}
            <span
              aria-hidden="true"
              className="absolute inset-[-6%] rounded-full"
              style={{
                background: RING_GRADIENT,
                filter: 'blur(20px)',
                opacity: awake ? 0.55 : 0.32,
                transition: 'opacity 0.5s ease',
                animation: `jvb-spin ${awake ? '5s' : '16s'} linear infinite`,
              }}
            />
            {/* Turning gradient disc (becomes the ring once the face covers it) */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{
                background: RING_GRADIENT,
                animation: `jvb-spin ${awake ? '5s' : '16s'} linear infinite`,
              }}
            />
            {/* Bright highlight travelling around the rim (counter-rotating) */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{ animation: `jvb-spin ${awake ? '2.6s' : '8s'} linear infinite reverse` }}
            >
              <span
                className="absolute left-1/2 top-[-4%] h-[30%] w-[30%] -translate-x-1/2 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(186,230,253,0.55) 40%, transparent 70%)',
                  filter: 'blur(4px)',
                  mixBlendMode: 'screen',
                }}
              />
            </span>
            {/* Inner face — offset wobble makes the ring thickness organic */}
            <span
              aria-hidden="true"
              className="absolute inset-[10%] rounded-full"
              style={{
                background:
                  'radial-gradient(120% 120% at 68% 26%, #ffffff 0%, #f6f9ff 45%, #eef2fb 75%, #e6ecf9 100%)',
                boxShadow:
                  'inset 0 3px 12px rgba(255,255,255,0.95), inset 0 -12px 28px rgba(56,89,168,0.14), inset 10px 0 24px rgba(6,182,212,0.10)',
                animation: `jvb-wobble ${awake ? '3.5s' : '7s'} ease-in-out infinite`,
              }}
            />
            {/* Awake halo */}
            {awake && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: 'rgba(56,89,168,0.16)', animationDuration: '2s' }}
              />
            )}
            {/* Voice icon at the center */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              {awake ? (
                <AudioLines size={28} strokeWidth={1.5} style={{ color: '#3859a8' }} />
              ) : (
                <Mic size={28} strokeWidth={1.5} style={{ color: '#3859a8' }} />
              )}
            </span>
          </button>

          <div className="mt-3 flex justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium"
              style={{
                background: 'rgba(56,89,168,0.07)',
                border: '1px solid rgba(56,89,168,0.16)',
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: awake ? '#12a06b' : '#3B82F6' }}
              />
              <span className="text-text-secondary">
                {awake ? 'Awake and listening. Tap to rest.' : 'Tap the orb to wake your assistant'}
              </span>
            </span>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
