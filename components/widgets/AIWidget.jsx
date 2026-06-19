'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, X, Mic, User, Send } from 'lucide-react'

const TABS = [
  { key: 'chat', label: 'Chat', icon: MessageSquare },
  { key: 'voice', label: 'Voice', icon: Mic },
  { key: 'avatar', label: 'Avatar', icon: User },
]

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

function VoicePanel() {
  const [listening, setListening] = useState(false)

  return (
    <div className="flex flex-col items-center justify-center h-full gap-5 p-6">
      {/* Mic button */}
      <button
        onClick={() => setListening((v) => !v)}
        aria-label={listening ? 'Stop listening' : 'Start voice input'}
        className="relative w-20 h-20 rounded-full border-none cursor-pointer flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2"
        style={{
          background: listening
            ? 'linear-gradient(135deg, #22396E, #3859a8)'
            : 'linear-gradient(135deg, #3859a8, #2a4688)',
          boxShadow: listening
            ? '0 0 40px rgba(56, 89, 168,0.4)'
            : '0 8px 24px rgba(56, 89, 168,0.3)',
        }}
      >
        {listening && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'rgba(56, 89, 168,0.2)' }}
          />
        )}
        <Mic size={28} color="#fff" strokeWidth={1.5} />
      </button>

      <p className="text-sm font-medium text-text-secondary">
        {listening ? 'Listening...' : 'Tap to speak'}
      </p>
      <p className="text-xs text-text-secondary/60 text-center leading-relaxed max-w-[200px]">
        {/* TODO: Connect to Retell AI */}
        Voice agent demo coming soon. Talk to our AI in real-time.
      </p>
    </div>
  )
}

function AvatarPanel() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 p-6">
      {/* Avatar placeholder */}
      <div
        className="w-28 h-28 rounded-full flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #F0F4FF, #E8F0FE)',
          border: '2px solid rgba(56, 89, 168,0.15)',
        }}
      >
        <User size={40} className="text-primary/40" strokeWidth={1.2} />
      </div>

      <div className="text-center">
        <p className="text-sm font-semibold text-text mb-1">AI Avatar</p>
        <p className="text-xs text-text-secondary leading-relaxed max-w-[220px]">
          {/* TODO: Connect to Anam AI */}
          Meet your face-to-face AI assistant. Avatar demo launching soon.
        </p>
      </div>

      <div
        className="w-full rounded-xl p-3 text-center"
        style={{ background: 'rgba(56, 89, 168,0.04)', border: '1px solid rgba(56, 89, 168,0.08)' }}
      >
        <p className="text-[11px] text-primary font-medium">Powered by Anam AI</p>
      </div>
    </div>
  )
}

const PANELS = {
  chat: ChatPanel,
  voice: VoicePanel,
  avatar: AvatarPanel,
}

export function AIWidget() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('chat')

  const Panel = PANELS[tab]

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

            {/* Tab bar */}
            <div className="flex border-b border-black/5" role="tablist" aria-label="AI assistant mode">
              {TABS.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  role="tab"
                  aria-selected={tab === key}
                  aria-label={`${label} tab`}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-semibold border-none bg-transparent cursor-pointer transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-inset"
                  style={{
                    color: tab === key ? '#3859a8' : '#6B7280',
                    borderBottom: tab === key ? '2px solid #3859a8' : '2px solid transparent',
                  }}
                >
                  <Icon size={13} strokeWidth={tab === key ? 2 : 1.5} />
                  {label}
                </button>
              ))}
            </div>

            {/* Panel content */}
            <div className="flex-1 min-h-0">
              <Panel />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full border-none cursor-pointer flex items-center justify-center shadow-xl transition-shadow duration-300"
        style={{
          background: 'linear-gradient(135deg, #3859a8, #2a4688)',
          boxShadow: '0 8px 32px rgba(56, 89, 168,0.4)',
        }}
        aria-label={open ? 'Close AI assistant' : 'Open AI assistant'}
      >
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
