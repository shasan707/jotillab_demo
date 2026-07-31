'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  ArrowRight, Mic, PhoneCall, MessageSquare, Zap, Check, RotateCcw,
  CalendarCheck, UserPlus, Star, PhoneForwarded,
} from 'lucide-react'

const WAVEFORM_BARS = Array.from({ length: 20 }, (_, i) => ({
  delay: i * 0.04,
  height: 6 + Math.sin(i * 0.7) * 24 + Math.abs(Math.sin(i * 0.4)) * 12,
}))

const FLOATING_DOTS = [
  { radius: 195, duration: 25, delay: 0, size: 3, opacity: 0.2 },
  { radius: 200, duration: 32, delay: -8, size: 4, opacity: 0.14 },
  { radius: 205, duration: 28, delay: -15, size: 3, opacity: 0.18 },
  { radius: 192, duration: 35, delay: -5, size: 3.5, opacity: 0.12 },
  { radius: 202, duration: 22, delay: -12, size: 3, opacity: 0.16 },
  { radius: 196, duration: 40, delay: -20, size: 4, opacity: 0.1 },
]

const LIVE_INDICATORS = [
  { icon: PhoneCall, label: 'Missed calls recovered', value: '80%', color: '#3859a8' },
  { icon: MessageSquare, label: 'Faster response time', value: '< 3s', color: '#3B82F6' },
  { icon: Zap, label: 'Avg. setup time', value: '4 hrs', color: '#3B82F6' },
]

const CYCLING_WORDS = ['Customer', 'Call', 'Lead', 'Booking']

const NOTIFICATIONS = [
  { icon: PhoneCall, color: '#3859a8', title: 'Call answered', meta: 'Just now' },
  { icon: CalendarCheck, color: '#16A34A', title: 'Appointment booked', meta: 'Sat 10:15 AM' },
  { icon: UserPlus, color: '#3B82F6', title: 'New lead captured', meta: '2 min ago' },
  { icon: MessageSquare, color: '#3859a8', title: 'Follow-up text sent', meta: 'Moments ago' },
  { icon: Star, color: '#D97706', title: 'Review request sent', meta: '5 min ago' },
  { icon: PhoneForwarded, color: '#3B82F6', title: 'VIP routed to owner', meta: 'Just now' },
]

const DEMO_SCRIPT = [
  { speaker: 'caller', text: 'Hi, do you have anything open this Saturday?' },
  { speaker: 'ai', text: 'We do. I can book you in at 10:15 AM. What name should I put down?' },
  { speaker: 'caller', text: 'Lisa Romero.' },
  { speaker: 'ai', text: 'All set, Lisa. Saturday at 10:15 AM. A confirmation text is on its way.' },
]

/**
 * Drives the looping hero conversation. Returns the visible messages
 * (typewriter-truncated), whether the AI is "speaking" (drives the orb
 * waveform), whether the booking pill should show, and a restart handle.
 */
