'use client'

import { motion } from 'framer-motion'

const LOGOS = [
  'Meridian Health',
  'Apex Realty',
  'Coastal Law',
  'Vantage Auto',
  'Summit Finance',
  'Nova Logistics',
]

// Duplicate for seamless infinite loop
const TRACK = [...LOGOS, ...LOGOS]

export function LogoCloud() {
  return (
    <section className="py-12 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="text-center text-[11px] font-semibold tracking-[0.14em] uppercase mb-8"
          style={{
            color: 'var(--color-text-secondary)',
            fontFamily: 'var(--font-display)',
          }}
        >
          Trusted by forward-thinking businesses
        </motion.p>
      </div>

      {/* Fade masks */}
      <div className="relative">
        <div
          className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-24"
          style={{ background: 'linear-gradient(to right, var(--color-bg), transparent)' }}
        />
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-24"
          style={{ background: 'linear-gradient(to left, var(--color-bg), transparent)' }}
        />

        {/* Marquee track */}
        <div
          className="flex gap-12"
          style={{
            animation: 'marquee 28s linear infinite',
            width: 'max-content',
          }}
        >
          {TRACK.map((name, i) => (
            <LogoItem key={`${name}-${i}`} name={name} />
          ))}
        </div>
      </div>

      {/* Inline keyframe — avoids globals pollution */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  )
}

function LogoItem({ name }) {
  // Split into abbrev + rest for subtle two-tone rendering
  const [first, ...rest] = name.split(' ')

  return (
    <div
      className="flex items-center gap-2 select-none whitespace-nowrap"
      style={{ minWidth: 160 }}
    >
      {/* Square monogram */}
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
        style={{
          background: 'rgba(56, 89, 168,0.06)',
          border: '1px solid rgba(56, 89, 168,0.10)',
        }}
      >
        <span
          className="text-[10px] font-bold"
          style={{
            color: 'var(--color-primary)',
            fontFamily: 'var(--font-display)',
            letterSpacing: '0.03em',
          }}
        >
          {first[0]}{rest[0]?.[0] ?? ''}
        </span>
      </div>

      {/* Name */}
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          color: 'rgba(17,17,17,0.55)',
        }}
      >
        {name}
      </span>
    </div>
  )
}
