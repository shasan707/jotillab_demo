import { notFound } from 'next/navigation'
import Link from 'next/link'
import * as LucideIcons from 'lucide-react'
import { Check, ArrowRight } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { IconBox } from '@/components/ui/IconBox'
import { PricingCard } from '@/components/pricing/PricingCard'
import { DemoVisualization } from '@/components/product/DemoVisualization'
import { ProductHeroDevice } from '@/components/product/ProductHeroDevice'

// Products that have a live device interface (same screens as the homepage
// showcase) — shown as the hero visual. Others use ProductHeroPreview.
const DEMO_DEVICE_SLUGS = ['receptionist', 'messenger', 'outreach', 'space', 'avatar']
import { FAQAccordion } from '@/components/product/FAQAccordion'
import { ProductHeroPreview } from '@/components/product/ProductHeroPreview'
import JotilFlowPipeline from '@/components/product/JotilFlowPipeline'
import { ProductGlyph } from '@/components/ui/ProductGlyph'
import { getBrandLogo } from '@/components/ui/BrandLogos'

/* ─── Static generation ─── */

export async function generateStaticParams() {
  const { productSlugs } = await import('@/data/products')
  return productSlugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const { getProductBySlug } = await import('@/data/products')
  const product = getProductBySlug(slug)
  return {
    title: product?.name ?? 'Product',
    description: product?.tagline ?? '',
  }
}

/* ─── Helpers ─── */

function getLucideIcon(name) {
  // PascalCase lookup
  const Icon = LucideIcons[name]
  if (Icon) return Icon
  // Try common fallback
  return LucideIcons['Sparkles']
}

/* ─── Page ─── */

