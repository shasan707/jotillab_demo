'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone, PhoneIncoming, PhoneOff, Mic, MicOff,
  MessageSquare, Send, Smartphone, Globe, Hash,
  BarChart3, TrendingUp, Users, Mail, CheckCircle2,
  User, Calendar, Clock, Search,
  Zap, GitBranch, Database, CheckCircle,
  Video, Volume2, Maximize2,
} from 'lucide-react'

/* ================================================================
   Shared styles / constants
   ================================================================ */
const headingFont = { fontFamily: 'var(--font-display)' }
const monoFont = { fontFamily: 'var(--font-jetbrains)' }

const cardEntry = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
}

/* ================================================================
   RECEPTIONIST — phone call with incoming animation,
   caller profile, AI transcript, live waveform
   ================================================================ */
function ReceptionistDemo() {
  const [callState, setCallState] = useState('ringing') // ringing | answered | transcript
  const [typingIndex, setTypingIndex] = useState(0)

  useEffect(() => {
    const t1 = setTimeout(() => setCallState('answered'), 2200)
    const t2 = setTimeout(() => setCallState('transcript'), 3400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    if (callState !== 'transcript') return
    const iv = setInterval(() => setTypingIndex(i => i + 1), 1200)
    return () => clearInterval(iv)
  }, [callState])

  const transcript = [
    { from: 'ai', text: 'Good morning! Thank you for calling Meridian Dental. How can I help you today?' },
    { from: 'caller', text: "Hi, I'd like to schedule a cleaning appointment." },
    { from: 'ai', text: 'Of course! I have availability this Thursday at 2 PM or Friday at 10 AM. Which works better?' },
    { from: 'caller', text: "Thursday at 2 works perfectly." },
    { from: 'ai', text: "Great, you're all set for Thursday at 2 PM. We'll send a confirmation to your phone. Is there anything else?" },
  ]

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      <motion.div {...cardEntry} className="card-premium p-0 overflow-hidden">
        {/* Incoming call header with pulse */}
        <div className="relative flex items-center gap-3 px-5 py-4 border-b border-black/5 bg-[#F8FAFF]">
          {/* Pulse rings behind icon */}
          {callState === 'ringing' && (
            <>
              <motion.div
                className="absolute left-5 top-4 h-9 w-9 rounded-full border-2 border-[#3859a8]/30"
                animate={{ scale: [1, 1.8], opacity: [0.6, 0] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
              <motion.div
                className="absolute left-5 top-4 h-9 w-9 rounded-full border-2 border-[#3859a8]/20"
                animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
              />
            </>
          )}

          <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-[#3859a8] to-[#3B82F6] flex items-center justify-center shrink-0">
            <AnimatePresence mode="wait">
              {callState === 'ringing' ? (
                <motion.div key="ring" animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5, repeat: Infinity }}>
                  <PhoneIncoming size={16} className="text-white" />
                </motion.div>
              ) : (
                <motion.div key="on" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                  <Phone size={16} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text truncate" style={headingFont}>
              {callState === 'ringing' ? 'Incoming Call' : 'AI Receptionist Active'}
            </p>
            <p className="text-xs text-text-secondary">+1 (801) 555-0192</p>
          </div>

          <AnimatePresence mode="wait">
            {callState === 'ringing' ? (
              <motion.span
                key="ringing"
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-amber-50 text-amber-600"
              >
                Ringing
              </motion.span>
            ) : (
              <motion.span
                key="live"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600"
              >
                Live
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Caller info card */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mx-5 mt-4 p-3 rounded-xl bg-[#F0F4FF] border border-[#3859a8]/10 flex items-center gap-3"
        >
          <div className="h-10 w-10 rounded-full bg-white border border-black/5 flex items-center justify-center shrink-0">
            <User size={16} className="text-[#3859a8]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text">Sarah Mitchell</p>
            <p className="text-xs text-text-secondary">Returning Patient &middot; Last visit Mar 12</p>
          </div>
          <div className="flex flex-col items-end gap-0.5">
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600">VIP</span>
          </div>
        </motion.div>

        {/* AI status bar */}
        <div className="px-5 py-3 flex items-center gap-2.5">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-[#3859a8] shrink-0"
          />
          <p className="text-xs text-text-secondary font-medium">
            {callState === 'transcript' ? 'AI Handling Conversation' : 'AI Connecting...'}
          </p>
          {callState === 'transcript' && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="ml-auto text-[10px] text-text-secondary tabular-nums"
              style={monoFont}
            >
              0:42
            </motion.span>
          )}
        </div>

        {/* Transcript area */}
        <div className="px-5 pb-2 space-y-2.5 min-h-[140px]">
          {transcript.slice(0, Math.min(typingIndex + 1, transcript.length)).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.from === 'caller' ? 'justify-end' : 'justify-start'} items-start gap-2`}
            >
              {msg.from === 'ai' && (
                <div className="h-5 w-5 rounded-full bg-[#EEF3FE] flex items-center justify-center shrink-0 mt-0.5">
                  <Zap size={10} className="text-[#3859a8]" />
                </div>
              )}
              <div
                className={`max-w-[210px] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${
                  msg.from === 'caller'
                    ? 'bg-white border border-black/5 text-text-secondary rounded-tr-sm'
                    : 'bg-[#F0F4FF] text-text rounded-tl-sm'
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Waveform bar */}
        <div className="px-5 py-4 border-t border-black/5 flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-[#3859a8] flex items-center justify-center shrink-0">
            <Mic size={14} className="text-white" />
          </div>
          <div className="flex-1 flex items-center gap-[3px]">
            {Array.from({ length: 24 }, (_, i) => {
              const h = [3, 5, 8, 12, 9, 14, 10, 7, 11, 6, 13, 8, 5, 9, 15, 11, 7, 10, 6, 12, 8, 4, 7, 5][i]
              return (
                <motion.div
                  key={i}
                  className="w-[3px] rounded-full bg-[#3859a8]/40"
                  style={{ height: h * 1.5 }}
                  animate={{ height: [h * 1.5, h * 2.8, h * 1.2, h * 2.4, h * 1.5] }}
                  transition={{ duration: 0.7 + i * 0.03, repeat: Infinity, ease: 'easeInOut' }}
                />
              )
            })}
          </div>
          <div className="h-8 w-8 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <PhoneOff size={13} className="text-red-400" />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ================================================================
   MESSENGER — multi-channel chat with channel tabs (Web, SMS, WhatsApp)
   ================================================================ */
function MessengerDemo() {
  const [activeChannel, setActiveChannel] = useState('web')

  const channels = [
    { id: 'web', label: 'Web Chat', icon: Globe, color: '#3859a8' },
    { id: 'sms', label: 'SMS', icon: Smartphone, color: '#3B82F6' },
    { id: 'whatsapp', label: 'WhatsApp', icon: Hash, color: '#25D366' },
  ]

  const threads = {
    web: [
      { from: 'user', text: 'Hi, I need help choosing a plan.', time: '2:04 PM' },
      { from: 'ai', text: 'Happy to help! How many customer conversations does your team handle monthly?', time: '2:04 PM' },
      { from: 'user', text: 'About 600 across all channels.', time: '2:05 PM' },
      { from: 'ai', text: 'The Professional plan would be ideal -- it includes unlimited messages, CRM integration, and AI training on your data.', time: '2:05 PM' },
    ],
    sms: [
      { from: 'ai', text: "Hi Alex! Your appointment is confirmed for tomorrow at 10 AM. Reply CHANGE to reschedule.", time: '11:30 AM' },
      { from: 'user', text: 'CHANGE', time: '11:42 AM' },
      { from: 'ai', text: "No problem! I have openings at 2 PM or 4 PM tomorrow. Which works better?", time: '11:42 AM' },
      { from: 'user', text: '4 PM please', time: '11:43 AM' },
      { from: 'ai', text: "Done! You're rescheduled for tomorrow at 4 PM. We'll send a reminder in the morning.", time: '11:43 AM' },
    ],
    whatsapp: [
      { from: 'user', text: "Hey, what's the status of my order #4821?", time: '3:15 PM' },
      { from: 'ai', text: "Let me look that up for you! Order #4821 shipped yesterday and is expected to arrive by Thursday.", time: '3:15 PM' },
      { from: 'user', text: 'Can I change the delivery address?', time: '3:16 PM' },
      { from: 'ai', text: "I've forwarded your request to our shipping team. You'll receive a confirmation within the hour.", time: '3:16 PM' },
    ],
  }

  const activeThread = threads[activeChannel]
  const activeChannelInfo = channels.find(c => c.id === activeChannel)

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      <motion.div {...cardEntry} className="card-premium p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5 bg-[#F8FAFF]">
          <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#3859a8] to-[#3B82F6] flex items-center justify-center shrink-0">
            <MessageSquare size={16} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-text" style={headingFont}>Jotil Messenger</p>
            <div className="flex items-center gap-1.5">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              <p className="text-xs text-text-secondary">3 active conversations</p>
            </div>
          </div>
        </div>

        {/* Channel tabs */}
        <div className="flex border-b border-black/5">
          {channels.map(ch => {
            const Icon = ch.icon
            const isActive = activeChannel === ch.id
            return (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors relative ${
                  isActive ? 'text-[#3859a8]' : 'text-text-secondary hover:text-text'
                }`}
              >
                <Icon size={13} style={isActive ? { color: ch.color } : undefined} />
                <span>{ch.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="channel-tab"
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-[#3859a8]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* Messages */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChannel}
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -8 }}
            transition={{ duration: 0.2 }}
            className="px-4 py-4 space-y-2.5 min-h-[200px]"
          >
            {activeThread.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08, duration: 0.25 }}
                className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[220px] rounded-2xl px-3.5 py-2 text-[13px] leading-snug ${
                    msg.from === 'user'
                      ? 'bg-[#3859a8] text-white rounded-tr-sm'
                      : 'bg-[#F0F4FF] text-text rounded-tl-sm'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-[10px] mt-1 ${msg.from === 'user' ? 'text-white/50' : 'text-text-secondary/60'}`}>
                    {msg.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Input */}
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 bg-[#F8FAFF] border border-black/[0.06] rounded-xl px-4 py-2.5">
            <p className="flex-1 text-sm text-text-secondary/50">Type a message...</p>
            <div className="h-7 w-7 rounded-lg bg-[#3859a8] flex items-center justify-center">
              <Send size={12} className="text-white" />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ================================================================
   OUTREACH — campaign dashboard with progress, delivery funnel,
   live activity feed
   ================================================================ */
function OutreachDemo() {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    const iv = setInterval(() => setElapsed(e => e + 1), 2000)
    return () => clearInterval(iv)
  }, [])

  const funnelSteps = [
    { label: 'Contacts', value: 4200, width: '100%', color: 'bg-[#3859a8]/15 text-[#3859a8]' },
    { label: 'Delivered', value: 3860, width: '92%', color: 'bg-[#3B82F6]/15 text-[#3B82F6]' },
    { label: 'Opened', value: 2150, width: '51%', color: 'bg-[#3B82F6]/15 text-[#3B82F6]' },
    { label: 'Responded', value: 847, width: '20%', color: 'bg-emerald-500/15 text-emerald-600' },
  ]

  const activity = [
    { text: 'Sarah M. responded positively', time: '12s ago', type: 'success' },
    { text: 'Call connected: James O.', time: '34s ago', type: 'info' },
    { text: 'Voicemail left: Priya N.', time: '1m ago', type: 'neutral' },
  ]

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      <motion.div {...cardEntry} className="card-premium p-0 overflow-hidden">
        {/* Campaign header */}
        <div className="px-5 py-4 border-b border-black/5 bg-[#F8FAFF] flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text" style={headingFont}>Q2 Re-engagement</p>
            <p className="text-xs text-text-secondary mt-0.5">Outbound Voice + SMS</p>
          </div>
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.6, repeat: Infinity }}
            className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600"
          >
            Running
          </motion.span>
        </div>

        {/* KPI row */}
        <div className="grid grid-cols-3 gap-px bg-black/5">
          {[
            { label: 'Delivery Rate', value: '91.9%', icon: Mail },
            { label: 'Response Rate', value: '20.2%', icon: TrendingUp },
            { label: 'Avg. Cost', value: '$0.34', icon: BarChart3 },
          ].map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15 * i + 0.3 }}
                className="bg-white px-4 py-3.5 text-center"
              >
                <Icon size={14} className="text-[#3859a8] mx-auto mb-1.5" />
                <p className="text-lg font-bold text-text tabular-nums" style={monoFont}>{kpi.value}</p>
                <p className="text-[10px] text-text-secondary mt-0.5">{kpi.label}</p>
              </motion.div>
            )
          })}
        </div>

        {/* Delivery funnel */}
        <div className="px-5 py-4 space-y-2">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Campaign Funnel</p>
          {funnelSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * i + 0.4 }}
              className="flex items-center gap-3"
            >
              <span className="text-[11px] text-text-secondary w-[70px] shrink-0">{step.label}</span>
              <div className="flex-1 h-5 bg-[#F0F4FF] rounded-md overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: step.width }}
                  transition={{ duration: 0.9, delay: 0.5 + i * 0.12, ease: 'easeOut' }}
                  className={`h-full rounded-md ${step.color.split(' ')[0]}`}
                />
              </div>
              <span className={`text-xs font-semibold tabular-nums ${step.color.split(' ')[1]}`} style={monoFont}>
                {step.value.toLocaleString()}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Live activity */}
        <div className="px-5 pb-4">
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">Live Activity</p>
          <div className="space-y-1.5">
            {activity.map((a, i) => (
              <motion.div
                key={`${a.text}-${elapsed}`}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 py-1.5"
              >
                <div className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                  a.type === 'success' ? 'bg-emerald-500' : a.type === 'info' ? 'bg-[#3859a8]' : 'bg-gray-300'
                }`} />
                <p className="text-[12px] text-text-secondary flex-1 truncate">{a.text}</p>
                <p className="text-[10px] text-text-secondary/50 shrink-0">{a.time}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ================================================================
   SPACE — mini CRM with contact cards, lead scores,
   upcoming calendar items
   ================================================================ */
function SpaceDemo() {
  const [activeTab, setActiveTab] = useState('leads')

  const leads = [
    { name: 'Acme Corp', contact: 'Sarah Chen', score: 94, status: 'Hot', statusColor: 'text-red-500 bg-red-50', avatar: 'SC' },
    { name: 'Meridian LLC', contact: 'James Okafor', score: 78, status: 'Warm', statusColor: 'text-amber-600 bg-amber-50', avatar: 'JO' },
    { name: 'TechBridge Co', contact: 'Priya Nair', score: 61, status: 'Nurture', statusColor: 'text-blue-600 bg-blue-50', avatar: 'PN' },
  ]

  const calendarItems = [
    { time: '10:00 AM', title: 'Discovery Call', subtitle: 'Sarah Chen, Acme Corp', color: 'border-l-[#3859a8]' },
    { time: '1:30 PM', title: 'Demo Presentation', subtitle: 'James Okafor, Meridian', color: 'border-l-[#3B82F6]' },
    { time: '3:00 PM', title: 'Follow-up Review', subtitle: 'Team Standup', color: 'border-l-emerald-500' },
  ]

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      <motion.div {...cardEntry} className="card-premium p-0 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-black/5 bg-[#F8FAFF] flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text" style={headingFont}>JotilSpace</p>
            <p className="text-xs text-text-secondary mt-0.5">AI Workspace</p>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-black/5 rounded-lg px-2.5 py-1.5">
            <Search size={12} className="text-text-secondary" />
            <span className="text-[11px] text-text-secondary/50">Search...</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-black/5">
          {[
            { id: 'leads', label: 'Leads', icon: Users },
            { id: 'calendar', label: 'Calendar', icon: Calendar },
          ].map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors relative ${
                  isActive ? 'text-[#3859a8]' : 'text-text-secondary hover:text-text'
                }`}
              >
                <Icon size={13} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="space-tab"
                    className="absolute bottom-0 left-2 right-2 h-[2px] rounded-full bg-[#3859a8]"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'leads' ? (
            <motion.div
              key="leads"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Column labels */}
              <div className="flex items-center px-5 pt-3 pb-1.5 gap-3">
                <p className="text-[11px] font-medium text-text-secondary/60 uppercase tracking-wider flex-1">Contact</p>
                <p className="text-[11px] font-medium text-text-secondary/60 uppercase tracking-wider w-16 text-right">Score</p>
                <p className="text-[11px] font-medium text-text-secondary/60 uppercase tracking-wider w-14 text-right">Stage</p>
              </div>

              {/* Lead rows */}
              <div className="divide-y divide-black/[0.04]">
                {leads.map((lead, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i + 0.15 }}
                    className="flex items-center gap-3 px-5 py-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#3859a8]/10 to-[#3B82F6]/10 flex items-center justify-center shrink-0">
                      <span className="text-[10px] font-bold text-[#3859a8]">{lead.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{lead.name}</p>
                      <p className="text-[11px] text-text-secondary truncate">{lead.contact}</p>
                    </div>
                    <div className="w-16 flex items-center gap-1.5 justify-end">
                      <div className="h-1.5 w-10 bg-[#F0F4FF] rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${lead.score}%` }}
                          transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: 'easeOut' }}
                          className="h-full bg-gradient-to-r from-[#3859a8] to-[#3B82F6] rounded-full"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#3859a8] tabular-nums" style={monoFont}>
                        {lead.score}
                      </span>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full w-14 text-center ${lead.statusColor}`}>
                      {lead.status}
                    </span>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              <div className="px-5 py-3 border-t border-black/5 bg-[#F8FAFF]">
                <p className="text-xs text-text-secondary">
                  <span className="font-semibold text-[#3859a8]">12 leads</span> synced from all channels &middot; Updated just now
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
            >
              <div className="px-5 pt-3.5 pb-1">
                <p className="text-xs font-semibold text-text-secondary">Today, April 6</p>
              </div>
              <div className="px-5 py-2 space-y-2">
                {calendarItems.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.1 }}
                    className={`bg-white border border-black/5 rounded-xl px-4 py-3 border-l-[3px] ${item.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-text">{item.title}</p>
                      <div className="flex items-center gap-1 text-text-secondary">
                        <Clock size={10} />
                        <span className="text-[11px] tabular-nums" style={monoFont}>{item.time}</span>
                      </div>
                    </div>
                    <p className="text-[11px] text-text-secondary mt-0.5">{item.subtitle}</p>
                  </motion.div>
                ))}
              </div>
              <div className="px-5 py-3 border-t border-black/5 bg-[#F8FAFF]">
                <p className="text-xs text-text-secondary">
                  <span className="font-semibold text-[#3859a8]">3 events</span> scheduled for today
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

/* ================================================================
   FLOW — workflow diagram with animated data packets
   flowing between connected nodes
   ================================================================ */
function FlowDemo() {
  const nodes = [
    { label: 'New Lead', sub: 'Webhook Trigger', icon: Zap, color: 'from-[#3859a8] to-[#2a4688]' },
    { label: 'AI Classify', sub: 'Score & Route', icon: GitBranch, color: 'from-[#3B82F6] to-[#4F46E5]' },
    { label: 'CRM Update', sub: 'Create Record', icon: Database, color: 'from-[#3B82F6] to-[#0284C7]' },
    { label: 'Notify Team', sub: 'Slack + Email', icon: CheckCircle, color: 'from-emerald-500 to-emerald-600' },
  ]

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      <motion.div {...cardEntry} className="card-premium p-0 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-black/5 bg-[#F8FAFF] flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-text" style={headingFont}>Lead Routing Workflow</p>
            <p className="text-xs text-text-secondary mt-0.5">4 nodes &middot; 3 connections</p>
          </div>
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600">Active</span>
        </div>

        {/* Node diagram */}
        <div className="px-5 py-5 flex flex-col items-center gap-0">
          {nodes.map((node, i) => {
            const Icon = node.icon
            return (
              <div key={i} className="flex flex-col items-center w-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.15 + 0.2, duration: 0.35 }}
                  className="w-full flex items-center gap-3.5 bg-white border border-black/5 rounded-2xl px-4 py-3 shadow-sm relative overflow-hidden"
                >
                  {/* Subtle shimmer on active node */}
                  {i === 1 && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-[#3859a8]/[0.04] to-transparent"
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                    />
                  )}

                  <div className={`h-9 w-9 rounded-xl bg-gradient-to-br ${node.color} flex items-center justify-center shrink-0 relative`}>
                    <Icon size={16} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-text" style={headingFont}>{node.label}</p>
                    <p className="text-[11px] text-text-secondary">{node.sub}</p>
                  </div>

                  {/* Processing indicator on active node */}
                  {i === 1 && (
                    <motion.div
                      animate={{ opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex items-center gap-1"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-[#3B82F6]" />
                      <span className="text-[10px] text-[#3B82F6] font-medium">Processing</span>
                    </motion.div>
                  )}

                  {i === 3 && (
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  )}
                </motion.div>

                {/* Connector with animated data packet */}
                {i < nodes.length - 1 && (
                  <div className="relative flex flex-col items-center my-1 h-6">
                    <div className="h-full w-px bg-gradient-to-b from-[#3859a8]/30 to-[#3B82F6]/30" />
                    {/* Animated data packet */}
                    <motion.div
                      className="absolute w-2 h-2 rounded-full bg-[#3859a8] shadow-sm shadow-[#3859a8]/30"
                      animate={{ top: ['-2px', '20px'], opacity: [1, 0.3] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.6, ease: 'easeIn' }}
                    />
                    <svg width="8" height="5" viewBox="0 0 8 5" fill="#3859a8" className="opacity-40 -mt-px">
                      <path d="M4 5L0 0h8z" />
                    </svg>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Stats footer */}
        <div className="px-5 pb-4 grid grid-cols-3 gap-2.5">
          {[['142', 'Runs today'], ['99.8%', 'Success'], ['0.4s', 'Avg time']].map(([val, lbl], i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="bg-[#F8FAFF] rounded-xl px-3 py-2.5 text-center"
            >
              <p className="text-sm font-bold text-[#3859a8]" style={monoFont}>{val}</p>
              <p className="text-[10px] text-text-secondary mt-0.5">{lbl}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

/* ================================================================
   AVATAR — face-to-face video call with avatar placeholder,
   expression/lip-sync indicators, and conversation UI
   ================================================================ */
function AvatarDemo() {
  const [isSpeaking, setIsSpeaking] = useState(true)

  useEffect(() => {
    const iv = setInterval(() => setIsSpeaking(s => !s), 3000)
    return () => clearInterval(iv)
  }, [])

  return (
    <div className="relative w-full max-w-sm mx-auto select-none">
      <motion.div {...cardEntry} className="card-premium p-0 overflow-hidden">
        {/* Video header */}
        <div className="px-5 py-3.5 border-b border-black/5 bg-[#F8FAFF] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Video size={15} className="text-[#3859a8]" />
            <p className="text-sm font-semibold text-text" style={headingFont}>AI Avatar Session</p>
          </div>
          <motion.span
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="flex items-center gap-1.5 text-xs font-medium text-red-500"
          >
            <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
            REC
          </motion.span>
        </div>

        {/* Avatar video area */}
        <div className="relative bg-gradient-to-br from-[#E8EFFE] to-[#F0F4FF] mx-4 mt-4 rounded-2xl overflow-hidden aspect-[4/3]">
          {/* Avatar face placeholder */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              {/* Outer glow when speaking */}
              {isSpeaking && (
                <motion.div
                  className="absolute -inset-4 rounded-full bg-[#3859a8]/10"
                  animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              )}

              {/* Avatar circle */}
              <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-[#3859a8] to-[#3B82F6] flex items-center justify-center shadow-lg shadow-[#3859a8]/20">
                <User size={40} className="text-white/90" />

                {/* Lip-sync indicator */}
                {isSpeaking && (
                  <motion.div
                    className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-[2px]"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    {[3, 5, 7, 5, 3].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-[2px] rounded-full bg-white/70"
                        style={{ height: h }}
                        animate={{ height: [h, h * 1.8, h * 0.6, h * 1.4, h] }}
                        transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.06 }}
                      />
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Name tag */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-sm rounded-full px-3 py-1 border border-black/5 whitespace-nowrap">
                <p className="text-[11px] font-medium text-text">Jotil AI Avatar</p>
              </div>
            </div>
          </div>

          {/* Small self-view */}
          <div className="absolute bottom-3 right-3 h-14 w-20 rounded-lg bg-gray-800 border-2 border-white/20 overflow-hidden flex items-center justify-center shadow-md">
            <User size={16} className="text-white/40" />
            <div className="absolute bottom-1 right-1">
              <MicOff size={8} className="text-white/50" />
            </div>
          </div>

          {/* AI status overlay */}
          <div className="absolute top-3 left-3 bg-white/80 backdrop-blur-sm rounded-full px-2.5 py-1 flex items-center gap-1.5 border border-black/5">
            <motion.div
              animate={{ scale: isSpeaking ? [1, 1.3, 1] : 1 }}
              transition={{ duration: 0.8, repeat: isSpeaking ? Infinity : 0 }}
              className={`h-2 w-2 rounded-full ${isSpeaking ? 'bg-[#3859a8]' : 'bg-amber-400'}`}
            />
            <span className="text-[10px] font-medium text-text">
              {isSpeaking ? 'Speaking' : 'Listening'}
            </span>
          </div>
        </div>

        {/* Live captions */}
        <div className="px-5 py-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={isSpeaking ? 'ai' : 'user'}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-[#F0F4FF] rounded-xl px-4 py-2.5"
            >
              <p className="text-[10px] font-semibold text-[#3859a8] mb-0.5">
                {isSpeaking ? 'AI Avatar' : 'You'}
              </p>
              <p className="text-[13px] text-text leading-snug">
                {isSpeaking
                  ? "I'd be happy to walk you through our product features. Let me show you how it works..."
                  : "That sounds great. Can you show me the analytics dashboard?"
                }
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls bar */}
        <div className="px-5 pb-4 flex items-center justify-center gap-3">
          {[
            { icon: Mic, label: 'Mic', active: false },
            { icon: Video, label: 'Video', active: true },
            { icon: Volume2, label: 'Volume', active: true },
            { icon: Maximize2, label: 'Fullscreen', active: false },
          ].map((ctrl, i) => {
            const Icon = ctrl.icon
            return (
              <div
                key={i}
                className={`h-9 w-9 rounded-xl flex items-center justify-center ${
                  ctrl.active
                    ? 'bg-[#3859a8]/10 text-[#3859a8]'
                    : 'bg-gray-100 text-text-secondary'
                }`}
              >
                <Icon size={15} />
              </div>
            )
          })}
          <div className="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center text-red-500 ml-2">
            <PhoneOff size={15} />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

/* ================================================================
   PUBLIC EXPORT
   ================================================================ */
export function DemoVisualization({ slug }) {
  const demos = {
    receptionist: ReceptionistDemo,
    messenger: MessengerDemo,
    outreach: OutreachDemo,
    space: SpaceDemo,
    flow: FlowDemo,
    avatar: AvatarDemo,
  }

  const Demo = demos[slug]
  if (!Demo) return null

  return (
    <div className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">Live Preview</p>
          <h2 className="text-3xl font-bold text-text tracking-tight" style={headingFont}>
            See it in action
          </h2>
          <p className="text-text-secondary mt-3 max-w-md mx-auto">
            An interactive preview of how the product works in a real customer interaction.
          </p>
        </div>
        <Demo />
      </div>
    </div>
  )
}
