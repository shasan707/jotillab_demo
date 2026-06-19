'use client'

import { useEffect, useRef, useState } from 'react'
import { Briefcase, Zap, Calendar, Send } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const BRAND = {
  label: 'JotilLabs',
  sublabel: 'AI Assistant',
  color: '#3859a8',
}

const CONVERSATIONS = [
  {
    messages: [
      { role: 'user', text: 'Hi, what does JotilLabs do?' },
      { role: 'ai', text: 'We help businesses automate customer chats and calls 24/7 across voice, web, SMS, and WhatsApp.' },
      { role: 'user', text: 'I run a dental clinic.' },
    ],
    action: { icon: Briefcase, label: 'Industry matched', sublabel: 'Healthcare playbook' },
    finalMsg: 'Perfect. We help 200+ dental practices recover missed calls. Want to see a demo?',
  },
  {
    messages: [
      { role: 'user', text: 'Can JotilLabs work with my HubSpot?' },
      { role: 'ai', text: 'Yes! We sync with HubSpot, Salesforce, and 150+ other tools out of the box.' },
      { role: 'user', text: 'How long does setup take?' },
    ],
    action: { icon: Zap, label: 'Avg. setup time', sublabel: '4 hours, fully managed' },
    finalMsg: 'Most teams are live within a day. Want a personalized walkthrough?',
  },
  {
    messages: [
      { role: 'user', text: 'How much does it cost?' },
      { role: 'ai', text: 'Pricing scales with your call and message volume. Want a custom quote in 5 minutes?' },
      { role: 'user', text: 'Yes, please book a demo.' },
    ],
    action: { icon: Calendar, label: 'Demo booked', sublabel: 'Tomorrow, 2:00 PM' },
    finalMsg: "You're set. A calendar invite is on its way.",
  },
]

