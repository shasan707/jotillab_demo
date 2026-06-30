'use client'

import { useState, useRef } from 'react'
import { useInView } from 'framer-motion'
import { SlideDevice } from '@/components/sections/showcase/SlideDevice'
import { DeviceCaption } from '@/components/sections/showcase/DeviceCaption'
import { PRODUCT_STEPS } from '@/components/sections/showcase/data'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

// Which device the live interface renders in (same mapping as the homepage
// showcase). Only these products have an interactive screen.
const DEVICE_TYPE = {
  receptionist: 'phone',
  messenger: 'phone',
  outreach: 'phone',
  space: 'browser',
  avatar: 'browser',
}

export function hasDemoDevice(slug) {
  return Boolean(DEVICE_TYPE[slug])
}

/**
 * "See it in action" product demo using the SAME live device interface as the
 * homepage showcase (phone / browser mockup with the animated product screen).
 * The screen animates once the section scrolls into view.
 */
export function ProductDemoDevice({ slug }) {
  const deviceType = DEVICE_TYPE[slug]
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-20% 0px -20% 0px' })
  const [step, setStep] = useState(0)

  if (!deviceType) return null

  return (
    <section className="cv-auto py-20 px-4">
      <div className="max-w-5xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Live preview</p>
          <h2
            className="headline-shadow text-[clamp(1.9rem,3.5vw,2.75rem)] font-bold text-text tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            See it in action
          </h2>
        </AnimatedSection>

        <div ref={ref} className="flex flex-col items-center gap-6">
          <SlideDevice
            slug={slug}
            deviceType={deviceType}
            isActive={inView}
            onStep={setStep}
          />
          <DeviceCaption steps={PRODUCT_STEPS[slug]} activeIndex={step} />
        </div>
      </div>
    </section>
  )
}
