'use client'

import { useEffect, useRef } from 'react'

/* Scrollable message list for the guided chat intake. Bubble styling and
   the thinking dots mirror ChatScenarioCard so the intake reads as the
   same product the page has been demonstrating. */

const BRAND = '#3859a8'

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2].map((d) => (
        <span
          key={d}
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: '#ffffff',
            opacity: 0.7,
            animation: `typing-dot 1.4s ease-in-out ${d * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  )
}

export function ChatMessages({ messages, reduced }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-2.5 min-h-[300px] max-h-[420px]"
      aria-live="polite"
    >
      {messages.map((msg) => {
        const isBot = msg.role === 'bot'
        return (
          <div
            key={msg.id}
            className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}
            style={reduced ? undefined : { animation: 'sent-bubble-in 0.35s ease-out' }}
          >
            <div
              className={`max-w-[85%] px-3.5 py-2.5 text-[13.5px] leading-snug whitespace-pre-wrap ${
                isBot ? 'rounded-2xl rounded-bl-md text-white' : 'rounded-2xl rounded-br-md text-text'
              }`}
              style={{
                background: isBot ? BRAND : '#f1f3f5',
                boxShadow: isBot ? '0 2px 8px rgba(56,89,168,0.18)' : 'none',
                minHeight: msg.typing ? 36 : undefined,
                display: msg.typing ? 'flex' : undefined,
                alignItems: msg.typing ? 'center' : undefined,
              }}
            >
              {msg.typing ? <ThinkingDots /> : msg.text}
            </div>
          </div>
        )
      })}
    </div>
  )
}
