'use client'

import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

/**
 * Magnetic button - gently follows the cursor within a radius.
 *
 * Physics-based spring via framer-motion. Respects prefers-reduced-motion
 * (falls back to static button). Use for primary CTAs where subtle delight
 * is wanted. Do NOT stack with other heavy hover animations.
 *
 * @example
 * <MagneticButton href="/contact" variant="primary">Book a demo</MagneticButton>
 * <MagneticButton onClick={...} variant="outline">Learn more</MagneticButton>
 */
export function MagneticButton({
  href,
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  strength = 0.25,
  className,
  ...rest
}) {
  const ref = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const reduced = useReducedMotion()

  const handleMouseMove = (e) => {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setOffset({
      x: (e.clientX - cx) * strength,
      y: (e.clientY - cy) * strength,
    })
  }

  const handleMouseLeave = () => setOffset({ x: 0, y: 0 })

  const baseClasses = cn(
    'inline-flex items-center justify-center gap-2 font-semibold rounded-lg no-underline transition-colors',
    size === 'sm' && 'text-sm px-4 py-2',
    size === 'md' && 'text-sm px-5 py-3',
    size === 'lg' && 'text-base px-6 py-3.5',
    variant === 'primary' && 'btn-gradient text-white',
    variant === 'outline' && 'border border-primary/30 text-primary hover:bg-primary/5',
    variant === 'ghost' && 'text-text-secondary hover:text-text',
    className
  )

  const MotionTag = href ? motion(Link) : motion.button
  const props = href ? { href } : { onClick, type: 'button' }

  return (
    <MotionTag
      ref={ref}
      className={baseClasses}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: offset.x, y: offset.y }}
      transition={{ type: 'spring', stiffness: 180, damping: 20, mass: 0.6 }}
      whileTap={{ scale: 0.98 }}
      {...props}
      {...rest}
    >
      {children}
    </MotionTag>
  )
}
