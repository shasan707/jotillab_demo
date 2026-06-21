'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/* Full-screen landing hero. A Spline 3D scene fills the background; a soft
   white radial mask keeps the left column legible. The left column carries the
   glitch headline (Russo One) + CTAs; the right column cycles a TRANSPARENT
   glass orb holding a unique, custom-generated icon per product. Vibrant,
   color-theory accent pairs (analogous hues) give each product its energy.
   Right column hides below lg. */

const PRODUCTS = [
  { name: 'JotilReceptionist', tag: 'Never miss a call. Never miss a customer.', iconKey: 'receptionist', color: '#3B82F6', c2: '#06b6d4' },
  { name: 'JotilMessenger', tag: 'One inbox. Every channel. Every customer.', iconKey: 'messenger', color: '#06b6d4', c2: '#3B82F6' },
  { name: 'JotilOutreach', tag: 'Reach more. Book more. Grow faster.', iconKey: 'outreach', color: '#f97316', c2: '#ec4899' },
  { name: 'JotilSpace', tag: 'One workspace. Every AI. Every workflow.', iconKey: 'space', color: '#a855f7', c2: '#3B82F6' },
  { name: 'JotilFlow', tag: 'Connect. Trigger. Automate.', iconKey: 'flow', color: '#10b981', c2: '#06b6d4' },
  { name: 'JotilAvatar', tag: 'See your brand. Hear your brand. Talk to your brand.', iconKey: 'avatar', color: '#ec4899', c2: '#a855f7' },
]

const BLOB_MORPH = [
  '32% 68% 70% 30% / 30% 30% 70% 70%',
  '62% 38% 30% 70% / 60% 30% 70% 40%',
  '32% 68% 70% 30% / 30% 30% 70% 70%',
]

/* Unique, hand-built SVG glyphs — one per product. Stroked with a per-icon
   gradient (color -> c2). Not from any icon library. */
function ProductIcon({ iconKey, color, c2 }) {
  const id = `ico-${iconKey}`
  const stroke = `url(#${id})`
  const common = { fill: 'none', stroke, strokeWidth: 2.3, strokeLinecap: 'round', strokeLinejoin: 'round' }

  const glyph = {
    receptionist: (
      <>
        <circle cx="24" cy="24" r="4.5" fill={stroke} stroke="none" />
        <path {...common} d="M15 17a12 12 0 0 1 0 14" />
        <path {...common} d="M33 17a12 12 0 0 0 0 14" />
        <path {...common} strokeOpacity="0.55" d="M9.5 12a20 20 0 0 1 0 24" />
        <path {...common} strokeOpacity="0.55" d="M38.5 12a20 20 0 0 0 0 24" />
      </>
    ),
    messenger: (
      <>
        <path {...common} d="M10 17a5 5 0 0 1 5-5h18a5 5 0 0 1 5 5v9a5 5 0 0 1-5 5H21l-7 6v-6a5 5 0 0 1-4-5z" />
        <circle cx="18" cy="21.5" r="1.8" fill={stroke} stroke="none" />
        <circle cx="24" cy="21.5" r="1.8" fill={stroke} stroke="none" />
        <circle cx="30" cy="21.5" r="1.8" fill={stroke} stroke="none" />
      </>
    ),
    outreach: (
      <>
        <circle cx="21" cy="27" r="11" {...common} />
        <circle cx="21" cy="27" r="4.5" {...common} />
        <path {...common} d="M29 19 39 9" />
        <path {...common} d="M32 9h7v7" />
      </>
    ),
    space: (
      <>
        <rect x="9" y="9" width="13" height="13" rx="3.5" {...common} />
        <rect x="26" y="9" width="13" height="13" rx="3.5" {...common} />
        <rect x="9" y="26" width="13" height="13" rx="3.5" {...common} />
        <rect x="26" y="26" width="13" height="13" rx="3.5" fill={stroke} stroke="none" />
      </>
    ),
    flow: (
      <>
        <circle cx="12" cy="14" r="4.5" {...common} />
        <circle cx="12" cy="34" r="4.5" {...common} />
        <circle cx="36" cy="24" r="4.5" {...common} />
        <path {...common} d="M16.2 15.8 31.8 22.4" />
        <path {...common} d="M16.2 32.2 31.8 25.6" />
      </>
    ),
    avatar: (
      <>
        <circle cx="22" cy="19" r="8.5" {...common} />
        <path {...common} d="M9 40c1.6-7.4 7-11 13-11s11.4 3.6 13 11" />
        <path d="M37 8l1.6 3.6 3.6 1.6-3.6 1.6L37 19l-1.6-3.6L31.8 13.8l3.6-1.6z" fill={stroke} stroke="none" />
      </>
    ),
  }

  return (
    <svg viewBox="0 0 48 48" className="h-14 w-14" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor={color} />
          <stop offset="1" stopColor={c2} />
        </linearGradient>
      </defs>
      {glyph[iconKey]}
    </svg>
  )
}

