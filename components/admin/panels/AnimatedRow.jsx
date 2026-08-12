'use client'

import { motion, useReducedMotion } from 'framer-motion'

/* Staggered entrance for list rows; inert under reduced motion.
   The stagger is keyed on position within the freshly loaded page so
   "Load more" batches animate in without replaying existing rows. */

export function AnimatedRow({ index = 0, children }) {
  const reduce = useReducedMotion()
  if (reduce) return <li>{children}</li>
  return (
    <motion.li
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: Math.min(index * 0.03, 0.36), ease: 'easeOut' }}
    >
      {children}
    </motion.li>
  )
}
