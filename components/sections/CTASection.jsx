'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, PhoneCall } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { SerifAccent } from '@/components/design'

export function CTASection() {
  return (
    <section
      className="cv-auto surface-navy relative py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #3859a8 0%, #2a4688 45%, #0f1129 100%)',
      }}
    >
      {/* Brand grain noise overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          opacity: 0.06,
          mixBlendMode: 'overlay',
        }}
      />

      {/* Dot pattern overlay (sparse, for texture) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 40%, black 40%, transparent 100%)',
        }}
      />

      {/* Traveling beam along the top edge */}
      <div aria-hidden="true" className="beam-line" />

      {/* Cyan ambient glow - top right, drifts slowly */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full atmosphere-drift-1"
        style={{
          width: 520,
          height: 520,
          top: '-25%',
          right: '-12%',
          background: 'radial-gradient(circle, rgba(59, 130, 246,0.28) 0%, transparent 70%)',
          filter: 'blur(90px)',
          willChange: 'transform',
        }}
      />
      {/* Royal blue secondary glow - left, counter-drifts */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute rounded-full atmosphere-drift-2"
        style={{
          width: 420,
          height: 420,
          top: '10%',
          left: '-10%',
          background: 'radial-gradient(circle, rgba(56,89,168,0.35) 0%, transparent 70%)',
          filter: 'blur(90px)',
          willChange: 'transform',
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">

        {/* Badge */}
        <AnimatedSection>
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-8"
            style={{
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.20)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-white"
              style={{ opacity: 0.85 }}
            />
            <span
              className="text-[11px] font-semibold text-white tracking-[0.1em] uppercase"
              style={{ fontFamily: 'var(--font-display)', opacity: 0.9 }}
            >
              Get started today
            </span>
          </div>
        </AnimatedSection>

        {/* Headline */}
        <AnimatedSection delay={0.07}>
          <h2
            className="text-white font-extrabold tracking-[-0.04em] mb-6"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4.5vw, 3.25rem)',
              lineHeight: 1.1,
              // Same subtle directional cast as every other heading, tuned dark
              // so it reads on the navy band (a dark-navy shadow would vanish).
              textShadow:
                '2px 3px 0 rgba(0,0,0,0.22), 4px 6px 9px rgba(0,0,0,0.16)',
            }}
          >
            Stop losing customers{'\u00A0'}
            <br className="hidden sm:block" />
            to missed conversations.
          </h2>
        </AnimatedSection>

        {/* Sub-copy */}
        <AnimatedSection delay={0.13}>
          <p
            className="text-[1.05rem] leading-[1.75] mb-10 max-w-xl mx-auto"
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              color: 'rgba(255,255,255,0.72)',
            }}
          >
            Join hundreds of businesses already using Jotil to handle calls,
            chats, and follow-ups. <SerifAccent weight={600}>24/7</SerifAccent>, without extra headcount.
          </p>
        </AnimatedSection>

        {/* CTAs */}
        <AnimatedSection delay={0.18}>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Primary: white bg */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 no-underline text-sm font-semibold rounded-[11px] px-6 py-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              style={{
                fontFamily: 'var(--font-display)',
                background: '#FFFFFF',
                color: 'var(--color-primary)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
              }}
            >
              Book a Demo
              <ArrowRight size={15} strokeWidth={2} />
            </Link>

            {/* Secondary: frosted */}
            <Link
              href="/products/receptionist"
              className="inline-flex items-center gap-2 no-underline text-sm font-semibold text-white rounded-[11px] px-6 py-3.5 transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.22)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <PhoneCall size={15} strokeWidth={1.75} />
              Talk to Our AI
            </Link>
          </div>
        </AnimatedSection>

        {/* Trust note */}
        <AnimatedSection delay={0.24}>
          <p
            className="mt-8 text-[12px]"
            style={{
              fontFamily: 'var(--font-inter), Inter, sans-serif',
              color: 'rgba(255,255,255,0.45)',
            }}
          >
            No credit card required. Setup in under a day.
          </p>
        </AnimatedSection>

      </div>
    </section>
  )
}
