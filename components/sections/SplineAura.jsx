'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight, Phone, MessageSquare, Megaphone, LayoutGrid, Workflow, Sparkles,
} from 'lucide-react'

/* Full-screen landing hero. A Spline 3D scene fills the background; a soft
   white radial mask keeps the left column legible. The left column carries the
   glitch headline (Russo One) + CTAs; the right column cycles a morphing
   gradient "product blob" every 3.2s. Right column hides below lg. */

const PRODUCTS = [
  { name: 'JotilReceptionist', tag: 'Never miss a call. Never miss a customer.', icon: Phone, color: '#3859a8', glow: '#0f1129' },
  { name: 'JotilMessenger', tag: 'One inbox. Every channel. Every customer.', icon: MessageSquare, color: '#06b6d4', glow: '#0f1129' },
  { name: 'JotilOutreach', tag: 'Reach more. Book more. Grow faster.', icon: Megaphone, color: '#f97316', glow: '#0f1129' },
  { name: 'JotilSpace', tag: 'One workspace. Every AI. Every workflow.', icon: LayoutGrid, color: '#a855f7', glow: '#0f1129' },
  { name: 'JotilFlow', tag: 'Connect. Trigger. Automate.', icon: Workflow, color: '#10b981', glow: '#0f1129' },
  { name: 'JotilAvatar', tag: 'See your brand. Hear your brand. Talk to your brand.', icon: Sparkles, color: '#ec4899', glow: '#0f1129' },
]

const BLOB_MORPH = [
  '32% 68% 70% 30% / 30% 30% 70% 70%',
  '62% 38% 30% 70% / 60% 30% 70% 40%',
  '32% 68% 70% 30% / 30% 30% 70% 70%',
]

export function SplineAura() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % PRODUCTS.length), 3200)
    return () => clearInterval(id)
  }, [])

  const product = PRODUCTS[index]
  const Icon = product.icon

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
            style={{ borderColor: 'rgba(56,89,168,0.4)', background: 'rgba(255,255,255,0.7)', color: '#0f1129' }}
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
                background: 'linear-gradient(90deg, #3859a8, #1e3a8a, #0f1129)',
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
              style={{ border: '1px solid #3859a8', background: 'rgba(255,255,255,0.8)', color: '#0f1129', fontFamily: 'var(--font-display)' }}
            >
              See How It Works
            </Link>
          </div>
        </div>

        {/* Right column — cycling product blob */}
        <div className="hidden items-center justify-center lg:flex">
          <div className="relative mx-auto flex h-[460px] w-[460px] max-w-full items-center justify-center">
            {/* Ambient pulsing glow */}
            <motion.div
              aria-hidden="true"
              className="absolute inset-0"
              style={{ background: `radial-gradient(circle at center, ${product.glow}55, transparent 65%)`, filter: 'blur(40px)' }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.9, 0.6] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Morphing gradient blob */}
            <AnimatePresence mode="wait">
              <motion.div
                key={product.name}
                initial={{ scale: 0.7, opacity: 0, rotate: -8 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: 0,
                  borderRadius: BLOB_MORPH,
                }}
                exit={{ scale: 0.7, opacity: 0, rotate: 8 }}
                transition={{
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                  borderRadius: { duration: 6, repeat: Infinity },
                }}
                className="relative flex h-[320px] w-[320px] flex-col items-center justify-center gap-4 px-8 text-center text-white"
                style={{
                  background: `linear-gradient(135deg, ${product.color}, ${product.glow})`,
                  boxShadow: '0 30px 80px -20px rgba(15,17,41,0.45)',
                }}
              >
                <Icon className="h-14 w-14" strokeWidth={1.5} />
                <span className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  {product.name}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] opacity-90">
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
