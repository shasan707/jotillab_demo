'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Mic, Volume2 } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const BRAND_BLUE = '#3859a8'

const TURNS = [
  { role: 'ai', text: "Hi! I'm Sarah from JotilLabs. How can I help today?" },
  { role: 'user', text: 'Tell me about pricing' },
  { role: 'ai', text: 'Our Starter plan is $99 a month, perfect for small teams. Want a quick demo?' },
  { role: 'user', text: 'Yes, show me' },
]

/* Real photo "live" avatar. A slow Ken-Burns drift keeps it alive at rest;
   while speaking it breathes a touch faster and a warm glow pulses near the
   mouth to read as talking energy. Motion is disabled under reduced-motion. */
function FemaleAvatar({ speaking }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      className="relative h-full w-full"
      style={{ transformOrigin: 'center 32%' }}
      animate={reduced ? undefined : { scale: speaking ? [1, 1.015, 1] : [1, 1.025, 1] }}
      transition={{ duration: speaking ? 1.5 : 9, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* Live avatar clip (hand/mouth motion). Loops, muted, autoplays; the
          still photo shows as the poster while it loads / if it can't play. */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/avatar-sarah.jpg"
        className="h-full w-full object-cover"
        style={{ objectPosition: 'center 24%' }}
      >
        <source src="/avatar-sarah.mp4" type="video/mp4" />
      </video>
      {/* Talking glow that pulses while speaking */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        animate={reduced ? { opacity: 0 } : { opacity: speaking ? [0, 0.16, 0] : 0 }}
        transition={{ duration: 0.5, repeat: speaking && !reduced ? Infinity : 0, ease: 'easeInOut' }}
        style={{ background: 'radial-gradient(55% 42% at 50% 74%, rgba(56,89,168,0.45), transparent 70%)' }}
      />
    </motion.div>
  )
}

function SpeakingIndicator({ active }) {
  return (
    <div className="flex items-center gap-0.5 h-3">
      {[0, 1, 2, 3, 4].map((i) => (
        <span
          key={i}
          className="w-0.5 rounded-full"
          style={{
            backgroundColor: BRAND_BLUE,
            height: active ? '100%' : '30%',
            animation: active ? `wave-bar 0.9s ease-in-out ${i * 0.12}s infinite` : 'none',
            transition: 'height 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}

export function AvatarScreen({ isActive, onAction, onStep }) {
  const [sentMessages, setSentMessages] = useState([])
  const [activeTurnIdx, setActiveTurnIdx] = useState(-1)
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const loopRef = useRef(null)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [sentMessages])

  useEffect(() => {
    if (!isActive) {
      setSentMessages([])
      setActiveTurnIdx(-1)
      setAiSpeaking(false)
      if (loopRef.current) loopRef.current.forEach(clearTimeout)
      return
    }

    const timers = []
    const t = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id }

    const runLoop = () => {
      setSentMessages([])
      setActiveTurnIdx(-1)
      setAiSpeaking(false)

      let now = 700

      TURNS.forEach((turn, idx) => {
        if (turn.role === 'ai') {
          const speakDuration = Math.max(1800, turn.text.length * 52)
          t(() => {
            setActiveTurnIdx(idx)
            setAiSpeaking(true)
            setSentMessages((prev) => [...prev, turn])
            onStep?.(idx)
          }, now)
          now += speakDuration
          t(() => setAiSpeaking(false), now)
          now += 600
        } else {
          t(() => {
            setActiveTurnIdx(idx)
            setSentMessages((prev) => [...prev, turn])
            onStep?.(idx)
          }, now)
          now += 1100
        }
      })

      t(runLoop, now + 2400)
    }

    runLoop()
    loopRef.current = timers
    return () => timers.forEach(clearTimeout)
  }, [isActive])

  return (
    <div className="w-full h-full flex flex-col bg-white relative overflow-hidden">
      {/* Content: avatar left, chat right */}
      <div className="flex-1 flex min-h-0">
        {/* Left: Avatar */}
        <div className="w-[44%] relative flex flex-col" style={{ background: 'linear-gradient(160deg, #eef3ff, #d4ddf2)' }}>
          {/* Avatar fills the panel edge-to-edge, down to the name — no empty
              background around it. */}
          <div className="flex-1 relative overflow-hidden">
            <FemaleAvatar speaking={aiSpeaking} />
            {/* Live-camera framing: soft studio light + vignette */}
            <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(120% 75% at 28% 12%, rgba(255,255,255,0.22), transparent 55%)' }} />
            <div className="pointer-events-none absolute inset-0" style={{ boxShadow: 'inset 0 0 36px rgba(20,22,45,0.28)' }} />
            {aiSpeaking && (
              <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/90 backdrop-blur" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-gray-700">LIVE</span>
              </div>
            )}
          </div>
          <div className="shrink-0 px-3 pb-2 pt-1 flex flex-col items-center gap-1">
            <p className="text-[14px] font-bold text-gray-900">Sarah</p>
            <p className="text-[12px] text-gray-500">AI Brand Ambassador</p>
            <div className="flex items-center gap-2 mt-1">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                <Mic className="w-3 h-3 text-white" strokeWidth={1.8} />
              </div>
              <SpeakingIndicator active={aiSpeaking} />
              <Volume2 className="w-3 h-3 text-gray-400" strokeWidth={1.6} />
            </div>
          </div>
        </div>

        {/* Right: Conversation */}
        <div className="flex-1 flex flex-col bg-white border-l border-gray-100">
          <div className="shrink-0 px-3 py-2 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md flex items-center justify-center" style={{ backgroundColor: `${BRAND_BLUE}15` }}>
                <Logo size={10} animate={false} />
              </div>
              <p className="text-[14px] font-bold text-gray-900">Live Conversation</p>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[12px] text-green-600">Active</span>
            </div>
          </div>

          <div ref={scrollRef} className="flex-1 px-3 py-2 overflow-y-auto flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {sentMessages.map((msg, i) => {
                const isUser = msg.role === 'user'
                return (
                  <motion.div
                    key={`msg-${i}`}
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[88%] px-2 py-1.5 text-[13px] leading-snug ${
                        isUser
                          ? 'rounded-xl rounded-br-sm text-gray-900'
                          : 'rounded-xl rounded-bl-sm text-white'
                      }`}
                      style={{
                        backgroundColor: isUser ? '#f1f3f5' : BRAND_BLUE,
                        boxShadow: isUser ? 'none' : `0 2px 8px ${BRAND_BLUE}30`,
                      }}
                    >
                      {!isUser && i === activeTurnIdx && aiSpeaking && (
                        <span className="inline-flex items-center gap-0.5 mr-1.5 align-middle">
                          {[0, 1, 2].map((d) => (
                            <span
                              key={d}
                              className="w-0.5 rounded-full bg-white"
                              style={{
                                height: 5,
                                animation: `wave-bar 0.9s ease-in-out ${d * 0.12}s infinite`,
                              }}
                            />
                          ))}
                        </span>
                      )}
                      {msg.text}
                    </div>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>

          <div className="shrink-0 px-3 py-1.5 border-t border-gray-100 flex items-center gap-2">
            <div className="flex-1 bg-gray-50 rounded-full px-2.5 py-1 text-[12px] text-gray-400">
              Type or speak...
            </div>
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center"
              style={{ backgroundColor: BRAND_BLUE }}
            >
              <Mic className="w-2.5 h-2.5 text-white" strokeWidth={1.8} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
