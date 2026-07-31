'use client'

import { motion } from 'framer-motion'
import {
  Scissors, TrendingUp, HeartPulse, Wrench, Scale,
  ClipboardCheck, Home, UtensilsCrossed, Store,
} from 'lucide-react'

const ICONS = [
  { Icon: Scissors, label: 'Beauty & Spa' },
  { Icon: TrendingUp, label: 'Finance' },
  { Icon: HeartPulse, label: 'Health & Wellness' },
  { Icon: Wrench, label: 'Home Services' },
  { Icon: Scale, label: 'Legal' },
  { Icon: ClipboardCheck, label: 'Personal Secretary' },
  { Icon: Home, label: 'Real Estate' },
  { Icon: UtensilsCrossed, label: 'Restaurants' },
  { Icon: Store, label: 'Small Business' },
]

export function IndustryIconStrip() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 md:gap-2.5">
      {ICONS.map(({ Icon, label }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.2 + i * 0.05, duration: 0.45, ease: 'easeOut' }}
          whileHover={{ y: -2, scale: 1.04 }}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold cursor-default select-none"
          style={{
            background: 'rgba(56, 89, 168, 0.06)',
            color: '#3859a8',
            border: '1px solid rgba(56, 89, 168, 0.16)',
            transition: 'box-shadow 0.25s, background-color 0.25s',
          }}
        >
          <Icon size={13} strokeWidth={1.8} />
          {label}
        </motion.div>
      ))}
    </div>
  )
}
