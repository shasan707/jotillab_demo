import { Check, Minus } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Badge } from '@/components/ui/Badge'
import { AtmosphericDivider, TiltCard } from '@/components/design'
import { Button } from '@/components/ui/Button'
import { ProductGlyph } from '@/components/ui/ProductGlyph'
import { products } from '@/data/products'

export const metadata = {
  title: 'Our AI Products',
  description:
    'AI-powered tools to automate every customer touchpoint. Voice, chat, SMS, outbound campaigns, CRM, workflow automation, and AI avatars.',
}

/* ── Comparison table data ── */
const TABLE_FEATURES = [
  { label: 'Voice calls', key: 'voice' },
  { label: 'Web chat', key: 'chat' },
  { label: 'SMS', key: 'sms' },
  { label: 'CRM', key: 'crm' },
  { label: 'Automation', key: 'automation' },
  { label: 'Scheduling', key: 'scheduling' },
]

/* Comparison table covers the 6 core solutions. The 3 engagement-based
   solutions (Devs, Consult, Education) are scoped per project, so a
   feature checklist does not apply to them. */
const SERVICE_SLUGS = ['jotildevs', 'jotilconsult', 'jotileducation']
const CORE = products.filter((p) => !SERVICE_SLUGS.includes(p.slug))

const PRODUCT_FEATURES = {
  receptionist: { voice: true, chat: true, sms: false, crm: false, automation: false, scheduling: true },
  messenger: { voice: false, chat: true, sms: true, crm: false, automation: true, scheduling: false },
  outreach: { voice: true, chat: false, sms: true, crm: false, automation: true, scheduling: false },
  space: { voice: false, chat: true, sms: false, crm: true, automation: true, scheduling: true },
  flow: { voice: false, chat: false, sms: false, crm: false, automation: true, scheduling: false },
  avatar: { voice: true, chat: true, sms: false, crm: false, automation: false, scheduling: false },
}

/* ── Starting price helper ── */
function startingPrice(product) {
  const tiers = product.pricing?.tiers ?? []
  const first = tiers[0]
  if (!first) return null
  if (first.price === 'Custom') return 'Custom pricing'
  return `From ${first.price}${first.period}`
}

