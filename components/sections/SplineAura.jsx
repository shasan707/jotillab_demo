'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

/* Cursor/touch "jelly" tilt for the hero orb. Pointer-based so it works with a
   mouse, a finger, or a pen; rAF-throttled; springs back on leave; inert under
   prefers-reduced-motion. Composes with the orb's own morph animation because
   the tilt lives on a parent wrapper. */
function useJellyTilt(max = 12) {
  const ref = useRef(null)
  const frame = useRef(null)

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width
    const py = (e.clientY - rect.top) / rect.height
    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const rx = (0.5 - py) * max * 2
      const ry = (px - 0.5) * max * 2
      el.style.transition = 'transform 0.1s ease-out'
      el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    })
  }, [max])

  const reset = useCallback(() => {
    const el = ref.current
    if (!el) return
    if (frame.current) cancelAnimationFrame(frame.current)
    el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)'
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
  }, [])

  return {
    ref,
    handlers: {
      onPointerMove: onMove,
      onPointerLeave: reset,
      onPointerUp: reset,
      onPointerCancel: reset,
    },
  }
}

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

// Subtle dark directional cast — the SAME spec as .headline-shadow so the hero
// matches every other bold heading on the site (consistent shadow everywhere).
// Solid words use text-shadow; the gradient words use a drop-shadow FILTER,
// because text-shadow does not render on background-clip:text gradient text.
const HEADLINE_SHADOW_DARK = '1px 2px 0 rgba(15,17,41,0.10), 2px 3px 6px rgba(15,17,41,0.07)'
const HEADLINE_FILTER_DARK =
  'drop-shadow(1px 2px 0 rgba(15,17,41,0.10)) drop-shadow(2px 3px 5px rgba(15,17,41,0.07))'

// Deep wave-blue gradient (drawn from the hero background's deepest blue):
// rich navy -> royal -> sapphire. Used for the gradient headline words and the
// primary CTA so they tie into the background in a deep, professional way.
const HERO_GRADIENT =
  'linear-gradient(120deg, #22396E 0%, #2a4688 38%, #3859a8 68%, #3B82F6 100%)'

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

/* Right column: transparent glass orb cycling unique product icons. Owns its
   own cycle state + tilt so the 3.2s interval only re-renders THIS subtree, not
   the whole hero (headline/CTAs stay static between cycles). */
