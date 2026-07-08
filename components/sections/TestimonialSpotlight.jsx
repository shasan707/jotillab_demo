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
  initials: 'AG',
}

export function TestimonialSpotlight() {
  return (
    <section className="cv-auto py-24 bg-[#E9EEF7]">
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection className="text-center mb-12">
          <p className="badge mx-auto mb-4 w-fit">What customers say</p>
          <h2
            className="headline-shadow text-[clamp(1.9rem,3.5vw,2.75rem)] font-extrabold tracking-[-0.04em] text-text"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Trusted to answer, <span className="text-gradient">every time</span>
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
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #3859a8, #2a4688)' }}
              >
                {TESTIMONIAL.initials}
              </div>
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
