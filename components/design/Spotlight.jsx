'use client'

import { useCallback, useRef } from 'react'

/**
 * Cursor-tracked spotlight glow for cards (Linear/Vercel signature).
 *
 * `useSpotlight()` returns handlers to spread on a position:relative parent;
 * they write the pointer position into CSS vars (--spot-x/--spot-y) and a
 * hover flag (--spot-o). Drop a <Spotlight /> inside that parent to render the
 * glow. rAF-throttled, inert under prefers-reduced-motion, and silent on touch
 * (no mousemove fires). Mirrors the sheen technique in TiltCard.
 */
export function useSpotlight() {
  const frame = useRef(null)

  const onMouseMove = useCallback((e) => {
    const el = e.currentTarget
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (frame.current) cancelAnimationFrame(frame.current)
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty('--spot-x', `${x.toFixed(1)}px`)
      el.style.setProperty('--spot-y', `${y.toFixed(1)}px`)
      el.style.setProperty('--spot-o', '1')
    })
  }, [])

  const onMouseLeave = useCallback((e) => {
    if (frame.current) cancelAnimationFrame(frame.current)
    e.currentTarget?.style.setProperty('--spot-o', '0')
  }, [])

  return { onMouseMove, onMouseLeave }
}

/**
 * Glow overlay. Place inside a parent wired with useSpotlight() handlers.
 * `color` is the glow tint; `size` the radius in px; `blend` lets dark
 * surfaces use 'screen' instead of the default 'soft-light'.
 */
export function Spotlight({ color = 'rgba(56,89,168,0.22)', size = 380, blend = 'soft-light' }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        borderRadius: 'inherit',
        pointerEvents: 'none',
        opacity: 'var(--spot-o, 0)',
        transition: 'opacity 0.4s ease',
        mixBlendMode: blend,
        background: `radial-gradient(${size}px circle at var(--spot-x, 50%) var(--spot-y, 50%), ${color}, transparent 60%)`,
      }}
    />
  )
}
