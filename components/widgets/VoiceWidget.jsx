'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Mic, X, Volume2, Phone } from 'lucide-react'

/* Voice-only widget at bottom-LEFT (mirrors the chat widget at bottom-right).
   Tapping the trigger connects the call IMMEDIATELY — the panel opens
   already dialing, like the chat agent opens ready to type. Closing the
   panel ends the call. The browser only ever sees a short-lived access
   token from our own API route; the Retell API key stays on the server. */

function VoiceCall() {
  const [status, setStatus] = useState('connecting') // connecting | live | idle | error
  const [agentTalking, setAgentTalking] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const clientRef = useRef(null)
  const autoStarted = useRef(false)

  // Connect as soon as the panel opens; end the call when it closes.
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

      // Load the SDK only when a call actually starts.
      const { RetellWebClient } = await import('retell-client-js-sdk')
      const client = new RetellWebClient()
      clientRef.current = client

      client.on('call_started', () => setStatus('live'))
      client.on('call_ended', () => {
        setStatus('idle')
        setAgentTalking(false)
        clientRef.current = null
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

  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-4 p-6"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f5f8fd 100%)' }}
    >
      <style>{`
        @keyframes vwc-ring {
          0% { transform: scale(1); opacity: 0.45; }
          80%, 100% { transform: scale(1.55); opacity: 0; }
        }
      `}</style>

      {/* Call sphere — mirrors the 3D trigger; tap ends (or retries) the call */}
      <button
        onClick={live || connecting ? endCall : startCall}
        aria-label={live ? 'End the call' : connecting ? 'Cancel' : 'Start a voice call'}
        className="relative w-20 h-20 rounded-full border-none cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
        style={{
          background: live
            ? 'radial-gradient(120% 120% at 30% 24%, #6a94e8 0%, #3859a8 40%, #22396E 78%, #171f3d 100%)'
            : 'radial-gradient(120% 120% at 30% 24%, #7db2ff 0%, #3B82F6 40%, #3859a8 74%, #22396E 100%)',
          boxShadow: [
            'inset 0 2px 4px rgba(255,255,255,0.45)',
            'inset 0 -6px 12px rgba(15,17,41,0.35)',
            live ? '0 0 44px rgba(59,130,246,0.45)' : '0 10px 26px rgba(56,89,168,0.4)',
          ].join(', '),
        }}
      >
        {/* Live pulse rings — a second, delayed ring while the agent speaks */}
        {(live || connecting) && (
          <>
            <span
              aria-hidden="true"
              className="absolute inset-0 rounded-full"
              style={{ background: 'rgba(59,130,246,0.22)', animation: 'vwc-ring 1.8s ease-out infinite' }}
            />
            {agentTalking && (
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-full"
                style={{ background: 'rgba(6,182,212,0.20)', animation: 'vwc-ring 1.8s 0.55s ease-out infinite' }}
              />
            )}
          </>
        )}
        {/* Glass highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[8%] h-[36%] w-[62%] -translate-x-1/2 rounded-full"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0))' }}
        />
        {connecting ? (
          <span className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : live ? (
          agentTalking ? <Volume2 size={28} color="#fff" strokeWidth={1.5} /> : <Mic size={28} color="#fff" strokeWidth={1.5} />
        ) : (
          <Mic size={28} color="#fff" strokeWidth={1.5} />
        )}
      </button>

      {/* Status pill */}
      <span
        className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-[12.5px] font-medium"
        style={{ background: 'rgba(56,89,168,0.06)', border: '1px solid rgba(56,89,168,0.14)' }}
      >
        <span
          className="h-2 w-2 rounded-full"
          style={{
            background: status === 'error' ? '#DC2626' : live ? '#12a06b' : '#3B82F6',
            animation: connecting ? 'vwc-ring 1.2s ease-out infinite' : 'none',
          }}
        />
        <span className="text-text-secondary">
          {connecting
            ? 'Connecting you now...'
            : live
              ? agentTalking
                ? 'Jotil AI is speaking. Tap to end.'
                : 'Live. Speak whenever you like.'
              : status === 'error'
                ? 'Something went wrong.'
                : 'Call ended. Tap to talk again.'}
        </span>
      </span>

      {status === 'error' && (
        <p className="text-xs text-red-500 text-center max-w-[220px] m-0">
          {errorMessage} <button onClick={startCall} className="border-none bg-transparent p-0 text-xs font-semibold text-primary cursor-pointer underline">Retry</button>
        </p>
      )}

      {/* Or call the same AI on the phone */}
      <div className="w-full max-w-[248px] mt-1">
        <div className="flex items-center gap-3 mb-3" aria-hidden="true">
          <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, transparent, rgba(15,17,41,0.14))' }} />
          <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-text-secondary">or</span>
          <span className="h-px flex-1" style={{ background: 'linear-gradient(90deg, rgba(15,17,41,0.14), transparent)' }} />
        </div>
        <a
          href="tel:+18669307859"
          className="group flex items-center justify-center gap-2.5 w-full rounded-xl px-4 py-3 text-sm font-semibold no-underline transition-all duration-200 hover:-translate-y-[2px] active:translate-y-0"
          style={{
            color: '#ffffff',
            background: 'linear-gradient(135deg, #3859a8 0%, #3B82F6 100%)',
            boxShadow: '0 6px 18px rgba(56,89,168,0.35), inset 0 1px 0 rgba(255,255,255,0.25)',
          }}
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15 transition-transform duration-200 group-hover:rotate-12">
            <Phone size={13} strokeWidth={2.2} />
          </span>
          Call +1 (866) 930-7859
        </a>
        <p className="text-[11px] text-text-secondary/70 text-center mt-2 m-0">
          The same AI picks up the phone.
        </p>
      </div>
    </div>
  )
}

