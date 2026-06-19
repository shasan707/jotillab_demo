'use client'

import { useEffect, useRef } from 'react'
import Logo from '@/components/ui/Logo'

/**
 * Site watermark for the homepage. Fixed positioning, sits at z-1 INSIDE
 * <main> (so it stacks below opaque device mockups which carry their own
 * higher z-index inside the same context, but above section backgrounds and
 * inline content). Subtle cursor-driven 3D parallax on fine pointers.
 *
 * Render as a child of <main> on the homepage only. Hidden below md breakpoint.
 */
export function HomeWatermark() {
  const ref = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const fine = window.matchMedia('(pointer: fine)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || reduced) return

    let mouseX = 0.5
    let mouseY = 0.5
    let currentX = 0.5
    let currentY = 0.5
    let rafId = 0

    const onMouseMove = (e) => {
      mouseX = e.clientX / window.innerWidth
      mouseY = e.clientY / window.innerHeight
      if (!rafId) rafId = requestAnimationFrame(update)
    }

    const update = () => {
      rafId = 0
      currentX += (mouseX - currentX) * 0.08
      currentY += (mouseY - currentY) * 0.08

      const tiltX = (currentY - 0.5) * -14
      const tiltY = (currentX - 0.5) * 18
      if (ref.current) {
        ref.current.style.transform = `perspective(1100px) translateX(28%) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`
      }

      if (
        Math.abs(mouseX - currentX) > 0.002 ||
        Math.abs(mouseY - currentY) > 0.002
      ) {
        rafId = requestAnimationFrame(update)
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[1] hidden md:flex items-center justify-end overflow-hidden"
    >
      <div
        ref={ref}
        className="will-change-transform -mr-12 lg:-mr-20"
        style={{
          opacity: 0.06,
          transform: 'translateX(28%)',
          transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
          transformStyle: 'preserve-3d',
        }}
      >
        <Logo size={900} tone="brand" animate={false} />
      </div>
    </div>
  )
}
