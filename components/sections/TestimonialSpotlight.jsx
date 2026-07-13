'use client'

import { Quote } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { TiltCard } from '@/components/design'

/* Single customer spotlight. Add more entries here as real reviews come in. */
const TESTIMONIAL = {
  quote:
    'JotilLabs answers our calls before we can reach the phone. Customers get booked, questions get answered, and nothing slips through anymore. It feels like we hired a full front desk overnight.',
  name: 'Aldrin Gonsalves',
  company: 'LAAA G Scorp',
}

/* LAAA G Scorp company logomark: navy squircle, LG lettermark, sapphire dot
   (swap in the real logo file whenever the client provides one). */
function ScorpLogo() {
  return (
    <span
      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px]"
      style={{
        background: 'linear-gradient(135deg, #22396E, #3859a8)',
        border: '1px solid rgba(56,89,168,0.35)',
        boxShadow: '0 4px 14px rgba(34,57,110,0.30)',
      }}
      aria-label="LAAA G Scorp logo"
      role="img"
    >
      <svg viewBox="0 0 48 48" width={30} height={30} aria-hidden="true">
        <text
          x="23"
          y="31"
          textAnchor="middle"
          fill="#ffffff"
          fontSize="19"
          fontWeight="700"
          fontFamily="var(--font-roboto), Roboto, Arial, sans-serif"
          letterSpacing="0.5"
        >
          LG
        </text>
        <circle cx="37.5" cy="29" r="3" fill="#3B82F6" />
      </svg>
    </span>
  )
}

export function TestimonialSpotlight() {
  return (
    <section className="cv-auto py-24 bg-[#E9EEF7]">
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection className="text-center mb-12">
          <h2
            className="headline-shadow text-[clamp(1.9rem,3.5vw,2.75rem)] font-extrabold tracking-[-0.04em] text-text"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Happy <span className="text-gradient">Clients</span>
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <TiltCard maxTilt={4} className="card-premium rounded-[20px] p-8 md:p-12">
            <Quote size={40} className="text-primary opacity-25 mb-6" strokeWidth={1.5} />
            <blockquote
              className="text-lg md:text-xl font-medium text-text leading-relaxed m-0 mb-8"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
            >
              &ldquo;{TESTIMONIAL.quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <ScorpLogo />
              <div>
                <p className="font-bold text-text m-0">{TESTIMONIAL.name}</p>
                <p className="text-sm text-text-secondary m-0">{TESTIMONIAL.company}</p>
              </div>
            </div>
          </TiltCard>
        </AnimatedSection>
      </div>
    </section>
  )
}
