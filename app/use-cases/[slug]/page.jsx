import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowRight, ArrowLeft, AlertCircle, Sparkles,
  Quote, Check, ChevronRight,
} from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Badge } from '@/components/ui/Badge'
import { CountUp } from '@/components/ui/CountUp'
import { AtmosphericDivider } from '@/components/design'
import { CursorTilt } from '@/components/ui/CursorTilt'
import { INDUSTRIES, INDUSTRY_SLUGS, getIndustry, getRelatedIndustries } from '@/lib/industries'
import { products } from '@/data/products'
import { ScenarioCard } from '@/components/sections/industry/ScenarioCard'

const BRAND = '#3859a8'

export function generateStaticParams() {
  return INDUSTRY_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const industry = getIndustry(slug)
  if (!industry) return { title: 'Industry not found' }
  return {
    title: `${industry.name} AI Solutions`,
    description: industry.heroDescription,
  }
}

export default async function IndustryPage({ params }) {
  const { slug } = await params
  const industry = getIndustry(slug)
  if (!industry) notFound()

  const Icon = industry.icon
  const related = getRelatedIndustries(industry.slug, 4)
  const recommendedProducts = industry.products
    .map((slug) => products.find((p) => p.slug === slug))
    .filter(Boolean)

  return (
    <div className="min-h-screen bg-bg">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div
          className="pointer-events-none absolute -top-40 -right-30 rounded-full"
          aria-hidden="true"
          style={{
            width: 620,
            height: 620,
            background: 'radial-gradient(circle, rgba(56, 89, 168,0.10) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-20 -left-25 rounded-full"
          aria-hidden="true"
          style={{
            width: 460,
            height: 460,
            background: 'radial-gradient(circle, rgba(34, 211, 238,0.07) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <AnimatedSection>
            <Link
              href="/use-cases"
              className="inline-flex items-center gap-1 text-xs font-semibold mb-6 no-underline transition-all hover:gap-2"
              style={{ color: BRAND }}
            >
              <ArrowLeft size={12} strokeWidth={2.2} />
              All industries
            </Link>
          </AnimatedSection>

          <div className="grid md:grid-cols-[auto_1fr] gap-6 md:gap-10 items-start">
            <AnimatedSection>
              <div
                className="w-20 h-20 rounded-3xl flex items-center justify-center shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(56,89,168,0.12), rgba(56,89,168,0.22))',
                  boxShadow: '0 8px 28px rgba(56,89,168,0.18)',
                }}
              >
                <Icon size={36} color={BRAND} strokeWidth={1.5} />
              </div>
            </AnimatedSection>

            <div>
              <AnimatedSection delay={0.06}>
                <Badge variant="blue" className="mb-4">{industry.badge}</Badge>
              </AnimatedSection>

              <AnimatedSection delay={0.1}>
                <h1
                  className="font-extrabold tracking-[-0.04em] leading-[1.05] text-text mb-4"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 3.85rem)' }}
                >
                  {industry.tagline}
                </h1>
              </AnimatedSection>

              <AnimatedSection delay={0.16}>
                <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mb-8">
                  {industry.heroDescription}
                </p>
              </AnimatedSection>

              <AnimatedSection delay={0.22}>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 no-underline text-sm font-semibold text-white btn-gradient px-7 py-3.5 rounded-[11px] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Book a demo
                    <ArrowRight size={15} strokeWidth={2} />
                  </Link>
                  <Link
                    href="/products"
                    className="inline-flex items-center no-underline text-sm font-semibold text-text px-7 py-3.5 rounded-[11px] transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)' }}
                  >
                    Explore products
                  </Link>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>

      {/* ── Product dashboard promo ── */}
      <section className="pb-16">
        <div className="max-w-5xl mx-auto px-6">
          <AnimatedSection>
            <CursorTilt max={6}>
              <div
                className="relative rounded-[24px] overflow-hidden"
                style={{
                  border: '1px solid rgba(56,89,168,0.14)',
                  boxShadow: '0 24px 60px -24px rgba(15,17,41,0.30)',
                }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  className="block w-full h-auto"
                  aria-label={`${industry.name} platform dashboard preview`}
                >
                  <source src="/dashboard-promo.mp4" type="video/mp4" />
                </video>
              </div>
            </CursorTilt>
          </AnimatedSection>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-bg-alt)" height={50} />

      {/* ── Problems / Solutions ── */}
      <section className="py-24 bg-bg-alt/40">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-10 lg:gap-14">
            {/* Problems */}
            <AnimatedSection>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: '#dc2626' }}
              >
                Where it breaks today
              </p>
              <h2
                className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-6"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.65rem, 2.6vw, 2.2rem)' }}
              >
                The reality of running {industry.name.toLowerCase()} ops
              </h2>
              <div className="flex flex-col gap-3">
                {industry.problems.map((p, i) => (
                  <AnimatedSection key={p.title} delay={0.1 + i * 0.07}>
                    <div
                      className="rounded-2xl bg-white p-5 flex items-start gap-3"
                      style={{
                        border: '1px solid rgba(220,38,38,0.12)',
                        boxShadow: '0 1px 2px rgba(15,17,41,0.04)',
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{ background: 'rgba(220,38,38,0.08)' }}
                      >
                        <AlertCircle size={18} color="#dc2626" strokeWidth={1.8} />
                      </div>
                      <div>
                        <h3 className="font-bold text-text text-[15px] mb-1">{p.title}</h3>
                        <p className="text-sm text-text-secondary leading-relaxed">{p.detail}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>

            {/* Solutions */}
            <AnimatedSection delay={0.1}>
              <p
                className="text-xs font-bold uppercase tracking-widest mb-3"
                style={{ color: BRAND }}
              >
                What JotilLabs does
              </p>
              <h2
                className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-6"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.65rem, 2.6vw, 2.2rem)' }}
              >
                Built for how {industry.name.toLowerCase()} actually runs
              </h2>
              <div className="flex flex-col gap-3">
                {industry.solutions.map((s, i) => (
                  <AnimatedSection key={s.title} delay={0.18 + i * 0.07}>
                    <div
                      className="rounded-2xl p-5 flex items-start gap-3"
                      style={{
                        background: 'linear-gradient(135deg, rgba(56,89,168,0.04), rgba(56,89,168,0.10))',
                        border: '1px solid rgba(56,89,168,0.18)',
                      }}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                        style={{
                          background: `linear-gradient(135deg, ${BRAND}, #2a4688)`,
                          boxShadow: '0 4px 12px rgba(56,89,168,0.30)',
                        }}
                      >
                        <Check size={18} color="#fff" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h3 className="font-bold text-text text-[15px]">{s.title}</h3>
                          {s.product && (
                            <span
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                              style={{
                                background: 'rgba(56,89,168,0.12)',
                                color: BRAND,
                                border: '1px solid rgba(56,89,168,0.20)',
                              }}
                            >
                              <Sparkles size={9} strokeWidth={2} />
                              Jotil{s.product}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary leading-relaxed">{s.detail}</p>
                      </div>
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg-alt)" to="var(--color-bg)" height={50} />

      {/* ── Live Scenarios ── */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <Badge variant="blue" className="mb-5">See it in action</Badge>
            <h2
              className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-3"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.4vw, 2.85rem)' }}
            >
              Real conversations, not slideware
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              These are the kinds of interactions your AI handles every day — across voice, SMS, and web.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {industry.scenarios.map((scenario, i) => (
              <AnimatedSection key={scenario.title} delay={i * 0.1}>
                <ScenarioCard scenario={scenario} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-bg-alt)" height={50} />

      {/* ── Outcomes / Stats ── */}
      <section className="py-24 bg-bg-alt/40">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <Badge variant="blue" className="mb-5">Measured impact</Badge>
            <h2
              className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-3"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.4vw, 2.85rem)' }}
            >
              What changes for {industry.name.toLowerCase()} teams
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Average results our {industry.name.toLowerCase()} customers report inside the first 30 days.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {industry.outcomes.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.08}>
                <div
                  className="h-full rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  style={{
                    background: 'linear-gradient(160deg, #ffffff, #f8faff)',
                    border: '1px solid rgba(56,89,168,0.10)',
                    boxShadow: '0 1px 2px rgba(15,17,41,0.03)',
                  }}
                >
                  <p className="text-4xl font-extrabold mb-2 leading-none" style={{ color: BRAND }}>
                    <CountUp end={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="text-xs text-text-secondary leading-snug">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg-alt)" to="var(--color-bg)" height={50} />

      {/* ── Customer Quote ── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection>
            <div
              className="relative rounded-[28px] p-10 md:p-14 overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(56,89,168,0.06), rgba(56,89,168,0.14))',
                border: '1px solid rgba(56,89,168,0.18)',
              }}
            >
              <Quote
                size={48}
                color={BRAND}
                strokeWidth={1.5}
                className="opacity-30 mb-6"
              />
              <p
                className="font-bold tracking-[-0.02em] text-text leading-[1.3] mb-8"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 2.4vw, 1.75rem)' }}
              >
                &ldquo;{industry.quote.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 text-white font-bold"
                  style={{ background: `linear-gradient(135deg, ${BRAND}, #2a4688)` }}
                >
                  {industry.quote.author
                    .split(' ')
                    .map((n) => n[0])
                    .filter((c) => /[A-Za-z]/.test(c))
                    .slice(0, 2)
                    .join('')}
                </div>
                <div>
                  <p className="font-bold text-text">{industry.quote.author}</p>
                  <p className="text-sm text-text-secondary">
                    {industry.quote.role} · {industry.quote.company}
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-bg-alt)" height={50} />

      {/* ── Recommended Products ── */}
      <section className="py-24 bg-bg-alt/40">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <Badge variant="blue" className="mb-5">The stack</Badge>
            <h2
              className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-3"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.4vw, 2.85rem)' }}
            >
              Products that power this setup
            </h2>
            <p className="text-text-secondary max-w-xl mx-auto">
              Each {industry.name} deployment runs on a tailored combination of these JotilLabs products.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recommendedProducts.map((product, i) => (
              <AnimatedSection key={product.slug} delay={i * 0.08}>
                <Link
                  href={`/products/${product.slug}`}
                  className="block no-underline group h-full"
                >
                  <div
                    className="rounded-2xl bg-white p-7 h-full transition-all duration-300 group-hover:-translate-y-1"
                    style={{
                      border: '1px solid rgba(15,17,41,0.06)',
                      boxShadow: '0 1px 2px rgba(15,17,41,0.04)',
                    }}
                  >
                    <div className="flex items-center gap-2 mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(56,89,168,0.10)' }}
                      >
                        <Sparkles size={18} color={BRAND} strokeWidth={1.6} />
                      </div>
                      <Badge variant="blue">{product.badge}</Badge>
                    </div>
                    <h3 className="text-xl font-bold text-text mb-2">{product.name}</h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4">
                      {product.oneLiner}
                    </p>
                    <span
                      className="inline-flex items-center gap-1 text-xs font-semibold transition-all group-hover:gap-2"
                      style={{ color: BRAND }}
                    >
                      Learn more
                      <ArrowRight size={12} strokeWidth={2.2} />
                    </span>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg-alt)" to="var(--color-bg)" height={50} />

      {/* ── FAQ ── */}
      <section className="py-24">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection className="text-center mb-12">
            <Badge variant="blue" className="mb-5">FAQ</Badge>
            <h2
              className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-3"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.4vw, 2.85rem)' }}
            >
              Common questions from {industry.name.toLowerCase()} owners
            </h2>
          </AnimatedSection>

          <div className="flex flex-col gap-3">
            {industry.faq.map((item, i) => (
              <AnimatedSection key={item.q} delay={i * 0.08}>
                <details
                  className="group rounded-2xl bg-white p-5 cursor-pointer transition-all"
                  style={{
                    border: '1px solid rgba(15,17,41,0.06)',
                    boxShadow: '0 1px 2px rgba(15,17,41,0.04)',
                  }}
                >
                  <summary className="flex items-center justify-between gap-3 list-none">
                    <h3 className="font-bold text-text text-[15px] flex-1">{item.q}</h3>
                    <ChevronRight
                      size={18}
                      color={BRAND}
                      strokeWidth={2}
                      className="shrink-0 transition-transform group-open:rotate-90"
                    />
                  </summary>
                  <p className="text-sm text-text-secondary leading-relaxed mt-3">{item.a}</p>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-bg-alt)" height={50} />

      {/* ── CTA ── */}
      <section className="py-24 bg-bg-alt/40">
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <div
              className="relative rounded-[28px] p-10 md:p-14 text-center overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(56, 89, 168,0.10), rgba(59, 130, 246,0.06), rgba(34, 211, 238,0.05))',
                border: '1px solid rgba(56, 89, 168,0.18)',
              }}
            >
              <div
                className="pointer-events-none absolute -top-16 -right-16 w-64 h-64 rounded-full"
                aria-hidden="true"
                style={{
                  background: 'radial-gradient(circle, rgba(56, 89, 168,0.18) 0%, transparent 70%)',
                  filter: 'blur(40px)',
                }}
              />

              <div className="relative">
                <div
                  className="inline-flex w-14 h-14 rounded-2xl items-center justify-center mb-5"
                  style={{
                    background: 'linear-gradient(135deg, rgba(56,89,168,0.14), rgba(56,89,168,0.22))',
                    boxShadow: '0 4px 14px rgba(56,89,168,0.15)',
                  }}
                >
                  <Icon size={26} color={BRAND} strokeWidth={1.6} />
                </div>
                <h2
                  className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-4"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.85rem, 3.2vw, 2.6rem)' }}
                >
                  See it on a {industry.name.toLowerCase()} call.
                </h2>
                <p className="text-text-secondary leading-relaxed mb-8 max-w-lg mx-auto">
                  Book a 15-minute demo. We&rsquo;ll wire your AI agent to a sample {industry.name.toLowerCase()} setup and let you put it through its paces — live.
                </p>
                <div className="flex flex-wrap gap-3 justify-center">
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 no-underline text-sm font-semibold text-white btn-gradient px-7 py-3.5 rounded-[11px] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Book a demo
                    <ArrowRight size={15} strokeWidth={2} />
                  </Link>
                  <Link
                    href="/use-cases"
                    className="inline-flex items-center no-underline text-sm font-semibold text-text px-7 py-3.5 rounded-[11px] transition-all duration-300 hover:-translate-y-0.5"
                    style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)' }}
                  >
                    All industries
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ── Other Industries ── */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <AnimatedSection className="mb-8">
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: BRAND }}
            >
              Also serving
            </p>
            <h2
              className="font-extrabold tracking-[-0.03em] leading-[1.1] text-text"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.65rem, 2.6vw, 2.2rem)' }}
            >
              Other industries we work with
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {related.map((rel, i) => {
              const RelIcon = rel.icon
              return (
                <AnimatedSection key={rel.slug} delay={i * 0.06}>
                  <Link
                    href={`/use-cases/${rel.slug}`}
                    className="group block no-underline"
                  >
                    <div
                      className="rounded-2xl bg-white p-5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md"
                      style={{
                        border: '1px solid rgba(15,17,41,0.06)',
                        boxShadow: '0 1px 2px rgba(15,17,41,0.04)',
                      }}
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: 'rgba(56,89,168,0.10)' }}
                      >
                        <RelIcon size={18} color={BRAND} strokeWidth={1.6} />
                      </div>
                      <p className="font-bold text-text text-[14px] mb-0.5">{rel.name}</p>
                      <p className="text-[11px] text-text-secondary leading-snug line-clamp-2">
                        {rel.tagline}
                      </p>
                    </div>
                  </Link>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