export default async function ProductPage({ params }) {
  const { slug } = await params
  const { getProductBySlug } = await import('@/data/products')
  const product = getProductBySlug(slug)

  if (!product) notFound()

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: product.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      {/* ─── 1. Hero ─── */}
      <section className="hero-wave-bg relative pt-28 pb-20 px-4 overflow-hidden">
        {/* Background orbs */}
        <div
          className="absolute top-0 right-0 w-[600px] h-[500px] rounded-full opacity-40 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse, #3859a815 0%, transparent 65%)', filter: 'blur(80px)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full opacity-25 pointer-events-none"
          aria-hidden="true"
          style={{ background: 'radial-gradient(ellipse, #3B82F610 0%, transparent 70%)', filter: 'blur(60px)' }}
        />

        <div className="relative max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left column */}
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-5">
                <ProductGlyph slug={slug} size={52} />
                <Badge variant="blue">{product.badge}</Badge>
              </div>
              <h1
                className="headline-shadow text-4xl sm:text-5xl lg:text-6xl font-extrabold text-text tracking-tight leading-[1.07] mb-5"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 800 }}
              >
                <span className="text-navy">{product.displayName[0]}</span><span className="text-primary">{product.displayName[1]}</span>
              </h1>
              <p
                className="text-xl font-semibold text-text-secondary mb-4"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {product.tagline}
              </p>
              <p className="text-base text-text-secondary leading-relaxed mb-8 max-w-lg">
                {product.heroDescription}
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                <Button href="/contact" variant="primary" size="lg">
                  Book a Demo
                </Button>
                <Button
                  href={`/products/${slug}/pricing`}
                  variant="outline"
                  size="lg"
                >
                  View Pricing
                </Button>
              </div>
            </AnimatedSection>

            {/* Right column - live product interface (same device mockup as the
                homepage showcase); products without a screen use the preview. */}
            <AnimatedSection delay={0.15} className="flex justify-center lg:justify-end">
              {slug === 'flow' ? (
                <JotilFlowPipeline />
              ) : DEMO_DEVICE_SLUGS.includes(slug) ? (
                <ProductHeroDevice slug={slug} />
              ) : (
                <ProductHeroPreview slug={slug} productName={product.name} />
              )}
            </AnimatedSection>
          </div>
        </div>
      </section>


      {/* ─── 2. Services breakdown ─── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">What you get</p>
            <h2
              className="headline-shadow text-[clamp(1.9rem,3.5vw,2.75rem)] font-bold text-text tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              What&apos;s included
            </h2>
          </AnimatedSection>

          <div
            className={`grid gap-6 ${
              product.services.length === 2
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
            }`}
          >
            {product.services.map((svc, i) => (
              <AnimatedSection key={i} delay={i * 0.08}>
                <div className="card-premium h-full flex flex-col">
                  <h3
                    className="text-lg font-bold text-text mb-3"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {svc.name}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-5 flex-1">
                    {svc.description}
                  </p>
                  <ul className="space-y-2.5">
                    {svc.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-sm text-text-secondary">
                        <span className="mt-0.5 h-4 w-4 rounded-full bg-[#EEF3FE] flex items-center justify-center shrink-0">
                          <Check size={9} className="text-primary" strokeWidth={3} />
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>


      {/* ─── 3. Demo visualization (the live interface is now in the hero) ─── */}
      <DemoVisualization slug={slug} />


      {/* ─── 4. Features grid ─── */}
      <section className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Why it works</p>
            <h2
              className="headline-shadow text-[clamp(1.9rem,3.5vw,2.75rem)] font-bold text-text tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Built for results
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {product.features.map((feat, i) => {
              const Icon = getLucideIcon(feat.icon)
              return (
                <AnimatedSection key={i} delay={i * 0.06}>
                  <div className="card h-full">
                    <IconBox size="md" glow className="mb-4">
                      <Icon strokeWidth={1.5} />
                    </IconBox>
                    <h3
                      className="text-base font-semibold text-text mb-2"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {feat.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed">{feat.description}</p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </section>


      {/* ─── 5. Pricing teaser — single highlighted tier + CTA to full pricing page ─── */}
      <section id="pricing" className="bg-[#E9EEF7] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection className="text-center mb-12">
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Pricing</p>
            <h2
              className="headline-shadow text-[clamp(1.9rem,3.5vw,2.75rem)] font-bold text-text tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Simple, transparent pricing
            </h2>
            <p className="text-text-secondary mt-3 max-w-md mx-auto">
              Start free, scale when you need to. Every plan includes onboarding support.
            </p>
          </AnimatedSection>

          {product.pricing.billingModel === 'contact' ? (
            <AnimatedSection className="max-w-2xl mx-auto text-center">
              <p className="text-text-secondary mb-6 leading-relaxed">
                {product.pricing.subhead}
              </p>
              <Link
                href={product.pricing.primaryCTA.href}
                className="inline-flex items-center gap-2 btn-gradient no-underline text-white font-semibold rounded-lg px-6 py-3 hover:-translate-y-0.5 transition-transform"
              >
                {product.pricing.primaryCTA.label}
                <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </AnimatedSection>
          ) : (
            <>
              {(() => {
                // Build the same 4-tier grid as the dedicated pricing page —
                // Starter / Pro / Business / Enterprise (Enterprise synthesized
                // inline from pricing.enterprise data). Keeps the product page
                // and the dedicated /pricing page visually consistent, which
                // is the industry pattern (HubSpot / Dialpad / Zendesk / etc.).
                const coreTiers = product.pricing.tiers
                const ent = product.pricing.enterprise
                const enterpriseTier = ent
                  ? {
                      slug: 'enterprise',
                      name: 'Enterprise',
                      price: 'Custom',
                      period: '',
                      description: ent.description,
                      priceFrom: ent.priceFrom,
                      features: ent.features ?? [],
                    }
                  : null
                const gridTiers = enterpriseTier
                  ? [...coreTiers, enterpriseTier]
                  : coreTiers
                const gridColsClass =
                  gridTiers.length === 4
                    ? 'lg:grid-cols-4'
                    : 'lg:grid-cols-3'
                return (
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} auto-rows-fr gap-6 items-stretch`}
                  >
                    {gridTiers.map((tier, i) => (
                      <AnimatedSection key={tier.slug ?? i} delay={i * 0.06}>
                        <PricingCard
                          tier={tier}
                          productSlug={slug}
                          unitLabel={product.pricing.unitLabel}
                        />
                      </AnimatedSection>
                    ))}
                  </div>
                )
              })()}

              <AnimatedSection delay={0.3}>
                <div className="text-center mt-10">
                  <Link
                    href={`/products/${slug}/pricing`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary no-underline hover:gap-3 transition-all"
                  >
                    See full pricing — all tiers and compare plans
                    <ArrowRight size={16} strokeWidth={2} />
                  </Link>
                </div>
              </AnimatedSection>
            </>
          )}
        </div>
      </section>


      {/* ─── 6. FAQ (client accordion) ─── */}
      <FAQAccordion faq={product.faq} />


      {/* ─── 7. Bottom CTA ─── */}
      <section className="bg-[#E9EEF7] py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <AnimatedSection>
            <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-4">Get Started</p>
            <h2
              className="headline-shadow text-[clamp(1.9rem,3.5vw,2.75rem)] font-extrabold text-text tracking-tight mb-4"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Ready to try{' '}
              <span className="text-primary">{product.name}</span>?
            </h2>
            <p className="text-text-secondary mb-8 max-w-md mx-auto leading-relaxed">
              Join businesses already using {product.name} to handle their customer communications automatically.
            </p>
            <div className="flex items-center justify-center gap-3 flex-wrap">
              <Button href="/contact" variant="primary" size="lg">
                Book a Demo
              </Button>
              <Button href="/products" variant="outline" size="lg">
                Explore the Platform
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── 8. Integrations — interactive logo grid (before footer) ─── */}
      {product.integrations?.length > 0 && (
        <>
          <section className="cv-auto bg-white py-20 px-4">
            <div className="max-w-5xl mx-auto">
              <AnimatedSection className="text-center mb-12">
                <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">
                  Integrations
                </p>
                <h2
                  className="headline-shadow text-[clamp(1.9rem,3.5vw,2.75rem)] font-bold text-text tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  Works with the tools you already use
                </h2>
                <p className="text-text-secondary mt-3 max-w-md mx-auto">
                  {product.name} plugs into your existing stack in minutes. No ripping and replacing.
                </p>
              </AnimatedSection>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {product.integrations.map((name, i) => {
                  const Logo = getBrandLogo(name)
                  return (
                    <AnimatedSection key={name} delay={i * 0.06}>
                      <div className="group relative flex h-full flex-col items-center justify-center gap-3 rounded-2xl bg-white border border-black/5 px-4 py-7 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-[0_18px_44px_rgba(56,89,168,0.14)]">
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                          style={{ background: 'radial-gradient(120% 80% at 50% 0%, rgba(59,130,246,0.07), transparent 60%)' }}
                        />
                        <span className="relative flex h-10 w-10 items-center justify-center transition-transform duration-300 group-hover:scale-110 [&_svg]:h-9 [&_svg]:w-9">
                          {Logo ? <Logo /> : <LucideIcons.Plug className="h-7 w-7 text-primary" strokeWidth={1.5} />}
                        </span>
                        <span className="relative text-sm font-medium text-text-secondary transition-colors group-hover:text-text">
                          {name}
                        </span>
                      </div>
                    </AnimatedSection>
                  )
                })}
              </div>

              <AnimatedSection delay={0.3}>
                <p className="text-center text-sm text-text-secondary mt-8">
                  Plus any REST API, webhook, or custom integration your business needs.
                </p>
              </AnimatedSection>
            </div>
          </section>
        </>
      )}
    </>
  )
}
