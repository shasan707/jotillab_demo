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
      className="flex flex-col items-center justify-center h-full gap-1.5 px-6 pb-5 pt-3"
      style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f2f6fd 100%)' }}
    >
      <style>{`
        @keyframes vwo-spin { to { transform: rotate(360deg); } }
        @keyframes vwo-blob {
          0%, 100% { border-radius: 45% 55% 53% 47% / 54% 45% 55% 46%; }
          25% { border-radius: 55% 45% 44% 56% / 47% 55% 45% 53%; }
          50% { border-radius: 46% 54% 56% 44% / 44% 53% 47% 56%; }
          75% { border-radius: 56% 44% 47% 53% / 53% 46% 54% 47%; }
        }
        @keyframes vwo-glow {
          0%, 100% { opacity: 0.45; }
          50% { opacity: 0.85; }
        }
        @keyframes vwo-icon {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>

      {/* Orb: organic glowing ring with the call button at its center.
          Tap ends the live call (or retries after an error). */}
      <button
        onClick={live || connecting ? endCall : startCall}
        aria-label={live ? 'End the call' : connecting ? 'Cancel' : 'Start a voice call'}
        className="relative h-[168px] w-[168px] shrink-0 rounded-full border-none bg-transparent p-0 cursor-pointer flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-4"
      >
        {/* Bloom */}
        <span
          aria-hidden="true"
          className="absolute inset-[-5%] rounded-full"
          style={{
            background:
              'conic-gradient(from 210deg, #22396E 0deg, #3859a8 90deg, #3B82F6 180deg, #06b6d4 265deg, #22396E 360deg)',
            filter: 'blur(18px)',
            opacity: live ? 0.55 : 0.35,
            transition: 'opacity 0.5s ease',
            animation: `vwo-spin ${live || connecting ? '5s' : '14s'} linear infinite, vwo-blob ${live || connecting ? '4s' : '9s'} ease-in-out infinite`,
          }}
        />
        {/* Ring disc */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{
            background:
              'conic-gradient(from 210deg, #22396E 0deg, #3859a8 90deg, #3B82F6 180deg, #06b6d4 265deg, #22396E 360deg)',
            animation: `vwo-spin ${live || connecting ? '5s' : '14s'} linear infinite, vwo-blob ${live || connecting ? '4s' : '9s'} ease-in-out infinite`,
          }}
        />
        {/* Travelling highlight */}
        <span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ animation: `vwo-spin ${live || connecting ? '2.6s' : '7s'} linear infinite reverse` }}
        >
          <span
            className="absolute left-1/2 top-[-4%] h-[30%] w-[30%] -translate-x-1/2 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(186,230,253,0.55) 40%, transparent 70%)',
              filter: 'blur(4px)',
              mixBlendMode: 'screen',
            }}
          />
        </span>
        {/* Inner face (turns the disc into a ring) */}
        <span
          aria-hidden="true"
          className="absolute inset-[9%] rounded-full"
          style={{
            background:
              'radial-gradient(120% 120% at 68% 26%, #ffffff 0%, #f6f9ff 45%, #eef2fb 75%, #e6ecf9 100%)',
            boxShadow:
              'inset 0 3px 12px rgba(255,255,255,0.95), inset 0 -12px 28px rgba(56,89,168,0.14), inset 10px 0 24px rgba(6,182,212,0.10)',
            animation: `vwo-blob ${live || connecting ? '5s' : '11s'} ease-in-out infinite`,
          }}
        />
        {/* Center call button */}
        <span
          className="relative z-10 flex h-[64px] w-[64px] items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #7db2ff 0%, #3B82F6 45%, #22396E 100%)',
            boxShadow: '0 8px 22px rgba(56,89,168,0.45), inset 0 2px 3px rgba(255,255,255,0.4)',
          }}
        >
          {/* Pulsing glow overlay */}
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, transparent, rgba(255,255,255,0.18), rgba(255,255,255,0.4))',
              animation: 'vwo-glow 2s ease-in-out infinite',
            }}
          />
          {connecting ? (
            <span className="h-6 w-6 rounded-full border-2 border-white/40 border-t-white animate-spin" />
          ) : live ? (
            agentTalking
              ? <Volume2 size={24} color="#fff" strokeWidth={2} style={{ animation: 'vwo-icon 1.2s ease-in-out infinite' }} />
              : <Mic size={24} color="#fff" strokeWidth={2} />
          ) : (
            <Mic size={24} color="#fff" strokeWidth={2} style={{ animation: 'vwo-icon 2s ease-in-out infinite' }} />
          )}
        </span>
      </button>

      {/* Label */}
      <p className="m-0 mt-2 text-[16px] font-semibold tracking-[0.01em] text-text text-center">
        {label}
      </p>

      {status === 'error' ? (
        <p className="m-0 text-xs text-red-500 text-center max-w-[230px]">
          {errorMessage}{' '}
          <button onClick={startCall} className="border-none bg-transparent p-0 text-xs font-semibold text-primary cursor-pointer underline">
            Retry
          </button>
        </p>
      ) : live ? (
        <p className="m-0 text-[11.5px] text-text-secondary/70 text-center">Tap the orb to end the call</p>
      ) : null}

      {/* Or call the phone line */}
      <a
        href="tel:+18669307859"
        className="mt-1 flex items-center justify-center gap-1.5 text-[13.5px] font-medium no-underline transition-colors hover:text-primary"
        style={{ color: '#3859a8', fontVariantNumeric: 'tabular-nums' }}
      >
        <Phone size={13} strokeWidth={2} />
        Or call +1 (866) 930-7859
      </a>

      <p className="m-0 text-[11px] tracking-[0.03em] text-text-secondary/60 text-center">
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
