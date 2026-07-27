'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { MessageSquare, X, Send } from 'lucide-react'

/* Chat widget (bottom-right), wired to the live Retell chat agent through
   /api/retell/chat — the browser only exchanges plain messages and an opaque
   chat id; the API key and agent id never leave the server. The live voice
   assistant has its own widget at bottom-left (VoiceWidget). */

const TRIGGER_CSS = `
@keyframes jw-glow {
  0%, 100% { box-shadow: 0 4px 15px rgba(59,130,246,0.3); }
  50% { box-shadow: 0 4px 22px rgba(59,130,246,0.55), 0 0 10px rgba(6,182,212,0.3); }
}
@keyframes jw-dots {
  0%, 60%, 100% { transform: translateY(0) scale(0.8); opacity: 0.5; }
  30% { transform: translateY(-4px) scale(1); opacity: 1; }
}
@keyframes jw-online {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
`

function BotAvatar({ size = 24 }) {
  return (
    <span
      className="rounded-full shrink-0 flex items-center justify-center text-white font-bold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.42,
        background: 'linear-gradient(135deg, #3B82F6, #22396E)',
        boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.35)',
      }}
    >
      J
    </span>
  )
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 px-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 rounded-full"
          style={{ background: '#3859a8', animation: `jw-dots 1.1s ${i * 0.15}s ease-in-out infinite` }}
        />
      ))}
    </span>
  )
}

function ChatPanel() {
  const [messages, setMessages] = useState([
    {
      role: 'bot',
      text: "Hi! I'm Jotil AI. How can I help you today? Ask me about our products, pricing, or how we can automate your business.",
    },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const chatIdRef = useRef('')
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages, sending])

  async function send(e) {
    e.preventDefault()
    const text = input.trim()
    if (!text || sending) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', text }])
    setSending(true)
    try {
      const res = await fetch('/api/retell/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId: chatIdRef.current || undefined, message: text }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not send that.')
      chatIdRef.current = data.chatId
      setMessages((m) => [
        ...m,
        { role: 'bot', text: data.reply || 'Sorry, I did not catch that. Could you rephrase?' },
      ])
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'bot', text: 'Sorry, something went wrong on my side. Please try again in a moment.' },
      ])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) =>
          m.role === 'bot' ? (
            <div key={i} className="flex items-end gap-2">
              <BotAvatar />
              <div className="bg-[#F0F4FF] rounded-xl rounded-bl-[4px] px-3.5 py-2.5 max-w-[82%]">
                <p className="text-sm text-text leading-relaxed whitespace-pre-line m-0">{m.text}</p>
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div
                className="rounded-xl rounded-br-[4px] px-3.5 py-2.5 max-w-[82%]"
                style={{ background: 'linear-gradient(135deg, #3859a8, #2a4688)' }}
              >
                <p className="text-sm text-white leading-relaxed whitespace-pre-line m-0">{m.text}</p>
              </div>
            </div>
          )
        )}
        {sending && (
          <div className="flex items-end gap-2">
            <BotAvatar />
            <div className="bg-[#F0F4FF] rounded-xl rounded-bl-[4px] px-4 py-3">
              <TypingDots />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-black/5 p-3">
        <form onSubmit={send} className="flex items-center gap-2">
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
            disabled={!input.trim() || sending}
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
  const [peek, setPeek] = useState(false)
  const everOpened = useRef(false)
  const reduced = useReducedMotion()

  // Peek invitation appears after a moment, and never again once opened.
  useEffect(() => {
    const t = setTimeout(() => setPeek(true), 2600)
    return () => clearTimeout(t)
  }, [])

  const openChat = () => {
    everOpened.current = true
    setPeek(false)
    setOpen(true)
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-5 sm:right-5 z-50">
      <style>{TRIGGER_CSS}</style>

      {/* Peek invitation */}
      <AnimatePresence>
        {peek && !open && !everOpened.current && (
          <motion.button
            onClick={openChat}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 right-0 w-[210px] cursor-pointer rounded-lg border border-black/5 bg-white px-3.5 py-2.5 text-left shadow-[0_4px_16px_rgba(15,17,41,0.12)]"
          >
            <p className="m-0 text-[13px] font-semibold text-text">Jotil AI</p>
            <p className="m-0 mt-0.5 text-[13px] text-text-secondary">Questions? Chat with me.</p>
          </motion.button>
        )}
      </AnimatePresence>
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
              <div className="flex items-center gap-2.5">
                <BotAvatar size={32} />
                <div className="leading-tight">
                  <p className="m-0 text-[15px] font-semibold text-white">Jotil AI</p>
                  <p className="m-0 flex items-center gap-1.5 text-[11px] text-white/85">
                    <span
                      className="h-[7px] w-[7px] rounded-full"
                      style={{ background: '#12a06b', animation: 'jw-online 2s ease-in-out infinite' }}
                    />
                    Online
                  </p>
                </div>
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

      {/* Floating trigger — reference style: gradient disc, white ring, float + glow */}
      <motion.button
        onClick={() => (open ? setOpen(false) : openChat())}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={open || reduced ? { y: 0 } : { y: [0, -6, 0] }}
        transition={open || reduced ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="relative w-14 h-14 rounded-full cursor-pointer flex items-center justify-center"
        style={{
          background: 'linear-gradient(135deg, #3B82F6 0%, #3859a8 55%, #22396E 100%)',
          border: '3px solid #ffffff',
          animation: reduced ? 'none' : 'jw-glow 2s ease-in-out infinite',
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
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
