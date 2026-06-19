import Link from 'next/link'
import {
  Search,
  Map,
  Rocket,
  RefreshCcw,
  ClipboardCheck,
  LineChart,
  Wrench,
  Repeat,
} from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { IconBox } from '@/components/ui/IconBox'
import { Badge } from '@/components/ui/Badge'
import { AtmosphericDivider } from '@/components/design'

export const metadata = {
  title: 'AI Automation Consultancy | JotilLabs',
  description:
    'We help businesses identify, plan, and implement AI automation opportunities that save time, reduce costs, and drive growth. No technical expertise required on your end.',
}

const SERVICES = [
  {
    icon: ClipboardCheck,
    title: 'AI Audit',
    description:
      'We review your current operations, tools, and workflows to find the highest-impact areas where AI can save your team time and money. You get a clear, prioritized list of opportunities.',
  },
  {
    icon: LineChart,
    title: 'Strategy & Roadmap',
    description:
      'We build a step-by-step plan tailored to your business goals, budget, and timeline. No guesswork. Just a realistic path from where you are today to where you want to be.',
  },
  {
    icon: Wrench,
    title: 'Implementation',
    description:
      'Our team handles the heavy lifting. We configure, integrate, and launch AI solutions that plug into your existing systems, so your day-to-day operations improve without disruption.',
  },
  {
    icon: Repeat,
    title: 'Ongoing Optimization',
    description:
      'AI gets better with data. We monitor performance, fine-tune configurations, and roll out improvements so your automation keeps delivering results month after month.',
  },
]

const PROCESS = [
  {
    step: '01',
    icon: Search,
    title: 'Discovery',
    description:
      'We start by learning your business inside and out. We talk to your team, observe your workflows, and identify the bottlenecks that are costing you the most.',
  },
  {
    step: '02',
    icon: Map,
    title: 'Analysis',
    description:
      'We map every opportunity against effort, cost, and expected ROI. You get a clear picture of what to automate first and why it matters for your bottom line.',
  },
  {
    step: '03',
    icon: Rocket,
    title: 'Implementation',
    description:
      'We build, test, and deploy your AI solutions in phases. Each phase is designed to deliver measurable value quickly, so you see results before committing further.',
  },
  {
    step: '04',
    icon: RefreshCcw,
    title: 'Review & Iterate',
    description:
      'After launch, we review performance data with you, gather feedback from your team, and continuously improve the system. Your automation grows with your business.',
  },
]

export default function ConsultancyPage() {
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
            <Badge variant="blue" className="mb-6">Consultancy</Badge>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <h1
              className="font-extrabold tracking-[-0.04em] leading-[1.06] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.75rem)' }}
            >
              AI Automation{' '}
              <br className="hidden sm:block" />
              <span className="text-gradient">Consultancy</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.14}>
            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              Not sure where AI fits into your business? We help you find the
              right opportunities, build a practical plan, and get automation
              running, without the risk of wasted time or budget.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-primary-50)" height={40} />

      {/* What We Offer */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <Badge variant="blue" className="mb-5">What we offer</Badge>
            <h2
              className="font-bold tracking-[-0.03em] text-text mb-3"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              From assessment to results
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Whether you are exploring AI for the first time or looking to
              expand what you already have, we meet you where you are.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {SERVICES.map((service, i) => {
              const Icon = service.icon
              return (
                <AnimatedSection key={service.title} delay={i * 0.09}>
                  <div className="card-premium h-full p-7">
                    <IconBox size="md" className="mb-5" glow>
                      <Icon size={20} color="#3859a8" strokeWidth={1.5} />
                    </IconBox>
                    <h3 className="font-semibold text-text text-lg mb-2">
                      {service.title}
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-bg-alt)" height={50} />

      {/* Process */}
      <section className="py-24 bg-bg-alt/40">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <Badge variant="blue" className="mb-5">How it works</Badge>
            <h2
              className="font-bold tracking-[-0.03em] text-text mb-3"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              A clear path from question to outcome
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Our process is designed to minimize risk and maximize speed to
              value. Four stages, each with clear deliverables.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {PROCESS.map((item, i) => {
              const Icon = item.icon
              return (
                <AnimatedSection key={item.title} delay={i * 0.09}>
                  <div className="card-premium h-full p-7">
                    <div className="flex items-start gap-4">
                      <IconBox size="md" glow>
                        <Icon size={20} color="#3859a8" strokeWidth={1.5} />
                      </IconBox>
                      <div>
                        <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
                          Step {item.step}
                        </p>
                        <h3 className="font-semibold text-text text-lg mb-2">
                          {item.title}
                        </h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
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
                Ready to see where AI fits in your business?
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8 max-w-lg mx-auto">
                Book a free discovery call. We will walk through your operations,
                identify the biggest opportunities, and show you what is possible
                with the right automation in place.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center no-underline text-sm font-semibold text-white btn-gradient px-7 py-3.5 rounded-[11px] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Book a Discovery Call
                </Link>
                <Link
                  href="/use-cases"
                  className="inline-flex items-center no-underline text-sm font-semibold text-text px-7 py-3.5 rounded-[11px] transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(0,0,0,0.04)',
                    border: '1px solid rgba(0,0,0,0.07)',
                  }}
                >
                  See Use Cases
                </Link>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  )
}
