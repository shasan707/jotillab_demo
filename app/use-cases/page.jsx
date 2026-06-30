import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Shield, Workflow } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Badge } from '@/components/ui/Badge'
import { CountUp } from '@/components/ui/CountUp'
import { AtmosphericDivider } from '@/components/design'
import { IndustryShowcase } from '@/components/sections/IndustryShowcase'
import { IndustryIconStrip } from '@/components/sections/IndustryIconStrip'

export const metadata = {
  title: 'Use Cases & Industry Solutions',
  description:
    'See how JotilLabs AI voice agents, chatbots, and SMS automation solve real problems across restaurant, dental, real estate, legal, hospitality, finance, e-commerce, and home services.',
}

const STATS = [
  { value: 80, suffix: '%', label: 'Fewer missed calls' },
  { value: 12, suffix: '+ hrs', label: 'Saved per week' },
  { value: 3, suffix: 'x', label: 'More leads contacted' },
  { value: 24, suffix: '/7', label: 'Always on for your customers' },
]

const HOW_IT_WORKS = [
  {
    icon: Sparkles,
    title: 'Tell us your business',
    detail: 'Share your industry, hours, and the calls or messages you handle most. Setup takes under an hour.',
  },
  {
    icon: Workflow,
    title: 'We tune the AI to you',
    detail: 'Custom voice, scripts, and integrations. The AI sounds like your team and books into your calendar.',
  },
  {
    icon: Zap,
    title: 'Go live in days',
    detail: 'Forward a number, drop in a chat snippet, or run a campaign. Results show up the same week.',
  },
]

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* ── Hero ── */}
      <section className="hero-wave-bg relative overflow-hidden pt-32 pb-20">
        <div
          className="pointer-events-none absolute top-[-160px] right-[-120px] rounded-full"
          aria-hidden="true"
          style={{
            width: 620,
            height: 620,
            background: 'radial-gradient(circle, rgba(56, 89, 168,0.10) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="pointer-events-none absolute bottom-[-80px] left-[-100px] rounded-full"
          aria-hidden="true"
          style={{
            width: 460,
            height: 460,
            background: 'radial-gradient(circle, rgba(59, 130, 246,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <Badge variant="blue" className="mb-6">Industry Solutions</Badge>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <h1
              className="font-extrabold tracking-[-0.04em] leading-[1.05] text-text mb-6"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)' }}
            >
              AI built for the way your{' '}
              <span className="text-gradient">industry actually works</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.14}>
            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto mb-9">
              From a two-person dental practice to a regional real estate firm, every JotilLabs setup is shaped around the calls, texts, and follow-ups your business actually deals with. Not generic. Not configurable on the side. Built in.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <IndustryIconStrip />
          </AnimatedSection>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-primary-50)" height={40} />

      {/* ── Industry showcase (interactive) ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <p className="text-sm font-semibold tracking-wide uppercase mb-3" style={{ color: '#3859a8' }}>
              Pick your industry
            </p>
            <h2
              className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-3"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.4vw, 2.85rem)' }}
            >
              See exactly what we&rsquo;d do for you
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Tap an industry below. Each setup is built around the specific operational pain we hear from owners every day.
            </p>
          </AnimatedSection>

          <IndustryShowcase />
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-bg-alt)" height={50} />

      {/* ── How it works ── */}
      <section className="py-24 bg-[#E9EEF7]">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <Badge variant="blue" className="mb-5">How it works</Badge>
            <h2
              className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-3"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.4vw, 2.85rem)' }}
            >
              From signup to live in three steps
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Most teams are running their first automated calls inside the same week.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {/* Connector line on desktop */}
            <div
              className="hidden md:block absolute top-12 left-[16.66%] right-[16.66%] h-px pointer-events-none"
              aria-hidden="true"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(56,89,168,0.25), transparent)',
              }}
            />

            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon
              return (
                <AnimatedSection key={step.title} delay={i * 0.1}>
                  <div
                    className="relative h-full rounded-2xl bg-white p-7 group transition-all duration-300 hover:-translate-y-1"
                    style={{
                      border: '1px solid rgba(15,17,41,0.06)',
                      boxShadow: '0 1px 2px rgba(15,17,41,0.04)',
                    }}
                  >
                    {/* Step number background */}
                    <div
                      className="absolute top-4 right-5 text-7xl font-black opacity-[0.05] leading-none select-none"
                      style={{ color: '#3859a8' }}
                      aria-hidden="true"
                    >
                      {i + 1}
                    </div>

                    <div
                      className="relative w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                      style={{
                        background: 'linear-gradient(135deg, rgba(56,89,168,0.1), rgba(56,89,168,0.18))',
                        boxShadow: '0 4px 14px rgba(56,89,168,0.15)',
                      }}
                    >
                      <Icon size={22} color="#3859a8" strokeWidth={1.6} />
                    </div>

                    <h3 className="text-lg font-bold text-text mb-2 relative">{step.title}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed relative">{step.detail}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg-alt)" to="var(--color-bg)" height={50} />

      {/* ── Stats ── */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <Badge variant="blue" className="mb-5">By the numbers</Badge>
            <h2
              className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-3"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.4vw, 2.85rem)' }}
            >
              Results that pay back the platform
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Average outcomes our customers report inside the first 30 days.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {STATS.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.08}>
                <div
                  className="h-full rounded-2xl p-6 text-center group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(160deg, #ffffff, #f8faff)',
                    border: '1px solid rgba(56,89,168,0.10)',
                    boxShadow: '0 1px 2px rgba(15,17,41,0.03)',
                  }}
                >
                  <p className="text-4xl font-extrabold mb-2 leading-none" style={{ color: '#3859a8' }}>
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-text-secondary leading-snug">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div
              className="relative rounded-[28px] p-10 md:p-14 text-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(56, 89, 168,0.10), rgba(59, 130, 246,0.06), rgba(34, 211, 238,0.05))',
                border: '1px solid rgba(56, 89, 168,0.18)',
              }}
            >
              {/* Decorative shapes */}
              <div
                className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full"
                aria-hidden="true"
                style={{
                  background: 'radial-gradient(circle, rgba(56, 89, 168,0.18) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />
              <div
                className="pointer-events-none absolute -bottom-16 -left-16 w-64 h-64 rounded-full"
                aria-hidden="true"
                style={{
                  background: 'radial-gradient(circle, rgba(34, 211, 238,0.16) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              <div className="relative">
                <Shield size={28} className="mx-auto mb-4" color="#3859a8" strokeWidth={1.6} />
                <h2
                  className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-4"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.85rem, 3.2vw, 2.6rem)' }}
                >
                  See it live. Talk to our AI.
                </h2>
                <p className="text-text-secondary leading-relaxed mb-8 max-w-lg mx-auto">
                  Book a 15-minute demo and watch our AI handle a real inbound call, answer questions, and book appointments. Live, in front of you.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 no-underline text-sm font-semibold text-white btn-gradient px-7 py-3.5 rounded-[11px] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Book a Demo
                    <ArrowRight size={15} strokeWidth={2} />
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center no-underline text-sm font-semibold text-text px-7 py-3.5 rounded-[11px] transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)' }}
                  >
                    Explore Products
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
