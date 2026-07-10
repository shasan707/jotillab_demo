'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Mic } from 'lucide-react'

/* Floating voice-AI trigger at bottom-LEFT, mirroring the chat widget at
   bottom-right. Opens the shared AI widget directly on its Voice tab. */
export function VoiceFloatButton() {
  const reduced = useReducedMotion()

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-50">
      <motion.button
        onClick={() => window.dispatchEvent(new CustomEvent('jotil:open-widget', { detail: { tab: 'voice' } }))}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={reduced ? { y: 0 } : { y: [0, -7, 0] }}
        transition={reduced ? { duration: 0.2 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
        className="relative w-14 h-14 rounded-full border-none cursor-pointer flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #22396E 0%, #3859a8 55%, #3B82F6 100%)',
          boxShadow: '0 12px 34px rgba(56,89,168,0.45), 0 4px 14px rgba(59,130,246,0.35)',
        }}
        aria-label="Talk to our voice AI"
      >
        {!reduced && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'rgba(56,89,168,0.35)', animationDuration: '2.4s', animationDelay: '1.2s' }}
          />
        )}
        <Mic size={22} color="#fff" strokeWidth={1.8} />
      </motion.button>
    </div>
  )
}
