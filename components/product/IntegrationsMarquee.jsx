'use client'

import { getBrandLogo } from '@/components/ui/BrandLogos'

/* Per-product integration tools shown as a two-row moving marquee (same look
   and motion as the homepage IntegrationStrip), but driven by each product's
   own `integrations` list. Rows scroll in opposite directions. */

function Pill({ label }) {
  const Logo = getBrandLogo(label)
  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-full shrink-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        background: '#ffffff',
        border: '1px solid rgba(15,17,41,0.06)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {Logo && (
        <span className="shrink-0 flex items-center justify-center">
          <Logo />
        </span>
      )}
      <span
        className="text-[13px] font-medium text-text whitespace-nowrap"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {label}
      </span>
    </div>
  )
}

// Products list only 4-6 tools; repeat them so the row is wide enough to loop
// seamlessly. The rendered track is this padded set doubled (translateX -50%).
function pad(items, min = 8) {
  if (!items.length) return items
  const out = [...items]
  let i = 0
  while (out.length < min) out.push(items[i++ % items.length])
  return out
}

function Row({ items, reverse = false, speed = 25 }) {
  const base = pad(items)
  const duration = base.length * speed

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10" style={{ background: 'linear-gradient(to right, #ffffff, transparent)' }} />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10" style={{ background: 'linear-gradient(to left, #ffffff, transparent)' }} />

      <div
        className="flex gap-3 w-max"
        style={{ animation: `${reverse ? 'pim-reverse' : 'pim'} ${duration}s linear infinite` }}
      >
        {[...base, ...base].map((label, i) => (
          <Pill key={`${label}-${i}`} label={label} />
        ))}
      </div>

      <style jsx>{`
        @keyframes pim {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes pim-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

export function IntegrationsMarquee({ items = [] }) {
  if (!items.length) return null
  return (
    <div className="space-y-3">
      <Row items={items} speed={25} />
      <Row items={items} reverse speed={30} />
    </div>
  )
}
