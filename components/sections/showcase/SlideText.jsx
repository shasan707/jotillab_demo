import Link from 'next/link'

export function SlideText({ product }) {
  const { slug, icon: Icon, badge, title, desc, features } = product

  return (
    <div className="slide-text max-w-[460px]">
      <div
        className="slide-badge inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide mb-5"
        style={{ background: 'rgba(56, 89, 168, 0.08)', color: '#3859a8' }}
      >
        <Icon size={14} strokeWidth={2} />
        {badge}
      </div>

      <h2
        className="slide-heading text-[clamp(1.75rem,3vw,2.625rem)] font-bold leading-[1.15] tracking-[-0.03em] text-text mb-4"
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
            <span className="w-1.5 h-1.5 rounded-full shrink-0 bg-primary" />
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
