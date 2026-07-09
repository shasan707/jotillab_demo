import Link from 'next/link'

/* Centered product-name lockup, shown on its own row above the side-by-side
   text + device block: spaced uppercase navy name over a thin rule with a
   blue dot centered on it. */
export function SlideBadge({ product }) {
  const { badge } = product
  const NAVY = '#22396E'
  // "JotilReceptionist" -> "Jotil Receptionist" so the uppercase reads cleanly
  const spaced = badge.replace(/([a-z])([A-Z])/g, '$1 $2')

  return (
    <div className="flex justify-center">
      <div className="slide-badge inline-flex flex-col items-center">
        <span
          className="text-center text-lg font-semibold uppercase tracking-[0.22em] sm:text-2xl"
          style={{ color: NAVY, fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          {spaced}
        </span>
        <span aria-hidden="true" className="relative mt-2 block h-[2px] w-full" style={{ background: NAVY }}>
          <span
            className="absolute left-1/2 top-1/2 h-[7px] w-[7px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: '#3B82F6', boxShadow: '0 0 0 3px #ffffff' }}
          />
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