export function SplineAura() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % PRODUCTS.length), 3200)
    return () => clearInterval(id)
  }, [])

  const product = PRODUCTS[index]

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white text-slate-900">
      {/* Spline 3D background */}
      <iframe
        src="https://my.spline.design/herolightcopy-HWuYMA6IdNGk0VGuyvrItNGB"
        title="3D background"
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 z-0 h-full w-full border-0"
        style={{ pointerEvents: 'none' }}
      />

      {/* Legibility mask */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: 'radial-gradient(60% 70% at 25% 50%, rgba(255,255,255,0.85) 35%, transparent 75%)' }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-12 px-6 pb-16 pt-28 lg:grid-cols-2">
        {/* Left column */}
        <div>
          <div
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] backdrop-blur-sm"
            style={{ borderColor: 'rgba(59,130,246,0.45)', background: 'rgba(255,255,255,0.7)', color: '#0f1129' }}
          >
            <span aria-hidden="true">▲</span> Automate. Empower. Scale.
          </div>

          <h1
            className="flex flex-col uppercase leading-[0.92] text-6xl sm:text-7xl lg:text-8xl"
            style={{ fontFamily: 'var(--font-russo), sans-serif', letterSpacing: '-0.01em' }}
          >
            <span className="glitch-v9" data-text="Never Miss a" style={{ color: '#0f1129' }}>
              Never Miss a
            </span>
            <span className="glitch-v9" data-text="Customer" style={{ color: '#0f1129' }}>
              Customer
            </span>
            <span
              style={{
                background: 'linear-gradient(90deg, #3B82F6, #7c3aed, #06b6d4)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Again.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Every call answered. Every lead followed up. Every conversation handled.
            Your AI teammate works around the clock so your team can focus on closing
            deals and growing your business.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* Book a Demo — kept from the previous hero */}
            <Link
              href="/contact"
              className="btn-gradient btn-shine inline-flex items-center gap-2 rounded-[12px] px-7 py-4 text-sm font-semibold text-white no-underline shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Book a Demo
              <ArrowRight size={15} strokeWidth={2} />
            </Link>

            <Link
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-[12px] px-7 py-4 text-sm font-semibold no-underline transition-all duration-300 hover:-translate-y-0.5"
              style={{ border: '1px solid #7c3aed', background: 'rgba(255,255,255,0.8)', color: '#0f1129', fontFamily: 'var(--font-display)' }}
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Right column — transparent glass orb cycling unique product icons */}
        <div className="hidden items-center justify-center lg:flex">
          <div className="relative mx-auto flex h-[460px] w-[460px] max-w-full items-center justify-center">
            {/* Vibrant ambient glow (tracks the active product hue) */}
            <motion.div
              key={`glow-${product.iconKey}`}
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: `radial-gradient(circle at center, ${product.color}45, transparent 62%)`, filter: 'blur(46px)' }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Transparent glass morphing orb */}
            <AnimatePresence mode="wait">
              <motion.div
                key={product.name}
                initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
                animate={{ scale: 1, opacity: 1, rotate: 0, borderRadius: BLOB_MORPH }}
                exit={{ scale: 0.7, opacity: 0, rotate: 8 }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  borderRadius: { duration: 6, repeat: Infinity },
                }}
                className="relative flex h-[320px] w-[320px] flex-col items-center justify-center gap-4 px-8 text-center"
                style={{
                  background: 'linear-gradient(150deg, rgba(255,255,255,0.62), rgba(255,255,255,0.30))',
                  backdropFilter: 'blur(16px) saturate(1.3)',
                  WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
                  boxShadow: `inset 0 1px 0 rgba(255,255,255,0.8), 0 26px 64px -24px ${product.color}99`,
                }}
              >
                {/* Morphing vibrant gradient ring border (follows the blob shape) */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    borderRadius: 'inherit',
                    padding: '2.5px',
                    background: `linear-gradient(135deg, ${product.color}, ${product.c2})`,
                    WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                    WebkitMaskComposite: 'xor',
                    maskComposite: 'exclude',
                  }}
                />

                <ProductIcon iconKey={product.iconKey} color={product.color} c2={product.c2} />
                <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)', color: '#0f1129' }}>
                  {product.name}
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: product.color }}>
                  {product.tag}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
