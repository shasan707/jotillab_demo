import Link from 'next/link'
import { ArrowRight, Sparkles } from 'lucide-react'

export function EssentialsCard({ product, essentials }) {
  const contactHref = `/contact?product=${product.slug}&tier=essentials`

  return (
    <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-border bg-white px-6 py-5 shadow-sm">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles size={14} className="text-primary" strokeWidth={1.5} />
          <span className="text-[11px] font-semibold uppercase tracking-widest text-primary font-display">
            {essentials.name} - just getting started?
          </span>
        </div>
        <p className="text-sm text-text-secondary leading-relaxed">
          {essentials.description}.{' '}
          <span className="font-semibold text-text">
            {essentials.price}
            {essentials.period}
          </span>
          {essentials.includedUnits
            ? ` for ${essentials.includedUnits.toLocaleString()} ${product.pricing.unitLabel}s/mo.`
            : '.'}
        </p>
      </div>
      <Link
        href={contactHref}
        className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2 text-sm font-semibold text-primary no-underline hover:bg-primary/10 transition-colors"
      >
        Get started
        <ArrowRight size={14} strokeWidth={2} />
      </Link>
    </div>
  )
}
