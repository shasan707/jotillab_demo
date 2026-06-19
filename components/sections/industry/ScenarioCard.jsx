'use client'

import { useState, useEffect } from 'react'
import { Phone, MessageSquare, Globe, Mail } from 'lucide-react'

const CHANNEL_META = {
  voice: { icon: Phone, label: 'Voice' },
  sms: { icon: MessageSquare, label: 'SMS' },
  web: { icon: Globe, label: 'Web Chat' },
  email: { icon: Mail, label: 'Email' },
}

const BRAND = '#3859a8'

function WaveBars({ color }) {
  return (
    <div className="flex items-center gap-[3px] h-4">
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <span
          key={i}
          className="w-[3px] rounded-full"
          style={{
            backgroundColor: color,
            height: '100%',
            animation: `wave-bar 0.9s ease-in-out ${i * 0.08}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

function ThinkingDots({ color }) {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((d) => (
        <span
          key={d}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: color,
            opacity: 0.7,
            animation: `typing-dot 1.4s ease-in-out ${d * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export function ScenarioCard({ scenario }) {
  const meta = CHANNEL_META[scenario.channel] || CHANNEL_META.voice
  const ChannelIcon = meta.icon
  const isVoice = scenario.channel === 'voice'

  const [revealed, setRevealed] = useState([])
  const [activeIdx, setActiveIdx] = useState(-1)
  const [activePhase, setActivePhase] = useState(null) // 'wave' | 'thinking' | 'typing' | null
  const [typedText, setTypedText] = useState('')

  useEffect(() => {
    const timers = []
    const t = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id }

    const runLoop = () => {
      setRevealed([])
      setActiveIdx(-1)
      setActivePhase(null)
      setTypedText('')

      let now = 600

      scenario.messages.forEach((msg, i) => {
        if (isVoice) {
          // Voice: each bubble shows wave bars first, then settles to text
          t(() => {
            setRevealed((prev) => [...prev, msg])
            setActiveIdx(i)
            setActivePhase('wave')
          }, now)
          now += 1100
          t(() => {
            setActivePhase(null)
            setActiveIdx(-1)
          }, now)
          now += 500
        } else {
          // SMS / Web: AI types char-by-char with thinking dots first; user appears instantly
          const isAI = msg.from === 'ai'
          if (isAI) {
            // Thinking dots
            t(() => {
              setRevealed((prev) => [...prev, msg])
              setActiveIdx(i)
              setActivePhase('thinking')
              setTypedText('')
            }, now)
            now += 700
            // Switch to typing
            t(() => setActivePhase('typing'), now)
            const speed = 25
            msg.text.split('').forEach((_, charI) => {
              t(() => setTypedText(msg.text.slice(0, charI + 1)), now + (charI + 1) * speed)
            })
            now += msg.text.length * speed + 100
            t(() => {
              setActivePhase(null)
              setActiveIdx(-1)
            }, now)
            now += 500
          } else {
            t(() => {
              setRevealed((prev) => [...prev, msg])
              setActiveIdx(i)
              setActivePhase(null)
            }, now)
            now += 700
          }
        }
      })

      t(runLoop, now + 2500)
    }

    runLoop()
    return () => timers.forEach(clearTimeout)
  }, [scenario, isVoice])

  return (
    <div
      className="rounded-[20px] bg-white overflow-hidden flex flex-col h-full"
      style={{
        border: '1px solid rgba(15,17,41,0.06)',
        boxShadow: '0 1px 2px rgba(15,17,41,0.04), 0 8px 24px rgba(15,17,41,0.04)',
      }}
    >
      {/* Channel header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-black/5"
        style={{ background: 'linear-gradient(180deg, #f8faff, #ffffff)' }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(56,89,168,0.10)' }}
        >
          <ChannelIcon size={14} color={BRAND} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: BRAND }}>
            {meta.label}
          </p>
          <p className="text-sm font-bold text-text leading-tight truncate">{scenario.title}</p>
        </div>
      </div>

      {/* Conversation */}
      <div className="flex-1 flex flex-col gap-2 px-4 py-4 min-h-[280px]">
        {revealed.map((msg, i) => {
          const isAI = msg.from === 'ai'
          const isActive = i === activeIdx

          // Voice: wave bars while active, then text settles in
          if (isVoice) {
            const showWave = isActive && activePhase === 'wave'
            return (
              <div
                key={i}
                className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
                style={{ animation: 'sent-bubble-in 0.35s ease-out' }}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 text-[12.5px] leading-snug ${
                    isAI ? 'rounded-2xl rounded-bl-md text-white' : 'rounded-2xl rounded-br-md text-text'
                  }`}
                  style={{
                    background: isAI ? BRAND : '#f1f3f5',
                    boxShadow: isAI ? '0 2px 8px rgba(56,89,168,0.18)' : 'none',
                    minHeight: 32,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showWave ? <WaveBars color={isAI ? '#ffffff' : BRAND} /> : msg.text}
                </div>
              </div>
            )
          }

          // SMS / Web: typing animation for AI, instant for user
          const showThinking = isActive && activePhase === 'thinking' && isAI
          const showTyping = isActive && activePhase === 'typing' && isAI
          const text = showTyping ? typedText : showThinking ? '' : msg.text

          return (
            <div
              key={i}
              className={`flex ${isAI ? 'justify-start' : 'justify-end'}`}
              style={{ animation: 'sent-bubble-in 0.35s ease-out' }}
            >
              <div
                className={`max-w-[85%] px-3 py-2 text-[12.5px] leading-snug ${
                  isAI ? 'rounded-2xl rounded-bl-md text-white' : 'rounded-2xl rounded-br-md text-text'
                }`}
                style={{
                  background: isAI ? BRAND : '#f1f3f5',
                  boxShadow: isAI ? '0 2px 8px rgba(56,89,168,0.18)' : 'none',
                  minHeight: showThinking ? 32 : undefined,
                  display: showThinking ? 'flex' : undefined,
                  alignItems: showThinking ? 'center' : undefined,
                }}
              >
                {showThinking ? (
                  <ThinkingDots color="#ffffff" />
                ) : (
                  <>
                    {text}
                    {showTyping && text.length < msg.text.length && (
                      <span
                        className="inline-block w-px ml-px align-middle"
                        style={{
                          height: 11,
                          backgroundColor: 'rgba(255,255,255,0.85)',
                          animation: 'caret-blink 0.8s step-end infinite',
                        }}
                      />
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
