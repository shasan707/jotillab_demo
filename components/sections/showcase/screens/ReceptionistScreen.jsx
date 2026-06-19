'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PhoneCall, PhoneOff, Calendar, MessageSquare, UserPlus, Sparkles, User } from 'lucide-react'
import Logo from '@/components/ui/Logo'

const SCRIPT = [
  { type: 'msg', role: 'ai', text: 'Good morning! Thank you for calling. How can I help?' },
  { type: 'msg', role: 'caller', text: "Hi, I'd like to schedule a consultation for my business." },
  { type: 'msg', role: 'ai', text: "I'd be happy to help! What type of business are you in?" },
  { type: 'msg', role: 'caller', text: "We run a dental practice in downtown Lehi." },
  { type: 'msg', role: 'ai', text: 'I have Thursday at 10 AM or Friday at 2 PM. Which works?' },
  { type: 'msg', role: 'caller', text: 'Thursday at 10 works great.' },
  { type: 'action', id: 'calendar', icon: Calendar, label: 'Appointment booked', sublabel: 'Thu, 10:00 AM' },
  { type: 'msg', role: 'ai', text: "Perfect! I'll send you a confirmation text right now." },
  { type: 'action', id: 'sms', icon: MessageSquare, label: 'SMS sent', sublabel: 'Confirmation delivered' },
  { type: 'msg', role: 'ai', text: "I've also saved your contact in our system." },
  { type: 'action', id: 'crm', icon: UserPlus, label: 'Contact saved', sublabel: 'Added to CRM' },
  { type: 'msg', role: 'caller', text: 'Thank you so much!' },
  { type: 'msg', role: 'ai', text: "You're welcome! See you Thursday." },
]

const LOOP_DURATION = 32000

function RingingPhase() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden" style={{ background: '#fafbfd' }}>
      {/* Soft pastel glow at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[45%]"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(56,89,168,0.04) 30%, rgba(56,89,168,0.08) 60%, rgba(99,102,241,0.06) 100%)',
        }}
      />

      <div className="relative mb-5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              animation: `ring-expand 2s ease-out ${i * 0.5}s infinite`,
              width: 72, height: 72,
              top: '50%', left: '50%',
              marginTop: -36, marginLeft: -36,
              border: '1.5px solid rgba(56,89,168,0.1)',
            }}
          />
        ))}
        <div
          className="w-[72px] h-[72px] rounded-full flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #e8edf5, #f0f2f8)',
            boxShadow: '0 4px 20px rgba(56,89,168,0.1), inset 0 1px 0 rgba(255,255,255,0.8)',
          }}
        >
          <User size={30} strokeWidth={1.5} style={{ color: '#3859a8' }} />
        </div>
      </div>

      <p className="text-sm font-semibold" style={{ color: '#0f1129' }}>Sarah Mitchell</p>
      <p className="text-[11px] mt-0.5" style={{ color: '#6B7098' }}>+1 (801) 555-0147</p>
      <p className="text-[10px] mt-1" style={{ color: '#9da3c0' }}>Incoming Call...</p>

      <div className="flex gap-14 mt-10">
        <div className="flex flex-col items-center gap-1.5">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #ff6b6b, #ee5a5a)',
              boxShadow: '0 4px 16px rgba(238,90,90,0.3), 0 1px 3px rgba(238,90,90,0.2)',
            }}
          >
            <PhoneOff size={18} strokeWidth={1.5} className="text-white" />
          </div>
          <span className="text-[9px]" style={{ color: '#9da3c0' }}>Decline</span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <motion.div
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #34d399, #22c55e)',
              boxShadow: '0 4px 16px rgba(34,197,94,0.35), 0 1px 3px rgba(34,197,94,0.2)',
            }}
          >
            <PhoneCall size={18} strokeWidth={1.5} className="text-white" />
          </motion.div>
          <span className="text-[9px]" style={{ color: '#9da3c0' }}>Accept</span>
        </div>
      </div>

      {/* JotilLabs orb */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2">
        <div className="relative">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 36, height: 36,
                top: '50%', left: '50%',
                marginTop: -18, marginLeft: -18,
                border: '1px solid rgba(56,89,168,0.08)',
                animation: `ring-expand 2s ease-out ${i * 0.5}s infinite`,
              }}
            />
          ))}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #4a6fc2, #3859a8)',
              boxShadow: '0 4px 16px rgba(56,89,168,0.25), 0 1px 3px rgba(56,89,168,0.15)',
              animation: 'orb-pulse 1.6s ease-in-out infinite',
            }}
          >
            <Logo size={14} tone="on-dark" animate={false} />
          </div>
        </div>
      </div>
    </div>
  )
}

