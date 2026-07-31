'use client'

import { useState, useEffect } from 'react'
import { MessageSquare, Globe, Mail, MessageCircle } from 'lucide-react'
import { getBrandLogo } from '@/components/ui/BrandLogos'

const BRAND = '#3859a8'

/* Channel logos shown on the second "page" of the card. Brand marks come from
   BrandLogos; generic channels use lucide icons. */
const CHANNELS = [
  { name: 'WhatsApp', brand: 'WhatsApp' },
  { name: 'Microsoft Teams', brand: 'Microsoft Teams' },
  { name: 'Slack', brand: 'Slack' },
  { name: 'SMS', icon: MessageSquare },
  { name: 'Web Chat', icon: Globe },
  { name: 'Email', icon: Mail },
]

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

/* One card for ALL text channels: page one plays a live chat conversation
   (the industry's SMS and web scenarios take turns), page two shows the
   channels that same conversation can arrive from. Loops forever. */
export function ChatScenarioCard({ scenarios }) {
  const [convoIdx, setConvoIdx] = useState(0) // which scenario is playing
  const [page, setPage] = useState('chat') // 'chat' | 'channels'
  const [revealed, setRevealed] = useState([])
  const [activeIdx, setActiveIdx] = useState(-1)
  const [activePhase, setActivePhase] = useState(null) // 'thinking' | 'typing' | null
  const [typedText, setTypedText] = useState('')

  const scenario = scenarios[convoIdx % scenarios.length]

  useEffect(() => {
    const timers = []
    const t = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id }

    // Play the conversation, then flip to the channels page, then advance to
    // the next conversation.
    setPage('chat')
    setRevealed([])
    setActiveIdx(-1)
    setActivePhase(null)
    setTypedText('')

    let now = 600
    scenario.messages.forEach((msg, i) => {
      const isAI = msg.from === 'ai'
      if (isAI) {
        t(() => {
          setRevealed((prev) => [...prev, msg])
          setActiveIdx(i)
          setActivePhase('thinking')
          setTypedText('')
        }, now)
        now += 700
        t(() => setActivePhase('typing'), now)
        const speed = 25
        msg.text.split('').forEach((_, charI) => {
          t(() => setTypedText(msg.text.slice(0, charI + 1)), now + (charI + 1) * speed)
        })
        now += msg.text.length * speed + 100
        t(() => { setActivePhase(null); setActiveIdx(-1) }, now)
        now += 500
      } else {
        t(() => {
          setRevealed((prev) => [...prev, msg])
          setActiveIdx(i)
          setActivePhase(null)
        }, now)
        now += 700
      }
    })

    // Flip to the channels page, hold it, then start the next conversation.
    t(() => setPage('channels'), now + 1600)
    t(() => setConvoIdx((v) => v + 1), now + 1600 + 4200)

    return () => timers.forEach(clearTimeout)
  }, [scenario])

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
          <MessageCircle size={14} color={BRAND} strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: BRAND }}>
            Chat
          </p>
          <p className="text-sm font-bold text-text leading-tight truncate">
            {page === 'chat' ? scenario.title : 'One inbox, every channel'}
          </p>
        </div>
      </div>

      {page === 'chat' ? (
        /* Page one: the conversation */
        <div className="flex-1 flex flex-col gap-2 px-4 py-4 min-h-[280px]">
          {revealed.map((msg, i) => {
            const isAI = msg.from === 'ai'
            const isActive = i === activeIdx
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
      ) : (
        /* Page two: the channels this same conversation can arrive from */
        <div
          className="flex-1 flex flex-col items-center justify-center gap-5 px-4 py-4 min-h-[280px]"
          style={{ animation: 'sent-bubble-in 0.4s ease-out' }}
        >
          <p className="text-sm text-text-secondary text-center max-w-[240px]">
            The same assistant answers wherever your customers write.
          </p>
          <div className="grid grid-cols-3 gap-3">
            {CHANNELS.map((ch) => {
              const Brand = ch.brand ? getBrandLogo(ch.brand) : null
              const Icon = ch.icon
              return (
                <div
                  key={ch.name}
                  className="flex flex-col items-center gap-1.5 rounded-xl bg-white px-3 py-3"
                  style={{
                    border: '1px solid rgba(15,17,41,0.06)',
                    boxShadow: '0 4px 14px rgba(56,89,168,0.07)',
                  }}
                >
                  <span className="flex h-7 w-7 items-center justify-center [&_svg]:h-6 [&_svg]:w-6">
                    {Brand ? <Brand /> : <Icon size={22} strokeWidth={1.6} style={{ color: BRAND }} />}
                  </span>
                  <span className="text-[10px] font-semibold text-text-secondary whitespace-nowrap">
                    {ch.name}
                  </span>
                </div>
              )
            })}
          </div>
          <p className="text-[11px] text-text-secondary">Replies in seconds on all of them.</p>
        </div>
      )}
    </div>
  )
}
