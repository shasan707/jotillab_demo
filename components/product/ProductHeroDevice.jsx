'use client'

import { useState, useRef } from 'react'
import { useInView } from 'framer-motion'
import { SlideDevice } from '@/components/sections/showcase/SlideDevice'
import { CursorTilt } from '@/components/ui/CursorTilt'

// Same device mapping as the homepage showcase.
const DEVICE_TYPE = {
  receptionist: 'phone',
  messenger: 'phone',
  outreach: 'phone',
  space: 'browser',
  avatar: 'browser',
  jotildevs: 'browser',
}

/**
 * The live product interface (same mockup + animated screen as the homepage
 * showcase), used as the hero visual on the right side of product pages.
 */
export function ProductHeroDevice({ slug }) {
  const deviceType = DEVICE_TYPE[slug]
  const ref = useRef(null)
  const inView = useInView(ref, { margin: '-15% 0px -15% 0px' })
  const [, setStep] = useState(0)

  if (!deviceType) return null

  return (
    <div ref={ref} data-hero-device className="flex w-full justify-center lg:justify-end">
      <CursorTilt>
        <SlideDevice slug={slug} deviceType={deviceType} isActive={inView} onStep={setStep} />
      </CursorTilt>
    </div>
  )
}
