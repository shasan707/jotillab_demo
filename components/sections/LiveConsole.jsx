'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import {
  PhoneCall, MessageSquare, Check, CalendarCheck, UserPlus, Star,
  PhoneForwarded, Activity,
} from 'lucide-react'
import { TiltCard } from '@/components/design'

/* "Live Console" device interface — sits between the hero and the Solutions
   bento. A glass panel with a typewriter call transcript, a streaming activity
   feed, and a stats strip. Extracted from the original HeroConsole so it can
   live as its own section under the new Spline hero. Motion respects
   prefers-reduced-motion (static transcript / no streaming). */

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

/** Looping conversation driving the console's call panel. A typing indicator
   shows while a party "types", then the full message drops in — like a real
   messaging app. This avoids per-character reflow/word-wrap jumps. */
function useConversationDemo() {
  const reduced = useReducedMotion()
  const [messages, setMessages] = useState([])
  const [typingSpeaker, setTypingSpeaker] = useState(null)
  const [aiSpeaking, setAiSpeaking] = useState(false)
  const [booked, setBooked] = useState(false)

  useEffect(() => {
    if (reduced) {
      setMessages(DEMO_SCRIPT)
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
      await wait(1200)
      while (!cancelled) {
        setMessages([])
        setBooked(false)
        await wait(500)
        for (const msg of DEMO_SCRIPT) {
          if (cancelled) return
          // "typing…" indicator, duration scaled to message length
          setTypingSpeaker(msg.speaker)
          setAiSpeaking(msg.speaker === 'ai')
          await wait(Math.min(1700, 650 + msg.text.length * 22))
          if (cancelled) return
          setTypingSpeaker(null)
          setMessages(prev => [...prev, msg])
          await wait(750)
        }
        if (cancelled) return
        setAiSpeaking(false)
        setBooked(true)
        await wait(4500)
      }
    }

    run()
    return () => {
      cancelled = true
      timeouts.forEach(clearTimeout)
    }
  }, [reduced])

  return { messages, typingSpeaker, aiSpeaking, booked }
}

/** Activity feed that streams a new event in every few seconds. */
function useActivityFeed() {
  const reduced = useReducedMotion()
  // Start already full (5 rows) so the list never grows/reflows — only swaps.
  const [items, setItems] = useState(() => [4, 3, 2, 1, 0].map(i => ({ ...FEED_EVENTS[i], key: i })))

  useEffect(() => {
    if (reduced) return
    let next = 5
    const interval = setInterval(() => {
      setItems(prev => {
        const ev = FEED_EVENTS[next % FEED_EVENTS.length]
        const added = [{ ...ev, key: next }, ...prev]
        next += 1
        return added.slice(0, 5)
      })
    }, 3400)
    return () => clearInterval(interval)
  }, [reduced])

  return items
}

function CallPanel({ messages, typingSpeaker, aiSpeaking, booked }) {
  const visible = messages.slice(typingSpeaker ? -2 : -3)

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
      <div className="flex flex-col gap-2 justify-end flex-1 min-h-[150px] overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          {visible.map(msg => (
            <motion.div
              key={`${msg.speaker}-${msg.text}`}
              layout="position"
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
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
                {msg.text}
              </div>
            </motion.div>
          ))}

          {typingSpeaker && (
            <motion.div
              key="typing"
              layout="position"
              initial={{ opacity: 0, y: 14, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className={typingSpeaker === 'ai' ? 'self-end' : 'self-start'}
            >
              <div
                className="rounded-xl px-3 py-2.5 flex items-center gap-1"
                style={
                  typingSpeaker === 'ai'
                    ? { background: 'linear-gradient(135deg, #3859a8, #2a4688)', borderBottomRightRadius: 5 }
                    : { background: 'rgba(15,17,41,0.05)', border: '1px solid rgba(15,17,41,0.06)', borderBottomLeftRadius: 5 }
                }
              >
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full"
                    style={{
                      background: typingSpeaker === 'ai' ? 'rgba(255,255,255,0.75)' : 'rgba(15,17,41,0.4)',
                      animation: `typing-dot 1.2s ease-in-out ${i * 0.18}s infinite`,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          )}
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
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
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

export function LiveConsole() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const { messages, typingSpeaker, aiSpeaking, booked } = useConversationDemo()
  const feedItems = useActivityFeed()

  // Scroll-driven "docking" effect: the panel lifts, scales, and tilts flat
  // as the section travels from the bottom of the viewport to center.
  const reduced = useReducedMotion()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'center center'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [80, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1])
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0])
  const opacity = useTransform(scrollYProgress, [0, 0.55], [0.35, 1])

  return (
    <section ref={sectionRef} className="relative bg-white py-16 sm:py-20">
      <div className="max-w-5xl mx-auto px-6" style={{ perspective: 1300 }}>
        <motion.div
          style={reduced ? undefined : { y, scale, rotateX, opacity, transformOrigin: 'center top' }}
        >
          <TiltCard maxTilt={1.5} className="rounded-[26px]">
            {/* Premium hardware-style gradient bezel */}
            <div
              className="rounded-[26px] p-[3px]"
              style={{
                background:
                  'linear-gradient(150deg, rgba(255,255,255,0.95) 0%, rgba(56,89,168,0.55) 30%, rgba(124,58,237,0.45) 58%, rgba(6,182,212,0.45) 80%, rgba(255,255,255,0.7) 100%)',
                boxShadow: '0 30px 70px rgba(56,89,168,0.18), 0 8px 26px rgba(15,17,41,0.08)',
              }}
            >
              <div
                className="rounded-[23px] overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.45)',
                  backdropFilter: 'blur(10px) saturate(1.4)',
                  WebkitBackdropFilter: 'blur(10px) saturate(1.4)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9)',
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
                    JotilLabs Live Dashboard
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
                    <CallPanel messages={messages} typingSpeaker={typingSpeaker} aiSpeaking={aiSpeaking} booked={booked} />
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
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  )
}
