'use client'

import { useState } from 'react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Mic, AudioLines } from 'lucide-react'

/* Interactive AI-bot moment shown between the hero and the demo video.
   Pure CSS orb (no WebGL, no extra libraries): a slowly turning gradient
   ring with a soft glow. Tap or click to wake it: it turns faster, breathes,
   and the icon flips from mic to waveform. Tap again to rest. */

const ORB_GRADIENT = 'conic-gradient(from 0deg, #3B82F6, #7c3aed, #06b6d4, #3B82F6)'

const CSS = `
@keyframes jvb-spin { to { transform: rotate(360deg); } }
@keyframes jvb-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.035); }
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
            style={{ touchAction: 'manipulation', animation: awake ? 'jvb-breathe 2.4s ease-in-out infinite' : 'none' }}
          >
            {/* Soft glow behind the ring */}
            <span
              aria-hidden="true"
              className="absolute inset-[6%] rounded-full"
              style={{
                background: ORB_GRADIENT,
                filter: 'blur(18px)',
                opacity: awake ? 0.45 : 0.25,
                transition: 'opacity 0.5s ease',
              }}
            />
            {/* Turning gradient ring */}
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{
                background: ORB_GRADIENT,
                animation: `jvb-spin ${awake ? '4.5s' : '14s'} linear infinite`,
              }}
            />
            {/* Inner face */}
            <span
              aria-hidden="true"
              className="absolute inset-[9px] rounded-full"
              style={{
                background: 'linear-gradient(160deg, #ffffff 0%, #f4f7fd 60%, #eef2fb 100%)',
                boxShadow: 'inset 0 2px 10px rgba(255,255,255,0.9), inset 0 -10px 24px rgba(56,89,168,0.10)',
              }}
            />
            {/* Awake halo */}
            {awake && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full animate-ping"
                style={{ background: 'rgba(56,89,168,0.18)', animationDuration: '2s' }}
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
