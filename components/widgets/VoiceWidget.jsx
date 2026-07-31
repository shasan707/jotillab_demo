'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Mic, Volume2, Phone } from 'lucide-react'
import { VoiceOrbGL } from './VoiceOrbGL'
import { brand } from '@/lib/brand'

/* Voice agent at bottom-LEFT, always visible on every page — the reference
   layout at widget scale: the orb with the call button at its center, the
   state label, the "Or call" line, and the privacy note floating beneath it.
   No panel and no extra step: tapping the orb starts the call INSTANTLY;
   tapping again ends it. The browser only ever sees a short-lived access
   token from our own API route; the Retell API key stays on the server. */

const CSS = `
@keyframes vwo-glow {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 0.85; }
}
@keyframes vwo-icon {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}
@keyframes vwb-eq {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.8); }
}
@keyframes vwb-wave {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(2); }
}
`

/* Live call visualizer, matching the reference: green EQ bars while the
   assistant listens, amber wave bars while it speaks. */
function VoiceBars({ speaking, reduced }) {
  const heights = speaking ? [8, 14, 22, 14, 8] : [10, 18, 12]
  const gradient = speaking
    ? 'linear-gradient(to top, #f59e0b, #fbbf24)'
    : 'linear-gradient(to top, #12a06b, #10b981)'
  return (
    <div className="mt-1 flex flex-col items-center gap-1">
      <span
        className="text-[9.5px] font-semibold uppercase tracking-[0.1em] text-text-secondary/80"
        style={GLOW}
      >
        {speaking ? 'Speaking' : 'Listening'}
      </span>
      <div className="flex h-[24px] items-center gap-[3px]">
        {heights.map((h, i) => (
          <span
            key={`${speaking}-${i}`}
            className="w-[4px] rounded-full"
            style={{
              height: h,
              background: gradient,
              animation: reduced
                ? 'none'
                : `${speaking ? 'vwb-wave 0.8s' : 'vwb-eq 1s'} ${i * (speaking ? 0.1 : 0.15)}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

const GLOW = {
  textShadow:
    '0 1px 2px rgba(255,255,255,0.95), 0 0 10px rgba(255,255,255,0.9), 0 0 22px rgba(255,255,255,0.85)',
}

export function VoiceWidget() {
  const [status, setStatus] = useState('idle') // idle | connecting | live | error
  const [agentTalking, setAgentTalking] = useState(false)
  const clientRef = useRef(null)
  const reduced = useReducedMotion()

  // End any live call when leaving the site.
  useEffect(() => {
    return () => {
      try { clientRef.current?.stopCall() } catch {}
      clientRef.current = null
    }
  }, [])

  async function startCall() {
    setStatus('connecting')

    // Mic preflight: surface a blocked/broken microphone immediately instead
    // of joining a call the agent can never hear ("error_no_audio_received").
    try {
      const probe = await navigator.mediaDevices.getUserMedia({ audio: true })
      probe.getTracks().forEach((t) => t.stop())
    } catch {
      setStatus('mic')
      return
    }

    try {
      const res = await fetch('/api/retell/web-call', { method: 'POST' })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not start the call.')

      const { RetellWebClient } = await import('retell-client-js-sdk')
      const client = new RetellWebClient()
      clientRef.current = client

      // Only the CURRENT client may drive state: if the user cancelled while
      // we were connecting, events from this stale client are ignored and
      // the call is torn down instead of resurrecting the UI.
      const isCurrent = () => clientRef.current === client

      client.on('call_started', () => {
        if (isCurrent()) setStatus('live')
        else { try { client.stopCall() } catch {} }
      })
      client.on('call_ended', () => {
        if (!isCurrent()) return
        clientRef.current = null
        setStatus('idle')
        setAgentTalking(false)
      })
      client.on('agent_start_talking', () => { if (isCurrent()) setAgentTalking(true) })
      client.on('agent_stop_talking', () => { if (isCurrent()) setAgentTalking(false) })
      client.on('error', () => {
        try { client.stopCall() } catch {}
        if (!isCurrent()) return
        clientRef.current = null
        setStatus('error')
        setAgentTalking(false)
      })

      await client.startCall({ accessToken: data.accessToken, sampleRate: 24000 })
      if (!isCurrent()) { try { client.stopCall() } catch {} }
    } catch {
      clientRef.current = null
      setStatus('error')
      setAgentTalking(false)
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
  const busy = live || connecting

  const label = connecting
    ? 'Connecting...'
    : live
      ? agentTalking
        ? 'Jotil AI is speaking'
        : 'Live. Tap to end.'
      : status === 'mic'
        ? 'Microphone is blocked. Allow mic access, then tap again.'
        : status === 'error'
          ? 'Tap to try again'
          : 'Talk to Jotil AI'

  return (
    <div className="fixed bottom-4 left-4 z-50 flex w-[176px] select-none flex-col items-center sm:bottom-5 sm:left-5">
      <style>{CSS}</style>

      {/* Orb — tap to start the call instantly, tap again to end */}
      <motion.button
        onClick={busy ? endCall : startCall}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        animate={busy || reduced ? { y: 0 } : { y: [0, -5, 0] }}
        transition={busy || reduced ? { duration: 0.2 } : { duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1.1 }}
        className="relative flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border-none bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        aria-label={live ? 'End the call' : connecting ? 'Cancel' : 'Talk to our voice AI'}
      >
        <VoiceOrbGL size={56} speed={live ? 1.9 : connecting ? 1.5 : 1} className="absolute inset-0" />
        {/* Center call button */}
        <span
          className="relative z-10 flex h-[30px] w-[30px] items-center justify-center rounded-full"
          style={{
            background: 'radial-gradient(circle at 35% 30%, #7db2ff 0%, #3B82F6 45%, #22396E 100%)',
            boxShadow: '0 4px 14px rgba(56,89,168,0.5), inset 0 1px 2px rgba(255,255,255,0.4)',
          }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 rounded-full"
            style={{
              background: 'radial-gradient(circle, transparent, rgba(255,255,255,0.18), rgba(255,255,255,0.4))',
              animation: reduced ? 'none' : 'vwo-glow 2s ease-in-out infinite',
            }}
          />
          {connecting ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : live && agentTalking ? (
            <Volume2 size={15} color="#fff" strokeWidth={2.2} style={{ animation: reduced ? 'none' : 'vwo-icon 1.2s ease-in-out infinite' }} />
          ) : (
            <Mic size={15} color="#fff" strokeWidth={2.2} style={{ animation: reduced || busy ? 'none' : 'vwo-icon 2s ease-in-out infinite' }} />
          )}
        </span>
      </motion.button>

      {/* Label */}
      <p className="m-0 mt-1.5 text-center text-[13px] font-semibold leading-tight text-text" style={GLOW}>
        {label}
      </p>

      {/* Live visualizer: listening / speaking bars like the reference */}
      {live && <VoiceBars speaking={agentTalking} reduced={reduced} />}

      {/* Or call the phone line */}
      <a
        href={brand.phoneHref}
        className="mt-1 flex items-center justify-center gap-1 whitespace-nowrap text-[11.5px] font-medium leading-tight no-underline transition-colors hover:text-primary"
        style={{ color: '#3859a8', fontVariantNumeric: 'tabular-nums', ...GLOW }}
      >
        <Phone size={10} strokeWidth={2.2} className="shrink-0" />
        Or call {brand.phone}
      </a>

      {/* Privacy note */}
      <p className="m-0 mt-0.5 text-center text-[10px] tracking-[0.03em] leading-tight text-text-secondary/70" style={GLOW}>
        Secure and confidential
      </p>
    </div>
  )
}
