import Link from 'next/link'
import { Target, Eye, Lightbulb, Shield, Zap, Users } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { CountUp } from '@/components/ui/CountUp'
import { IconBox } from '@/components/ui/IconBox'
import { Badge } from '@/components/ui/Badge'
import { AtmosphericDivider } from '@/components/design'

export const metadata = {
  title: 'About JotilLabs',
  description:
    'Learn about JotilLabs, an AI automation company founded in Lehi, Utah. Our mission is to help businesses communicate smarter through intelligent automation.',
}

const STATS = [
  { end: 500, suffix: '+', label: 'Businesses Served', prefix: '' },
  { end: 99.9, suffix: '%', label: 'Platform Uptime', prefix: '', decimals: 1 },
  { end: 50, suffix: '+', label: 'Integrations', prefix: '' },
  { end: 4, suffix: 'hr', label: 'Average Setup Time', prefix: '' },
]

const VALUES = [
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description:
      'We build with emerging AI technology before it becomes mainstream, giving our clients a meaningful head start over their competition.',
  },
  {
    icon: Shield,
    title: 'Trust & Compliance',
    description:
      'Every product is designed with TCPA, HIPAA, and data-privacy requirements in mind. Your customers trust you, and we help you honor that.',
  },
  {
    icon: Zap,
    title: 'Speed to Value',
    description:
      'Most clients go live in days, not months. We obsess over onboarding experience so you see results fast, not after a six-month implementation.',
  },
  {
    icon: Users,
    title: 'Partner Mindset',
    description:
      'We act like a member of your team, not a vendor. Your success metrics are our success metrics.',
  },
]

const TEAM = [
  {
    initials: 'SS',
    name: 'Sayeed Sajal',
    title: 'CEO & Co-Founder',
    bio: 'Sayeed drives the overall vision and product strategy at JotilLabs, combining deep expertise in AI systems with a relentless focus on delivering measurable business outcomes for clients.',
  },
  {
    initials: 'SD',
    name: 'Saikat Das',
    title: 'COO & Co-Founder',
    bio: 'Saikat leads operations, partnerships, and go-to-market. He ensures that every client deployment runs smoothly from kickoff through scaling, with a strong background in enterprise operations.',
  },
  {
    initials: 'QR',
    name: 'Qudrat E Alahy Ratul',
    title: 'CTO & Co-Founder',
    bio: 'Ratul architects the technical foundation of the Jotil platform, from voice AI infrastructure to real-time communication pipelines, with a philosophy of building systems that are both powerful and maintainable.',
  },
]

