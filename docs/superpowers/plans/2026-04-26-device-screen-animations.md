# Device Screen Animations & Glass Composition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace flat device mockups with a premium 3D glass composition -- tilted transparent devices with floating action cards behind them and cinematic looping screen animations inside.

**Architecture:** SlideDevice wraps each device in a 3D scene with FloatingCards behind it. Devices get glass bodies with CSS backdrop-filter. Each screen component runs a time-based Framer Motion loop and emits action events that highlight the corresponding floating card. The outer GSAP ScrollTrigger (unchanged) controls which slide is visible.

**Tech Stack:** Framer Motion (screen auto-play + card highlights), CSS transforms (3D tilt + perspective), CSS backdrop-filter (glass), existing GSAP ScrollTrigger (outer scroll)

---

### Task 1: Card Data + FloatingCards Component

**Files:**
- Create: `components/sections/showcase/cards/cardData.js`
- Create: `components/sections/showcase/cards/FloatingCards.jsx`

- [ ] **Step 1: Create card data definitions**

```js
// components/sections/showcase/cards/cardData.js
import { Calendar, MessageSquare, UserPlus, MessageCircle, Users, UserCheck, Mail, Phone, BarChart3, Brain, Inbox, Camera, Route, Sparkles } from 'lucide-react'

export const FLOATING_CARDS = {
  receptionist: [
    { id: 'calendar', icon: Calendar, label: 'Thu 10:00 AM', sublabel: 'Appointment booked', top: '-16px', right: '-44px', rotate: '3deg' },
    { id: 'sms', icon: MessageSquare, label: 'Confirmation sent', sublabel: 'SMS delivered', bottom: '80px', right: '-48px', rotate: '-2deg' },
    { id: 'crm', icon: UserPlus, label: 'Sarah Mitchell', sublabel: 'Added to CRM', top: '60px', left: '-38px', rotate: '-4deg' },
  ],
  messenger: [
    { id: 'whatsapp', icon: MessageCircle, label: 'New message', sublabel: 'WhatsApp', top: '-16px', right: '-44px', rotate: '3deg' },
    { id: 'teams', icon: Users, label: 'Channel synced', sublabel: 'Teams', bottom: '80px', right: '-48px', rotate: '-2deg' },
    { id: 'handoff', icon: UserCheck, label: 'Escalated', sublabel: 'Human agent', top: '60px', left: '-38px', rotate: '-4deg' },
  ],
  outreach: [
    { id: 'email', icon: Mail, label: 'Drip sent', sublabel: 'Email sequence', top: '-16px', right: '-44px', rotate: '3deg' },
    { id: 'dialer', icon: Phone, label: 'Auto-dial', sublabel: 'Queued', bottom: '80px', right: '-48px', rotate: '-2deg' },
    { id: 'analytics', icon: BarChart3, label: '3x meetings', sublabel: 'Booked', top: '60px', left: '-38px', rotate: '-4deg' },
  ],
  space: [
    { id: 'model', icon: Brain, label: 'GPT-4o', sublabel: 'Generating', top: '-16px', right: '-52px', rotate: '3deg' },
    { id: 'perf', icon: BarChart3, label: 'Performance', sublabel: '94% quality', bottom: '60px', right: '-52px', rotate: '-2deg' },
    { id: 'inbox', icon: Inbox, label: 'Unified inbox', sublabel: '12 conversations', top: '50px', left: '-42px', rotate: '-4deg' },
  ],
  avatar: [
    { id: 'video', icon: Camera, label: 'Live presence', sublabel: 'Active', top: '-16px', right: '-52px', rotate: '3deg' },
    { id: 'onboarding', icon: Route, label: 'Guided selling', sublabel: 'Step 2 of 4', bottom: '60px', right: '-52px', rotate: '-2deg' },
    { id: 'personality', icon: Sparkles, label: 'Brand voice', sublabel: 'Custom tone', top: '50px', left: '-42px', rotate: '-4deg' },
  ],
}
```

- [ ] **Step 2: Create FloatingCards component**

```jsx
// components/sections/showcase/cards/FloatingCards.jsx
'use client'

import { motion } from 'framer-motion'
import { FLOATING_CARDS } from './cardData'

export function FloatingCards({ slug, highlightedCards = new Set() }) {
  const cards = FLOATING_CARDS[slug]
  if (!cards) return null

  return (
    <>
      {cards.map((card) => {
        const Icon = card.icon
        const isHighlighted = highlightedCards.has(card.id)

        const posStyle = {}
        if (card.top) posStyle.top = card.top
        if (card.bottom) posStyle.bottom = card.bottom
        if (card.left) posStyle.left = card.left
        if (card.right) posStyle.right = card.right

        return (
          <motion.div
            key={card.id}
            className="absolute z-0 hidden md:flex"
            style={{
              ...posStyle,
              transform: `rotate(${card.rotate})`,
            }}
            animate={{
              opacity: isHighlighted ? 1 : 0.4,
              scale: isHighlighted ? 1.05 : 0.95,
            }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <div
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
              style={{
                background: 'rgba(255, 255, 255, 0.92)',
                backdropFilter: 'blur(8px)',
                border: `1px solid ${isHighlighted ? 'rgba(56, 89, 168, 0.25)' : 'rgba(0,0,0,0.06)'}`,
                boxShadow: isHighlighted
                  ? '0 4px 20px rgba(56, 89, 168, 0.15), 0 2px 8px rgba(0,0,0,0.06)'
                  : '0 2px 8px rgba(0,0,0,0.04)',
                transition: 'border-color 0.3s, box-shadow 0.3s',
              }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                style={{
                  background: isHighlighted ? 'rgba(56, 89, 168, 0.1)' : 'rgba(0,0,0,0.03)',
                  transition: 'background 0.3s',
                }}
              >
                <Icon
                  size={15}
                  strokeWidth={1.5}
                  style={{
                    color: isHighlighted ? '#3859a8' : '#9ca3af',
                    transition: 'color 0.3s',
                  }}
                />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-gray-800 leading-tight">{card.label}</p>
                <p className="text-[9px] text-gray-400 leading-tight">{card.sublabel}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </>
  )
}
```

