import Link from 'next/link'
import { ProductGlyph } from '@/components/ui/ProductGlyph'

/* Centered product-name lockup, shown on its own row above the side-by-side
   text + device block: the product's own logo, then the one-word name in two
   tones ("Jotil" navy + product part royal blue — the same pair on every
   product), over a thin rule with a blue dot centered on it. */
export function SlideBadge({ product }) {
  const { slug, badge } = product
  const NAVY = '#22396E'
  const BLUE = '#3859a8'
  // Split "JotilReceptionist" into ["Jotil", "Receptionist"] for the two tones
  // (no space is rendered between them).
  const rest = badge.replace(/^Jotil/, '')

  return (
    <div className="flex justify-center">
      <div className="slide-badge inline-flex items-center gap-3">
        <ProductGlyph slug={slug} size={34} />
        {/* The rule sits under the NAME only (exact text width on every
            product), with the dot centered on it. */}
        <span className="inline-flex flex-col items-center">
          <span
            className="text-center text-lg font-semibold uppercase tracking-[0.18em] sm:text-2xl"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            <span style={{ color: NAVY }}>Jotil</span>
            <span style={{ color: BLUE }}>{rest}</span>
          </span>
          {/* Rule tapers from thick at the center to hairline at both ends */}
          <span aria-hidden="true" className="relative mt-1.5 block h-[5px] w-full">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 6" preserveAspectRatio="none">
              <path d="M0 3 Q 50 0.4 100 3 Q 50 5.6 0 3 Z" fill={NAVY} />
            </svg>
            <span
              className="absolute left-1/2 top-1/2 h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ background: '#3B82F6', boxShadow: '0 0 0 2px #ffffff' }}
            />
          </span>
        </span>
      </div>
    </div>
  )
}

/* The copy that sits beside the device (left-aligned, like before) — title,
   description, outcome bullets, and CTA. The product-name badge lives in
   SlideBadge above the row, so it is not repeated here. */
export function SlideText({ product }) {
  const { slug, title, desc, features } = product

  return (
    <div className="slide-text max-w-[460px]">
      <h2
        className="slide-heading headline-shadow text-[clamp(1.9rem,3.5vw,2.75rem)] font-bold leading-[1.15] tracking-[-0.03em] text-text mb-4"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        {title}
      </h2>

      <p className="slide-desc text-base leading-[1.7] text-text-secondary mb-7">
        {desc}
      </p>

      <ul className="slide-features flex flex-col gap-3 mb-8">
        {features.map((f, i) => (
          <li
            key={i}
            className="slide-feature flex items-center gap-2.5 text-sm text-text-secondary"
          >
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0"
              style={{ background: 'linear-gradient(135deg, #3B82F6, #7c3aed)' }}
            />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href={`/products/${slug}`}
        className="slide-cta inline-flex items-center gap-2 px-7 py-3 rounded-[10px] text-sm font-medium text-white no-underline btn-gradient"
      >
        Learn more
      </Link>
    </div>
  )
}
