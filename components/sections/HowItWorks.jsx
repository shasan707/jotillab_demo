'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Plug, SlidersHorizontal, Zap } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const STEPS = [
  {
    number: '01',
    icon: Plug,
    title: 'Connect',
    desc: 'Link your phone numbers, website, and tools. No code required.',
    color: '#3859a8',
    colorAlpha: 'rgba(56, 89, 168,0.10)',
  },
  {
    number: '02',
    icon: SlidersHorizontal,
    title: 'Configure',
    desc: 'Tell the AI about your business. Train it on your FAQs and workflows.',
    color: '#3B82F6',
    colorAlpha: 'rgba(59, 130, 246,0.10)',
  },
  {
    number: '03',
    icon: Zap,
    title: 'Automate',
    desc: 'Go live. Your AI handles calls, chats, and follow-ups around the clock.',
    color: '#3B82F6',
    colorAlpha: 'rgba(59, 130, 246,0.10)',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#F4F6FB]">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <AnimatedSection className="text-center mb-16">
          <p className="badge mx-auto mb-4 w-fit">How it works</p>
          <h2
            className="headline-shadow text-[clamp(1.9rem,3.5vw,2.75rem)] font-extrabold tracking-[-0.04em] text-text mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Up and running in{' '}
            <span className="text-gradient">hours, not months</span>
          </h2>
          <p
            className="text-base text-text-secondary leading-relaxed max-w-md mx-auto"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Three straightforward steps stand between you and a fully automated
            communication layer.
          </p>
        </AnimatedSection>

        {/* Steps */}
        <div className="relative flex flex-col lg:flex-row gap-0 lg:gap-0 items-stretch">

          {STEPS.map((step, i) => (
            <div key={step.number} className="flex-1 flex flex-col lg:flex-row items-stretch">

              {/* Step card */}
              <AnimatedSection delay={i * 0.12} className="flex-1">
                <StepCard step={step} index={i} />
              </AnimatedSection>

              {/* Connector — draws itself between steps on desktop */}
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex items-center justify-center w-14 shrink-0 self-center">
                  <Connector delay={0.35 + i * 0.3} />
                </div>
              )}

              {/* Vertical connector for mobile — draws downward on scroll */}
              {i < STEPS.length - 1 && (
                <div className="lg:hidden flex justify-center my-3">
                  <motion.div
                    className="w-px h-10 origin-top"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true, margin: '-10%' }}
                    transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                    style={{
                      background: 'linear-gradient(to bottom, rgba(56, 89, 168,0.25), rgba(59, 130, 246,0.15))',
                    }}
                  />
                </div>
              )}

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

function StepCard({ step, index }) {
  const { number, icon: Icon, title, desc, color, colorAlpha } = step
  const ref = useRef(null)
  // Activation: the step "switches on" once it scrolls into view.
  const inView = useInView(ref, { once: true, margin: '-20% 0px -20% 0px' })

  return (
    <div
      ref={ref}
      className="h-full p-8 rounded-[20px] flex flex-col gap-5 transition-all duration-300"
      style={{
        background: 'rgba(255,255,255,0.55)',
        backdropFilter: 'blur(16px) saturate(1.8)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
        border: '1px solid rgba(255,255,255,0.70)',
        boxShadow: '0 2px 8px rgba(15,17,41,0.04), inset 0 1px 0 rgba(255,255,255,0.95)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.70)'
        e.currentTarget.style.boxShadow = `0 16px 48px ${color}14, 0 4px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)`
        e.currentTarget.style.borderColor = `${color}25`
        e.currentTarget.style.transform = 'translateY(-3px)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.55)'
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,17,41,0.04), inset 0 1px 0 rgba(255,255,255,0.95)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.70)'
        e.currentTarget.style.transform = 'translateY(0)'
      }}
    >
      {/* Step number — fades up to full strength as the step activates */}
      <motion.span
        className="block text-[3.5rem] font-extrabold leading-[1.25] select-none pt-1"
        initial={{ opacity: 0.3 }}
        animate={{ opacity: inView ? 1 : 0.3 }}
        transition={{ duration: 0.6, delay: 0.15 + index * 0.18, ease: 'easeOut' }}
        style={{
          fontFamily: 'var(--font-jetbrains), JetBrains Mono, monospace',
          background: `linear-gradient(135deg, ${color}, ${color}aa)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          letterSpacing: '-0.04em',
        }}
      >
        {number}
      </motion.span>

      {/* Icon — neutral until activated, then fills with its step color */}
      <div className="relative w-11 h-11">
        {inView && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-[12px]"
            initial={{ scale: 0.7, opacity: 0.55 }}
            animate={{ scale: 1.9, opacity: 0 }}
            transition={{ duration: 0.9, delay: 0.25 + index * 0.18, ease: 'easeOut' }}
            style={{ border: `1.5px solid ${color}` }}
          />
        )}
        <div
          className="w-11 h-11 rounded-[12px] flex items-center justify-center transition-all duration-500"
          style={{
            background: inView ? colorAlpha : 'rgba(15,17,41,0.04)',
            border: inView ? `1px solid ${color}22` : '1px solid rgba(15,17,41,0.06)',
            transitionDelay: `${0.2 + index * 0.18}s`,
          }}
        >
          <Icon
            size={20}
            strokeWidth={1.75}
            className="transition-colors duration-500"
            style={{ color: inView ? color : '#9AA3B8', transitionDelay: `${0.2 + index * 0.18}s` }}
          />
        </div>
      </div>

      {/* Title */}
      <div>
        <h3
          className="text-lg font-bold text-text mb-2 tracking-[-0.025em]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>
        <p
          className="text-sm text-text-secondary leading-relaxed"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          {desc}
        </p>
      </div>
    </div>
  )
}

function Connector({ delay = 0 }) {
  return (
    <svg width="56" height="12" viewBox="0 0 56 12" fill="none" aria-hidden="true">
      {/* Line draws left to right as the section scrolls into view */}
      <motion.path
        d="M2 6 H45"
        stroke="rgba(56, 89, 168, 0.35)"
        strokeWidth="1.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.55, delay, ease: 'easeInOut' }}
      />
      {/* Arrow tip pops in after the line arrives */}
      <motion.path
        d="M46 2 L52 6 L46 10"
        stroke="rgba(56, 89, 168, 0.4)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0, x: -4 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: '-15%' }}
        transition={{ duration: 0.3, delay: delay + 0.5, ease: 'easeOut' }}
      />
    </svg>
  )
}
