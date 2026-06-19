'use client'

import { motion } from 'framer-motion'
import { Phone, Shield, Users, Clock } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { CountUp } from '@/components/ui/CountUp'

// `ring` is the fraction of the radial ring drawn around the icon —
// a visual echo of the metric, not exact data.
const STATS = [
  {
    end: 80,
    suffix: '%',
    label: 'Fewer missed calls for our clients',
    icon: Phone,
    color: '#3859a8',
    colorAlpha: 'rgba(56, 89, 168,0.10)',
    ring: 0.8,
  },
  {
    end: 3,
    prefix: '<',
    suffix: 's',
    label: 'Average customer response time',
    icon: Shield,
    color: '#3B82F6',
    colorAlpha: 'rgba(59, 130, 246,0.10)',
    ring: 0.93,
  },
  {
    end: 12,
    suffix: '+',
    label: 'Hours saved per week, per team',
    icon: Users,
    color: '#3B82F6',
    colorAlpha: 'rgba(59, 130, 246,0.10)',
    ring: 0.62,
  },
  {
    end: 4,
    suffix: 'hr',
    label: 'From signup to live, on average',
    icon: Clock,
    color: '#3859a8',
    colorAlpha: 'rgba(56, 89, 168,0.10)',
    ring: 0.45,
  },
]

export function Stats() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Optional section label */}
        <AnimatedSection className="text-center mb-12">
          <p
            className="text-[11px] font-semibold tracking-[0.14em] uppercase"
            style={{
              color: '#3859a8',
              fontFamily: 'var(--font-display)',
            }}
          >
            Results that speak for themselves
          </p>
        </AnimatedSection>

        {/* Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {STATS.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.08}>
              <StatCard stat={stat} />
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  )
}

function StatCard({ stat }) {
  const { end, suffix, decimals = 0, label, icon: Icon, color, colorAlpha, ring } = stat

  return (
    <div
      className="rounded-[20px] p-5 sm:p-7 flex flex-col gap-3 sm:gap-4 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(16px) saturate(1.4)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.4)',
        border: '1px solid rgba(56, 89, 168, 0.10)',
        boxShadow: '0 4px 20px rgba(15, 17, 41, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.boxShadow = '0 16px 48px rgba(15, 17, 41, 0.08), inset 0 1px 0 rgba(255,255,255,0.9)'
        e.currentTarget.style.borderColor = 'rgba(56, 89, 168, 0.18)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.85)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(15, 17, 41, 0.04), inset 0 1px 0 rgba(255,255,255,0.8)'
        e.currentTarget.style.borderColor = 'rgba(56, 89, 168, 0.10)'
        e.currentTarget.style.background = 'rgba(255,255,255,0.7)'
      }}
    >
      {/* Icon inside a radial ring that draws as the card scrolls in,
          in sync with the CountUp */}
      <div className="relative w-14 h-14">
        <svg className="absolute inset-0 -rotate-90" width="56" height="56" viewBox="0 0 56 56" aria-hidden="true">
          <circle cx="28" cy="28" r="25" stroke="rgba(15,17,41,0.07)" strokeWidth="2.5" fill="none" />
          <motion.circle
            cx="28"
            cy="28"
            r="25"
            stroke={color}
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: ring }}
            viewport={{ once: true, margin: '-10%' }}
            transition={{ duration: 2.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </svg>
        <div
          className="absolute inset-[7px] rounded-full flex items-center justify-center"
          style={{ background: colorAlpha }}
        >
          <Icon size={18} strokeWidth={1.75} style={{ color }} />
        </div>
      </div>

      {/* Number */}
      <div>
        <p
          className="text-[clamp(2rem,4vw,2.75rem)] font-extrabold leading-none tracking-[-0.04em] text-gradient"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <CountUp end={end} suffix={suffix} decimals={decimals} duration={2.2} />
        </p>

        {/* Label */}
        <p
          className="text-sm text-text-secondary mt-2 leading-snug"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          {label}
        </p>
      </div>
    </div>
  )
}
