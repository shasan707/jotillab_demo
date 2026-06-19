'use client'

import { useRef, useCallback } from 'react'

/**
 * Cursor-tracking 3D tilt with a moving light sheen.
 * Wraps any card; tilt is capped at `maxTilt` degrees so motion stays
 * premium rather than gimmicky. Resets smoothly on leave. Inert on
 * touch devices (no mousemove) and under prefers-reduced-motion.
 */
export function TiltCard({ children, className, maxTilt = 4, style, ...rest }) {
  const ref = useRef(null)
  const frame = useRef(null)

  const handleMove = useCallback(
    e => {
      const el = ref.current
      if (!el) return
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

      const rect = el.getBoundingClientRect()
      const px = (e.clientX - rect.left) / rect.width
      const py = (e.clientY - rect.top) / rect.height

      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const rx = (0.5 - py) * maxTilt * 2
        const ry = (px - 0.5) * maxTilt * 2
        el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
        el.style.setProperty('--sheen-x', `${(px * 100).toFixed(1)}%`)
        el.style.setProperty('--sheen-y', `${(py * 100).toFixed(1)}%`)
        el.style.setProperty('--sheen-o', '1')
      })
    },
    [maxTilt]
  )

  const handleLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    if (frame.current) cancelAnimationFrame(frame.current)
    el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)'
    el.style.setProperty('--sheen-o', '0')
  }, [])

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={className}
      {...rest}
      style={{
        transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        transformStyle: 'preserve-3d',
        position: 'relative',
        ...style,
      }}
    >
      {children}
      {/* Light sheen following the cursor */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: 'inherit',
          pointerEvents: 'none',
          opacity: 'var(--sheen-o, 0)',
          transition: 'opacity 0.35s ease',
          background:
            'radial-gradient(360px circle at var(--sheen-x, 50%) var(--sheen-y, 50%), rgba(255,255,255,0.45), rgba(255,255,255,0.0) 62%)',
          mixBlendMode: 'soft-light',
        }}
      />
    </div>
  )
}
