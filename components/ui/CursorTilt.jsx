'use client'

import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Cursor + touch 3D tilt wrapper (same feel as the homepage showcase devices).
 * Pointer events cover mouse, pen and finger; rAF-throttled; springs back on
 * leave; inert under reduced motion. touch-action: pan-y keeps page scroll.
 */
export function CursorTilt({ children, max = 7, className = '' }) {
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
      className={className}
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
