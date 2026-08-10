'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'
import { CheckCircle2, MessageCircle, Undo2 } from 'lucide-react'
import { getIntakeConversation, CONTACT_QUESTION_IDS } from '@/lib/intakeQuestions'
import { ChatMessages } from './ChatMessages'
import { ChipGroup } from './ChipGroup'
import { ChatInputBar } from './ChatInputBar'
import { ChatProgress } from './ChatProgress'

/* Guided chat intake on each industry page. A scripted conversation asks
   the intake questions one at a time; selects answer with quick-reply
   chips, typed questions get an inline input. Once the contact block is
   answered a partial lead is created via /api/intake/lead and kept up to
   date as the conversation continues, so an abandoned chat still reaches
   the team. The final answer completes the lead through /api/intake,
   which also sends the notification email. Scripted on purpose: every
   answer stays structured, and the section works without any AI backend. */

const DOTS_MS = 550
const GAP_MS = 250
const PATCH_DEBOUNCE_MS = 1500

export function ChatIntake({ slug, industryName }) {
  const script = useMemo(() => {
    const items = []
    getIntakeConversation(slug).forEach((group) => {
      group.questions.forEach((q, qi) => {
        items.push({ q, groupTitle: group.title, intro: qi === 0 ? group.intro : null })
      })
    })
    return items
  }, [slug])
  const total = script.length

  const [messages, setMessages] = useState([])
  const [qIndex, setQIndex] = useState(0)
  const [phase, setPhase] = useState('idle') // idle | botTyping | awaiting | submitting | done | failed
  const [honeypot, setHoneypot] = useState('')

  const containerRef = useRef(null)
  const inView = useInView(containerRef, { once: true, amount: 0.3 })
  const reduced = useReducedMotion()

  const messagesRef = useRef([]) // mirror of `messages` for snapshots
  const answersRef = useRef({})
  const honeypotRef = useRef('')
  const leadRef = useRef(null) // { id, key } once the partial lead exists
  const leadTriedRef = useRef(false)
  const startedRef = useRef(false)
  const idRef = useRef(0)
  const timersRef = useRef([])
  const patchTimerRef = useRef(null)
  const snapshotsRef = useRef({}) // question index -> message count before it was asked

  useEffect(() => {
    return () => {
      timersRef.current.forEach(clearTimeout)
      clearTimeout(patchTimerRef.current)
    }
  }, [])

  function mutateMessages(updater) {
    messagesRef.current = updater(messagesRef.current)
    setMessages(messagesRef.current)
  }

  function schedule(fn, ms) {
    if (reduced || ms <= 0) {
      fn()
      return
    }
    timersRef.current.push(setTimeout(fn, ms))
  }

  /* Queue one or more bot bubbles: thinking dots first, then the text. */
  function botSay(texts, after) {
    setPhase('botTyping')
    let delay = 200
    texts.forEach((text) => {
      const id = ++idRef.current
      schedule(() => mutateMessages((prev) => [...prev, { id, role: 'bot', typing: true }]), delay)
      delay += DOTS_MS
      schedule(
        () => mutateMessages((prev) => prev.map((m) => (m.id === id ? { id, role: 'bot', text } : m))),
        delay
      )
      delay += GAP_MS
    })
    schedule(() => after?.(), delay)
  }

  function ask(index, prefixText) {
    const item = script[index]
    snapshotsRef.current[index] = messagesRef.current.length
    const opener = [prefixText, item.intro].filter(Boolean).join(' ')
    const texts = opener ? [opener] : []
    texts.push(item.q.prompt || item.q.label)
    botSay(texts, () => setPhase('awaiting'))
  }

  useEffect(() => {
    if (!inView || startedRef.current) return
    startedRef.current = true
    const greeting = `Hi, welcome to JotilLabs. A few quick questions and we will come back with a plan built for your ${industryName.toLowerCase()} business.`
    ask(0, greeting)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  async function createLead(currentAnswers) {
    try {
      const res = await fetch('/api/intake/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, answers: currentAnswers, website: honeypotRef.current }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok && data.lead && Number.isInteger(data.lead.id)) {
        leadRef.current = data.lead
      }
    } catch {
      // No lead is fine: the final submit still carries everything.
    }
  }

  function sendPatch() {
    if (!leadRef.current) return
    fetch('/api/intake/lead', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slug, lead: leadRef.current, answers: answersRef.current }),
    }).catch(() => {})
  }

  function schedulePatch(flushNow) {
    if (!leadRef.current) return
    clearTimeout(patchTimerRef.current)
    if (flushNow) sendPatch()
    else patchTimerRef.current = setTimeout(sendPatch, PATCH_DEBOUNCE_MS)
  }

  async function finish() {
    clearTimeout(patchTimerRef.current)
    setPhase('submitting')
    const bubbleId = ++idRef.current
    mutateMessages((prev) => [...prev, { id: bubbleId, role: 'bot', typing: true }])
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          answers: answersRef.current,
          website: honeypotRef.current,
          lead: leadRef.current || undefined,
        }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.')
      mutateMessages((prev) =>
        prev.map((m) =>
          m.id === bubbleId ? { id: bubbleId, role: 'bot', text: 'Thanks, we have everything we need.' } : m
        )
      )
      setPhase('done')
    } catch (err) {
      mutateMessages((prev) =>
        prev.map((m) =>
          m.id === bubbleId
            ? { id: bubbleId, role: 'bot', text: err.message || 'Could not send your answers. Please try again.' }
            : m
        )
      )
      setPhase('failed')
    }
  }

  /* value: string | string[] for answers, undefined for a skip. */
  function handleAnswer(value) {
    if (phase !== 'awaiting') return
    const item = script[qIndex]
    const q = item.q

    const display =
      value === undefined ? q.skipLabel || 'Skip this' : Array.isArray(value) ? value.join(', ') : value
    mutateMessages((prev) => [...prev, { id: ++idRef.current, role: 'user', text: display }])

    const nextAnswers = { ...answersRef.current }
    if (value === undefined) delete nextAnswers[q.id]
    else nextAnswers[q.id] = value
    answersRef.current = nextAnswers

    const next = qIndex + 1
    const contactDone = CONTACT_QUESTION_IDS.every((id) => nextAnswers[id])
    if (!leadRef.current && !leadTriedRef.current && contactDone) {
      leadTriedRef.current = true
      createLead(nextAnswers)
    } else if (leadRef.current) {
      // Flush at group boundaries so a group's answers land promptly.
      schedulePatch(next >= total || Boolean(script[next]?.intro))
    }

    if (next >= total) {
      setQIndex(next)
      finish()
      return
    }

    setQIndex(next)
    const thanks =
      q.id === CONTACT_QUESTION_IDS[CONTACT_QUESTION_IDS.length - 1] && nextAnswers.contact_name
        ? `Thanks, ${String(nextAnswers.contact_name).split(' ')[0]}.`
        : null
    ask(next, thanks)
  }

  function handleBack() {
    if (phase !== 'awaiting' || qIndex === 0) return
    timersRef.current.forEach(clearTimeout)
    timersRef.current = []
    const prev = qIndex - 1
    const cut = snapshotsRef.current[prev]
    mutateMessages((msgs) => msgs.slice(0, cut))
    const prevId = script[prev].q.id
    const nextAnswers = { ...answersRef.current }
    delete nextAnswers[prevId]
    answersRef.current = nextAnswers
    if (leadRef.current) schedulePatch(false)
    setQIndex(prev)
    ask(prev)
  }

  const currentItem = qIndex < total ? script[qIndex] : null
  const answered = Math.min(qIndex, total)
  const isChips = currentItem && (currentItem.q.type === 'select' || currentItem.q.type === 'multiselect')

  return (
    <div
      ref={containerRef}
      className="relative rounded-[20px] bg-white overflow-hidden flex flex-col"
      style={{
        border: '1px solid rgba(15,17,41,0.06)',
        boxShadow: '0 1px 2px rgba(15,17,41,0.04), 0 8px 24px rgba(15,17,41,0.04)',
      }}
    >
      {/* Header, matching the chat scenario card on the same page */}
      <div
        className="flex items-center gap-2.5 px-5 py-3.5 border-b border-black/5"
        style={{ background: 'linear-gradient(180deg, #f8faff, #ffffff)' }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: 'rgba(56,89,168,0.10)' }}
        >
          <MessageCircle size={15} color="#3859a8" strokeWidth={1.8} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">JotilLabs</p>
          <p className="text-sm font-bold text-text leading-tight truncate">
            Tell us about your business. It takes about two minutes.
          </p>
        </div>
      </div>

      <ChatProgress answered={phase === 'done' ? total : answered} total={total} title={currentItem?.groupTitle || ''} />

      {/* Honeypot: hidden from people, tempting for bots */}
      <div className="absolute w-px h-px overflow-hidden -m-px" aria-hidden="true" style={{ clip: 'rect(0 0 0 0)' }}>
        <label htmlFor={`intake-website-${slug}`}>Website</label>
        <input
          id={`intake-website-${slug}`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => {
            setHoneypot(e.target.value)
            honeypotRef.current = e.target.value
          }}
        />
      </div>

      <ChatMessages messages={messages} reduced={reduced} />

      {/* Answer area */}
      <div className="border-t border-black/5 px-5 py-4">
        {phase === 'awaiting' && currentItem && (
          <div>
            {isChips ? (
              <ChipGroup
                key={currentItem.q.id}
                question={currentItem.q}
                onAnswer={handleAnswer}
                onSkip={() => handleAnswer(undefined)}
              />
            ) : (
              <ChatInputBar
                key={currentItem.q.id}
                question={currentItem.q}
                onAnswer={handleAnswer}
                onSkip={() => handleAnswer(undefined)}
              />
            )}
            {qIndex > 0 && (
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-text-secondary hover:text-text bg-transparent border-none cursor-pointer transition-colors"
                >
                  <Undo2 size={12} strokeWidth={2.2} />
                  Change previous answer
                </button>
              </div>
            )}
          </div>
        )}

        {(phase === 'idle' || phase === 'botTyping' || phase === 'submitting') && (
          <p className="text-xs text-text-secondary py-2">
            {phase === 'submitting' ? 'Sending your answers...' : 'Your answers stay between you and our team.'}
          </p>
        )}

        {phase === 'done' && (
          <div className="flex items-center gap-3 py-1">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
              style={{ background: 'rgba(56,89,168,0.1)' }}
            >
              <CheckCircle2 size={20} color="#3859a8" strokeWidth={1.5} />
            </div>
            <p className="text-sm text-text-secondary">
              Our team will review your answers and reach out within one business day with a plan built
              for your {industryName.toLowerCase()} business.
            </p>
          </div>
        )}

        {phase === 'failed' && (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={finish}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white btn-gradient px-6 py-2.5 rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300"
            >
              Try again
            </button>
            <p className="text-xs text-text-secondary">Or call us at +1 (358) 900-0040.</p>
          </div>
        )}
      </div>
    </div>
  )
}
