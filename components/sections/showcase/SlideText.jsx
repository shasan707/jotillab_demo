import Link from 'next/link'

/* Centered product-name pill, shown on its own row above the side-by-side
   text + device block. */
export function SlideBadge({ product }) {
  const { icon: Icon, badge } = product

  return (
    <div className="flex justify-center">
      <div
        className="slide-badge inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-lg sm:text-xl font-bold tracking-wide"
        style={{ background: 'rgba(124, 58, 237, 0.09)', color: '#7c3aed' }}
      >
        <Icon size={22} strokeWidth={2} />
        {badge}
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
