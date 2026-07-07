import { ContactForm } from '@/components/sections/ContactForm'
import { DemoScheduler } from '@/components/sections/DemoScheduler'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Badge } from '@/components/ui/Badge'
import { AtmosphericDivider, TiltCard } from '@/components/design'
import { Check, Mail, Phone, Clock, Sparkles, PhoneCall } from 'lucide-react'

export const metadata = {
  title: 'Contact JotilLabs',
  description:
    'Book a live 15-minute demo of JotilLabs AI, or send our team a message. See our AI voice, chat, and automation handle a real customer conversation, tailored to your business.',
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'JotilLabs',
  telephone: '+1-358-900-0040',
  email: 'contact@jotillabs.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lehi',
    addressRegion: 'Utah',
    addressCountry: 'US',
  },
}

const VALUE_POINTS = [
  'A real conversation, not a slideshow',
  'Tailored to your industry and use case',
  'No setup on your end, no commitment',
]

const STEPS = [
  {
    n: '01',
    Icon: Clock,
    title: 'Pick a time',
    desc: 'Grab a slot that works for you. The whole thing takes about fifteen minutes.',
  },
  {
    n: '02',
    Icon: Sparkles,
    title: 'We tailor it',
    desc: 'Before the call, we build a scenario around your business and your goals.',
  },
  {
    n: '03',
    Icon: PhoneCall,
    title: 'See it live',
    desc: 'Watch the AI take a real call, then ask us anything you want.',
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />

      {/* ── Hero: pitch on the left, live booking on the right ── */}
      <section id="book" className="hero-wave-bg relative overflow-hidden pt-32 pb-20">
        <div
          className="pointer-events-none absolute -top-24 -right-16 rounded-full"
          aria-hidden="true"
          style={{ width: 520, height: 520, background: 'radial-gradient(circle, rgba(56,89,168,0.10) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />
        <div
          className="pointer-events-none absolute top-40 -left-24 rounded-full"
          aria-hidden="true"
          style={{ width: 420, height: 420, background: 'radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left — the pitch */}
            <div className="lg:pt-8">
              <AnimatedSection>
                <Badge variant="blue" className="mb-5">Book a live demo</Badge>
              </AnimatedSection>

              <AnimatedSection delay={0.06}>
                <h1
                  className="font-extrabold tracking-[-0.04em] leading-[1.05] text-text mb-5"
                  style={{ fontSize: 'clamp(2.3rem, 4.6vw, 3.6rem)' }}
                >
                  See your AI answer a{' '}
                  <span className="text-gradient">real call</span>{' '}
                  in 15 minutes.
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={0.12}>
                <p className="text-lg text-text-secondary leading-relaxed max-w-lg mb-8">
                  Pick a time that fits your schedule. We will tailor a demo to your business and let you put it through its paces, live.
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.18}>
                <ul className="space-y-3.5 mb-9">
                  {VALUE_POINTS.map((point) => (
                    <li key={point} className="flex items-center gap-3">
                      <span
                        className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: 'rgba(56,89,168,0.10)' }}
                      >
                        <Check size={13} color="#3859a8" strokeWidth={2.6} />
                      </span>
                      <span className="text-[15px] text-text-secondary">{point}</span>
                    </li>
                  ))}
                </ul>
              </AnimatedSection>

              <AnimatedSection delay={0.24}>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:contact@jotillabs.com"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    <Mail size={15} color="#3859a8" strokeWidth={1.8} />
                    <span className="text-sm font-medium text-text group-hover:text-primary transition-colors">contact@jotillabs.com</span>
                  </a>
                  <a
                    href="tel:+13589000040"
                    className="group inline-flex items-center gap-2.5 rounded-full bg-white px-4 py-2.5 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    <Phone size={15} color="#3859a8" strokeWidth={1.8} />
                    <span className="text-sm font-medium text-text group-hover:text-primary transition-colors">+1 (358) 900-0040</span>
                  </a>
                </div>
                <p className="text-sm text-text-muted mt-5">
                  Replies within one business day. Based in Lehi, Utah.
                </p>
              </AnimatedSection>
            </div>

            {/* Right — the interactive booking widget */}
            <AnimatedSection delay={0.15}>
              <DemoScheduler />
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ── How a demo works (a real 3-step sequence) ── */}
      <section className="py-20 bg-white border-t" style={{ borderColor: 'rgba(15,17,41,0.06)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary mb-3">What to expect</p>
            <h2
              className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              From booking to a live call in three steps
            </h2>
          </AnimatedSection>

          <div className="grid md:grid-cols-3 gap-5">
            {STEPS.map((step, i) => (
              <AnimatedSection key={step.n} delay={i * 0.1}>
                <TiltCard maxTilt={4} className="card-premium h-full rounded-[20px] p-7 flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-11 h-11 rounded-[13px] flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, rgba(56,89,168,0.12), rgba(56,89,168,0.22))' }}
                    >
                      <step.Icon size={20} color="#3859a8" strokeWidth={1.7} />
                    </div>
                    <span
                      className="text-sm font-bold tabular-nums"
                      style={{ color: 'rgba(56,89,168,0.35)', fontFamily: 'var(--font-jetbrains)' }}
                    >
                      {step.n}
                    </span>
                  </div>
                  <h3 className="font-bold text-text text-lg mb-2">{step.title}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{step.desc}</p>
                </TiltCard>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-bg-alt)" height={40} />

      {/* ── Message form + contact details + FAQ ── */}
      <section className="py-16 pb-28">
        <div className="max-w-6xl mx-auto px-6">
          <ContactForm />
        </div>
      </section>
    </div>
  )
}
