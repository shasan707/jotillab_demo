'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  ArrowRight, PhoneCall, MessageSquare, Check,
  CalendarCheck, UserPlus, Star, PhoneForwarded, Activity,
} from 'lucide-react'
import { TiltCard } from '@/components/design'

const CYCLING_WORDS = ['customer', 'call', 'lead', 'booking']

const DEMO_SCRIPT = [
  { speaker: 'caller', text: 'Hi, do you have anything open this Saturday?' },
  { speaker: 'ai', text: 'We do. I can book you in at 10:15 AM. What name should I put down?' },
  { speaker: 'caller', text: 'Lisa Romero.' },
  { speaker: 'ai', text: 'All set, Lisa. Saturday at 10:15 AM. A confirmation text is on its way.' },
]

const FEED_EVENTS = [
  { icon: PhoneCall, color: '#3859a8', title: 'Call answered', meta: 'Riverside Dental · just now' },
  { icon: CalendarCheck, color: '#16A34A', title: 'Appointment booked', meta: 'Saturday 10:15 AM' },
  { icon: UserPlus, color: '#3B82F6', title: 'New lead captured', meta: 'Website chat' },
  { icon: MessageSquare, color: '#3859a8', title: 'Follow-up text sent', meta: '2 missed callers' },
  { icon: Star, color: '#D97706', title: 'Review request sent', meta: 'After visit' },
  { icon: PhoneForwarded, color: '#3B82F6', title: 'VIP routed to owner', meta: 'Priority caller' },
  { icon: Check, color: '#16A34A', title: 'Chat resolved', meta: 'Order status' },
  { icon: MessageSquare, color: '#3B82F6', title: 'After-hours inquiry handled', meta: '11:42 PM' },
]

const CONSOLE_STATS = [
  { value: '80%', label: 'Missed calls recovered' },
  { value: '< 3s', label: 'Average response time' },
  { value: '24/7', label: 'Always on coverage' },
]

/** Looping typewriter conversation driving the console's call panel. */
function useConversationDemo() {
  const reduced = useReducedMotion()
  const [messages, setMessages] = useState([])
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    if (reduced) {
      setMessages(DEMO_SCRIPT.map(m => ({ ...m, shown: m.text })))
      setBooked(true)
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
      await wait(1400)
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
          await wait(600)
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
  }, [reduced])

  return { messages, aiSpeaking, booked }
}

/** Activity feed that streams a new event in every few seconds. */
function useActivityFeed() {
  const reduced = useReducedMotion()
  const [items, setItems] = useState(() => [2, 1, 0].map(i => ({ ...FEED_EVENTS[i], key: i })))

  useEffect(() => {
    if (reduced) return
    let next = 3
    const interval = setInterval(() => {
      setItems(prev => {
        const ev = FEED_EVENTS[next % FEED_EVENTS.length]
        const added = [{ ...ev, key: next }, ...prev]
        next += 1
        return added.slice(0, 5)
      })
    }, 2800)
    return () => clearInterval(interval)
  }, [reduced])

  return items
}

function CyclingWord() {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (reduced) return
    const interval = setInterval(() => setIndex(i => (i + 1) % CYCLING_WORDS.length), 2600)
    return () => clearInterval(interval)
  }, [reduced])

  return (
    <span className="relative inline-grid align-bottom">
      {/* Invisible sizer reserves width/height for the widest word so the
          line never collapses or clips during the crossfade. */}
      <span
        aria-hidden="true"
        className="invisible col-start-1 row-start-1 whitespace-nowrap"
        style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontStyle: 'italic', fontWeight: 560, letterSpacing: '-0.02em' }}
      >
        {CYCLING_WORDS.reduce((a, b) => (b.length > a.length ? b : a), '')}
      </span>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.em
          key={CYCLING_WORDS[index]}
          initial={{ y: '0.32em', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-0.32em', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="col-start-1 row-start-1 inline-block text-gradient whitespace-nowrap"
          style={{ fontFamily: 'var(--font-fraunces), Georgia, serif', fontStyle: 'italic', fontWeight: 560, letterSpacing: '-0.02em' }}
        >
          {CYCLING_WORDS[index]}
        </motion.em>
      </AnimatePresence>
    </span>
  )
}

