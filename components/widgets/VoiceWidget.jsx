'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Mic, X, Volume2, Phone } from 'lucide-react'
import { VoiceOrbGL } from './VoiceOrbGL'

/* Voice agent at bottom-LEFT. No panel, no extra step: tapping the trigger
   reveals the free-floating orb (WebGL, brand blues) which starts dialing
   IMMEDIATELY, with the label, "Or call" line, and privacy note stacked
   below it. Tapping the orb (or the trigger again) ends the call. The
   browser only ever sees a short-lived access token from our own API
   route; the Retell API key and agent id stay on the server. */

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

const TEXT_HALO = {
  textShadow: '0 1px 0 rgba(255,255,255,0.85), 0 0 14px rgba(255,255,255,0.9)',
}

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
    <div className="relative flex w-[240px] select-none flex-col items-center">
      {/* Soft halo so the free-floating stack reads on any page */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-x-10 -inset-y-8 rounded-[48px]"
        style={{
          background:
            'radial-gradient(closest-side, rgba(250,251,253,0.98) 40%, rgba(250,251,253,0.85) 68%, transparent)',
          backdropFilter: 'blur(2px)',
        }}
      />

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

      <p className="relative m-0 mt-1.5 text-center text-[16px] font-semibold tracking-[0.01em] text-text" style={TEXT_HALO}>
        {label}
      </p>

      {status === 'error' ? (
        <p className="relative m-0 mt-0.5 max-w-[230px] text-center text-xs text-red-500" style={TEXT_HALO}>
          {errorMessage}{' '}
          <button
            onClick={startCall}
            className="cursor-pointer border-none bg-transparent p-0 text-xs font-semibold text-primary underline"
          >
            Retry
          </button>
        </p>
      ) : live ? (
        <p className="relative m-0 mt-0.5 text-center text-[11.5px] text-text-secondary/80" style={TEXT_HALO}>
          Tap the orb to end the call
        </p>
      ) : null}

      <a
        href="tel:+18669307859"
        className="relative mt-1.5 flex items-center justify-center gap-1.5 text-[13.5px] font-medium no-underline transition-colors hover:text-primary"
        style={{ color: '#3859a8', fontVariantNumeric: 'tabular-nums', ...TEXT_HALO }}
      >
        <Phone size={13} strokeWidth={2} />
        Or call +1 (866) 930-7859
      </a>

      <p className="relative m-0 mt-1 text-center text-[11px] tracking-[0.03em] text-text-secondary/70" style={TEXT_HALO}>
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

      {/* Free-floating voice session (no panel). Mount = dial, unmount = hang up. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.92 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-[4.5rem] left-0"
          >
            <VoiceSession />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger — reference style: gradient disc, white ring, float + glow */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        animate={open || reduced ? { y: 0 } : { y: [0, -6, 0] }}
        transition={open || reduced ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full"
        style={{
          background: 'linear-gradient(135deg, #22396E 0%, #3859a8 60%, #3B82F6 100%)',
          border: '3px solid #ffffff',
          animation: reduced ? 'none' : 'vwt-glow 2s ease-in-out infinite',
        }}
        aria-label={open ? 'Close voice assistant' : 'Talk to our voice AI'}
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
              <X size={22} color="#fff" strokeWidth={1.5} />
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
              <Mic size={22} color="#fff" strokeWidth={1.8} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  )
}
