/* Colorful per-product glyph — the same hand-built icons used in the homepage
   hero "swapping" orb (SplineAura). Stroked with each product's gradient
   (color -> c2) and set in a soft tinted rounded box, so every product page
   shows its distinctive logo. */

const COLORS = {
  receptionist: { color: '#3B82F6', c2: '#06b6d4' },
  messenger: { color: '#06b6d4', c2: '#3B82F6' },
  outreach: { color: '#3859a8', c2: '#06b6d4' },
  space: { color: '#22396E', c2: '#3B82F6' },
  flow: { color: '#06b6d4', c2: '#3859a8' },
  avatar: { color: '#3B82F6', c2: '#22396E' },
  jotildevs: { color: '#2a4688', c2: '#06b6d4' },
  jotilconsult: { color: '#3859a8', c2: '#3B82F6' },
  jotileducation: { color: '#06b6d4', c2: '#22396E' },
}

function Glyph({ slug, stroke }) {
  const common = { fill: 'none', stroke, strokeWidth: 2.3, strokeLinecap: 'round', strokeLinejoin: 'round' }
  switch (slug) {
    case 'messenger':
      return (
        <>
          <path {...common} d="M10 17a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5H21l-7 6v-6a5 5 0 0 1-4-5z" />
          <circle cx="18" cy="21.5" r="1.8" fill={stroke} stroke="none" />
          <circle cx="24" cy="21.5" r="1.8" fill={stroke} stroke="none" />
          <circle cx="30" cy="21.5" r="1.8" fill={stroke} stroke="none" />
        </>
      )
    case 'outreach':
      return (
        <>
          <circle cx="21" cy="27" r="11" {...common} />
          <circle cx="21" cy="27" r="4.5" {...common} />
          <path {...common} d="M29 19 39 9" />
          <path {...common} d="M32 9h7v7" />
        </>
      )
    case 'space':
      return (
        <>
          <rect x="9" y="9" width="13" height="13" rx="3.5" {...common} />
          <rect x="26" y="9" width="13" height="13" rx="3.5" {...common} />
          <rect x="9" y="26" width="13" height="13" rx="3.5" {...common} />
          <rect x="26" y="26" width="13" height="13" rx="3.5" fill={stroke} stroke="none" />
        </>
      )
    case 'flow':
      return (
        <>
          <circle cx="12" cy="14" r="4.5" {...common} />
          <circle cx="12" cy="34" r="4.5" {...common} />
          <circle cx="36" cy="24" r="4.5" {...common} />
          <path {...common} d="M16.2 15.8 31.8 22.4" />
          <path {...common} d="M16.2 32.2 31.8 25.6" />
        </>
      )
    case 'avatar':
      return (
        <>
          <circle cx="22" cy="19" r="8.5" {...common} />
          <path {...common} d="M9 40c1.6-7.4 7-11 13-11s11.4 3.6 13 11" />
          <path d="M37 8l1.6 3.6 3.6 1.6-3.6 1.6L37 19l-1.6-3.6L31.8 13.8l3.6-1.6z" fill={stroke} stroke="none" />
        </>
      )
    case 'jotildevs':
      return (
        <>
          <path {...common} d="M16 14 8 24l8 10" />
          <path {...common} d="m32 14 8 10-8 10" />
          <path {...common} d="M27 11 21 37" />
        </>
      )
    case 'jotilconsult':
      return (
        <>
          <circle cx="24" cy="24" r="14" {...common} />
          <path {...common} d="m30 18-3.4 8.6L18 30l3.4-8.6z" />
          <circle cx="24" cy="24" r="1.6" fill={stroke} stroke="none" />
        </>
      )
    case 'jotileducation':
      return (
        <>
          <path {...common} d="M24 11 7 19l17 8 17-8z" />
          <path {...common} d="M15 23.5v7.5c0 2.6 4 5 9 5s9-2.4 9-5v-7.5" />
          <path {...common} d="M41 20v8" />
        </>
      )
    case 'receptionist':
    default:
      return (
        <>
          <circle cx="24" cy="24" r="4.5" fill={stroke} stroke="none" />
          <path {...common} d="M15 17a12 12 0 0 1 0 14" />
          <path {...common} d="M33 17a12 12 0 0 0 0 14" />
          <path {...common} strokeOpacity="0.55" d="M9.5 12a20 20 0 0 1 0 24" />
          <path {...common} strokeOpacity="0.55" d="M38.5 12a20 20 0 0 0 0 24" />
        </>
      )
  }
}

export function ProductGlyph({ slug, size = 60, className = '' }) {
  const { color, c2 } = COLORS[slug] || COLORS.receptionist
  const id = `pglyph-${slug}`

  return (
    <span
      className={`inline-flex items-center justify-center rounded-[16px] ${className}`}
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${color}1f, ${c2}14)`,
        border: `1px solid ${color}33`,
        boxShadow: `0 8px 22px ${color}22`,
      }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 48 48" width={size * 0.62} height={size * 0.62} role="img">
        <defs>
          <linearGradient id={id} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor={color} />
            <stop offset="1" stopColor={c2} />
          </linearGradient>
        </defs>
        <Glyph slug={slug} stroke={`url(#${id})`} />
      </svg>
    </span>
  )
}
