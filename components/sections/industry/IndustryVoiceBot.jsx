'use client'

import { useState } from 'react'
import { VoiceOrb } from '@/components/ui/VoiceOrb'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Badge } from '@/components/ui/Badge'

/* Interactive AI-bot moment shown before the industry demo scenarios.
   The orb is purely visual (no microphone). Tapping or clicking it wakes
   it up: it spins faster and ripples; tap again to let it rest. */
export function IndustryVoiceBot({ industryName }) {
  const [awake, setAwake] = useState(false)

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <AnimatedSection>
          <Badge variant="blue" className="mb-5">Meet your AI</Badge>
          <h2
            className="headline-shadow font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-3"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.4vw, 2.85rem)' }}
          >
            Say hello to your {industryName.toLowerCase()} assistant
          </h2>
          <p className="mx-auto max-w-xl text-text-secondary">
            This is the voice that greets your customers when you cannot pick up.
            Tap the orb to wake it, then see the kinds of conversations it handles below.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <button
            type="button"
            onClick={() => setAwake((v) => !v)}
            aria-pressed={awake}
            aria-label={awake ? 'Let the assistant rest' : 'Wake the assistant'}
            className="relative mx-auto mt-6 block h-[260px] w-[260px] cursor-pointer border-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4 rounded-full sm:h-[320px] sm:w-[320px]"
            style={{ touchAction: 'manipulation' }}
          >
            <VoiceOrb engaged={awake} />
          </button>

          <div className="mt-2 flex justify-center">
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium"
              style={{
                background: 'rgba(56,89,168,0.07)',
                border: '1px solid rgba(56,89,168,0.16)',
                color: awake ? '#3859a8' : undefined,
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
