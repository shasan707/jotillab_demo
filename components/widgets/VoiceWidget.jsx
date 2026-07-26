'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Mic, X, Volume2, Phone } from 'lucide-react'

/* Voice-only widget at bottom-LEFT (mirrors the chat widget at bottom-right).
   Opening it goes straight to the live Retell voice call UI — no tabs.
   The browser only ever sees a short-lived access token from our own API
   route; the Retell API key stays on the server. */

function VoiceCall() {
  const [status, setStatus] = useState('idle') // idle | connecting | live | error
  const [agentTalking, setAgentTalking] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const clientRef = useRef(null)

  useEffect(() => {
    return () => {
      try { clientRef.current?.stopCall() } catch {}
      clientRef.current = null
    }
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
    <div className="flex flex-col items-center justify-center h-full gap-5 p-6">
      <button
        onClick={live || connecting ? endCall : startCall}
        aria-label={live ? 'End the call' : connecting ? 'Cancel' : 'Start a voice call'}
        className="relative w-20 h-20 rounded-full border-none cursor-pointer flex items-center justify-center transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 disabled:opacity-60"
        style={{
          background: live
            ? 'linear-gradient(135deg, #22396E, #3859a8)'
            : 'linear-gradient(135deg, #3859a8, #2a4688)',
          boxShadow: live
            ? '0 0 40px rgba(56, 89, 168,0.4)'
            : '0 8px 24px rgba(56, 89, 168,0.3)',
        }}
      >
        {(live || connecting) && (
          <span
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: 'rgba(56, 89, 168,0.2)' }}
          />
        )}
        {connecting ? (
          <span className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : live ? (
          agentTalking ? <Volume2 size={28} color="#fff" strokeWidth={1.5} /> : <Mic size={28} color="#fff" strokeWidth={1.5} />
        ) : (
          <Mic size={28} color="#fff" strokeWidth={1.5} />
        )}
      </button>

      <p className="text-sm font-medium text-text-secondary">
        {connecting
          ? 'Connecting...'
          : live
            ? agentTalking
              ? 'Jotil AI is speaking. Tap to end.'
              : 'Live. Speak whenever you like.'
            : 'Tap to talk to our AI'}
      </p>

      {status === 'error' && (
        <p className="text-xs text-red-500 text-center max-w-[220px]">{errorMessage}</p>
      )}

      {/* Or call the same AI on the phone */}
      <div className="w-full max-w-[240px]">
        <div className="flex items-center gap-3 mb-3" aria-hidden="true">
          <span className="h-px flex-1 bg-black/8" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-text-secondary">or</span>
          <span className="h-px flex-1 bg-black/8" />
        </div>
        <a
          href="tel:+18669307859"
          className="flex items-center justify-center gap-2 w-full rounded-xl px-4 py-2.5 text-sm font-semibold no-underline transition-all duration-200 hover:-translate-y-[1px]"
          style={{
            color: '#3859a8',
            background: 'rgba(56,89,168,0.07)',
            border: '1px solid rgba(56,89,168,0.22)',
            boxShadow: '0 2px 8px rgba(56,89,168,0.10)',
          }}
        >
          <Phone size={15} strokeWidth={2} />
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
