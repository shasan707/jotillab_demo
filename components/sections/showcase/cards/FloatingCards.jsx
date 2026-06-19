'use client'

import { motion } from 'framer-motion'
import { FLOATING_CARDS } from './cardData'

export function FloatingCards({ slug, highlightedCards = new Set() }) {
  const cards = FLOATING_CARDS[slug]
  if (!cards) return null

  return (
    <>
      {cards.map((card) => {
        const Icon = card.icon
        const isHighlighted = highlightedCards.has(card.id)

        return (
          <motion.div
            key={card.id}
            className="absolute z-0 hidden md:block"
            style={{
              top: card.top,
              bottom: card.bottom,
              left: card.left,
              right: card.right,
              transform: `rotate(${card.rotate}) translateZ(${card.depth || '-40px'})`,
              transformStyle: 'preserve-3d',
            }}
            animate={{
              opacity: isHighlighted ? 1 : 0.85,
              scale: isHighlighted ? 1.08 : 0.98,
            }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          >
            <div
              className="rounded-2xl px-4 py-3 flex items-center gap-3"
              style={{
                minWidth: 140,
                background: isHighlighted
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(240,242,255,0.9) 100%)'
                  : 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(245,245,250,0.65) 100%)',
                backdropFilter: 'blur(16px) saturate(1.3)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.3)',
                border: `1px solid ${isHighlighted ? 'rgba(56, 89, 168, 0.2)' : 'rgba(255,255,255,0.6)'}`,
                boxShadow: isHighlighted
                  ? '0 8px 32px rgba(56, 89, 168, 0.12), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)'
                  : '0 4px 20px rgba(0,0,0,0.04), 0 1px 4px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,0.6)',
                transition: 'border-color 0.4s, box-shadow 0.4s, background 0.4s',
              }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: isHighlighted
                    ? 'linear-gradient(135deg, rgba(56, 89, 168, 0.12), rgba(56, 89, 168, 0.06))'
                    : 'rgba(0,0,0,0.03)',
                  transition: 'background 0.3s',
                }}
              >
                <Icon
                  size={16}
                  strokeWidth={1.5}
                  style={{
                    color: isHighlighted ? '#3859a8' : '#9ca3af',
                    transition: 'color 0.3s',
                  }}
                />
              </div>
              <div>
                <p className="text-[11px] font-semibold text-gray-800 leading-tight">{card.label}</p>
                <p className="text-[9px] text-gray-400 leading-tight mt-0.5">{card.sublabel}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </>
  )
}
