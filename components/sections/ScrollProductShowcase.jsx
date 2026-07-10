'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, useReducedMotion } from 'framer-motion'
import { PRODUCT_SLIDES, PRODUCT_STEPS } from './showcase/data'
import { SlideBadge, SlideText } from './showcase/SlideText'
import { SlideDevice } from './showcase/SlideDevice'
import { DeviceCaption } from './showcase/DeviceCaption'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

/* Product showcase: each product is a normal in-flow row (text + device side by
   side, alternating sides on desktop; stacked on mobile). The device lives in
   natural flow — it is only WIDTH-constrained by its column, never pinned to the
   viewport height — so it can never be clipped top/bottom on any screen size.
   Each row animates its device only while in view, and a DeviceCaption narrates
   the live step. */

function SectionHeading() {
  return (
    <AnimatedSection className="text-center pt-24 pb-12 px-6">
      <p className="text-sm font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: '#7c3aed' }}>
        What Changes for Your Business
      </p>
      <h2
        className="headline-shadow text-[clamp(1.9rem,3.5vw,2.75rem)] font-bold tracking-[-0.03em] text-text max-w-2xl mx-auto"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        One AI Platform for Every Customer{' '}
        <span className="text-gradient">Conversation.</span>
      </h2>
    </AnimatedSection>
  )
}

/* Cursor + touch tilt for the device mockups. Pointer events cover mouse, pen
   and finger; rAF-throttled; springs back on leave; inert under reduced motion.
   touch-action: pan-y keeps vertical page scrolling working on phones. */
function DeviceTilt({ children, max = 7 }) {
  const ref = useRef(null)
  const frame = useRef(null)
  const reduced = useReducedMotion()

  const onMove = (e) => {
    const el = ref.current
    if (!el || reduced) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      const rx = (0.5 - py) * max * 2
      const ry = (px - 0.5) * max * 2
      el.style.transition = 'transform 0.1s ease-out'
      el.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    })
  }
  const reset = () => {
    const el = ref.current
    if (!el) return
    if (frame.current) cancelAnimationFrame(frame.current)
    el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
    el.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)'
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerUp={reset}
      onPointerCancel={reset}
      style={{ transformStyle: 'preserve-3d', touchAction: 'pan-y', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}

function ShowcaseRow({ product, flip, bg }) {
  const [step, setStep] = useState(0)
  const ref = useRef(null)
  const reduced = useReducedMotion()
  // Drive the in-device demo only while the row is on screen.
  const inView = useInView(ref, { margin: '-20% 0px -20% 0px' })

  // Horizontal slide-in only on desktop (≥lg). On phones a 64px sideways
  // travel pushes the device past its column edge before it settles, so the
  // mockup appears to cross its boundary — there we reveal with fade + rise
  // only (no x), which keeps every device fully inside its bounds.
  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  const dx = isDesktop ? 64 : 0

  // whileInView reveal (IntersectionObserver-based, so it works with the site's
  // Lenis smooth scroll). The centered header rises in; the device and feature
  // columns slide in from opposite sides on desktop (fade + rise only on mobile
  // so nothing crosses its bounds). Re-triggers each time the row re-enters.
  const spring = { type: 'spring', stiffness: 95, damping: 18 }
  const viewport = { amount: 0.3, margin: '-8% 0px -8% 0px' }
  const badgeMotion = reduced ? {} : {
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport,
    transition: spring,
  }
  const textMotion = reduced ? {} : {
    initial: { opacity: 0, x: flip ? dx : -dx, y: 20 },
    whileInView: { opacity: 1, x: 0, y: 0 },
    viewport,
    transition: { ...spring, delay: 0.06 },
  }
  const deviceMotion = reduced ? {} : {
    initial: { opacity: 0, x: flip ? -dx : dx, y: 24, scale: 0.96 },
    whileInView: { opacity: 1, x: 0, y: 0, scale: 1 },
    viewport,
    transition: { ...spring, delay: 0.1 },
  }

  // Each product is a full-width band with an alternating background (white /
  // cool tint) — so the products read as clearly separated sections via the
  // background, with no card/box around them. Badge centered on top, copy beside
  // the device below.
  return (
    <div className="w-full" style={{ backgroundColor: bg }}>
      <div
        ref={ref}
        className="cv-auto mx-auto flex max-w-[1300px] flex-col gap-7 px-6 py-16 lg:gap-9 lg:py-20"
      >
        <motion.div {...badgeMotion}>
          <SlideBadge product={product} />
        </motion.div>

        <div
          className={`grid grid-cols-1 items-center gap-10 lg:gap-12 ${flip ? 'lg:grid-cols-[1.18fr_0.82fr]' : 'lg:grid-cols-[0.82fr_1.18fr]'}`}
        >
          {/* Copy */}
          <motion.div className={flip ? 'lg:order-2' : 'lg:order-1'} {...textMotion}>
            <SlideText product={product} />
          </motion.div>

          {/* Device + live caption */}
          <motion.div
            className={`flex min-w-0 flex-col items-center gap-5 ${flip ? 'lg:order-1' : 'lg:order-2'}`}
            {...deviceMotion}
          >
            <DeviceTilt>
              <SlideDevice slug={product.slug} deviceType={product.deviceType} isActive={inView} onStep={setStep} />
            </DeviceTilt>
            <DeviceCaption steps={PRODUCT_STEPS[product.slug]} activeIndex={step} />
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export function ScrollProductShowcase() {
  // Alternating full-width background bands differentiate each product section.
  const ALT = '#E9EEF7'
  return (
    <section className="overflow-x-clip">
      <div style={{ backgroundColor: ALT }}>
        <SectionHeading />
      </div>

      <div className="flex flex-col">
        {PRODUCT_SLIDES.map((product, i) => (
          <ShowcaseRow
            key={product.slug}
            product={product}
            flip={i % 2 === 1}
            bg={i % 2 === 0 ? '#ffffff' : ALT}
          />
        ))}
      </div>

    </section>
  )
}