function CallPanel({ messages, aiSpeaking, booked }) {
  const visible = messages.slice(-3)

  return (
    <div className="flex flex-col rounded-2xl p-4 sm:p-5 h-full" style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(15,17,41,0.06)' }}>
      {/* Panel header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(56,89,168,0.10)' }}>
            <PhoneCall size={14} strokeWidth={1.75} className="text-primary" />
          </span>
          <span>
            <span className="block text-[12px] font-semibold text-text leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Incoming call
            </span>
            <span className="block text-[10px] text-text-muted leading-tight mt-0.5" style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>
              (555) 014-2287
            </span>
          </span>
        </div>
        <AnimatePresence mode="wait">
          {booked ? (
            <motion.span
              key="booked"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold"
              style={{ background: 'rgba(22,163,74,0.10)', color: '#15803D', border: '1px solid rgba(22,163,74,0.18)' }}
            >
              <Check size={10} strokeWidth={2.5} />
              Booked
            </motion.span>
          ) : (
            <motion.span
              key="wave"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-end gap-[2px] h-4"
              aria-hidden="true"
            >
              {[0, 1, 2, 3, 4].map(i => (
                <motion.span
                  key={i}
                  className="w-[2.5px] rounded-full"
                  style={{ background: aiSpeaking ? '#3859a8' : 'rgba(56,89,168,0.25)' }}
                  animate={aiSpeaking ? { height: [4, 12 + (i % 3) * 4, 4] } : { height: 4 }}
                  transition={aiSpeaking ? { duration: 0.5, delay: i * 0.07, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.3 }}
                />
              ))}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      {/* Transcript */}
      <div className="flex flex-col gap-2 justify-end flex-1 min-h-[150px]">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map(msg => (
            <motion.div
              key={`${msg.speaker}-${msg.text}`}
              layout="position"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className={msg.speaker === 'ai' ? 'self-end' : 'self-start'}
            >
              <div
                className="rounded-xl px-3 py-2 text-[12.5px] leading-[1.5] max-w-[260px]"
                style={
                  msg.speaker === 'ai'
                    ? { background: 'linear-gradient(135deg, #3859a8, #2a4688)', color: '#fff', borderBottomRightRadius: 5, fontFamily: 'var(--font-inter), Inter, sans-serif' }
                    : { background: 'rgba(15,17,41,0.05)', color: '#0F1129', border: '1px solid rgba(15,17,41,0.06)', borderBottomLeftRadius: 5, fontFamily: 'var(--font-inter), Inter, sans-serif' }
                }
              >
                {msg.shown}
                {msg.shown.length < msg.text.length && (
                  <span
                    className="inline-block w-[2px] h-[12px] ml-[2px] align-middle animate-caret-blink rounded-full"
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

function ActivityFeed({ items }) {
  return (
    <div className="flex flex-col rounded-2xl p-4 sm:p-5 h-full" style={{ background: 'rgba(255,255,255,0.65)', border: '1px solid rgba(15,17,41,0.06)' }}>
      <div className="flex items-center gap-2.5 mb-3">
        <span className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.10)' }}>
          <Activity size={14} strokeWidth={1.75} style={{ color: '#3B82F6' }} />
        </span>
        <span className="text-[12px] font-semibold text-text" style={{ fontFamily: 'var(--font-display)' }}>
          Happening now
        </span>
      </div>

      <ul className="flex flex-col gap-1.5 m-0 p-0 list-none">
        <AnimatePresence initial={false} mode="popLayout">
          {items.map(item => (
            <motion.li
              key={item.key}
              layout="position"
              initial={{ opacity: 0, y: -14, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, transition: { duration: 0.18 } }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2.5 rounded-xl px-2.5 py-2"
              style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(15,17,41,0.05)' }}
            >
              <span
                className="w-7 h-7 rounded-[9px] flex items-center justify-center shrink-0"
                style={{ background: `${item.color}12`, border: `1px solid ${item.color}20` }}
              >
                <item.icon size={13} strokeWidth={1.75} style={{ color: item.color }} />
              </span>
              <span className="min-w-0">
                <span className="block text-[12px] font-semibold text-text leading-tight truncate" style={{ fontFamily: 'var(--font-display)' }}>
                  {item.title}
                </span>
                <span className="block text-[10px] text-text-muted leading-tight mt-0.5 truncate" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                  {item.meta}
                </span>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}

export function HeroConsole() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { messages, aiSpeaking, booked } = useConversationDemo()
  const feedItems = useActivityFeed()

  return (
    <section className="relative overflow-hidden pt-36 pb-20 sm:pt-40">
      {/* Transparent base — the drifting aurora shows through */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">

        {/* Editorial headline block */}
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-7"
            style={{ background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(56, 89, 168,0.14)', backdropFilter: 'blur(8px)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-semibold text-primary tracking-[0.25em] uppercase font-display">
              Your AI front desk, on duty
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="font-extrabold text-text tracking-[-0.05em] mb-6"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.7rem, 6.6vw, 5rem)', lineHeight: 1.02 }}
          >
            Never miss a<br />
            <CyclingWord /> again.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
            className="text-lg text-text-secondary leading-[1.75] max-w-[540px] mx-auto mb-9"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Calls answered, chats handled, leads followed up, appointments
            booked. Your AI teammate works around the clock so nothing slips
            through while you run the business.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.42, ease: 'easeOut' }}
            className="flex flex-wrap justify-center gap-3"
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 no-underline text-sm font-semibold text-white btn-gradient btn-shine px-7 py-4 rounded-[12px] shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Book a Demo
              <ArrowRight size={15} strokeWidth={2} />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 no-underline text-sm font-semibold text-text px-7 py-4 rounded-[12px] transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              style={{ background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(15,17,41,0.08)', backdropFilter: 'blur(8px)', fontFamily: 'var(--font-display)' }}
            >
              Explore Solutions
            </Link>
          </motion.div>
        </div>

        {/* Live console */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <TiltCard maxTilt={1.5} className="rounded-[24px]">
            <div
              className="rounded-[24px] overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(24px) saturate(1.6)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.6)',
                border: '1px solid rgba(255,255,255,0.8)',
                boxShadow: '0 32px 90px rgba(56, 89, 168,0.16), 0 8px 28px rgba(15,17,41,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
              }}
            >
              {/* Chrome bar */}
              <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(15,17,41,0.06)', background: 'rgba(255,255,255,0.5)' }}>
                <div className="flex items-center gap-3">
                  <span className="flex gap-1.5" aria-hidden="true">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(15,17,41,0.12)' }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(15,17,41,0.12)' }} />
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(15,17,41,0.12)' }} />
                  </span>
                  <span className="text-[12px] font-semibold text-text-secondary" style={{ fontFamily: 'var(--font-display)' }}>
                    JotilLabs Live Console
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-[0.12em] uppercase" style={{ background: 'rgba(22,163,74,0.10)', color: '#15803D', border: '1px solid rgba(22,163,74,0.18)' }}>
                  <span className="relative flex w-1.5 h-1.5">
                    <span className="absolute inline-flex w-full h-full rounded-full animate-ping" style={{ background: 'rgba(22,163,74,0.5)' }} />
                    <span className="relative inline-flex w-1.5 h-1.5 rounded-full" style={{ background: '#16A34A' }} />
                  </span>
                  Live
                </span>
              </div>

              {/* Panels */}
              <div className="bg-dot-grid grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-4 p-4 sm:p-5">
                {mounted && (
                  <>
                    <CallPanel messages={messages} aiSpeaking={aiSpeaking} booked={booked} />
                    <ActivityFeed items={feedItems} />
                  </>
                )}
              </div>

              {/* Stats strip */}
              <div className="grid grid-cols-3" style={{ borderTop: '1px solid rgba(15,17,41,0.06)' }}>
                {CONSOLE_STATS.map((stat, i) => (
                  <div key={stat.label} className="px-4 py-4 text-center" style={i > 0 ? { borderLeft: '1px solid rgba(15,17,41,0.06)' } : undefined}>
                    <p className="text-lg sm:text-xl font-extrabold text-gradient leading-none" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.03em' }}>
                      {stat.value}
                    </p>
                    <p className="text-[10px] sm:text-[11px] text-text-secondary mt-1.5" style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  )
}
