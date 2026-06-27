'use client'

import { useEffect, useRef, useState } from 'react'

const NOISE_SVG = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.4 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E`

/**
 * Fixed aurora layer behind all content. Four blurred radial washes drift
 * on independent loops (transform-only, GPU-cheap) AND gently parallax
 * toward the cursor for an interactive, alive feel. Each blob nests a
 * drift-animated inner element inside a parallax outer wrapper so the two
 * transforms compose without fighting. The hero variant runs brighter and
 * more saturated. Cursor parallax + drift both suspend under
 * prefers-reduced-motion (global guard) and on touch (no pointer events).
 */
export function BrandBackground({ variant = 'quiet' }) {
  const isHero = variant === 'hero'
  const intensity = isHero ? 0.72 : 0.42
  const rootRef = useRef(null)

  // Start fully transparent and fade in after mount, so on a refresh the page
  // content paints first — without this the fixed aurora paints a full-screen
  // violet wash before the hero/sections cover it (a visible violet flash).
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const id = requestAnimationFrame(() => setShown(true))
    return () => cancelAnimationFrame(id)
  }, [])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.matchMedia('(hover: none)').matches) return

    let frame = null
    const onMove = (e) => {
      const px = e.clientX / window.innerWidth - 0.5 // -0.5 .. 0.5
      const py = e.clientY / window.innerHeight - 0.5
      if (frame) cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        root.style.setProperty('--px', px.toFixed(3))
        root.style.setProperty('--py', py.toFixed(3))
      })
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMove)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [])

  // Each blob: outer wrapper carries cursor parallax, inner carries drift.
  const parallax = (strength) => ({
    position: 'absolute',
    inset: 0,
    transform: `translate3d(calc(var(--px, 0) * ${strength}px), calc(var(--py, 0) * ${strength}px), 0)`,
    transition: 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
    willChange: 'transform',
  })

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
      style={{ '--px': 0, '--py': 0, opacity: shown ? 1 : 0, transition: 'opacity 0.6s ease-out' }}
    >
      {/* Layer 1: royal-blue + violet, top-left biased */}
      <div style={parallax(36)}>
        <div
          className="atmosphere-drift-1"
          style={{
            position: 'absolute',
            top: '-22%',
            left: '-12%',
            width: '72%',
            height: '82%',
            background:
              'radial-gradient(circle at 30% 30%, rgba(56, 89, 168, 0.50), transparent 60%), radial-gradient(circle at 70% 60%, rgba(138, 107, 255, 0.34), transparent 55%)',
            filter: 'blur(58px)',
            opacity: intensity,
            willChange: 'transform',
          }}
        />
      </div>

      {/* Layer 2: sapphire, bottom-right biased (strongest parallax) */}
      <div style={parallax(64)}>
        <div
          className="atmosphere-drift-2"
          style={{
            position: 'absolute',
            top: '6%',
            right: '-16%',
            width: '68%',
            height: '74%',
            background:
              'radial-gradient(circle at 60% 40%, rgba(59, 130, 246, 0.46), transparent 60%), radial-gradient(circle at 28% 72%, rgba(138, 107, 255, 0.30), transparent 55%)',
            filter: 'blur(68px)',
            opacity: intensity,
            willChange: 'transform',
          }}
        />
      </div>

      {/* Layer 3: deep royal, bottom-left biased (slowest, gentlest parallax) */}
      <div style={parallax(24)}>
        <div
          className="atmosphere-drift-3"
          style={{
            position: 'absolute',
            bottom: '-26%',
            left: '4%',
            width: '62%',
            height: '72%',
            background:
              'radial-gradient(circle at 40% 60%, rgba(59, 130, 246, 0.40), transparent 60%), radial-gradient(circle at 70% 30%, rgba(56, 89, 168, 0.34), transparent 55%)',
            filter: 'blur(78px)',
            opacity: intensity * 0.9,
            willChange: 'transform',
          }}
        />
      </div>

      {/* Layer 4 (hero only): a bright sapphire core that tracks the cursor
          more directly, giving the hero a luminous interactive centerpiece. */}
      {isHero && (
        <div style={parallax(96)}>
          <div
            className="atmosphere-drift-2"
            style={{
              position: 'absolute',
              top: '18%',
              left: '50%',
              width: '46%',
              height: '46%',
              transform: 'translateX(-50%)',
              background:
                'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.40), rgba(56, 89, 168, 0.16) 45%, transparent 70%)',
              filter: 'blur(64px)',
              opacity: intensity * 0.85,
              willChange: 'transform',
            }}
          />
        </div>
      )}

      {/* Noise grain overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.35 * 0.4,
          mixBlendMode: 'overlay',
          backgroundImage: `url("${NOISE_SVG}")`,
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
        }}
      />
    </div>
  )
}
