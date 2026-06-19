import { Check, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

/**
 * Tier card used in the per-product pricing grid.
 *
 * Props:
 *   tier        — standard tier object from data/products.js OR a synthesized
 *                 enterprise tier object ({ slug: 'enterprise', name: 'Enterprise',
 *                 price: 'Custom', features: [...], priceFrom?: string })
 *   productSlug — product slug for building contact URL
 *   unitLabel   — label for quota line (e.g. 'conversation', 'minute', 'credit')
 */
export function PricingCard({ tier, productSlug, unitLabel }) {
  const isHighlighted = tier.highlighted
  const isEnterprise = tier.slug === 'enterprise'
  const tierSlug = tier.slug || tier.name?.toLowerCase()
  const href = productSlug
    ? `/contact?product=${productSlug}&tier=${tierSlug}`
    : '/contact'

  // Derive a single-line quota summary from existing tier data.
  // For quota-based products: "500 conversations included".
  // For per-user: "per user".
  // For enterprise: "Custom quota" or the priceFrom as microcopy.
  const quotaLine = buildQuotaLine(tier, unitLabel, isEnterprise)

  return (
    <div className="relative flex flex-col h-full">
      {isHighlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
          <span className="inline-block rounded-full bg-navy px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white font-display whitespace-nowrap">
            Most Popular
          </span>
        </div>
      )}

      <div
        className={`flex flex-col h-full rounded-2xl border p-8 transition-all ${
          isHighlighted
            ? 'border-primary/25 bg-primary-50 shadow-[0_12px_32px_rgba(15,17,41,0.08)]'
            : 'border-primary-100 bg-white shadow-[0_1px_3px_rgba(15,17,41,0.05)]'
        }`}
      >
        {/* Name — fixed row height so tier labels align across all cards */}
        <p
          className="text-xl font-bold text-primary mb-2 min-h-[2rem] flex items-center"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {tier.name}
        </p>

        {/* Description — min-h locks height so all following rows align
            even when one tier has a longer description that wraps to 2 lines. */}
        <p className="text-sm text-text-secondary leading-relaxed mb-6 min-h-[3.5rem]">
          {tier.description ?? ''}
        </p>

        {/* Price — fixed row so the big numbers land on the same baseline
            across every card regardless of description length. */}
        <div className="mb-6 flex items-baseline gap-1 h-[3.5rem]">
          <span
            className={`text-5xl font-extrabold tracking-tight leading-none ${
              isEnterprise ? 'text-text' : 'text-primary'
            }`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {tier.price}
          </span>
          {tier.period && !isEnterprise && (
            <span className="text-sm text-text-secondary">{tier.period}</span>
          )}
        </div>

        {/* Quota line — min-h reserves the row even when a tier has no
            quota data, so the divider + features list start at the same Y
            on every card. */}
        <div className="min-h-[2.5rem] mb-4 pb-4 border-b border-black/5 flex items-start">
          {quotaLine ? (
            <p className="text-sm text-text font-semibold leading-snug">{quotaLine}</p>
          ) : null}
        </div>

        {/* Features — flex-1 pushes the CTA to the bottom. */}
        <ul className="space-y-2.5 mb-8 flex-1">
          {tier.features?.map((f, fi) => {
            const isInheritance = f.toLowerCase().startsWith('everything in')
            return (
              <li
                key={fi}
                className={`flex items-start gap-2 text-sm ${
                  isInheritance
                    ? 'text-text font-semibold pb-2 mb-1 border-b border-black/5'
                    : 'text-text-secondary'
                }`}
              >
                {!isInheritance && (
                  <Check
                    size={16}
                    strokeWidth={2.5}
                    className="text-emerald-600 mt-0.5 shrink-0"
                    aria-hidden="true"
                  />
                )}
                <span>{f}</span>
              </li>
            )
          })}
        </ul>

        {/* CTA */}
        {isEnterprise ? (
          <Link
            href={href}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-black/10 bg-white px-5 py-3 text-sm font-semibold text-text no-underline hover:border-primary/40 hover:text-primary transition-colors"
          >
            <Mail size={14} strokeWidth={2} />
            Contact Sales
          </Link>
        ) : (
          <Button
            href={href}
            variant={isHighlighted ? 'primary' : 'outline'}
            size="md"
            className="w-full justify-center"
          >
            {isHighlighted ? 'Start 14-day trial' : 'Get started'}
          </Button>
        )}
      </div>
    </div>
  )
}

/**
 * Derive a single-line quota summary from existing tier fields.
 * Returns null when no useful quota can be expressed.
 */
function buildQuotaLine(tier, unitLabel, isEnterprise) {
  if (isEnterprise) {
    return tier.priceFrom ? `From ${tier.priceFrom}/mo` : 'Custom quota'
  }
  if (tier.includedUnits && unitLabel) {
    const label = tier.includedUnits === 1 ? unitLabel : `${unitLabel}s`
    return `${tier.includedUnits.toLocaleString()} ${label} included`
  }
  if (tier.unitLabel === 'user' || unitLabel === 'user') {
    return 'per user, per month'
  }
  return null
}
