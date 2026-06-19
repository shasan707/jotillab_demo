import Link from 'next/link'
import {
  Mic,
  MessageSquare,
  GitBranch,
  Database,
  Zap,
  ShieldCheck,
  Brain,
} from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { IconBox } from '@/components/ui/IconBox'
import { Badge } from '@/components/ui/Badge'
import { AtmosphericDivider } from '@/components/design'

export const metadata = {
  title: 'Custom AI Application Development | JotilLabs',
  description:
    'We build bespoke AI applications tailored to your business. Voice AI systems, chat platforms, workflow automation, and data integrations, all designed around how you work.',
}

const SOLUTIONS = [
  {
    icon: Mic,
    title: 'Voice AI Systems',
    description:
      'Custom voice agents that answer calls, qualify leads, book appointments, and handle customer inquiries 24/7. Built to sound natural and represent your brand the way you want.',
  },
  {
    icon: MessageSquare,
    title: 'Chat Platforms',
    description:
      'Intelligent chat experiences for your website, SMS, or messaging apps. Your customers get instant, accurate responses while your team focuses on the conversations that matter most.',
  },
  {
    icon: GitBranch,
    title: 'Workflow Engines',
    description:
      'Automated workflows that connect your tools, route tasks, and eliminate repetitive manual steps. We design systems that keep your operations running smoothly without constant oversight.',
  },
  {
    icon: Database,
    title: 'Data Integrations',
    description:
      'We connect your AI to the systems you already use. CRMs, scheduling tools, billing platforms, and more. Your data flows where it needs to go, automatically and securely.',
  },
]

const DIFFERENTIATORS = [
  {
    icon: Zap,
    title: 'Speed to Launch',
    description:
      'Most projects go live in weeks, not months. We use proven components and frameworks so you get results fast without sacrificing quality or reliability.',
  },
  {
    icon: ShieldCheck,
    title: 'Production-Grade Quality',
    description:
      'Every system we build is designed for real business use from day one. Reliable, secure, and tested under load. No prototypes disguised as products.',
  },
  {
    icon: Brain,
    title: 'Deep AI Expertise',
    description:
      'AI is all we do. Our team has built voice, chat, and automation systems for hundreds of businesses. You get the benefit of that experience in every project we take on.',
  },
]

export default function CustomDevelopmentPage() {
  return (
    <div className="min-h-screen bg-bg">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24">
        <div
          className="pointer-events-none absolute top-[-120px] right-[-80px] rounded-full"
          aria-hidden="true"
          style={{
            width: 560,
            height: 560,
            background:
              'radial-gradient(circle, rgba(56, 89, 168,0.09) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="pointer-events-none absolute bottom-[-60px] left-[-100px] rounded-full"
          aria-hidden="true"
          style={{
            width: 420,
            height: 420,
            background:
              'radial-gradient(circle, rgba(59, 130, 246,0.07) 0%, transparent 70%)',
            filter: 'blur(70px)',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <Badge variant="blue" className="mb-6">Custom Development</Badge>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <h1
              className="font-extrabold tracking-[-0.04em] leading-[1.06] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.75rem)' }}
            >
              Custom AI{' '}
              <br className="hidden sm:block" />
              <span className="text-gradient">Applications</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.14}>
            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              When off-the-shelf tools do not fit, we build exactly what your
              business needs. Bespoke AI systems designed around your workflows,
              your customers, and your goals.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-primary-50)" height={40} />

      {/* What We Build */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <Badge variant="blue" className="mb-5">What we build</Badge>
            <h2
              className="font-bold tracking-[-0.03em] text-text mb-3"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              AI solutions built for your business
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Every business is different. We design and build AI applications
              that fit the way you actually work, not the other way around.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SOLUTIONS.map((solution, i) => {
              const Icon = solution.icon
              return (
                <AnimatedSection key={solution.title} delay={i * 0.09}>
                  <div className="card-premium h-full p-7">
                    <IconBox size="md" className="mb-5" glow>
                      <Icon size={20} color="#3859a8" strokeWidth={1.5} />
                    </IconBox>
                    <h3 className="font-semibold text-text text-lg mb-2">
                      {solution.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {solution.description}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-bg-alt)" height={50} />

      {/* Why Us */}
      <section className="py-24 bg-bg-alt/40">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <Badge variant="blue" className="mb-5">Why JotilLabs</Badge>
            <h2
              className="font-bold tracking-[-0.03em] text-text mb-3"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              What makes us different
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              We are not a general software agency that learned AI last year.
              This is all we do, and we do it well.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {DIFFERENTIATORS.map((item, i) => {
              const Icon = item.icon
              return (
                <AnimatedSection key={item.title} delay={i * 0.1}>
                  <div className="card-premium h-full p-7 text-center">
                    <IconBox size="md" className="mb-5 mx-auto" glow>
                      <Icon size={20} color="#3859a8" strokeWidth={1.5} />
                    </IconBox>
                    <h3 className="font-semibold text-text text-lg mb-2">
                      {item.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg-alt)" to="var(--color-bg)" height={50} />

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection>
            <div
              className="rounded-[24px] p-10 md:p-14 text-center"
              style={{
                background:
                  'linear-gradient(135deg, rgba(56, 89, 168,0.07), rgba(59, 130, 246,0.05), rgba(59, 130, 246,0.04))',
                border: '1px solid rgba(56, 89, 168,0.12)',
              }}
            >
              <h2
                className="font-bold tracking-[-0.03em] text-text mb-4"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)' }}
              >
                Have something specific in mind?
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8 max-w-lg mx-auto">
                Tell us about your project. We will assess the feasibility, outline
                a plan, and give you a realistic timeline and cost, no obligation.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center no-underline text-sm font-semibold text-white btn-gradient px-7 py-3.5 rounded-[11px] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Tell Us About Your Project
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center no-underline text-sm font-semibold text-text px-7 py-3.5 rounded-[11px] transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.07)',
                  }}
                >
                  Explore Our Solutions
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
