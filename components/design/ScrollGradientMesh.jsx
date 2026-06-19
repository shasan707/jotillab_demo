'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

/**
 * Scroll-linked ambient gradient mesh background.
 *
 * Renders two to three radial gradient blobs in an absolutely-positioned layer.
 * Blobs drift subtly with page scroll (parallax) and mouse position. Intended
 * as a layer INSIDE a hero or CTA section, not a full-page fixed background.
 *
 * Respects prefers-reduced-motion by falling back to a static mesh (no drift).
 *
 * @example
 * <section className="relative overflow-hidden">
 *   <ScrollGradientMesh />
 *   <div className="relative z-10">...content...</div>
 * </section>
 */
export function ScrollGradientMesh({
  tone = 'light', // 'light' | 'dark'
  opacity = 0.35,
  className = '',
}) {
  const wrap = useRef(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || !wrap.current) return
    const el = wrap.current

    let mouseX = 0
    let mouseY = 0
    let scrollY = 0
    let rafId = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth
      mouseY = e.clientY / window.innerHeight
      if (!rafId) rafId = requestAnimationFrame(update)
    }
    const onScroll = () => {
      scrollY = window.scrollY
      if (!rafId) rafId = requestAnimationFrame(update)
    }
    const update = () => {
      rafId = 0
      const driftX = (mouseX - 0.5) * 40
      const driftY = (mouseY - 0.5) * 40 - scrollY * 0.05
      el.style.setProperty('--mesh-x', `${driftX}px`)
      el.style.setProperty('--mesh-y', `${driftY}px`)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [reduced])

  const blobs =
    tone === 'dark'
      ? [
          { x: '20%', y: '30%', size: 640, color: 'rgba(59, 130, 246, 0.28)' },
          { x: '75%', y: '20%', size: 520, color: 'rgba(56, 89, 168, 0.35)' },
          { x: '50%', y: '85%', size: 700, color: 'rgba(15, 17, 41, 0.55)' },
        ]
      : [
          { x: '15%', y: '25%', size: 580, color: 'rgba(59, 130, 246, 0.22)' },
          { x: '80%', y: '30%', size: 520, color: 'rgba(56, 89, 168, 0.18)' },
          { x: '55%', y: '90%', size: 720, color: 'rgba(140, 163, 204, 0.22)' },
        ]

  return (
    <div
      ref={wrap}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: b.x,
            top: b.y,
            width: b.size,
            height: b.size,
            transform: 'translate(-50%, -50%) translate(var(--mesh-x, 0), var(--mesh-y, 0))',
            background: `radial-gradient(circle, ${b.color} 0%, transparent 70%)`,
            filter: 'blur(60px)',
            transition: reduced ? 'none' : 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
