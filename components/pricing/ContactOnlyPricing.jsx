import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'

export function ContactOnlyPricing({ product }) {
  const { pricing } = product

  return (
    <div className="max-w-3xl mx-auto">
      <div className="rounded-2xl border border-border bg-white p-8 sm:p-10 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-bold text-text mb-3 font-display tracking-tight">
          {pricing.headline}
        </h2>
        <p className="text-text-secondary mb-8 leading-relaxed">{pricing.subhead}</p>

        <Link
          href={pricing.primaryCTA.href}
          className="inline-flex items-center gap-2 btn-gradient no-underline text-white font-semibold rounded-lg px-6 py-3 mb-10 hover:-translate-y-0.5 transition-transform"
        >
          {pricing.primaryCTA.label}
          <ArrowRight size={16} strokeWidth={2} />
        </Link>

        {pricing.engagementTypes?.length > 0 && (
          <div className="mb-10">
            <h3 className="text-sm font-semibold uppercase tracking-widest text-text-secondary mb-4 font-display">
              Typical engagements
            </h3>
            <ul className="space-y-3">
              {pricing.engagementTypes.map((e, i) => (
                <li
                  key={i}
                  className="flex items-start justify-between gap-4 pb-3 border-b border-border/50 last:border-0"
                >
                  <div>
                    <p className="text-sm font-semibold text-text">{e.name}</p>
                    <p className="text-sm text-text-secondary leading-relaxed mt-0.5">
                      {e.description}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-primary whitespace-nowrap mt-0.5">
                    {e.priceNote}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {pricing.whatsIncluded?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-widest text-text-secondary mb-4 font-display">
              Every engagement includes
            </h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              {pricing.whatsIncluded.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-text-secondary">
                  <Check size={14} strokeWidth={2} className="text-primary mt-0.5 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
