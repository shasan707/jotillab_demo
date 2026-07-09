'use client'

import { useState } from 'react'
import { VoiceOrb } from '@/components/ui/VoiceOrb'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import Logo from '@/components/ui/Logo'

/* Interactive AI-bot moment shown between the hero and the demo video.
   Just the orb (with the JotilLabs logo at its center) and a short line
   below it. The orb is purely visual (no microphone): tap or click to wake
   it, tap again to let it rest. */
export function IndustryVoiceBot() {
  const [awake, setAwake] = useState(false)

  return (
    <section className="py-10">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <AnimatedSection>
          <button
            type="button"
            onClick={() => setAwake((v) => !v)}
            aria-pressed={awake}
            aria-label={awake ? 'Let the assistant rest' : 'Wake the assistant'}
            className="relative mx-auto block h-[240px] w-[240px] cursor-pointer rounded-full border-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4 sm:h-[300px] sm:w-[300px]"
            style={{ touchAction: 'manipulation' }}
          >
            <VoiceOrb engaged={awake} />
            {/* Logo floating at the orb's center */}
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <Logo size={52} />
            </span>
          </button>

          <div className="mt-1 flex justify-center">
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
