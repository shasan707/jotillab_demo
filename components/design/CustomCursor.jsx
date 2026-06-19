'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * Custom cursor follower - only visible on pointer-fine devices.
 *
 * Global overlay. Mount once (e.g. in layout or a section). When cursor enters
 * an element marked with `data-cursor="cta"`, the cursor enlarges and shifts
 * to the accent color. Pure opt-in per element - zero cost for the rest of the
 * page.
 *
 * Mobile and touch devices: component returns null (no effect).
 * prefers-reduced-motion: position updates without spring (snappy, not floaty).
 *
 * @example
 * // In layout.jsx (or a client wrapper):
 * <CustomCursor />
 *
 * // On any element that should trigger the hover state:
 * <button data-cursor="cta">Try it</button>
 */
export function CustomCursor() {
  const ref = useRef(null)
  const [pointerFine, setPointerFine] = useState(false)
  const [hoverVariant, setHoverVariant] = useState('default')
  const reduced = useReducedMotion()

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)')
    setPointerFine(mq.matches)
    const onChange = () => setPointerFine(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (!pointerFine) return

    const el = ref.current
    if (!el) return

    let rafId = 0
    const onMove = (e) => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        el.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
      })
    }

    const onEnter = (e) => {
      const t = e.target
      if (!(t instanceof HTMLElement)) return
      const variant = t.closest('[data-cursor]')?.getAttribute('data-cursor')
      if (variant) setHoverVariant(variant)
    }

    const onLeave = (e) => {
      const t = e.target
      if (!(t instanceof HTMLElement)) return
      if (t.closest('[data-cursor]')) setHoverVariant('default')
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
      cancelAnimationFrame(rafId)
    }
  }, [pointerFine])

  if (!pointerFine) return null

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[9999] -ml-[12px] -mt-[12px] rounded-full"
      initial={{ width: 24, height: 24, backgroundColor: 'rgba(15,17,41,0.12)', border: '1px solid rgba(15,17,41,0.18)' }}
      animate={
        hoverVariant === 'cta'
          ? {
              width: 56,
              height: 56,
              marginLeft: -28,
              marginTop: -28,
              backgroundColor: 'rgba(59, 130, 246,0.20)',
              border: '1px solid rgba(59, 130, 246,0.45)',
            }
          : {
              width: 24,
              height: 24,
              marginLeft: -12,
              marginTop: -12,
              backgroundColor: 'rgba(15,17,41,0.12)',
              border: '1px solid rgba(15,17,41,0.18)',
            }
      }
      transition={
        reduced
          ? { duration: 0 }
          : { type: 'spring', stiffness: 300, damping: 24, mass: 0.4 }
      }
      style={{ mixBlendMode: 'multiply' }}
    />
  )
}
