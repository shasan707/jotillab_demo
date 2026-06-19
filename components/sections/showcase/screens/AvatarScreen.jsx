'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mic, Volume2 } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const BRAND_BLUE = '#3859a8'

const TURNS = [
  { role: 'ai', text: "Hi! I'm Sarah from JotilLabs. How can I help today?" },
  { role: 'user', text: 'Tell me about pricing' },
  { role: 'ai', text: 'Our Starter plan is $99 a month, perfect for small teams. Want a quick demo?' },
  { role: 'user', text: 'Yes, show me' },
]

const VISEME_PATHS = {
  // [top lip path, bottom lip path, inner opening rx, inner opening ry]
  rest: {
    top: 'M 108 163 Q 120 161 132 163',
    bottom: 'M 108 163 Q 120 167 132 163',
    rx: 0,
    ry: 0,
  },
  small: {
    top: 'M 108 163 Q 120 161 132 163',
    bottom: 'M 108 163 Q 120 170 132 163',
    rx: 4,
    ry: 1.5,
  },
  medium: {
    top: 'M 108 162 Q 120 160 132 162',
    bottom: 'M 108 162 Q 120 174 132 162',
    rx: 6,
    ry: 4,
  },
  wide: {
    top: 'M 106 161 Q 120 159 134 161',
    bottom: 'M 106 161 Q 120 178 134 161',
    rx: 8,
    ry: 6,
  },
  smile: {
    top: 'M 106 162 Q 120 160 134 162',
    bottom: 'M 106 162 Q 120 172 134 162',
    rx: 5,
    ry: 2.5,
  },
}

const VISEME_KEYS = ['small', 'medium', 'wide', 'smile', 'medium', 'small']

