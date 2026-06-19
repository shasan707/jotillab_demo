'use client'

import { useEffect, useRef } from 'react'
import { useMotionValue, useTransform, animate, useInView } from 'framer-motion'

export function CountUp({
  end,
  suffix = '',
  prefix = '',
  decimals = 0,
  duration = 2,
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const motionValue = useMotionValue(0)
  const rounded = useTransform(motionValue, (latest) =>
    latest.toFixed(decimals)
  )

  useEffect(() => {
    if (!isInView) return

    const controls = animate(motionValue, end, {
      duration,
      ease: 'easeOut',
    })

    return () => controls.stop()
  }, [isInView, end, duration, motionValue])

  // Use a state to track the displayed value so we can render it in SSR-safe way
  const displayRef = useRef(null)

  useEffect(() => {
    const unsubscribe = rounded.on('change', (latest) => {
      if (displayRef.current) {
        displayRef.current.textContent = `${prefix}${Number(latest).toLocaleString('en-US', {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        })}${suffix}`
      }
    })

    return () => unsubscribe()
  }, [rounded, prefix, suffix, decimals])

  return (
    <span ref={ref}>
      <span ref={displayRef}>
        {prefix}0{suffix}
      </span>
    </span>
  )
}