export default function AboutPage() {
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

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <AnimatedSection>
            <Badge variant="blue" className="mb-6">Our Story</Badge>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <h1
              className="font-extrabold tracking-[-0.04em] leading-[1.06] mb-6"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 3.75rem)' }}
            >
              We believe every business{' '}
              <br className="hidden sm:block" />
              deserves{' '}
              <span className="text-gradient">world-class communication</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.14}>
            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto">
              JotilLabs was founded in 2026 by three builders who kept watching
              businesses lose customers to missed calls, slow responses, and
              manual work that never needed to be manual. We set out to change
              that with AI that genuinely works.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-primary-50)" height={40} />

      {/* Story + Mission / Vision */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
            {/* Left: Story */}
            <AnimatedSection>
              <Badge variant="blue" className="mb-5">How it started</Badge>
              <h2
                className="font-bold tracking-[-0.03em] leading-snug mb-6 text-text"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)' }}
              >
                Born from a frustration with wasted potential
              </h2>
              <div className="space-y-5 text-text-secondary leading-relaxed">
                <p>
                  The three of us had spent years working alongside small and
                  mid-sized businesses. We kept seeing the same pattern: great
                  products, great teams, but a communication layer that was
                  completely overwhelmed. Phones ringing off the hook. Leads
                  going unanswered overnight. Customer service reps buried in
                  repetitive questions.
                </p>
                <p>
                  When voice AI and large language models reached a quality
                  threshold where they could genuinely serve customers without
                  frustrating them, we knew the window was open. We incorporated
                  JotilLabs in Lehi, Utah, and started building the platform we
                  wished had existed.
                </p>
                <p>
                  Today we serve businesses across healthcare, real estate, legal,
                  hospitality, finance, and e-commerce. All with the same goal:
                  make their communication layer as smart and tireless as the rest
                  of their operation.
                </p>
              </div>
            </AnimatedSection>

            {/* Right: Mission + Vision cards */}
            <div className="space-y-5">
              <AnimatedSection delay={0.1}>
                <div className="card-premium p-7">
                  <div className="flex items-start gap-4">
                    <IconBox size="md" glow>
                      <Target size={20} color="#3859a8" strokeWidth={1.5} />
                    </IconBox>
                    <div>
                      <h3 className="font-semibold text-text text-lg mb-2">Our Mission</h3>
                      <p className="text-text-secondary leading-relaxed text-sm">
                        To make intelligent, AI-driven communication accessible
                        to every business, regardless of size, so that no call
                        goes missed, no lead goes cold, and no customer feels
                        ignored.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.18}>
                <div className="card-premium p-7">
                  <div className="flex items-start gap-4">
                    <IconBox size="md" glow>
                      <Eye size={20} color="#3B82F6" strokeWidth={1.5} />
                    </IconBox>
                    <div>
                      <h3 className="font-semibold text-text text-lg mb-2">Our Vision</h3>
                      <p className="text-text-secondary leading-relaxed text-sm">
                        A world where every business, from a two-person dental
                        practice to a regional hospitality chain, has AI working
                        around the clock to handle communications, qualify leads,
                        and delight customers at every touchpoint.
                      </p>
                    </div>
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection delay={0.26}>
                <div
                  className="rounded-[20px] p-7"
                  style={{
                    background: 'linear-gradient(135deg, rgba(56, 89, 168,0.07), rgba(59, 130, 246,0.05))',
                    border: '1px solid rgba(56, 89, 168,0.12)',
                  }}
                >
                  <p className="text-sm font-medium text-primary mb-1">Founded</p>
                  <p className="text-2xl font-bold text-text tracking-tight">2026</p>
                  <p className="text-sm text-text-secondary mt-1">Lehi, Utah</p>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-bg-alt)" height={50} />

      {/* Stats */}
      <section className="py-24 bg-bg-alt/40">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <h2
              className="font-bold tracking-[-0.03em] text-text mb-3"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              Trusted by growing businesses
            </h2>
            <p className="text-text-secondary">
              Numbers that reflect the confidence businesses put in our platform.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
            {STATS.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.08}>
                <div className="card text-center py-5 sm:py-8 px-3 sm:px-6">
                  <p
                    className="font-extrabold tracking-tight text-text mb-1 text-gradient"
                    style={{ fontSize: 'clamp(2rem, 4vw, 2.75rem)' }}
                  >
                    <CountUp
                      end={stat.end}
                      suffix={stat.suffix}
                      prefix={stat.prefix}
                      decimals={stat.decimals || 0}
                      duration={2.2}
                    />
                  </p>
                  <p className="text-sm text-text-secondary font-medium">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg-alt)" to="var(--color-bg)" height={50} />

      {/* Values */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <Badge variant="blue" className="mb-5">What we believe</Badge>
            <h2
              className="font-bold tracking-[-0.03em] text-text"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              The values that guide every decision
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {VALUES.map((value, i) => {
              const Icon = value.icon
              return (
                <AnimatedSection key={value.title} delay={i * 0.09}>
                  <div className="card-premium h-full p-7">
                    <IconBox size="md" className="mb-5" glow>
                      <Icon size={20} color="#3859a8" strokeWidth={1.5} />
                    </IconBox>
                    <h3 className="font-semibold text-text text-lg mb-2">{value.title}</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{value.description}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-bg-alt)" height={50} />

      {/* Team */}
      <section className="py-24 bg-bg-alt/40">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection className="text-center mb-14">
            <Badge variant="blue" className="mb-5">The founders</Badge>
            <h2
              className="font-bold tracking-[-0.03em] text-text mb-3"
              style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)' }}
            >
              Built by people who care deeply
            </h2>
            <p className="text-text-secondary max-w-lg mx-auto">
              Three co-founders, one shared obsession: making AI communication genuinely useful for real businesses.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEAM.map((member, i) => (
              <AnimatedSection key={member.name} delay={i * 0.1}>
                <div className="card text-center h-full flex flex-col items-center p-8">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-4 font-bold text-white text-lg tracking-tight shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #3859a8, #3B82F6)',
                      boxShadow: '0 8px 24px rgba(56, 89, 168,0.3)',
                    }}
                  >
                    {member.initials}
                  </div>

                  <h3 className="font-semibold text-text text-base mb-0.5">{member.name}</h3>
                  <p className="text-xs text-primary font-medium mb-4">{member.title}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{member.bio}</p>

                  <div className="mt-5 text-xs text-text-muted">
                    Lehi, Utah
                  </div>
                </div>
              </AnimatedSection>
            ))}
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
                background: 'linear-gradient(135deg, rgba(56, 89, 168,0.07), rgba(59, 130, 246,0.05), rgba(59, 130, 246,0.04))',
                border: '1px solid rgba(56, 89, 168,0.12)',
              }}
            >
              <h2
                className="font-bold tracking-[-0.03em] text-text mb-4"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)' }}
              >
                Want to join our mission?
              </h2>
              <p className="text-text-secondary leading-relaxed mb-8 max-w-lg mx-auto">
                Whether you are a business looking to deploy AI or a builder who wants to help shape the future of communication, we would love to connect.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/contact"
                  className="inline-flex items-center no-underline text-sm font-semibold text-white btn-gradient px-7 py-3.5 rounded-[11px] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  Get in Touch
                </Link>
                <Link
                  href="/use-cases"
                  className="inline-flex items-center no-underline text-sm font-semibold text-text px-7 py-3.5 rounded-[11px] transition-all duration-300 hover:-translate-y-0.5"
                  style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)' }}
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
