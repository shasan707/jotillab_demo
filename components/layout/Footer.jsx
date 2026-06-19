import Link from 'next/link'
import Logo from '@/components/ui/Logo'
import { products } from '@/data/products'
import { brand, copyrightLine } from '@/lib/brand'

const PRODUCT_LINKS = products.map((p) => ({
  label: p.shortName,
  to: `/products/${p.slug}`,
}))

const COMPANY_LINKS = [
  { label: 'About', to: '/about' },
  { label: 'Industries', to: '/use-cases' },
  { label: 'Blog', to: '/blog' },
  { label: 'Consultancy', to: '/consultancy' },
  { label: 'Custom Development', to: '/custom-development' },
  { label: 'Contact', to: '/contact' },
]

const LEGAL_LINKS = [
  { label: 'Terms & Conditions', to: '/terms' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Opt-In Consent', to: '/opt-in' },
]

function FooterColumn({ title, links }) {
  return (
    <div>
      <h4 className="font-display text-sm font-semibold text-white mb-5">
        {title}
      </h4>
      <ul className="space-y-3 list-none p-0 m-0">
        {links.map(({ label, to }) => (
          <li key={label}>
            <Link
              href={to}
              className="text-sm text-slate-400 no-underline hover:text-white transition-colors duration-200"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Footer() {
  return (
    <footer className="bg-navy text-white relative">
      <div
        className="h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, #3859a8, #3B82F6, #3859a8, transparent)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="mb-3 flex items-center gap-2">
              <Logo size={32} tone="on-dark" />
              <span className="font-display text-xl font-bold tracking-[-0.5px] leading-none">
                <span className="text-white">Jotil</span>
                <span className="text-[color:var(--color-logo-muted)]">Labs</span>
              </span>
            </div>
            <p className="font-display text-[10px] font-semibold tracking-[0.25em] uppercase text-[color:var(--color-logo-muted)]/70 mb-5">
              {brand.tagline}
            </p>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs mb-8">
              The AI-first customer platform. We help businesses answer every
              call, handle every conversation, and grow without adding
              headcount.
            </p>

            <div className="space-y-2 mb-6">
              <p className="text-sm text-slate-400">
                <a
                  href={`mailto:${brand.email}`}
                  className="no-underline text-slate-400 hover:text-white transition-colors"
                >
                  {brand.email}
                </a>
              </p>
              <p className="text-sm text-slate-400">
                <a
                  href={brand.phoneHref}
                  className="no-underline text-slate-400 hover:text-white transition-colors"
                >
                  {brand.phone}
                </a>
              </p>
              <p className="text-sm text-slate-400">{brand.address.city}, {brand.address.state}</p>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={brand.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-[10px] bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 no-underline"
                aria-label="LinkedIn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a
                href={brand.social.x}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-[10px] bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 no-underline"
                aria-label="X (Twitter)"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href={brand.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 rounded-[10px] bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 no-underline"
                aria-label="YouTube"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
                  <path d="m10 15 5-3-5-3z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="lg:col-span-2 lg:col-start-6">
            <FooterColumn title="Solutions" links={PRODUCT_LINKS} />
          </div>
          <div className="lg:col-span-2">
            <FooterColumn title="Company" links={COMPANY_LINKS} />
          </div>
          <div className="lg:col-span-2">
            <FooterColumn title="Legal" links={LEGAL_LINKS} />
          </div>
        </div>

        {/* Giant brand text watermark -- sits behind copyright bar */}
        <div className="relative mt-10">
          <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
            <p
              className="text-[clamp(3.5rem,15vw,16rem)] font-black leading-none tracking-[-0.02em] text-center"
              style={{
                fontFamily: 'var(--font-display)',
                background: 'linear-gradient(0deg, rgba(255,255,255,0.10) 0%, transparent 80%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              JotilLabs
            </p>
          </div>

          <div className="relative z-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {copyrightLine()}
          </p>
          <p className="text-xs text-slate-500">
            Built with AI-first principles.
          </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