export default function ProductsPage() {
  return (
    <>
      {/* ─── Hero ─── */}
      <section className="hero-wave-bg relative pt-28 pb-16 px-4 overflow-hidden">
        {/* Subtle orb */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-30 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse, #3859a820 0%, transparent 70%)', filter: 'blur(60px)' }}
        />

        <div className="relative max-w-4xl mx-auto text-center">
          <AnimatedSection>
            <Badge variant="blue" className="mb-5">Our Solutions</Badge>
            <h1
              className="headline-shadow text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text tracking-tight leading-[1.08]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Everything your business needs.{' '}
              <span className="text-gradient">One platform.</span>
            </h1>
            <p className="mt-5 text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
              From answering your first call to automating your entire customer workflow, every capability is built to work together and independently.
            </p>
          </AnimatedSection>

          {/* Logo row */}
          <AnimatedSection delay={0.15} className="mt-10 flex items-center justify-center gap-5 flex-wrap">
            {/* Detail pages intentionally unlinked for now. */}
            {products.map((p) => (
              <div
                key={p.slug}
                className="flex flex-col items-center gap-2 group"
                aria-label={p.name}
              >
                <ProductGlyph
                  slug={p.slug}
                  size={56}
                  className="shadow-sm transition-all duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md"
                />
                <span className="text-[10px] font-semibold text-text-secondary uppercase tracking-wider group-hover:text-primary transition-colors duration-150">
                  {p.displayName[1]}
                </span>
              </div>
            ))}
          </AnimatedSection>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-primary-50)" to="var(--color-bg)" height={50} />

      {/* ─── Products grid ─── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">What we offer</p>
            <h2
              className="headline-shadow text-3xl font-bold text-text tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Explore our solutions
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {products.map((product, i) => {
              const price = startingPrice(product)

              return (
                <AnimatedSection key={product.slug} delay={i * 0.07}>
                  <TiltCard maxTilt={4} className="card-premium h-full flex flex-col group rounded-[20px]">
                    {/* Card header */}
                    <div className="flex items-start gap-4 mb-5">
                      <ProductGlyph
                        slug={product.slug}
                        size={64}
                        className="shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                          <h3
                            className="text-xl font-bold text-text"
                            style={{ fontFamily: 'var(--font-display)' }}
                          >
                            {product.name}
                          </h3>
                          <Badge variant="blue">{product.badge}</Badge>
                        </div>
                        <p className="text-sm text-text-secondary leading-snug">{product.tagline}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-text-secondary leading-relaxed mb-5">
                      {product.description}
                    </p>

                    {/* Service bullets */}
                    <ul className="space-y-2 mb-6 flex-1">
                      {product.services.slice(0, 3).map((svc, si) => (
                        <li key={si} className="flex items-start gap-2.5 text-sm text-text-secondary">
                          <span className="mt-0.5 h-4 w-4 rounded-full bg-[#EEF3FE] flex items-center justify-center shrink-0">
                            <Check size={9} className="text-primary" strokeWidth={3} />
                          </span>
                          {svc.name}
                        </li>
                      ))}
                    </ul>

                    {/* Footer row */}
                    <div className="flex items-center justify-between pt-4 border-t border-black/5">
                      {price && (
                        <span
                          className="text-xs font-semibold text-text-secondary tabular-nums"
                          style={{ fontFamily: 'var(--font-jetbrains)' }}
                        >
                          {price}
                        </span>
                      )}
                      {/* Detail-page link intentionally removed for now. */}
                    </div>
                  </TiltCard>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-bg-alt)" height={40} />

      {/* ─── Comparison table ─── */}
      <section className="py-20 px-4 bg-[#E9EEF7] overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Compare</p>
            <h2
              className="headline-shadow text-3xl font-bold text-text tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Which solution fits your business?
            </h2>
            <p className="text-text-secondary mt-3 max-w-lg mx-auto">
              Each capability is designed for a specific use case. Here is how they compare.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={0.1} className="overflow-x-auto rounded-2xl border border-black/5 bg-white shadow-sm">
            <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-black/5 bg-[#F8FAFF]">
                      <th scope="col" className="text-left px-6 py-4 text-xs font-semibold text-text-secondary uppercase tracking-wider w-40">
                        Feature
                      </th>
                      {CORE.map((p) => {
                        return (
                          <th key={p.slug} scope="col" className="px-4 py-4 text-center">
                            <div className="flex flex-col items-center gap-1.5">
                              <ProductGlyph slug={p.slug} size={40} />
                              <span
                                className="text-xs font-semibold text-text whitespace-nowrap"
                                style={{ fontFamily: 'var(--font-display)' }}
                              >
                                {p.displayName[1]}
                              </span>
                            </div>
                          </th>
                        )
                      })}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/4">
                    {TABLE_FEATURES.map((feature, ri) => (
                      <tr key={feature.key} className={ri % 2 === 0 ? '' : 'bg-[#FAFBFD]'}>
                        <th scope="row" className="px-6 py-4 text-sm font-medium text-text text-left">{feature.label}</th>
                        {CORE.map((p) => {
                          const has = PRODUCT_FEATURES[p.slug]?.[feature.key]
                          return (
                            <td key={p.slug} className="px-4 py-4 text-center">
                              {has ? (
                                <>
                                  <Check size={16} className="text-primary mx-auto" strokeWidth={2.5} aria-hidden="true" />
                                  <span className="sr-only">Yes</span>
                                </>
                              ) : (
                                <>
                                  <Minus size={16} className="text-text-muted mx-auto" strokeWidth={1.5} aria-hidden="true" />
                                  <span className="sr-only">No</span>
                                </>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
          </AnimatedSection>

          <AnimatedSection delay={0.15}>
            <p className="text-sm text-text-secondary text-center mt-5">
              JotilDevs, JotilConsult and JotilEducation are scoped per engagement. Talk to us for a tailored plan.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg-alt)" to="var(--color-bg)" height={40} />

      {/* ─── Bottom CTA ─── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <h2
              className="headline-shadow text-3xl font-bold text-text tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Not sure which product fits?
            </h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              Our team will help you find the right combination for your business, or build a custom solution.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button href="/contact" variant="primary" size="lg">
                Talk to our AI &rarr;
              </Button>
              <Button href="/about" variant="outline" size="lg">
                About JotilLabs
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