function FemaleAvatar({ speaking }) {
  const [viseme, setViseme] = useState('rest')
  const [blinking, setBlinking] = useState(false)

  useEffect(() => {
    if (!speaking) {
      setViseme('rest')
      return
    }
    let i = 0
    const id = setInterval(() => {
      setViseme(VISEME_KEYS[i % VISEME_KEYS.length])
      i++
    }, 135)
    return () => clearInterval(id)
  }, [speaking])

  useEffect(() => {
    let timeoutId
    const blinkOnce = () => {
      setBlinking(true)
      timeoutId = setTimeout(() => setBlinking(false), 140)
    }
    const id = setInterval(blinkOnce, 3800)
    return () => {
      clearInterval(id)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [])

  const v = VISEME_PATHS[viseme]

  return (
    <motion.svg
      viewBox="0 0 240 280"
      className="w-full h-full"
      animate={speaking ? { y: [0, -1.5, 0, 1, 0] } : { y: 0 }}
      transition={speaking ? { duration: 1.6, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
    >
      <defs>
        <radialGradient id="avBg" cx="0.5" cy="0.4" r="0.7">
          <stop offset="0%" stopColor="#eef3ff" />
          <stop offset="100%" stopColor="#c8d4ee" />
        </radialGradient>
        <linearGradient id="avHair" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3d2818" />
          <stop offset="100%" stopColor="#1f1208" />
        </linearGradient>
        <radialGradient id="avSkin" cx="0.5" cy="0.35">
          <stop offset="0%" stopColor="#f8dabe" />
          <stop offset="100%" stopColor="#e3ba93" />
        </radialGradient>
        <linearGradient id="avSuit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3859a8" />
          <stop offset="100%" stopColor="#243d75" />
        </linearGradient>
      </defs>

      <rect width="240" height="280" fill="url(#avBg)" />
      <circle cx="120" cy="120" r="82" fill="rgba(255,255,255,0.35)" />

      {/* Suit / shoulders */}
      <path d="M 20 280 Q 50 215 95 200 L 145 200 Q 190 215 220 280 Z" fill="url(#avSuit)" />
      {/* Suit inner shadow */}
      <path d="M 95 200 L 120 250 L 145 200" fill="#1c2f5c" opacity="0.6" />
      {/* Blouse */}
      <path d="M 105 210 L 120 248 L 135 210 L 130 230 L 120 240 L 110 230 Z" fill="#ffffff" />
      {/* Necklace */}
      <path d="M 102 210 Q 120 226 138 210" stroke="#d4af37" strokeWidth="1.2" fill="none" opacity="0.7" />
      <circle cx="120" cy="220" r="2" fill="#d4af37" />

      {/* Neck */}
      <path d="M 102 178 L 102 208 Q 120 215 138 208 L 138 178 Z" fill="url(#avSkin)" />
      <path d="M 102 196 Q 120 202 138 196" stroke="#c89878" strokeWidth="0.8" fill="none" opacity="0.5" />

      {/* Hair back (long flowing) */}
      <path d="M 60 105 Q 48 195 70 245 L 100 235 Q 92 195 95 150 Z" fill="url(#avHair)" />
      <path d="M 180 105 Q 192 195 170 245 L 140 235 Q 148 195 145 150 Z" fill="url(#avHair)" />

      {/* Face */}
      <ellipse cx="120" cy="125" rx="48" ry="58" fill="url(#avSkin)" />

      {/* Hair top + bangs */}
      <path
        d="M 72 115 Q 64 70 92 56 Q 120 46 150 56 Q 178 70 170 115 Q 165 96 152 95 Q 145 90 132 93 Q 115 96 102 93 Q 88 90 82 95 Q 75 100 72 115 Z"
        fill="url(#avHair)"
      />
      {/* Side hair strands */}
      <path d="M 72 105 Q 60 140 66 170" stroke="url(#avHair)" strokeWidth="14" fill="none" strokeLinecap="round" />
      <path d="M 168 105 Q 180 140 174 170" stroke="url(#avHair)" strokeWidth="14" fill="none" strokeLinecap="round" />

      {/* Ears */}
      <ellipse cx="74" cy="130" rx="5" ry="9" fill="url(#avSkin)" />
      <ellipse cx="166" cy="130" rx="5" ry="9" fill="url(#avSkin)" />
      {/* Earrings */}
      <circle cx="74" cy="140" r="1.8" fill="#d4af37" />
      <circle cx="166" cy="140" r="1.8" fill="#d4af37" />

      {/* Eyebrows */}
      <path d="M 90 116 Q 100 112 110 116" stroke="#2a1a0d" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 130 116 Q 140 112 150 116" stroke="#2a1a0d" strokeWidth="2.5" fill="none" strokeLinecap="round" />

      {/* Eyes */}
      {blinking ? (
        <>
          <path d="M 92 130 Q 100 133 108 130" stroke="#2a1a0d" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 132 130 Q 140 133 148 130" stroke="#2a1a0d" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Left eye */}
          <ellipse cx="100" cy="131" rx="6" ry="7" fill="#fff" />
          <circle cx="100" cy="132" r="4" fill="#5d4a37" />
          <circle cx="100" cy="132" r="2" fill="#1a1006" />
          <circle cx="101.5" cy="130" r="1.3" fill="#fff" />
          {/* Right eye */}
          <ellipse cx="140" cy="131" rx="6" ry="7" fill="#fff" />
          <circle cx="140" cy="132" r="4" fill="#5d4a37" />
          <circle cx="140" cy="132" r="2" fill="#1a1006" />
          <circle cx="141.5" cy="130" r="1.3" fill="#fff" />
          {/* Lashes */}
          <path d="M 94 124 L 92 122" stroke="#2a1a0d" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 100 123 L 100 121" stroke="#2a1a0d" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 106 124 L 108 122" stroke="#2a1a0d" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 134 124 L 132 122" stroke="#2a1a0d" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 140 123 L 140 121" stroke="#2a1a0d" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M 146 124 L 148 122" stroke="#2a1a0d" strokeWidth="1.2" strokeLinecap="round" />
        </>
      )}

      {/* Nose */}
      <path d="M 118 138 Q 116 150 119 154 Q 122 156 123 154 Q 125 150 122 138" stroke="#c4926e" strokeWidth="1.1" fill="rgba(196,146,110,0.18)" />

      {/* Cheek blush */}
      <ellipse cx="88" cy="152" rx="9" ry="6" fill="#f4a4a4" opacity="0.45" />
      <ellipse cx="152" cy="152" rx="9" ry="6" fill="#f4a4a4" opacity="0.45" />

      {/* Mouth - lip sync */}
      <g>
        {/* Inner mouth opening */}
        {v.rx > 0 && (
          <ellipse cx="120" cy="167" rx={v.rx} ry={v.ry} fill="#5a1f1c" />
        )}
        {/* Top lip */}
        <path d={v.top} stroke="#a8534f" strokeWidth="2" fill="rgba(168,83,79,0.5)" strokeLinecap="round" />
        {/* Bottom lip */}
        <path d={v.bottom} stroke="#a8534f" strokeWidth="2.2" fill="rgba(168,83,79,0.7)" strokeLinecap="round" />
      </g>
    </motion.svg>
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

export function AvatarScreen({ isActive, onAction }) {
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
          }, now)
          now += speakDuration
          t(() => setAiSpeaking(false), now)
          now += 600
        } else {
          t(() => {
            setActiveTurnIdx(idx)
            setSentMessages((prev) => [...prev, turn])
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
          <div className="flex-1 flex items-center justify-center px-2 pt-2">
            <div className="relative w-full max-w-45 aspect-6/7 rounded-2xl overflow-hidden" style={{ boxShadow: '0 8px 24px rgba(56,89,168,0.18)' }}>
              <FemaleAvatar speaking={aiSpeaking} />
              {aiSpeaking && (
                <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/90 backdrop-blur" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-[11px] font-semibold text-gray-700">LIVE</span>
                </div>
              )}
            </div>
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
