'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { MessageSquare, X, Send } from 'lucide-react'

/* Chat-only widget (bottom-right). The live voice assistant has its own
   widget at bottom-left (VoiceWidget). */

function ChatPanel() {
  const [input, setInput] = useState('')

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* Bot greeting */}
        <div className="flex gap-2.5">
          <div
            className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-[10px] font-bold"
            style={{ background: 'linear-gradient(135deg, #3859a8, #2a4688)' }}
          >
            J
          </div>
          <div className="bg-[#F0F4FF] rounded-2xl rounded-tl-md px-3.5 py-2.5 max-w-[85%]">
            <p className="text-sm text-text leading-relaxed">
              Hi! I&apos;m Jotil AI. How can I help you today? Ask me about our products, pricing, or how we can automate your business.
            </p>
          </div>
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-black/5 p-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            // TODO: Connect to Vercel AI SDK
            setInput('')
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="ai-chat-input" className="sr-only">Type a message</label>
          <input
            id="ai-chat-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 text-sm bg-[#F8FAFF] rounded-xl px-3.5 py-2.5 outline-none border border-transparent focus:border-primary/20 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Send message"
            className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all duration-200 border-none cursor-pointer disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
            style={{ background: 'linear-gradient(135deg, #3859a8, #2a4688)' }}
          >
            <Send size={14} color="#fff" strokeWidth={2} />
          </button>
        </form>
        <p className="text-[10px] text-text-secondary mt-2 text-center">
          Powered by Jotil AI
        </p>
      </div>
    </div>
  )
}

export function AIWidget() {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50">
      {/* Widget panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 right-0 w-[calc(100vw-2rem)] sm:w-[340px] h-[460px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl border border-black/8 shadow-2xl shadow-black/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: 'linear-gradient(135deg, #3859a8, #2a4688)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageSquare size={12} color="#fff" strokeWidth={2} />
                </div>
                <span className="text-sm font-semibold text-white">Jotil AI</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close AI assistant"
                className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border-none cursor-pointer hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <X size={14} color="#fff" strokeWidth={2} />
              </button>
            </div>

            {/* Chat */}
            <div className="flex-1 min-h-0">
              <ChatPanel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button — vibrant gradient, gentle float, pulse glow */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        animate={open || reduced ? { y: 0 } : { y: [0, -7, 0] }}
        transition={open || reduced ? { duration: 0.2 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-14 h-14 rounded-full border-none cursor-pointer flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #3859a8 0%, #3B82F6 55%, #06b6d4 100%)',
          boxShadow: '0 12px 34px rgba(56,89,168,0.45), 0 4px 14px rgba(59,130,246,0.4)',
        }}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
      >
        {/* Vibrant pulse rings to draw the eye (only when closed) */}
        {!open && !reduced && (
          <>
            <span aria-hidden="true" className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(59,130,246,0.40)', animationDuration: '2.4s' }} />
            <span aria-hidden="true" className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(59,130,246,0.30)', animationDuration: '2.4s', animationDelay: '0.6s' }} />
          </>
        )}
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              <X size={22} color="#fff" strokeWidth={1.5} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              transition={{ duration: 0.15 }}
              className="flex"
            >
              <MessageSquare size={22} color="#fff" strokeWidth={1.5} />
            </motion.span>
          ) }
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
