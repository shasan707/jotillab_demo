'use client'

import { motion } from 'framer-motion'

/* Thin progress strip for the chat intake, reusing the wizard's gradient
   bar so the section keeps its visual identity. */

export function ChatProgress({ answered, total, title }) {
  const percent = Math.round((answered / total) * 100)
  const current = Math.min(answered + 1, total)
  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-bold uppercase tracking-widest text-primary">
          {answered >= total ? 'All set' : `Question ${current} of ${total}: ${title}`}
        </p>
        <p className="text-xs text-text-secondary">{percent}%</p>
      </div>
      <div
        className="h-1.5 rounded-full overflow-hidden"
        style={{ background: 'rgba(56,89,168,0.1)' }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={answered}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #3859a8, #3B82F6)' }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>
    </div>
  )
}
