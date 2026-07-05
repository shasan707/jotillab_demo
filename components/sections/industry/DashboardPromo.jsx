'use client'

import { useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Dashboard promo video, responsive by SCREEN.
 *
 *  - Desktop / tablet (>= 640px): the landscape (16:9) clip. A subtle cursor
 *    tilt applies on a real mouse.
 *  - Phone (< 640px): the portrait (9:16) clip, sized to fit the screen so the
 *    numbers stay readable. No tilt (touch is left alone).
 *
 * Both <video>s use preload="metadata", and only the one matching the screen
 * is displayed, so a phone never downloads the desktop clip (and vice-versa).
 *
 * Expected files in /public (add the ones you have; webm/poster are optional
 * and fall back to mp4 / no-poster if missing):
 *   dashboard-promo.webm / dashboard-promo.mp4 / dashboard-promo-poster.jpg
 *   dashboard-promo-mobile.webm / dashboard-promo-mobile.mp4 / dashboard-promo-mobile-poster.jpg
 */
export function DashboardPromo({ ariaLabel, max = 6 }) {
  const ref = useRef(null)
  const raf = useRef(null)
  const reduced = useReducedMotion()

  // Tilt only for a real mouse — touch/pen are left alone so scrolling stays
  // natural on phones.
  const onMove = (e) => {
    if (e.pointerType !== 'mouse' || reduced) return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    if (raf.current) cancelAnimationFrame(raf.current)
    raf.current = requestAnimationFrame(() => {
      const rx = (0.5 - py) * max * 2
      const ry = (px - 0.5) * max * 2
      el.style.transition = 'transform 0.1s ease-out'
      el.style.transform = `perspective(1100px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`
    })
  }
  const reset = () => {
    const el = ref.current
    if (!el) return
    if (raf.current) cancelAnimationFrame(raf.current)
    el.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1)'
    el.style.transform = 'perspective(1100px) rotateX(0deg) rotateY(0deg)'
  }

  const frameStyle = {
    border: '1px solid rgba(56,89,168,0.14)',
    boxShadow: '0 24px 60px -24px rgba(15,17,41,0.30)',
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      onPointerCancel={reset}
      className="mx-auto max-w-[960px]"
      style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
    >
      {/* Desktop / tablet (landscape 16:9) */}
      <video
        className="hidden sm:block h-auto w-full rounded-[14px]"
        style={frameStyle}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/dashboard-promo-poster.jpg"
        aria-label={ariaLabel}
      >
        <source src="/dashboard-promo.webm" type="video/webm" />
        <source src="/dashboard-promo.mp4" type="video/mp4" />
      </video>

      {/* Phone (portrait 9:16) */}
      <video
        className="mx-auto block h-auto w-full max-w-[420px] rounded-[14px] sm:hidden"
        style={frameStyle}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/dashboard-promo-mobile-poster.jpg"
        aria-label={ariaLabel}
      >
        <source src="/dashboard-promo-mobile.webm" type="video/webm" />
        <source src="/dashboard-promo-mobile.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
