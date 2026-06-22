'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { PRODUCT_SLIDES } from './showcase/data'
import { SlideText } from './showcase/SlideText'
import { SlideDevice } from './showcase/SlideDevice'
import { FlowCard } from './showcase/FlowCard'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

/* Retell-style sticky "scrollytelling": the feature steps scroll on the left
   while the device pins on the right and swaps to the active product as you
   scroll. Falls back to a simple stacked layout on small screens and under
   prefers-reduced-motion. */

const DEVICE_ZOOM = { phone: 0.86, browser: 0.6 }
const DEVICE_ZOOM_MOBILE = { phone: 0.82, browser: 0.42 }

function SectionHeading() {
  return (
    <AnimatedSection className="text-center pt-24 pb-10 px-6">
      <p className="text-sm font-semibold tracking-[0.18em] uppercase mb-3" style={{ color: '#7c3aed' }}>
        What Changes for Your Business
      </p>
      <h2
        className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.03em] text-text max-w-2xl mx-auto"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        One platform.{' '}
        <span className="text-gradient">Every customer touchpoint.</span>
      </h2>
    </AnimatedSection>
  )
}

function PinnedDevice({ product, reduced }) {
  return (
    <div className="sticky top-24 flex h-[calc(100vh-7rem)] items-center justify-center">
      {/* hue-matched soft glow behind the device */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[60%] w-[70%] rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.12), transparent 65%)', filter: 'blur(50px)' }}
      />
      <AnimatePresence mode="wait">
        <motion.div
          key={product.slug}
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 28, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: -28, scale: 0.96 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
          style={{ zoom: DEVICE_ZOOM[product.deviceType] ?? 0.8 }}
        >
          <SlideDevice slug={product.slug} deviceType={product.deviceType} isActive />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function ScrollProductShowcase() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)
  const stepRefs = useRef([])

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.step))
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 }
    )
    stepRefs.current.forEach((el) => el && obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const product = PRODUCT_SLIDES[active]

  return (
    <section className="bg-[#F4F6FB]">
      <SectionHeading />

      {/* Desktop: sticky scrollytelling */}
      <div className="hidden lg:block">
        <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-16 px-6 pb-12">
          {/* Left — scrolling steps */}
          <div>
            {PRODUCT_SLIDES.map((p, i) => (
              <div
                key={p.slug}
                data-step={i}
                ref={(el) => (stepRefs.current[i] = el)}
                className="flex min-h-[80vh] items-center"
              >
                <div
                  style={{
                    opacity: active === i ? 1 : 0.32,
                    filter: active === i ? 'none' : 'saturate(0.6)',
                    transform: active === i ? 'none' : 'translateY(6px)',
                    transition: 'opacity 0.45s ease, filter 0.45s ease, transform 0.45s ease',
                  }}
                >
                  <SlideText product={p} />
                </div>
              </div>
            ))}
          </div>

          {/* Right — pinned device that swaps per active step */}
          <div className="relative">
            <PinnedDevice product={product} reduced={reduced} />
          </div>
        </div>
      </div>

      {/* Mobile: stacked */}
      <div className="flex flex-col gap-20 px-6 pb-16 lg:hidden">
        {PRODUCT_SLIDES.map((p) => (
          <AnimatedSection key={p.slug} className="flex flex-col items-center gap-8 text-center">
            <div className="max-w-md text-left">
              <SlideText product={p} />
            </div>
            <div style={{ zoom: DEVICE_ZOOM_MOBILE[p.deviceType] ?? 0.6 }}>
              <SlideDevice slug={p.slug} deviceType={p.deviceType} isActive />
            </div>
          </AnimatedSection>
        ))}
      </div>

      <FlowCard />
    </section>
  )
}
