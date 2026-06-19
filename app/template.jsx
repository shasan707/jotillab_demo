'use client'

import { motion } from 'framer-motion'

/**
 * Page-enter transition: every route change fades the new page in.
 * Opacity only — a transform here would create a containing block and
 * break GSAP ScrollTrigger pinning inside ScrollProductShowcase.
 */
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
