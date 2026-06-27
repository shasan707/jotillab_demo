'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function SmoothScroll({ children }) {
  useEffect(() => {
    if (typeof window === 'undefined') return

    const reduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    if (reduced) return

    // Phones/touch use native scrolling — skip Lenis entirely so there's no
    // per-frame page transform competing with paint while scrolling. GSAP
    // ScrollTrigger falls back to native scroll events automatically.
    const isTouch =
      window.matchMedia('(max-width: 767px)').matches ||
      window.matchMedia('(hover: none)').matches
    if (isTouch) return

    const lenis = new Lenis({
      lerp: 0.1,
      duration: 1.2,
      smoothWheel: true,
      smoothTouch: false,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const onTick = (time) => lenis.raf(time * 1000)
    gsap.ticker.add(onTick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(onTick)
      lenis.destroy()
    }
  }, [])

  return children
}