function useConversationDemo() {
  const reduced = useReducedMotion()
  const [messages, setMessages] = useState([])
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [booked, setBooked] = useState(false)
  const [runId, setRunId] = useState(0)

  useEffect(() => {
    if (reduced) {
      // Static transcript, no typing loop.
      setMessages(DEMO_SCRIPT.map(m => ({ ...m, shown: m.text })))
      setBooked(true)
      setAiSpeaking(false)
      return
    }

    let cancelled = false
    const timeouts = []
    const wait = ms =>
      new Promise(resolve => {
        const t = setTimeout(resolve, ms)
        timeouts.push(t)
      })

    async function run() {
      await wait(runId === 0 ? 1600 : 400)
      while (!cancelled) {
        setMessages([])
        setBooked(false)
        for (const msg of DEMO_SCRIPT) {
          if (cancelled) return
          setAiSpeaking(msg.speaker === 'ai')
          await wait(420)
          setMessages(prev => [...prev, { ...msg, shown: '' }])
          for (let c = 1; c <= msg.text.length; c++) {
            if (cancelled) return
            const shown = msg.text.slice(0, c)
            setMessages(prev => {
              const next = [...prev]
              next[next.length - 1] = { ...msg, shown }
              return next
            })
            await wait(msg.speaker === 'ai' ? 20 : 28)
          }
          await wait(620)
        }
        if (cancelled) return
        setAiSpeaking(false)
        setBooked(true)
        await wait(4200)
      }
    }

    run()
    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [runId, reduced])

  const restart = useCallback(() => setRunId(id => id + 1), [])
  return { messages, aiSpeaking, booked, restart }
}

function VoiceOrb({ speaking, onMicClick }) {
  return (
    <div className="relative flex items-center justify-center select-none scale-[0.72] sm:scale-[0.85] lg:scale-100 origin-center" style={{ width: 380, height: 380 }}>
      {/* Glow */}
      <div className="absolute rounded-full pointer-events-none" style={{ width: 460, height: 460, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'radial-gradient(circle, rgba(56, 89, 168,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* Rings */}
      <div className="absolute rounded-full pointer-events-none animate-ring-pulse-reverse" style={{ width: 370, height: 370, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', border: '1px dotted rgba(56, 89, 168,0.07)' }} />
      <div className="absolute rounded-full pointer-events-none animate-ring-rotate" style={{ width: 355, height: 355, top: '50%', left: '50%', marginTop: -177.5, marginLeft: -177.5, border: '1px dashed rgba(59, 130, 246,0.09)' }} />
      <div className="absolute rounded-full pointer-events-none animate-ring-pulse" style={{ width: 344, height: 344, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', border: '1px solid rgba(56, 89, 168,0.12)' }} />

      {/* Floating dots */}
      {FLOATING_DOTS.map((dot, i) => (
        <div key={i} className="absolute rounded-full animate-orbit pointer-events-none" style={{ width: dot.size, height: dot.size, background: `rgba(56, 89, 168,${dot.opacity})`, top: '50%', left: '50%', marginTop: -(dot.size / 2), marginLeft: -(dot.size / 2), '--orbit-radius': `${dot.radius}px`, animationDuration: `${dot.duration}s`, animationDelay: `${dot.delay}s` }} />
      ))}

      {/* Main glass circle */}
      <div className="relative rounded-full flex flex-col items-center justify-center" style={{ width: 340, height: 340, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 20px 60px rgba(56, 89, 168,0.08), 0 4px 20px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.9)' }}>
        {/* Mic button — replays the live demo */}
        <button
          onClick={onMicClick}
          aria-label="Replay live demo"
          className="relative w-[72px] h-[72px] rounded-full border-none cursor-pointer flex items-center justify-center transition-all duration-300"
          style={{
            background: speaking ? 'linear-gradient(135deg, #22396E, #3859a8)' : 'linear-gradient(135deg, #3859a8, #2a4688)',
            boxShadow: speaking
              ? '0 0 40px rgba(56, 89, 168,0.5), 0 0 80px rgba(56, 89, 168,0.15)'
              : '0 8px 32px rgba(56, 89, 168,0.35)',
          }}
        >
          {speaking && (
            <span className="absolute inset-0 rounded-full animate-ping" style={{ background: 'rgba(56, 89, 168,0.25)' }} />
          )}
          <Mic size={26} color="#fff" strokeWidth={1.5} />
        </button>

        {/* Waveform */}
        <div className="flex items-center gap-[2.5px] mt-5 h-10">
          {WAVEFORM_BARS.map((bar, i) => (
            <motion.div
              key={i}
              className="w-[2.5px] rounded-full"
              style={{ background: speaking ? 'linear-gradient(to top, #3859a8, #3B82F6)' : 'rgba(56, 89, 168,0.2)' }}
              animate={speaking ? { height: [5, bar.height, 5] } : { height: 5 }}
              transition={speaking ? { duration: 0.5, delay: bar.delay, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
            />
          ))}
        </div>

        {/* Status */}
        <p className="text-[12px] mt-3 font-medium transition-colors duration-300" style={{ color: speaking ? '#3859a8' : '#6B7280', fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
          {speaking ? 'AI speaking...' : 'Live AI receptionist'}
        </p>
      </div>
    </div>
  )
}

function TranscriptCard({ messages, booked, onReplay }) {
  // Keep the card compact: only the two most recent bubbles are visible.
  const visible = messages.slice(-2)

  return (
    <div
      className="w-full max-w-[400px] rounded-[20px] px-5 pt-4 pb-5"
      style={{
        background: 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(20px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.6)',
        border: '1px solid rgba(255,255,255,0.75)',
        boxShadow: '0 14px 44px rgba(56, 89, 168,0.10), 0 3px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.95)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="relative flex w-2 h-2">
            <span className="absolute inline-flex w-full h-full rounded-full animate-ping" style={{ background: 'rgba(56, 89, 168,0.4)' }} />
            <span className="relative inline-flex w-2 h-2 rounded-full bg-primary" />
          </span>
          <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-text-secondary font-display">
            Live demo
          </span>
        </div>
        <AnimatePresence mode="wait">
          {booked ? (
            <motion.span
              key="booked"
              initial={{ opacity: 0, scale: 0.85, y: -4 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold"
              style={{ background: 'rgba(22, 163, 74, 0.10)', color: '#15803D', border: '1px solid rgba(22, 163, 74, 0.18)' }}
            >
              <Check size={11} strokeWidth={2.5} />
              Appointment booked
            </motion.span>
          ) : (
            <motion.button
              key="replay"
              onClick={onReplay}
              aria-label="Replay demo"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-text-muted hover:text-primary transition-colors bg-transparent border-none cursor-pointer p-0"
            >
              <RotateCcw size={11} strokeWidth={2} />
              Replay
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Bubbles */}
      <div className="flex flex-col gap-2.5 min-h-[104px] justify-end">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map(msg => (
            <motion.div
              key={`${msg.speaker}-${msg.text}`}
              layout="position"
              initial={{ opacity: 0, y: 14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, transition: { duration: 0.18 } }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className={msg.speaker === 'ai' ? 'self-end' : 'self-start'}
            >
              <div
                className="rounded-2xl px-3.5 py-2.5 text-[13px] leading-[1.55] max-w-[300px]"
                style={
                  msg.speaker === 'ai'
                    ? {
                        background: 'linear-gradient(135deg, #3859a8, #2a4688)',
                        color: '#fff',
                        borderBottomRightRadius: 6,
                        fontFamily: 'var(--font-inter), Inter, sans-serif',
                      }
                    : {
                        background: 'rgba(15,17,41,0.05)',
                        color: '#0F1129',
                        border: '1px solid rgba(15,17,41,0.06)',
                        borderBottomLeftRadius: 6,
                        fontFamily: 'var(--font-inter), Inter, sans-serif',
                      }
                }
              >
                {msg.shown}
                {msg.shown.length < msg.text.length && (
                  <span
                    className="inline-block w-[2px] h-[13px] ml-[2px] align-middle animate-caret-blink rounded-full"
                    style={{ background: msg.speaker === 'ai' ? 'rgba(255,255,255,0.8)' : 'rgba(15,17,41,0.5)' }}
                  />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

function FloatingNotifications() {
  const reduced = useReducedMotion()
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (reduced) return
    const interval = setInterval(() => setTick(t => t + 1), 4200)
    return () => clearInterval(interval)
  }, [reduced])

  // Three slots, each pulling a different notification; offsets keep
  // slots from ever showing the same item at the same time.
  const slots = [
    { item: NOTIFICATIONS[tick % NOTIFICATIONS.length], pos: { top: '4%', left: '-16%' }, floatDelay: '0s' },
    { item: NOTIFICATIONS[(tick + 2) % NOTIFICATIONS.length], pos: { top: '32%', right: '-17%' }, floatDelay: '-2.1s' },
    { item: NOTIFICATIONS[(tick + 4) % NOTIFICATIONS.length], pos: { bottom: '14%', left: '-22%' }, floatDelay: '-4.2s' },
  ]

  return (
    <div aria-hidden="true" className="absolute inset-0 pointer-events-none hidden lg:block">
      {slots.map((slot, i) => (
        <div key={i} className="absolute animate-float" style={{ ...slot.pos, animationDelay: slot.floatDelay }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={slot.item.title}
              initial={{ opacity: 0, y: 10, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.45, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2.5 rounded-[14px] pl-2.5 pr-4 py-2.5"
              style={{
                background: 'rgba(255,255,255,0.78)',
                backdropFilter: 'blur(16px) saturate(1.5)',
                WebkitBackdropFilter: 'blur(16px) saturate(1.5)',
                border: '1px solid rgba(255,255,255,0.85)',
                boxShadow: '0 10px 32px rgba(56, 89, 168,0.12), 0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <span
                className="w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0"
                style={{ background: `${slot.item.color}14`, border: `1px solid ${slot.item.color}22` }}
              >
                <slot.item.icon size={14} strokeWidth={1.75} style={{ color: slot.item.color }} />
              </span>
              <span className="whitespace-nowrap">
                <span className="block text-[12px] font-semibold text-text leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                  {slot.item.title}
                </span>
                <span className="block text-[10px] text-text-muted leading-tight mt-0.5" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                  {slot.item.meta}
                </span>
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function CyclingWord() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced) return
    // Let the initial headline reveal finish before the first swap.
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % CYCLING_WORDS.length)
    }, 2600)
    return () => clearInterval(interval)
  }, [reduced])

  return (
    <span className="block overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={CYCLING_WORDS[index]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block text-gradient leading-[1.05] tracking-[-0.04em] font-extrabold"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)', paddingBottom: '0.08em' }}
        >
          {CYCLING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

export function Hero() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { messages, aiSpeaking, booked, restart } = useConversationDemo()

  // Mouse-reactive depth: orb drifts with the cursor, notification cards
  // drift the opposite way. Springs keep it fluid; touch devices never
  // fire mousemove so this is inert on mobile.
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })
  const orbX = useTransform(sx, v => v * 12)
  const orbY = useTransform(sy, v => v * 9)
  const noteX = useTransform(sx, v => v * -20)
  const noteY = useTransform(sy, v => v * -14)

  const handleMouse = useCallback(e => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }, [mx, my])

  const resetMouse = useCallback(() => {
    mx.set(0)
    my.set(0)
  }, [mx, my])

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      onMouseMove={handleMouse}
      onMouseLeave={resetMouse}
    >
      {/* Transparent base — the drifting aurora BrandBackground shows through */}

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-80px)] py-16">

          {/* Left: Copy */}
          <div className="flex flex-col justify-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="inline-flex items-center gap-2.5 w-fit rounded-full px-4 py-2 mb-8"
              style={{ background: 'rgba(56, 89, 168,0.06)', border: '1px solid rgba(56, 89, 168,0.12)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[11px] font-semibold text-primary tracking-[0.25em] uppercase font-display">
                Automate. Empower. Scale.
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="overflow-hidden mb-6">
              {['Never Miss a', null, 'Again.'].map((line, i) =>
                line === null ? (
                  <motion.span
                    key="cycling"
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                    className="block"
                  >
                    <CyclingWord />
                  </motion.span>
                ) : (
                  <motion.span
                    key={line}
                    initial={{ y: '100%', opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.65, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="block leading-[1.05] tracking-[-0.04em] font-extrabold text-text"
                    style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.75rem, 5.5vw, 4.25rem)' }}
                  >
                    {line}
                  </motion.span>
                )
              )}
            </h1>

            {/* Subtext */}
            <motion.p
              className="text-lg text-text-secondary leading-[1.75] max-w-[480px] mb-10"
              style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.45, ease: 'easeOut' }}
            >
              Every call answered. Every lead followed up. Every conversation
              handled. Your AI teammate works around the clock so your team
              can focus on closing deals and growing your business.
            </motion.p>

            {/* CTAs */}
            <motion.div
              className="flex flex-wrap gap-3 mb-14"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55, ease: 'easeOut' }}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 no-underline text-sm font-semibold text-white btn-gradient btn-shine px-6 py-3.5 rounded-[11px] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Book a Demo
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 no-underline text-sm font-semibold text-text px-6 py-3.5 rounded-[11px] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
                style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.07)', fontFamily: 'var(--font-display)' }}
              >
                See How It Works
              </Link>
            </motion.div>

            {/* Live stats strip */}
            <motion.div
              className="flex flex-wrap gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              {LIVE_INDICATORS.map(({ icon: Icon, label, value, color }) => (
                <div key={label} className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}12` }}>
                    <Icon size={13} style={{ color }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text leading-none" style={{ fontFamily: 'var(--font-jetbrains), JetBrains Mono, monospace', letterSpacing: '-0.02em' }}>
                      {value}
                    </p>
                    <p className="text-[10px] text-text-secondary mt-0.5">{label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Voice Orb + live transcript */}
          <motion.div
            className="flex flex-col items-center lg:items-end gap-2"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            {mounted && (
              <>
                <motion.div
                  className="relative -mb-6 sm:-mb-2 lg:mb-0"
                  style={{ x: orbX, y: orbY }}
                >
                  <VoiceOrb speaking={aiSpeaking} onMicClick={restart} />
                  <motion.div className="absolute inset-0" style={{ x: noteX, y: noteY }}>
                    <FloatingNotifications />
                  </motion.div>
                </motion.div>
                <motion.div
                  className="w-full flex justify-center lg:justify-end lg:pr-2"
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <TranscriptCard messages={messages} booked={booked} onReplay={restart} />
                </motion.div>
              </>
            )}
          </motion.div>
        </div>
      </div>

      {/* Bottom fade removed — BrandBackground handles the transition now */}
    </section>
  )
}