- [ ] **Step 3: Verify build**

Run: `cd "/Users/qratul/research_and_dev/jotil/jotil website temp/jotil_labs_website" && npx next build 2>&1 | tail -5`
Expected: Build succeeds (components not imported yet, just created)

- [ ] **Step 4: Commit**

```bash
git add components/sections/showcase/cards/
git commit -m "feat(showcase): add floating card data and component"
```

---

### Task 2: Glass Device Mockups

**Files:**
- Modify: `components/sections/showcase/devices/PhoneMockup.jsx`
- Modify: `components/sections/showcase/devices/LaptopMockup.jsx`
- Modify: `components/sections/showcase/devices/MonitorMockup.jsx`

- [ ] **Step 1: Update PhoneMockup with glass body**

Replace the entire file with:

```jsx
// components/sections/showcase/devices/PhoneMockup.jsx
export function PhoneMockup({ children, vibrate = false, glass = false }) {
  return (
    <div className="relative" style={{ perspective: 1200 }}>
      {/* Side buttons */}
      <div className="absolute left-[-2.5px] top-[90px] w-[3px] h-[20px] rounded-l-sm" style={{ background: 'linear-gradient(180deg, #3a3a40, #2a2a30)' }} />
      <div className="absolute left-[-2.5px] top-[124px] w-[3px] h-[32px] rounded-l-sm" style={{ background: 'linear-gradient(180deg, #3a3a40, #2a2a30)' }} />
      <div className="absolute left-[-2.5px] top-[164px] w-[3px] h-[32px] rounded-l-sm" style={{ background: 'linear-gradient(180deg, #3a3a40, #2a2a30)' }} />
      <div className="absolute right-[-2.5px] top-[130px] w-[3px] h-[40px] rounded-r-sm" style={{ background: 'linear-gradient(180deg, #3a3a40, #2a2a30)' }} />

      <div
        className={`w-[280px] h-[580px] rounded-[46px] p-[10px] relative ${vibrate ? 'animate-phone-vibrate' : ''}`}
        style={{
          background: glass
            ? 'rgba(20, 20, 24, 0.55)'
            : 'linear-gradient(160deg, #2c2c30 0%, #1c1c20 40%, #0e0e12 100%)',
          backdropFilter: glass ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: glass ? 'blur(12px)' : 'none',
          boxShadow: [
            'inset 0 1px 0 rgba(255,255,255,0.08)',
            'inset 0 -1px 0 rgba(0,0,0,0.3)',
            '0 1px 2px rgba(0,0,0,0.15)',
            '0 4px 12px rgba(15,17,41,0.15)',
            '0 12px 32px rgba(15,17,41,0.2)',
            '0 32px 64px rgba(15,17,41,0.18)',
          ].join(', '),
        }}
      >
        <div className="absolute top-0 left-[25%] right-[25%] h-px rounded-full" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />

        <div className="absolute top-[12px] left-1/2 -translate-x-1/2 z-10 flex items-center justify-center" style={{ width: 92, height: 26, borderRadius: 13, background: glass ? 'rgba(10,10,14,0.8)' : '#0a0a0e' }}>
          <div className="rounded-full" style={{ width: 8, height: 8, background: 'radial-gradient(circle at 35% 35%, #1e1e3a, #0a0a0e)', boxShadow: 'inset 0 0 2px rgba(100,100,180,0.2)' }} />
        </div>

        <div className="w-full h-full rounded-[36px] overflow-hidden bg-white relative">
          {children}
          <div className="absolute inset-0 pointer-events-none z-10" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 35%, transparent 65%, rgba(255,255,255,0.02) 100%)' }} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Update LaptopMockup with glass body**

Replace the entire file with:

```jsx
// components/sections/showcase/devices/LaptopMockup.jsx
export function LaptopMockup({ children, glass = false }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-[480px] rounded-t-xl overflow-hidden relative"
        style={{
          border: glass ? '2px solid rgba(26, 26, 30, 0.5)' : '2px solid #1a1a1e',
          borderBottom: 'none',
          boxShadow: [
            '0 4px 12px rgba(15,17,41,0.12)',
            '0 12px 32px rgba(15,17,41,0.18)',
            '0 32px 64px rgba(15,17,41,0.14)',
          ].join(', '),
        }}
      >
        <div
          className="flex items-center gap-2 px-4 py-2.5 border-b border-black/5"
          style={{
            background: glass
              ? 'rgba(246, 246, 246, 0.75)'
              : 'linear-gradient(180deg, #f8f8f8, #f0f0f0)',
            backdropFilter: glass ? 'blur(12px)' : 'none',
            WebkitBackdropFilter: glass ? 'blur(12px)' : 'none',
          }}
        >
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
          </div>
          <div className="flex-1 mx-6">
            <div className="bg-white/80 rounded-md px-3 py-1 text-[10px] text-gray-400 text-center border border-black/5">
              app.jotillabs.com
            </div>
          </div>
        </div>
        <div className="bg-white aspect-[16/10] overflow-hidden relative">
          {children}
        </div>
      </div>
      <div
        className="w-[520px] h-[14px] rounded-b-lg"
        style={{
          background: glass
            ? 'linear-gradient(180deg, rgba(200,200,204,0.7), rgba(176,176,180,0.7))'
            : 'linear-gradient(180deg, #c8c8cc, #b0b0b4)',
          boxShadow: '0 2px 6px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.3)',
          backdropFilter: glass ? 'blur(8px)' : 'none',
          WebkitBackdropFilter: glass ? 'blur(8px)' : 'none',
        }}
      />
    </div>
  )
}
```

- [ ] **Step 3: Update MonitorMockup with glass body**

Replace the entire file with:

```jsx
// components/sections/showcase/devices/MonitorMockup.jsx
export function MonitorMockup({ children, glass = false }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-[460px] rounded-xl overflow-hidden relative"
        style={{
          border: glass ? '2px solid rgba(26, 26, 30, 0.5)' : '2px solid #1a1a1e',
          boxShadow: [
            'inset 0 0 0 1px rgba(255,255,255,0.04)',
            '0 4px 12px rgba(15,17,41,0.12)',
            '0 12px 32px rgba(15,17,41,0.18)',
            '0 32px 64px rgba(15,17,41,0.14)',
          ].join(', '),
        }}
      >
        <div className="bg-white aspect-[16/10] overflow-hidden relative">
          {children}
        </div>
        <div className="h-[6px] flex items-center justify-center" style={{ background: glass ? 'rgba(42, 42, 46, 0.6)' : 'linear-gradient(180deg, #2a2a2e, #1a1a1e)' }} />
      </div>
      <div className="w-[60px] h-[28px]" style={{ background: glass ? 'rgba(192, 192, 196, 0.6)' : 'linear-gradient(90deg, #c0c0c4, #d4d4d8, #c0c0c4)' }} />
      <div className="w-[120px] h-[6px] rounded-b-md" style={{ background: 'linear-gradient(180deg, #c8c8cc, #b0b0b4)', boxShadow: '0 2px 4px rgba(0,0,0,0.08)' }} />
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/sections/showcase/devices/
git commit -m "feat(showcase): add glass mode to device mockups"
```

---

### Task 3: SlideDevice Integration

**Files:**
- Modify: `components/sections/showcase/SlideDevice.jsx`

- [ ] **Step 1: Rewrite SlideDevice with glass composition**

Replace the entire file with:

```jsx
// components/sections/showcase/SlideDevice.jsx
'use client'

import { useState, useCallback, useRef } from 'react'
import { PhoneMockup } from './devices/PhoneMockup'
import { LaptopMockup } from './devices/LaptopMockup'
import { MonitorMockup } from './devices/MonitorMockup'
import { FloatingCards } from './cards/FloatingCards'
import { ReceptionistScreen } from './screens/ReceptionistScreen'
import { MessengerScreen } from './screens/MessengerScreen'
import { OutreachScreen } from './screens/OutreachScreen'
import { SpaceScreen } from './screens/SpaceScreen'
import { AvatarScreen } from './screens/AvatarScreen'

const SCREENS = {
  receptionist: ReceptionistScreen,
  messenger: MessengerScreen,
  outreach: OutreachScreen,
  space: SpaceScreen,
  avatar: AvatarScreen,
}

const DEVICES = {
  phone: PhoneMockup,
  laptop: LaptopMockup,
  monitor: MonitorMockup,
}

const TILT = {
  phone: 'perspective(1200px) rotateY(-8deg) rotateX(4deg)',
  laptop: 'perspective(1400px) rotateY(-6deg) rotateX(3deg)',
  monitor: 'perspective(1400px) rotateY(-5deg) rotateX(2deg)',
}

export function SlideDevice({ slug, deviceType, isActive }) {
  const Device = DEVICES[deviceType]
  const Screen = SCREENS[slug]
  const vibrate = deviceType === 'phone' && slug === 'receptionist'
  const [highlightedCards, setHighlightedCards] = useState(new Set())
  const timersRef = useRef({})

  const onAction = useCallback((cardId) => {
    setHighlightedCards((prev) => new Set([...prev, cardId]))
    if (timersRef.current[cardId]) clearTimeout(timersRef.current[cardId])
    timersRef.current[cardId] = setTimeout(() => {
      setHighlightedCards((prev) => {
        const next = new Set(prev)
        next.delete(cardId)
        return next
      })
    }, 1800)
  }, [])

  return (
    <div
      className="relative flex justify-center items-center scale-[0.85] md:scale-100 origin-center"
      style={{ transformStyle: 'preserve-3d' }}
      data-device
    >
      <FloatingCards slug={slug} highlightedCards={highlightedCards} />

      <div
        className="relative z-10 will-change-transform"
        style={{ transform: TILT[deviceType] }}
      >
        <Device vibrate={vibrate && isActive} glass>
          <Screen isActive={isActive} onAction={onAction} />
        </Device>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify build**

Run: `cd "/Users/qratul/research_and_dev/jotil/jotil website temp/jotil_labs_website" && npx next build 2>&1 | tail -5`
Expected: Build succeeds. Screen components need `onAction` prop added but won't break (unused prop in JSX).

- [ ] **Step 3: Commit**

```bash
git add components/sections/showcase/SlideDevice.jsx
git commit -m "feat(showcase): integrate glass composition and floating cards in SlideDevice"
```

---

### Task 4: Ring Animation CSS Keyframes

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add ring-pulse keyframe after the existing wave-bar keyframe**

Add at the end of the keyframes section (after `@keyframes typing-dot`):

```css
@keyframes ring-expand {
  0% {
    transform: scale(0.8);
    opacity: 0.6;
  }
  100% {
    transform: scale(2.2);
    opacity: 0;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add app/globals.css
git commit -m "feat(showcase): add ring-expand keyframe for incoming call animation"
```

---

### Task 5: ReceptionistScreen Rewrite

**Files:**
- Rewrite: `components/sections/showcase/screens/ReceptionistScreen.jsx`

- [ ] **Step 1: Rewrite with cinematic 4-phase loop**

Replace the entire file with:

```jsx
// components/sections/showcase/screens/ReceptionistScreen.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneCall, PhoneOff, Check } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const CONVERSATION = [
  { role: 'ai', text: 'Good morning! How can I help you today?' },
  { role: 'caller', text: "I'd like to schedule a consultation." },
  { role: 'ai', text: 'I have Thursday at 10 AM open. Does that work?' },
  { role: 'caller', text: 'Thursday at 10 works great.' },
]

const ACTIONS = [
  { id: 'calendar', label: 'Appointment booked', delay: 7400 },
  { id: 'sms', label: 'Confirmation SMS sent', delay: 8000 },
  { id: 'crm', label: 'Contact saved to CRM', delay: 8600 },
]

const FINAL_MSG = { role: 'ai', text: "All set! You'll get a confirmation shortly." }

const LOOP_DURATION = 11000

function RingingPhase() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#3859a8] to-[#2a4688] text-white">
      <div className="relative mb-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border-2 border-white/20"
            style={{
              animation: `ring-expand 2s ease-out ${i * 0.5}s infinite`,
              width: 72,
              height: 72,
              top: '50%',
              left: '50%',
              marginTop: -36,
              marginLeft: -36,
            }}
          />
        ))}
        <div className="w-[72px] h-[72px] rounded-full bg-white/15 flex items-center justify-center">
          <Logo size={36} tone="on-dark" animate={false} />
        </div>
      </div>
      <p className="text-sm font-semibold mt-2">JotilLabs AI</p>
      <p className="text-[11px] text-white/60 mt-0.5">Incoming Call...</p>

      <div className="flex gap-12 mt-10">
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-12 h-12 rounded-full bg-red-500/90 flex items-center justify-center">
            <PhoneOff size={18} strokeWidth={1.5} />
          </div>
          <span className="text-[9px] text-white/50">Decline</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center"
          >
            <PhoneCall size={18} strokeWidth={1.5} />
          </motion.div>
          <span className="text-[9px] text-white/50">Accept</span>
        </div>
      </div>
    </div>
  )
}

function ActiveCallPhase({ visibleLines, actions, aiSpeaking }) {
  return (
    <div className="w-full h-full flex flex-col bg-white text-[11px]">
      {/* Call header */}
      <div className="pt-8 pb-2 px-4 text-center" style={{ background: 'linear-gradient(to bottom, #3859a8, #2a4688)' }}>
        <p className="font-semibold text-sm text-white">Sarah Mitchell</p>
        <p className="text-[10px] text-white/60 mt-0.5">JotilLabs AI Answering</p>
        {/* Waveform */}
        <div className="flex items-center justify-center gap-[3px] mt-2 mb-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full"
              style={{
                height: 16,
                backgroundColor: 'rgba(255,255,255,0.7)',
                animation: aiSpeaking ? `wave-bar 1.2s ease-in-out ${i * 0.12}s infinite` : 'none',
                transform: aiSpeaking ? undefined : 'scaleY(0.3)',
                transition: 'transform 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Chat bubbles */}
      <div className="flex-1 px-3 py-2 overflow-hidden">
        <AnimatePresence>
          {CONVERSATION.slice(0, visibleLines).map((line, i) => {
            const isAI = line.role === 'ai'
            return (
              <motion.div
                key={`msg-${i}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={`flex mb-1.5 ${isAI ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] px-2.5 py-1.5 text-[10.5px] leading-[1.4] ${
                    isAI ? 'rounded-xl rounded-bl-sm bg-[#f1f3f5] text-gray-900' : 'rounded-xl rounded-br-sm text-white'
                  }`}
                  style={isAI ? {} : { backgroundColor: '#3859a8' }}
                >
                  {line.text}
                </div>
              </motion.div>
            )
          })}

          {/* Action indicators */}
          {actions.map((action, i) => (
            <motion.div
              key={`action-${action.id}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-center gap-1.5 py-1"
            >
              <div className="w-3.5 h-3.5 rounded-full bg-green-500/10 flex items-center justify-center">
                <Check size={8} strokeWidth={2.5} className="text-green-600" />
              </div>
              <span className="text-[9px] text-gray-400">{action.label}</span>
            </motion.div>
          ))}

          {/* Final AI message */}
          {actions.length === ACTIONS.length && (
            <motion.div
              key="final"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex justify-start mb-1.5"
            >
              <div className="max-w-[80%] px-2.5 py-1.5 text-[10.5px] leading-[1.4] rounded-xl rounded-bl-sm bg-[#f1f3f5] text-gray-900">
                {FINAL_MSG.text}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export function ReceptionistScreen({ isActive, onAction }) {
  const [phase, setPhase] = useState('ring')
  const [visibleLines, setVisibleLines] = useState(0)
  const [firedActions, setFiredActions] = useState([])
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const loopRef = useRef(null)

  useEffect(() => {
    if (!isActive) {
      setPhase('ring')
      setVisibleLines(0)
      setFiredActions([])
      setAiSpeaking(false)
      if (loopRef.current) loopRef.current.forEach(clearTimeout)
      return
    }

    const timers = []
    const schedule = (fn, ms) => {
      const id = setTimeout(fn, ms)
      timers.push(id)
      return id
    }

    const runLoop = () => {
      setPhase('ring')
      setVisibleLines(0)
      setFiredActions([])
      setAiSpeaking(false)

      // Phase 2: Connect
      schedule(() => setPhase('connect'), 2200)
      schedule(() => setPhase('active'), 3000)

      // Conversation bubbles
      schedule(() => { setAiSpeaking(true) }, 3000)
      schedule(() => { setVisibleLines(1); setAiSpeaking(false) }, 3600)
      schedule(() => setVisibleLines(2), 4200)
      schedule(() => { setAiSpeaking(true) }, 4800)
      schedule(() => { setVisibleLines(3); setAiSpeaking(false) }, 5400)
      schedule(() => setVisibleLines(4), 6600)

      // Actions
      ACTIONS.forEach((action) => {
        schedule(() => {
          setFiredActions((prev) => [...prev, action])
          if (onAction) onAction(action.id)
        }, action.delay)
      })

      // Loop
      schedule(runLoop, LOOP_DURATION)
    }

    runLoop()
    loopRef.current = timers

    return () => timers.forEach(clearTimeout)
  }, [isActive, onAction])

  return (
    <AnimatePresence mode="wait">
      {(phase === 'ring' || phase === 'connect') && (
        <motion.div
          key="ring"
          className="absolute inset-0"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <RingingPhase />
        </motion.div>
      )}
      {phase === 'active' && (
        <motion.div
          key="active"
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <ActiveCallPhase
            visibleLines={visibleLines}
            actions={firedActions}
            aiSpeaking={aiSpeaking}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 2: Verify build and test visually**

Run: `cd "/Users/qratul/research_and_dev/jotil/jotil website temp/jotil_labs_website" && npx next build 2>&1 | tail -5`
Then open http://localhost:3001 and scroll to the Receptionist slide. Verify:
- Phone rings with JotilLabs logo and pulsing rings
- Transitions to active call with waveform bars
- Chat bubbles appear one by one
- Action indicators appear and floating cards highlight
- Animation loops after ~11s

- [ ] **Step 3: Commit**

```bash
git add components/sections/showcase/screens/ReceptionistScreen.jsx
git commit -m "feat(showcase): cinematic receptionist screen with ring, connect, conversation loop"
```

---

### Task 6: MessengerScreen Rewrite

**Files:**
- Rewrite: `components/sections/showcase/screens/MessengerScreen.jsx`

- [ ] **Step 1: Rewrite with looping animation and card highlights**

Replace the entire file with:

```jsx
// components/sections/showcase/screens/MessengerScreen.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send } from 'lucide-react'

const channels = ['Web', 'SMS', 'WhatsApp', 'Teams']

const MESSAGES = [
  { role: 'user', text: 'Do you offer same-day service?' },
  { role: 'ai', text: 'Yes! I have 2:30 PM and 4:00 PM today.' },
  { role: 'user', text: '2:30 works. Book it!' },
  { role: 'ai', text: "Booked! I'll send confirmation to WhatsApp." },
]

const LOOP_DURATION = 10000

function JAvatar({ size = 18 }) {
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
      style={{ width: size, height: size, background: 'linear-gradient(135deg, #3859a8, #2a4688)', fontSize: size * 0.5 }}
    >
      J
    </div>
  )
}

export function MessengerScreen({ isActive, onAction }) {
  const [visibleMessages, setVisibleMessages] = useState(0)
  const [showWhatsApp, setShowWhatsApp] = useState(false)
  const loopRef = useRef(null)

  useEffect(() => {
    if (!isActive) {
      setVisibleMessages(0)
      setShowWhatsApp(false)
      if (loopRef.current) loopRef.current.forEach(clearTimeout)
      return
    }

    const timers = []
    const schedule = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id }

    const runLoop = () => {
      setVisibleMessages(0)
      setShowWhatsApp(false)

      schedule(() => setVisibleMessages(1), 800)
      schedule(() => setVisibleMessages(2), 2000)
      schedule(() => setVisibleMessages(3), 3200)

      // WhatsApp notification
      schedule(() => {
        setShowWhatsApp(true)
        if (onAction) onAction('whatsapp')
      }, 4000)
      schedule(() => setShowWhatsApp(false), 5500)

      schedule(() => setVisibleMessages(4), 5000)

      // Teams sync
      schedule(() => { if (onAction) onAction('teams') }, 6500)

      // Handoff
      schedule(() => { if (onAction) onAction('handoff') }, 7500)

      schedule(runLoop, LOOP_DURATION)
    }

    runLoop()
    loopRef.current = timers
    return () => timers.forEach(clearTimeout)
  }, [isActive, onAction])

  return (
    <div className="w-full h-full flex flex-col bg-white text-[11px] relative overflow-hidden">
      {/* WhatsApp banner */}
      <AnimatePresence>
        {showWhatsApp && (
          <motion.div
            initial={{ y: -40 }}
            animate={{ y: 0 }}
            exit={{ y: -40 }}
            transition={{ duration: 0.3 }}
            className="absolute top-0 left-0 right-0 z-20 bg-[#25d366] text-white px-3 py-2 flex items-center gap-2"
          >
            <span className="text-[10px] font-semibold">WhatsApp</span>
            <span className="text-[10px]">New message from a customer</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Channel tabs */}
      <div className="pt-8 px-2 flex border-b border-gray-100 shrink-0">
        {channels.map((ch, i) => (
          <button key={ch} className="flex-1 pb-1.5 text-center text-[9px] font-medium relative" style={{ color: i === 0 ? '#3859a8' : '#999' }}>
            {ch}
            {i === 0 && <span className="absolute bottom-0 left-1/4 right-1/4 h-[2px] rounded-full" style={{ backgroundColor: '#3859a8' }} />}
          </button>
        ))}
      </div>

      {/* Chat header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-50 shrink-0">
        <JAvatar size={24} />
        <div>
          <p className="text-[11px] font-semibold text-gray-900">JotilLabs AI</p>
          <p className="text-[9px] text-green-600 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
            Online now
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 px-3 py-2 overflow-hidden space-y-2">
        <AnimatePresence>
          {MESSAGES.slice(0, visibleMessages).map((msg, i) => {
            const isUser = msg.role === 'user'
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex ${isUser ? 'justify-end' : 'items-end gap-1.5'}`}
              >
                {!isUser && <JAvatar size={16} />}
                <div
                  className={`max-w-[75%] px-2.5 py-1.5 text-[10.5px] leading-[1.4] ${
                    isUser ? 'rounded-xl rounded-br-sm text-white' : 'rounded-xl rounded-bl-sm text-gray-900'
                  }`}
                  style={{ backgroundColor: isUser ? '#3859a8' : '#f1f3f5' }}
                >
                  {msg.text}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* Input bar */}
      <div className="px-3 py-2 border-t border-gray-100 flex items-center gap-2 shrink-0">
        <div className="flex-1 bg-gray-50 rounded-full px-3 py-1.5 text-[10px] text-gray-400">Type a message...</div>
        <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: '#3859a8' }}>
          <Send className="w-3.5 h-3.5 text-white" strokeWidth={1.5} />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/showcase/screens/MessengerScreen.jsx
git commit -m "feat(showcase): messenger screen with looping animation and card highlights"
```

---

### Task 7: OutreachScreen Rewrite

**Files:**
- Rewrite: `components/sections/showcase/screens/OutreachScreen.jsx`

- [ ] **Step 1: Rewrite with looping campaign animation and card highlights**

Replace the entire file with:

```jsx
// components/sections/showcase/screens/OutreachScreen.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, MessageCircle, Mail, PhoneOff } from 'lucide-react'

const stats = [
  { label: 'Contacted', target: 247 },
  { label: 'Reached', target: 68, suffix: '%' },
  { label: 'Booked', target: 34 },
]

const activityFeed = [
  { icon: Phone, name: 'John D.', action: 'Booked meeting', cardId: 'dialer' },
  { icon: MessageCircle, name: 'Lisa R.', action: 'Replied interested', cardId: 'dialer' },
  { icon: Mail, name: 'Mark T.', action: 'Email opened', cardId: 'email' },
  { icon: PhoneOff, name: 'Ana R.', action: 'Voicemail left', cardId: 'dialer' },
]

const LOOP_DURATION = 10000

function AnimatedStat({ label, target, suffix = '', progress }) {
  const value = Math.min(Math.floor(target * progress), target)
  return (
    <div className="flex-1 rounded-lg border border-gray-100 px-2 py-2 text-center">
      <p className="text-base font-bold" style={{ color: '#3859a8' }}>{value}{suffix}</p>
      <p className="text-[9px] text-gray-400 mt-0.5">{label}</p>
    </div>
  )
}

export function OutreachScreen({ isActive, onAction }) {
  const [visibleItems, setVisibleItems] = useState(0)
  const [statProgress, setStatProgress] = useState(0)
  const loopRef = useRef(null)

  useEffect(() => {
    if (!isActive) {
      setVisibleItems(0)
      setStatProgress(0)
      if (loopRef.current) loopRef.current.forEach(clearTimeout)
      return
    }

    const timers = []
    const schedule = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id }

    const runLoop = () => {
      setVisibleItems(0)
      setStatProgress(0)

      // Count up stats
      for (let step = 1; step <= 20; step++) {
        schedule(() => setStatProgress(step / 20), 400 + step * 60)
      }

      // Activity feed items
      activityFeed.forEach((item, i) => {
        schedule(() => {
          setVisibleItems(i + 1)
          if (onAction) onAction(item.cardId)
        }, 2000 + i * 1200)
      })

      // Analytics card at end
      schedule(() => { if (onAction) onAction('analytics') }, 7500)

      schedule(runLoop, LOOP_DURATION)
    }

    runLoop()
    loopRef.current = timers
    return () => timers.forEach(clearTimeout)
  }, [isActive, onAction])

  return (
    <div className="w-full h-full flex flex-col bg-white text-[11px]">
      <div className="pt-9 px-4 pb-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="font-semibold text-xs text-gray-900">Campaign: Spring Launch</p>
        </div>
        <p className="text-[10px] text-gray-400">Running since 9:00 AM</p>
      </div>

      <div className="flex gap-2 px-3 py-3 shrink-0">
        {stats.map((stat) => (
          <AnimatedStat key={stat.label} {...stat} progress={statProgress} />
        ))}
      </div>

      <div className="px-3 flex-1 overflow-hidden">
        <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Recent Activity</p>
        <div className="space-y-1.5">
          <AnimatePresence>
            {activityFeed.slice(0, visibleItems).map((item, i) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="flex items-center gap-2 py-1.5 px-2 rounded-lg bg-gray-50/80"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'rgba(56, 89, 168, 0.08)' }}>
                    <Icon className="w-3.5 h-3.5" style={{ color: '#3859a8' }} strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10.5px] font-semibold text-gray-900 truncate">{item.name}</p>
                    <p className="text-[9px] text-gray-400 truncate">{item.action}</p>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/showcase/screens/OutreachScreen.jsx
git commit -m "feat(showcase): outreach screen with looping campaign animation and card highlights"
```

---

### Task 8: SpaceScreen Rewrite

**Files:**
- Rewrite: `components/sections/showcase/screens/SpaceScreen.jsx`

- [ ] **Step 1: Rewrite with looping animation and card highlights**

Replace the entire file with:

```jsx
// components/sections/showcase/screens/SpaceScreen.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, Users, BarChart3, Cpu, Settings } from 'lucide-react'

const sidebarIcons = [MessageCircle, Users, BarChart3, Cpu, Settings]

const PROMPT_TEXT = 'Compare response quality for receptionist v2.1 vs v2.3'
const RESPONSE_V1 = 'Response quality: 87%. Average handle time: 45s. Customer satisfaction: 4.2/5.'
const RESPONSE_V2 = 'Response quality: 94%. Average handle time: 38s. Customer satisfaction: 4.7/5.'

const LOOP_DURATION = 10000

export function SpaceScreen({ isActive, onAction }) {
  const [typedChars, setTypedChars] = useState(0)
  const [responseChars1, setResponseChars1] = useState(0)
  const [responseChars2, setResponseChars2] = useState(0)
  const [showMetrics, setShowMetrics] = useState(false)
  const loopRef = useRef(null)

  useEffect(() => {
    if (!isActive) {
      setTypedChars(0)
      setResponseChars1(0)
      setResponseChars2(0)
      setShowMetrics(false)
      if (loopRef.current) loopRef.current.forEach(clearTimeout)
      return
    }

    const timers = []
    const schedule = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id }

    const runLoop = () => {
      setTypedChars(0)
      setResponseChars1(0)
      setResponseChars2(0)
      setShowMetrics(false)

      // Type prompt
      for (let i = 1; i <= PROMPT_TEXT.length; i++) {
        schedule(() => setTypedChars(i), 500 + i * 40)
      }

      const promptDone = 500 + PROMPT_TEXT.length * 40 + 300
      schedule(() => { if (onAction) onAction('model') }, promptDone)

      // Stream responses
      for (let i = 1; i <= RESPONSE_V1.length; i++) {
        schedule(() => setResponseChars1(i), promptDone + i * 20)
      }
      for (let i = 1; i <= RESPONSE_V2.length; i++) {
        schedule(() => setResponseChars2(i), promptDone + 200 + i * 20)
      }

      const responseDone = promptDone + Math.max(RESPONSE_V1.length, RESPONSE_V2.length + 200) * 20 + 300
      schedule(() => {
        setShowMetrics(true)
        if (onAction) onAction('perf')
      }, responseDone)

      schedule(() => { if (onAction) onAction('inbox') }, responseDone + 800)

      schedule(runLoop, LOOP_DURATION)
    }

    runLoop()
    loopRef.current = timers
    return () => timers.forEach(clearTimeout)
  }, [isActive, onAction])

  return (
    <div className="w-full h-full flex bg-[#fafbfd] text-[10px] overflow-hidden">
      <div className="w-12 bg-white border-r border-gray-100 flex flex-col items-center py-4 gap-4 shrink-0">
        {sidebarIcons.map((Icon, i) => (
          <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: i === 3 ? 'rgba(56, 89, 168, 0.1)' : 'transparent' }}>
            <Icon className="w-4 h-4" strokeWidth={1.5} style={{ color: i === 3 ? '#3859a8' : '#a0a0a0' }} />
          </div>
        ))}
      </div>

      <div className="flex-1 flex flex-col p-3 min-w-0">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-900">AI Model Playground</p>
          <div className="px-2 py-0.5 rounded-full text-[9px] font-medium text-white" style={{ backgroundColor: '#3859a8' }}>Compare</div>
        </div>

        {/* Prompt input */}
        <div className="bg-white rounded-lg border border-gray-200 px-2.5 py-1.5 mb-3 text-[10px] text-gray-700 min-h-[28px]">
          {PROMPT_TEXT.slice(0, typedChars)}
          {typedChars < PROMPT_TEXT.length && typedChars > 0 && (
            <span className="inline-block w-px h-3 bg-gray-800 ml-px animate-pulse" />
          )}
          {typedChars === 0 && <span className="text-gray-300">Type a prompt...</span>}
        </div>

        {/* Model comparison panels */}
        <div className="flex gap-2 flex-1">
          {[
            { name: 'v2.1', response: RESPONSE_V1, chars: responseChars1, highlighted: false },
            { name: 'v2.3', response: RESPONSE_V2, chars: responseChars2, highlighted: true },
          ].map((model) => (
            <div
              key={model.name}
              className="flex-1 rounded-lg border p-2 flex flex-col"
              style={{
                borderColor: model.highlighted ? 'rgba(56, 89, 168, 0.25)' : '#e5e7eb',
                backgroundColor: model.highlighted ? 'rgba(56, 89, 168, 0.02)' : '#fff',
              }}
            >
              <p className="text-[10px] font-semibold text-gray-900 mb-1.5">Receptionist {model.name}</p>
              <p className="text-[9px] text-gray-600 leading-[1.4] flex-1">
                {model.response.slice(0, model.chars)}
                {model.chars > 0 && model.chars < model.response.length && (
                  <span className="inline-block w-px h-2.5 bg-gray-400 ml-px animate-pulse" />
                )}
              </p>
              <AnimatePresence>
                {showMetrics && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-1.5 pt-1.5 border-t border-gray-100 text-[8px] text-gray-400"
                  >
                    Score: <span style={{ color: model.highlighted ? '#3859a8' : '#374151', fontWeight: 600 }}>{model.highlighted ? '94%' : '87%'}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/showcase/screens/SpaceScreen.jsx
git commit -m "feat(showcase): space screen with typing, streaming, and card highlights"
```

---

### Task 9: AvatarScreen Update

**Files:**
- Modify: `components/sections/showcase/screens/AvatarScreen.jsx`

- [ ] **Step 1: Update with looping interaction sequence and card highlights**

Replace the entire file with:

```jsx
// components/sections/showcase/screens/AvatarScreen.jsx
'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SPEECHES = [
  "Hi! Welcome. I'm here to help you find the right plan.",
  "Our Starter plan is great for small teams. Want to see a demo?",
]

const BUTTONS = [
  ['Tell me about pricing', 'I need a demo'],
  ['Yes, show me', 'Not right now'],
]

const LOOP_DURATION = 10000

export function AvatarScreen({ isActive, onAction }) {
  const [speechIndex, setSpeechIndex] = useState(-1)
  const [buttonClicked, setButtonClicked] = useState(-1)
  const loopRef = useRef(null)

  useEffect(() => {
    if (!isActive) {
      setSpeechIndex(-1)
      setButtonClicked(-1)
      if (loopRef.current) loopRef.current.forEach(clearTimeout)
      return
    }

    const timers = []
    const schedule = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id }

    const runLoop = () => {
      setSpeechIndex(-1)
      setButtonClicked(-1)

      schedule(() => {
        setSpeechIndex(0)
        if (onAction) onAction('video')
      }, 800)

      schedule(() => {
        if (onAction) onAction('personality')
      }, 2000)

      // User clicks a button
      schedule(() => setButtonClicked(0), 3500)

      // Second speech
      schedule(() => {
        setSpeechIndex(1)
        if (onAction) onAction('onboarding')
      }, 4500)

      schedule(runLoop, LOOP_DURATION)
    }

    runLoop()
    loopRef.current = timers
    return () => timers.forEach(clearTimeout)
  }, [isActive, onAction])

  const currentButtons = speechIndex >= 0 && speechIndex < BUTTONS.length ? BUTTONS[speechIndex] : []

  return (
    <div className="w-full h-full bg-[#f4f6fb] relative overflow-hidden text-[10px]">
      {/* Faux website */}
      <div className="w-full h-full flex flex-col opacity-60">
        <div className="flex items-center justify-between px-4 py-2.5 bg-white border-b border-gray-100">
          <span className="text-[11px] font-bold text-gray-700">acme.co</span>
          <div className="flex gap-3">
            <span className="text-[9px] text-gray-400">Products</span>
            <span className="text-[9px] text-gray-400">About</span>
            <span className="text-[9px] text-gray-400">Contact</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center px-6">
          <p className="text-lg font-bold text-gray-300 mb-2">Welcome to Acme</p>
          <div className="w-3/4 space-y-1.5">
            <div className="h-2 bg-gray-200 rounded-full" />
            <div className="h-2 bg-gray-200 rounded-full w-5/6" />
            <div className="h-2 bg-gray-200 rounded-full w-2/3" />
          </div>
        </div>
      </div>

      {/* Avatar widget */}
      <AnimatePresence>
        {speechIndex >= 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 12 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute bottom-3 right-3 z-10"
            style={{ width: 140 }}
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
              <div className="px-3 py-1.5 text-center" style={{ backgroundColor: '#3859a8' }}>
                <span className="text-[9px] font-semibold text-white tracking-wide">JotilLabs</span>
              </div>

              <div className="flex flex-col items-center py-3 px-2">
                <motion.div
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-12 h-12 rounded-full mb-2"
                  style={{ background: 'radial-gradient(circle at 50% 35%, #5a7ec4 0%, #3859a8 50%, #2a4688 100%)' }}
                >
                  <div className="w-full h-full relative flex items-center justify-center">
                    <div className="w-5 h-5 rounded-full absolute" style={{ top: '22%', background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)' }} />
                    <div className="w-9 h-4 rounded-t-full absolute bottom-0" style={{ background: 'radial-gradient(ellipse at top, rgba(255,255,255,0.15) 0%, transparent 70%)' }} />
                  </div>
                </motion.div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={speechIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                    className="bg-gray-50 rounded-lg px-2 py-1.5 mb-2"
                  >
                    <p className="text-[9px] text-gray-700 leading-[1.35] text-center">
                      {SPEECHES[speechIndex]}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex flex-col gap-1 w-full px-1">
                  {currentButtons.map((btn, i) => (
                    <button
                      key={`${speechIndex}-${i}`}
                      className="w-full py-1 rounded-full text-[8px] font-medium border transition-colors duration-200"
                      style={{
                        borderColor: buttonClicked === i && speechIndex === 0 ? '#3859a8' : 'rgba(56,89,168,0.3)',
                        color: '#3859a8',
                        backgroundColor: buttonClicked === i && speechIndex === 0 ? 'rgba(56,89,168,0.08)' : 'transparent',
                      }}
                    >
                      {btn}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/sections/showcase/screens/AvatarScreen.jsx
git commit -m "feat(showcase): avatar screen with interaction loop and card highlights"
```

---

### Task 10: Build Verification + Visual QA

**Files:** None (verification only)

- [ ] **Step 1: Run production build**

Run: `cd "/Users/qratul/research_and_dev/jotil/jotil website temp/jotil_labs_website" && npx next build 2>&1 | tail -10`
Expected: Build succeeds with no errors

- [ ] **Step 2: Visual QA checklist**

Open http://localhost:3001 (dev server) and verify:

1. **Receptionist slide**: Glass phone tilted, rings with JotilLabs logo, pulsing rings, transitions to call, bubbles appear one by one, action cards highlight behind phone, loops
2. **Messenger slide**: Glass phone tilted, chat bubbles appear one by one, WhatsApp banner slides in, floating cards highlight on actions, loops
3. **Outreach slide**: Glass phone tilted, stats count up, activity feed items slide in one by one, cards highlight per action type, loops
4. **Space slide**: Glass laptop tilted, prompt types character by character, responses stream in both panels, metrics appear, cards highlight, loops
5. **Avatar slide**: Glass monitor tilted, widget pops up, speech bubbles swap, button highlights, cards highlight, loops
6. **Floating cards**: Visible behind devices on desktop, hidden on mobile
7. **Glass effect**: Device frames semi-transparent, cards peek through
8. **3D tilt**: All devices slightly tilted, perspective visible
9. **Scroll transitions**: GSAP scrub + snap still work correctly between slides
10. **Mobile**: Cards hidden, devices not tilted (scale-85% fallback works)

- [ ] **Step 3: Commit any fixes from QA**

```bash
git add -A
git commit -m "fix(showcase): visual QA adjustments"
```