export function VoiceWidget() {
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-50">
      {/* Voice panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-16 left-0 w-[calc(100vw-2rem)] sm:w-[320px] h-[380px] max-h-[calc(100vh-6rem)] bg-white rounded-2xl border border-black/8 shadow-2xl shadow-black/10 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ background: 'linear-gradient(135deg, #3859a8, #2a4688)' }}
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                  <Mic size={12} color="#fff" strokeWidth={2} />
                </div>
                <span className="text-sm font-semibold text-white">Jotil Voice AI</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close voice assistant"
                className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center border-none cursor-pointer hover:bg-white/20 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50"
              >
                <X size={14} color="#fff" strokeWidth={2} />
              </button>
            </div>

            {/* Voice call — mounting/unmounting with the panel also ends any
                call when the panel is closed. */}
            <div className="flex-1 min-h-0">
              <VoiceCall />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger — 3D glossy sphere with an orbiting light ring */}
      <style>{`@keyframes vw-orbit { to { transform: rotate(360deg); } }`}</style>
      <motion.button
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1, rotate: -3 }}
        whileTap={{ scale: 0.94 }}
        animate={open || reduced ? { y: 0 } : { y: [0, -7, 0] }}
        transition={open || reduced ? { duration: 0.2 } : { duration: 3.2, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
        className="relative w-14 h-14 rounded-full border-none cursor-pointer flex items-center justify-center"
        style={{
          background:
            'radial-gradient(120% 120% at 30% 24%, #6a94e8 0%, #3859a8 40%, #2a4688 72%, #171f3d 100%)',
          boxShadow: [
            'inset 0 2px 4px rgba(255,255,255,0.45)',
            'inset 0 -7px 14px rgba(15,17,41,0.4)',
            '0 14px 34px rgba(34,57,110,0.5)',
            '0 5px 14px rgba(56,89,168,0.4)',
          ].join(', '),
        }}
        aria-label={open ? 'Close voice assistant' : 'Talk to our voice AI'}
      >
        {/* Orbiting light ring (counter-direction to the chat widget) */}
        {!reduced && (
          <span
            aria-hidden="true"
            className="absolute inset-[-5px] rounded-full"
            style={{
              padding: 2,
              background:
                'conic-gradient(from 180deg, rgba(56,89,168,0) 0deg, rgba(59,130,246,0.9) 120deg, rgba(6,182,212,0.9) 190deg, rgba(56,89,168,0) 300deg)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
              animation: 'vw-orbit 3.4s linear infinite reverse',
            }}
          />
        )}
        {/* Glass highlight */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-[7%] h-[38%] w-[64%] -translate-x-1/2 rounded-full"
          style={{ background: 'linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0))' }}
        />
        {!open && !reduced && (
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'rgba(56,89,168,0.35)', animationDuration: '2.4s', animationDelay: '1.2s' }}
          />
        )}
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