function ChatCard({ conversation, isActive, onCycleComplete }) {
  const ActionIcon = conversation.action.icon
  const [phase, setPhase] = useState('idle')
  const [currentRole, setCurrentRole] = useState(null)
  const [typedText, setTypedText] = useState('')
  const [sentItems, setSentItems] = useState([])
  const [sendPulse, setSendPulse] = useState(false)
  const scrollRef = useRef(null)
  const onCycleCompleteRef = useRef(onCycleComplete)

  useEffect(() => {
    onCycleCompleteRef.current = onCycleComplete
  }, [onCycleComplete])

  useEffect(() => {
    if (!isActive) {
      setPhase('idle')
      setCurrentRole(null)
      setTypedText('')
      setSentItems([])
      setSendPulse(false)
      return
    }

    const fullItems = [
      ...conversation.messages.map((m) => ({ kind: 'msg', ...m })),
      { kind: 'action' },
      { kind: 'msg', role: 'ai', text: conversation.finalMsg },
    ]

    const timers = []
    const t = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id }

    setPhase('idle')
    setCurrentRole(null)
    setTypedText('')
    setSentItems([])
    setSendPulse(false)

    let now = 600

    fullItems.forEach((event) => {
      if (event.kind === 'msg') {
        const isAI = event.role === 'ai'
        const text = event.text
        const speed = isAI ? 26 : 32

        if (isAI) {
          const startNow = now
          t(() => {
            setPhase('thinking')
            setCurrentRole('ai')
            setTypedText('')
          }, startNow)
          now += 850
          t(() => setPhase('typing'), now)
        } else {
          const startNow = now
          t(() => {
            setPhase('typing')
            setCurrentRole('user')
            setTypedText('')
          }, startNow)
        }

        const charsStart = now
        text.split('').forEach((_, i) => {
          t(() => setTypedText(text.slice(0, i + 1)), charsStart + (i + 1) * speed)
        })
        now += text.length * speed

        now += 220
        const pulseAt = now
        t(() => setSendPulse(true), pulseAt)
        t(() => setSendPulse(false), pulseAt + 280)

        now += 280
        const role = event.role
        t(() => {
          setSentItems((prev) => [...prev, { kind: 'msg', role, text }])
          setTypedText('')
          setPhase('idle')
          setCurrentRole(null)
        }, now)
        now += 480
      } else if (event.kind === 'action') {
        t(() => {
          setSentItems((prev) => [...prev, { kind: 'action' }])
        }, now)
        now += 1300
      }
    })

    t(() => onCycleCompleteRef.current?.(), now + 2800)

    return () => timers.forEach(clearTimeout)
  }, [isActive, conversation])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [sentItems, phase, typedText])

  const showAvatarRings = phase === 'thinking' && currentRole === 'ai'
  const showAvatarPulse = (phase === 'thinking' || phase === 'typing') && currentRole === 'ai'
  const inputCaretColor = currentRole === 'ai' ? BRAND.color : '#3859a8'

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden" style={{ borderRadius: 30 }}>
      {/* Header */}
      <div
        className="flex items-center gap-2 px-3 shrink-0"
        style={{ paddingTop: 28, paddingBottom: 8, borderBottom: `2px solid ${BRAND.color}15` }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${BRAND.color}, ${BRAND.color}cc)` }}
        >
          <Logo size={18} tone="on-dark" animate={false} />
        </div>
        <div>
          <p className="text-[15px] font-bold leading-tight" style={{ color: BRAND.color }}>{BRAND.label}</p>
          <p className="text-[9px] text-gray-400">{BRAND.sublabel}</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[8px] text-green-600">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 px-3 py-2 overflow-hidden">
        {sentItems.map((item, i) => {
          if (item.kind === 'msg') {
            const isUser = item.role === 'user'
            return (
              <div
                key={`item-${i}`}
                className={`flex mb-3 ${isUser ? 'justify-end' : 'items-end gap-1.5'}`}
                style={{ animation: 'sent-bubble-in 0.4s ease-out' }}
              >
                {!isUser && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
                    style={{ background: `linear-gradient(135deg, ${BRAND.color}, ${BRAND.color}cc)` }}
                  >
                    <Logo size={9} tone="on-dark" animate={false} />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-2.5 py-1.5 text-[10px] leading-[1.4] ${
                    isUser
                      ? 'rounded-xl rounded-br-sm text-gray-900'
                      : 'rounded-xl rounded-bl-sm text-white'
                  }`}
                  style={{ backgroundColor: isUser ? '#f1f3f5' : BRAND.color }}
                >
                  {item.text}
                </div>
              </div>
            )
          }
          return (
            <div
              key={`item-${i}`}
              className="flex flex-col items-center py-2 my-1"
              style={{ animation: 'sent-bubble-in 0.4s ease-out' }}
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center"
                style={{ background: `linear-gradient(135deg, ${BRAND.color}18, ${BRAND.color}08)` }}
              >
                <ActionIcon size={14} strokeWidth={1.5} style={{ color: BRAND.color }} />
              </div>
              <div className="flex items-center gap-1 mt-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-[8px] font-semibold" style={{ color: BRAND.color }}>
                  {conversation.action.label}
                </span>
                <span className="text-[7px] text-gray-400">{conversation.action.sublabel}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="shrink-0 px-3 py-2 border-t border-gray-100 flex items-center gap-2">
        <div className="relative shrink-0" style={{ width: 24, height: 24 }}>
          {showAvatarRings && [0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: 24, height: 24,
                top: 0, left: 0,
                border: `1.5px solid ${BRAND.color}`,
                opacity: 0.35 - i * 0.08,
                animation: `ring-expand 1.4s ease-out ${i * 0.35}s infinite`,
              }}
            />
          ))}
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center relative"
            style={{
              background: `linear-gradient(135deg, ${BRAND.color}, ${BRAND.color}cc)`,
              animation: showAvatarPulse ? 'orb-pulse 1.2s ease-in-out infinite' : 'none',
            }}
          >
            <Logo size={10} tone="on-dark" animate={false} />
          </div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-full px-3 py-1 text-[9px] flex items-center min-h-5">
          {phase === 'thinking' ? (
            <span className="flex items-center gap-0.75">
              {[0, 1, 2].map((d) => (
                <span
                  key={d}
                  className="w-1 h-1 rounded-full"
                  style={{
                    backgroundColor: BRAND.color,
                    opacity: 0.6,
                    animation: `typing-dot 1.4s ease-in-out ${d * 0.2}s infinite`,
                  }}
                />
              ))}
            </span>
          ) : phase === 'typing' ? (
            <span className="text-gray-800">
              {typedText}
              <span
                className="inline-block w-px ml-px align-middle"
                style={{
                  height: 9,
                  backgroundColor: inputCaretColor,
                  animation: 'caret-blink 0.8s step-end infinite',
                }}
              />
            </span>
          ) : (
            <span className="text-gray-400">Ask anything about JotilLabs...</span>
          )}
        </div>
        <div
          className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
          style={{
            backgroundColor: BRAND.color,
            transform: sendPulse ? 'scale(1.18)' : 'scale(1)',
            boxShadow: sendPulse ? `0 0 0 4px ${BRAND.color}33` : 'none',
            transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
          }}
        >
          <Send className="w-3 h-3 text-white" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}

export function MessengerScreen({ isActive }) {
  const [convIdx, setConvIdx] = useState(0)

  return (
    <div className="relative" style={{ width: 300, height: 640 }}>
      <div
        className="absolute inset-0"
        style={{
          boxShadow: '0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
          borderRadius: 30,
          overflow: 'hidden',
        }}
      >
        <ChatCard
          key={convIdx}
          conversation={CONVERSATIONS[convIdx]}
          isActive={isActive}
          onCycleComplete={() => setConvIdx((i) => (i + 1) % CONVERSATIONS.length)}
        />
      </div>
    </div>
  )
}