function HeroOrb() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % PRODUCTS.length), 3200)
    return () => clearInterval(id)
  }, [])

  // Drop the orb's backdrop-filter on phones — re-sampling a blurred backdrop
  // every scroll frame is a top cause of hero scroll jank on mobile. The orb
  // keeps its gradient fill, rim and shadows so it still reads as glass.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    const update = () => setIsMobile(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  const glassBlur = isMobile ? 'none' : 'blur(4px) saturate(1.4) brightness(1.03)'

  const product = PRODUCTS[index]
  const tilt = useJellyTilt(12)

  return (
    <div className="flex items-center justify-center" style={{ perspective: '900px' }}>
      <div
        ref={tilt.ref}
        {...tilt.handlers}
        className="relative mx-auto flex h-[300px] w-[300px] max-w-full items-center justify-center sm:h-[400px] sm:w-[400px] lg:h-[460px] lg:w-[460px]"
        style={{ transformStyle: 'preserve-3d', touchAction: 'pan-y' }}
      >
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
            initial={{ scale: 0.8, opacity: 0, rotate: -6 }}
            animate={{ scale: 1, opacity: 1, rotate: 0, borderRadius: BLOB_MORPH }}
            exit={{ scale: 0.8, opacity: 0, rotate: 6 }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
              borderRadius: { duration: 7, repeat: Infinity },
            }}
            className="relative flex h-[230px] w-[230px] flex-col items-center justify-center gap-2.5 px-4 text-center sm:h-[300px] sm:w-[300px] sm:gap-4 sm:px-8 lg:h-[320px] lg:w-[320px]"
            style={{
              transformStyle: 'preserve-3d',
              background: 'linear-gradient(150deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04))',
              backdropFilter: glassBlur,
              WebkitBackdropFilter: glassBlur,
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: `inset 0 2px 12px rgba(255,255,255,0.9), inset 0 -16px 36px rgba(56,89,168,0.22), inset 0 28px 54px rgba(255,255,255,0.16), 0 30px 64px -24px ${product.color}55, 0 8px 22px rgba(15,17,41,0.08)`,
            }}
          >
            {/* Hue-tinted refraction in the lower body of the droplet */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ borderRadius: 'inherit', background: `radial-gradient(120% 120% at 70% 80%, ${product.color}24, transparent 60%)` }} />
            {/* Bright glossy specular highlight (top-left) */}
            <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ borderRadius: 'inherit', background: 'radial-gradient(42% 34% at 30% 20%, rgba(255,255,255,0.92), transparent 60%)', mixBlendMode: 'screen', opacity: 0.75 }} />
            {/* Slow caustic shimmer for the water feel */}
            <motion.span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ borderRadius: 'inherit', background: 'radial-gradient(30% 26% at 72% 72%, rgba(186,230,253,0.7), transparent 60%)', mixBlendMode: 'screen' }} animate={{ opacity: [0.25, 0.6, 0.25] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} />
            {/* Fluid vibrant rim (glass edge) */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0"
              style={{
                borderRadius: 'inherit',
                padding: '2px',
                background: `linear-gradient(135deg, rgba(255,255,255,0.9), ${product.color}, ${product.c2})`,
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
                opacity: 0.9,
              }}
            />

            {/* Content floats inside the glass chamber at varying depths (3D) */}
            <div style={{ transform: 'translateZ(55px)' }}>
              <ProductIcon iconKey={product.iconKey} color={product.color} c2={product.c2} />
            </div>
            {/* Fluid size so long names (JotilReceptionist) stay inside the
                230px blob on phones; caps at the original 24px from sm up. */}
            <span
              className="max-w-full font-bold leading-tight"
              style={{ fontFamily: 'var(--font-display)', color: '#0f1129', transform: 'translateZ(38px)', fontSize: 'clamp(15px, 4.4vw, 24px)' }}
            >
              {product.name}
            </span>
            <span className="max-w-full text-[10px] font-semibold uppercase tracking-[0.14em] sm:text-[11px] sm:tracking-[0.18em]" style={{ color: product.color, transform: 'translateZ(26px)' }}>
              {product.tag}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export function SplineAura() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-white text-slate-900">
      {/* Hero scene background. This is a static capture of the original Spline
          3D "herolight" scene — visually identical, but a ~36KB cached image
          instead of a live WebGL iframe, so it costs effectively nothing to
          render or scroll on any device. */}
      <div
        aria-hidden="true"
        className="hero-bg-wave absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero-bg.jpg)' }}
      />

      {/* Soft veil behind the headline for legibility */}
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
            className="hero-display flex flex-col uppercase leading-[0.95] text-5xl sm:text-6xl lg:text-7xl"
            style={{ fontFamily: 'var(--font-russo), sans-serif', letterSpacing: '-0.01em' }}
          >
            <span className="glitch-v9" data-text="Instant" style={{ color: '#0f1129', textShadow: HEADLINE_SHADOW_DARK }}>
              Instant
            </span>
            <span className="glitch-v9" data-text="Engagement" style={{ color: '#0f1129', textShadow: HEADLINE_SHADOW_DARK }}>
              Engagement
            </span>
            <span
              style={{
                background: HERO_GRADIENT,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: HEADLINE_FILTER_DARK,
              }}
            >
              Autonomous
            </span>
            <span
              style={{
                background: HERO_GRADIENT,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                filter: HEADLINE_FILTER_DARK,
              }}
            >
              Growth
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Revolutionize how your business communicates. By combining precision AI
            with human-level conversation flow, we ensure no lead is ever left waiting,
            no question goes unanswered, and no deal falls through.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {/* Book a Demo — kept from the previous hero */}
            <Link
              href="/contact"
              className="btn-shine inline-flex items-center gap-2 rounded-[12px] px-7 py-4 text-sm font-semibold text-white no-underline shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              style={{ fontFamily: 'var(--font-display)', background: HERO_GRADIENT }}
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

        {/* Right column — transparent glass orb cycling unique product icons.
            Shown on mobile too (below the copy), scaled down to fit. Isolated
            into HeroOrb so its 3.2s cycle doesn't re-render the headline/CTAs. */}
        <HeroOrb />
      </div>
    </section>
  )
}
