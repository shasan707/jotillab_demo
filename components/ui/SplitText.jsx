'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

const containerVariants = {
  hidden: {},
  visible: (delay) => ({
    transition: {
      staggerChildren: 0.08,
      delayChildren: delay,
    },
  }),
}

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

export function SplitText({ text, className, delay = 0 }) {
  const words = text.split(' ')

  return (
    <motion.span
      className={cn('inline-flex flex-wrap', className)}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      custom={delay}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="mr-[0.3em] inline-block"
          variants={wordVariants}
        >
          {word}
        </motion.span>
      ))}
    </motion.span>
  )
}
