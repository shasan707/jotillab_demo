'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Mic, X, Volume2, Phone } from 'lucide-react'
import { VoiceOrbGL } from './VoiceOrbGL'

/* Voice agent at bottom-LEFT. Tapping the trigger opens the panel already
   dialing (no extra step): inside is the WebGL orb (reference shader in
   brand blues) with the call button at its center, the state label, the
   "Or call" line, and the privacy note. Tapping the orb (or closing the
   panel) ends the call. The browser only ever sees a short-lived access
   token from our own API route; the Retell API key stays on the server. */

const CSS = `
@keyframes vwt-glow {
  0%, 100% { box-shadow: 0 4px 15px rgba(56,89,168,0.3); }
  50% { box-shadow: 0 4px 22px rgba(56,89,168,0.55), 0 0 10px rgba(59,130,246,0.3); }
}
@keyframes vwo-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.85; }
}
@keyframes vwo-icon {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
`

function VoiceSession() {
  const [status, setStatus] = useState('connecting') // connecting | live | idle | error
  const [agentTalking, setAgentTalking] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const clientRef = useRef(null)
  const autoStarted = useRef(false)

  // Dial as soon as the orb appears; hang up when it goes away.
  useEffect(() => {
    if (!autoStarted.current) {
      autoStarted.current = true
      startCall()
    }
    return () => {
      try { clientRef.current?.stopCall() } catch {}
      clientRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function startCall() {
    setStatus('connecting')
    setErrorMessage('')
    try {
      const res = await fetch('/api/retell/web-call', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not start the call.')

      const { RetellWebClient } = await import('retell-client-js-sdk')
      const client = new RetellWebClient()
      clientRef.current = client

      client.on('call_started', () => setStatus('live'))
      client.on('call_ended', () => {
        clientRef.current = null
        setStatus('idle')
        setAgentTalking(false)
      })
      client.on('agent_start_talking', () => setAgentTalking(true))
      client.on('agent_stop_talking', () => setAgentTalking(false))
      client.on('error', () => {
        try { client.stopCall() } catch {}
        clientRef.current = null
        setStatus('error')
        setAgentTalking(false)
        setErrorMessage('The call dropped. Please try again.')
      })

      await client.startCall({ accessToken: data.accessToken })
    } catch (err) {
      clientRef.current = null
      setStatus('error')
      setAgentTalking(false)
      setErrorMessage(err.message || 'Could not start the call.')
    }
  }

  function endCall() {
    try { clientRef.current?.stopCall() } catch {}
    clientRef.current = null
    setStatus('idle')
    setAgentTalking(false)
  }

  const live = status === 'live'
  const connecting = status === 'connecting'

  const label = connecting
    ? 'Connecting you now...'
    : live
      ? agentTalking
        ? 'Jotil AI is speaking'
        : 'Live. Speak anytime.'
      : status === 'error'
        ? 'Could not connect'
        : 'Talk to Jotil AI'

  return (
    <div
      className="flex h-full select-none flex-col items-center justify-center gap-1 px-6 pb-5 pt-3"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f2f6fd 100%)' }}
    >
      {/* Orb — tap to end the live call, or to retry after an error */}
      <button
        onClick={live || connecting ? endCall : startCall}
        aria-label={live ? 'End the call' : connecting ? 'Cancel' : 'Start a voice call'}
        className="relative block h-[170px] w-[170px] cursor-pointer rounded-full border-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4"
      >
        <VoiceOrbGL size={170} speed={live ? 1.9 : connecting ? 1.5 : 1} className="absolute inset-0" />
        {/* Center call button */}
        <span
          className="absolute left-1/2 top-1/2 z-10 flex h-[64px] w-[64px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #7db2ff 0%, #3B82F6 45%, #22396E 100%)',
            boxShadow: '0 8px 22px rgba(56,89,168,0.5), inset 0 2px 3px rgba(255,255,255,0.4)',
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, transparent, rgba(255,255,255,0.18), rgba(255,255,255,0.4))',
              animation: 'vwo-glow 2s ease-in-out infinite',
            }}
          />
          {connecting ? (
            <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : live ? (
            agentTalking
              ? <Volume2 size={24} color="#fff" strokeWidth={2} style={{ animation: 'vwo-icon 1.2s ease-in-out infinite' }} />
              : <Mic size={24} color="#fff" strokeWidth={2} />
          ) : (
            <Mic size={24} color="#fff" strokeWidth={2} style={{ animation: 'vwo-icon 2s ease-in-out infinite' }} />
          )}
        </span>
      </button>

      <p className="relative m-0 mt-1.5 text-center text-[16px] font-semibold tracking-[0.01em] text-text">
        {label}
      </p>

      {status === 'error' ? (
        <p className="relative m-0 mt-0.5 max-w-[230px] text-center text-xs text-red-500">
          {errorMessage}{' '}
          <button
            onClick={startCall}
            className="cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-primary underline"
          >
            Retry
          </button>
        </p>
      ) : live ? (
        <p className="relative m-0 mt-0.5 text-center text-[11.5px] text-text-secondary/80">
          Tap the orb to end the call
        </p>
      ) : null}

      <a
        href="tel:+18669307859"
        className="relative mt-1.5 flex items-center justify-center gap-1.5 text-[13.5px] font-medium no-underline transition-colors hover:text-primary"
        style={{ color: '#3859a8', fontVariantNumeric: 'tabular-nums' }}
      >
        <Phone size={13} strokeWidth={2} />
        Or call +1 (866) 930-7859
      </a>

      <p className="relative m-0 mt-1 text-center text-[11px] tracking-[0.03em] text-text-secondary/70">
        Secure and confidential
      </p>
    </div>
  )
}

export function VoiceWidget() {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-50">
      <style>{CSS}</style>

      {/* Voice panel. Mount = dial, unmount = hang up. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 left-0 flex h-[400px] w-[calc(100vw-2rem)] max-h-[calc(100vh-6rem)] flex-col overflow-hidden rounded-2xl border border-black/8 bg-white shadow-2xl shadow-black/10 sm:w-[320px]"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: 'linear-gradient(135deg, #3859a8, #2a4688)' }}
            >
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
                  <Mic size={12} color="#fff" strokeWidth={2} />
                </div>
                <span className="text-sm font-semibold text-white">Jotil Voice AI</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close voice assistant"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-lg border-none bg-white/10 transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <X size={14} color="#fff" strokeWidth={2} />
              </button>
            </div>
            <div className="min-h-0 flex-1">
              <VoiceSession />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger — the orb itself, mini size, on every page */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.94 }}
        animate={open || reduced ? { y: 0 } : { y: [0, -6, 0] }}
        transition={open || reduced ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label={open ? 'Close voice assistant' : 'Talk to our voice AI'}
      >
        <VoiceOrbGL size={56} speed={open ? 1.8 : 1} className="absolute inset-0" />
        <span
          className="relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #7db2ff 0%, #3B82F6 45%, #22396E 100%)',
            boxShadow: '0 3px 10px rgba(56,89,168,0.5), inset 0 1px 2px rgba(255,255,255,0.4)',
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                <X size={15} color="#fff" strokeWidth={2.2} />
              </motion.span>
            ) : (
              <motion.span
                key="mic"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.15 }}
                className="flex"
              >
                <Mic size={15} color="#fff" strokeWidth={2.2} />
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>
    </div>
  )
}
