'use client'

import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

/* "What's happening now" caption shown beside/under the showcase device.
   Renders the active step label large and legible (so the audience can follow
   the animation even when the in-device text is small). Rendered OUTSIDE the
   device frame so it is never shrunk by the device scale. Reduced-motion:
   opacity-only crossfade. */
export function DeviceCaption({ steps, activeIndex, className = '' }) {
  const reduced = useReducedMotion()
  if (!steps || steps.length === 0) return null

  const idx = activeIndex >= 0 && activeIndex < steps.length ? activeIndex : 0
  const label = steps[idx]

  return (
    <div className={`flex flex-col items-center gap-3 ${className}`}>
      <div
        className="inline-flex items-center gap-2 rounded-full px-4 py-2"
        style={{ background: 'rgba(56,89,168,0.07)', border: '1px solid rgba(56,89,168,0.16)' }}
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full rounded-full" style={{ background: 'rgba(59,130,246,0.45)', animation: reduced ? 'none' : 'ping 1.8s cubic-bezier(0,0,0.2,1) infinite' }} />
          <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: '#3B82F6' }} />
        </span>
        <span className="relative min-h-[1.4em] overflow-hidden text-left">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={idx}
              initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="block text-[17px] sm:text-lg font-semibold text-text whitespace-nowrap"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {label}
            </motion.span>
          </AnimatePresence>
        </span>
      </div>
    </div>
  )
}