function AiOrb() {
  return (
    <div className="flex justify-start mb-3">
      <div className="flex items-center gap-1.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #4a6fc2, #3859a8, #2a4688)',
            animation: 'orb-pulse 1.2s ease-in-out infinite',
          }}
        >
          <Logo size={14} tone="on-dark" animate={false} />
        </div>
        <div className="flex items-center gap-[2px] px-2 py-1.5 rounded-xl rounded-bl-sm bg-[#f1f3f5]">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="w-[2.5px] rounded-full"
              style={{
                height: 12,
                backgroundColor: '#3859a8',
                animation: `wave-bar 0.7s ease-in-out ${i * 0.08}s infinite`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

function CallerWave() {
  return (
    <div className="flex justify-end mb-3">
      <div className="flex items-center gap-[2px] px-2.5 py-1.5 rounded-xl rounded-br-sm" style={{ backgroundColor: '#3859a8' }}>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="w-[2.5px] rounded-full"
            style={{
              height: 12,
              backgroundColor: 'rgba(255,255,255,0.8)',
              animation: `wave-bar 0.6s ease-in-out ${i * 0.08}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

function BlingAction({ action }) {
  const Icon = action.icon
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center py-2 my-1"
    >
      <div className="relative">
        {/* Sparkle particles */}
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute"
            style={{
              width: 6, height: 6,
              top: '50%', left: '50%',
              marginTop: [-14, -14, 8, 8][i],
              marginLeft: [-14, 8, -14, 8][i],
              animation: `bling-sparkle 0.8s ease-out ${i * 0.1}s`,
              animationFillMode: 'forwards',
              opacity: 0,
            }}
          >
            <Sparkles size={6} className="text-amber-400" />
          </div>
        ))}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, rgba(56,89,168,0.12), rgba(56,89,168,0.06))',
            animation: 'bling-in 0.5s ease-out',
          }}
        >
          <Icon size={16} strokeWidth={1.5} style={{ color: '#3859a8' }} />
        </div>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.2 }}
        className="flex items-center gap-1 mt-1.5"
      >
        <div className="w-3 h-3 rounded-full bg-green-500/15 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
        </div>
        <span className="text-[9px] font-semibold" style={{ color: '#3859a8' }}>{action.label}</span>
        <span className="text-[8px] text-gray-400">{action.sublabel}</span>
      </motion.div>
    </motion.div>
  )
}

function ChatBubble({ line }) {
  const isAI = line.role === 'ai'
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`flex mb-3 ${isAI ? 'justify-start' : 'justify-end'}`}
    >
      <div
        className={`max-w-[82%] px-2.5 py-1.5 text-[10px] leading-[1.4] ${
          isAI ? 'rounded-xl rounded-bl-sm text-white' : 'rounded-xl rounded-br-sm bg-[#f1f3f5] text-gray-900'
        }`}
        style={isAI ? { backgroundColor: '#3859a8' } : {}}
      >
        {line.text}
      </div>
    </motion.div>
  )
}

function ActiveCallPhase({ items, speakingRole, blingAction }) {
  const scrollRef = useRef(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [items, speakingRole, blingAction])

  return (
    <div className="w-full h-full flex flex-col bg-white text-[11px]">
      {/* Call header */}
      <div className="pt-7 pb-1.5 px-3 flex items-center gap-2" style={{ background: 'linear-gradient(to bottom, #3859a8, #2a4688)' }}>
        <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center shrink-0">
          <Logo size={12} tone="on-dark" animate={false} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-[11px] text-white leading-tight">Sarah Mitchell</p>
          <div className="flex items-center gap-1">
            <Logo size={8} tone="on-dark" animate={false} />
            <p className="text-[8px] text-white/60">JotilLabs AI Answering</p>
          </div>
        </div>
        {/* Header waveform */}
        <div className="flex items-center gap-[2px]">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="w-[2px] rounded-full"
              style={{
                height: 12,
                backgroundColor: 'rgba(255,255,255,0.6)',
                animation: speakingRole ? `wave-bar 1s ease-in-out ${i * 0.1}s infinite` : 'none',
                transform: speakingRole ? undefined : 'scaleY(0.3)',
                transition: 'transform 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 px-2.5 py-1.5 overflow-hidden">
        <AnimatePresence mode="popLayout">
          {items.map((item, i) => {
            if (item.type === 'msg') {
              return <ChatBubble key={`msg-${i}`} line={item} />
            }
            if (item.type === 'action') {
              return (
                <motion.div
                  key={`action-${item.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <BlingAction action={item} />
                </motion.div>
              )
            }
            return null
          })}

          {/* Active speaking indicator */}
          {speakingRole === 'ai' && (
            <motion.div
              key={`orb-${items.length}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <AiOrb />
            </motion.div>
          )}
          {speakingRole === 'caller' && (
            <motion.div
              key={`wave-${items.length}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <CallerWave />
            </motion.div>
          )}

          {/* Bling overlay for current action */}
          {blingAction && (
            <motion.div
              key={`bling-${blingAction.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <BlingAction action={blingAction} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom JotilLabs talking orb */}
      <div className="shrink-0 flex items-center justify-center py-3">
        <div className="relative">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: 36, height: 36,
                top: '50%', left: '50%',
                marginTop: -18, marginLeft: -18,
                background: speakingRole === 'ai'
                  ? `rgba(56,89,168,${0.15 - i * 0.04})`
                  : 'transparent',
                border: `1.5px solid rgba(56,89,168,${speakingRole === 'ai' ? 0.25 - i * 0.07 : 0.08})`,
                animation: speakingRole === 'ai'
                  ? `ring-expand 1.4s ease-out ${i * 0.25}s infinite`
                  : 'none',
                transition: 'background 0.3s, border-color 0.3s',
              }}
            />
          ))}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center relative"
            style={{
              background: speakingRole === 'ai'
                ? 'linear-gradient(135deg, #22D3EE, #3859a8, #6366F1)'
                : 'linear-gradient(135deg, #4a6fc2, #3859a8, #2a4688)',
              boxShadow: speakingRole === 'ai'
                ? '0 0 16px rgba(34,211,238,0.5), 0 0 32px rgba(56,89,168,0.3), 0 0 48px rgba(99,102,241,0.2)'
                : '0 2px 8px rgba(56,89,168,0.25)',
              animation: speakingRole === 'ai' ? 'orb-pulse 1s ease-in-out infinite' : 'none',
              transition: 'background 0.4s, box-shadow 0.4s',
            }}
          >
            <Logo size={15} tone="on-dark" animate={false} />
          </div>
        </div>
      </div>
    </div>
  )
}

export function ReceptionistScreen({ isActive, onAction }) {
  const [phase, setPhase] = useState('ring')
  const [items, setItems] = useState([])
  const [speakingRole, setSpeakingRole] = useState(null)
  const [blingAction, setBlingAction] = useState(null)
  const loopRef = useRef(null)

  useEffect(() => {
    if (!isActive) {
      setPhase('ring')
      setItems([])
      setSpeakingRole(null)
      setBlingAction(null)
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
      setItems([])
      setSpeakingRole(null)
      setBlingAction(null)

      schedule(() => setPhase('connect'), 2200)
      schedule(() => setPhase('active'), 2800)

      let t = 2800
      const speakDur = 1200
      const gap = 400

      SCRIPT.forEach((step) => {
        if (step.type === 'msg') {
          const role = step.role
          schedule(() => setSpeakingRole(role), t)
          t += speakDur
          const msg = step
          schedule(() => {
            setSpeakingRole(null)
            setItems((prev) => [...prev, msg])
          }, t)
          t += gap
        } else if (step.type === 'action') {
          t += 200
          const action = step
          schedule(() => {
            setBlingAction(action)
            if (onAction) onAction(action.id)
          }, t)
          t += 900
          schedule(() => {
            setBlingAction(null)
            setItems((prev) => [...prev, action])
          }, t)
          t += 300
        }
      })

      schedule(runLoop, Math.max(t + 1500, LOOP_DURATION))
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
            items={items}
            speakingRole={speakingRole}
            blingAction={blingAction}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
