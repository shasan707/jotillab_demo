'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileSpreadsheet, Phone, MessageCircle, Mail, Check, Upload,
} from 'lucide-react'

const CONTACTS_TOTAL = 247

const LEADS = [
  { name: 'Sarah Johnson', phone: '+1 (555) 123-4567', email: 'sarah@acmeco.com' },
  { name: 'Michael Chen', phone: '+1 (555) 234-5678', email: 'mchen@plus.io' },
  { name: 'Emily Davis', phone: '+1 (555) 345-6789', email: 'emily@flux.com' },
  { name: 'David Park', phone: '+1 (555) 456-7890', email: 'd.park@nova.co' },
  { name: 'Jessica Lee', phone: '+1 (555) 567-8901', email: 'jess@apex.io' },
]

const COLORS = {
  call: '#3859a8',
  email: '#7c3aed',
  sms: '#06b6d4',
  primary: '#3859a8',
}

const PHASE_TIMES = {
  uploadStart: 200,
  uploadDuration: 1500,
  sheetStart: 1900,
  sheetRowDelay: 220,
  sheetHold: 1400,
  callStart: 4500,
  callPerLead: 850,
  callResultHold: 1600,
  emailPerLead: 1100,
  emailResultHold: 1600,
  smsPerLead: 700,
  smsResultHold: 1800,
  loopHold: 1800,
}

function ProgressBar({ progress, color }) {
  return (
    <div className="w-full h-1 rounded-full bg-gray-100 overflow-hidden">
      <div
        className="h-full rounded-full transition-[width] duration-[60ms] ease-linear"
        style={{ width: `${progress * 100}%`, backgroundColor: color }}
      />
    </div>
  )
}

function UploadView({ progress, isUploading }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.96 }}
      transition={{ duration: 0.35 }}
      className="rounded-xl p-4 flex flex-col items-center gap-3"
      style={{
        background: 'linear-gradient(160deg, rgba(56,89,168,0.04), rgba(56,89,168,0.08))',
        border: '1.5px dashed rgba(56,89,168,0.25)',
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center relative"
        style={{
          backgroundColor: '#fff',
          boxShadow: '0 4px 16px rgba(56,89,168,0.12)',
          border: '1px solid rgba(56,89,168,0.1)',
        }}
      >
        {isUploading && (
          <>
            <span
              className="absolute inset-0 rounded-xl"
              style={{
                border: '1.5px solid rgba(56,89,168,0.4)',
                animation: 'ring-expand 1.5s ease-out infinite',
              }}
            />
            <span
              className="absolute inset-0 rounded-xl"
              style={{
                border: '1.5px solid rgba(56,89,168,0.25)',
                animation: 'ring-expand 1.5s ease-out 0.5s infinite',
              }}
            />
          </>
        )}
        <FileSpreadsheet className="w-6 h-6" style={{ color: '#3859a8' }} strokeWidth={1.5} />
      </div>

      <div className="text-center">
        <p className="text-[11px] font-semibold text-gray-900">leads_q2.xlsx</p>
        <p className="text-[9px] text-gray-400 mt-0.5">{CONTACTS_TOTAL} contacts</p>
      </div>

      <div className="w-full">
        <div className="flex items-center gap-1 mb-1.5">
          <Upload className="w-2.5 h-2.5" style={{ color: '#3859a8' }} strokeWidth={1.8} />
          <p className="text-[9px] font-semibold" style={{ color: '#3859a8' }}>
            {isUploading ? `Importing... ${Math.round(progress * 100)}%` : 'Ready to upload'}
          </p>
        </div>
        <ProgressBar progress={progress} color="#3859a8" />
      </div>
    </motion.div>
  )
}

function SheetView({ rowsVisible }) {
  return (
    <motion.div
      key="sheet"
      initial={{ opacity: 0, scale: 0.96, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl bg-white overflow-hidden"
      style={{
        border: '1px solid #e5e7eb',
        boxShadow: '0 4px 16px rgba(15,17,41,0.06)',
      }}
    >
      <div className="px-3 py-2 flex items-center gap-2 border-b border-gray-100" style={{ backgroundColor: '#f8f9fb' }}>
        <FileSpreadsheet className="w-3.5 h-3.5" style={{ color: COLORS.primary }} strokeWidth={1.6} />
        <p className="text-[10px] font-semibold text-gray-900 flex-1">leads_q2.xlsx</p>
        <p className="text-[9.5px] text-gray-500 font-mono">{CONTACTS_TOTAL} rows</p>
      </div>

      <div>
        <div
          className="grid items-center text-[9.5px] font-bold text-gray-500 uppercase tracking-wider px-2 py-1.5 border-b border-gray-100"
          style={{ gridTemplateColumns: '1fr 1.1fr 1.2fr', backgroundColor: '#fafbfd' }}
        >
          <span>Name</span>
          <span>Phone</span>
          <span>Email</span>
        </div>

        {LEADS.map((lead, i) => {
          const visible = i < rowsVisible
          return (
            <motion.div
              key={lead.email}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: visible ? 1 : 0, x: visible ? 0 : -6 }}
              transition={{ duration: 0.25 }}
              className="grid items-center text-[9.5px] px-2 py-1.5 border-b border-gray-100 last:border-b-0"
              style={{ gridTemplateColumns: '1fr 1.1fr 1.2fr' }}
            >
              <span className="text-gray-900 font-medium truncate">{lead.name}</span>
              <span className="text-gray-700 font-mono truncate">{lead.phone}</span>
              <span className="text-gray-600 font-mono truncate">{lead.email}</span>
            </motion.div>
          )
        })}

        {rowsVisible >= LEADS.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="px-2 py-1.5 text-center"
          >
            <p className="text-[9.5px] text-gray-400 italic">+ {CONTACTS_TOTAL - LEADS.length} more contacts</p>
          </motion.div>
        )}
      </div>

      {rowsVisible >= LEADS.length && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-3 py-2 border-t border-gray-100 flex items-center gap-1.5"
          style={{ backgroundColor: 'rgba(34,197,94,0.06)' }}
        >
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center"
            style={{ backgroundColor: '#22c55e' }}
          >
            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
          </div>
          <p className="text-[9.5px] font-semibold text-green-700">Sheet parsed. Starting outreach...</p>
        </motion.div>
      )}
    </motion.div>
  )
}

function CallingView({ activeIdx, finished }) {
  const lead = LEADS[Math.min(activeIdx, LEADS.length - 1)]
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 px-1">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${COLORS.call}18` }}
        >
          <Phone className="w-4.5 h-4.5" style={{ color: COLORS.call }} strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-gray-900 leading-tight">Calling leads</p>
          <p className="text-[9.5px] text-gray-500">From leads_q2.xlsx</p>
        </div>
      </div>

      <div
        className="relative overflow-hidden rounded-xl py-5 px-4 flex flex-col items-center gap-3"
        style={{
          background: `linear-gradient(160deg, ${COLORS.call}08, ${COLORS.call}18)`,
          border: `1px solid ${COLORS.call}25`,
        }}
      >
        <div className="relative" style={{ width: 64, height: 64 }}>
          {!finished && [0, 1, 2].map((i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                width: 64,
                height: 64,
                top: 0,
                left: 0,
                border: `1.5px solid ${COLORS.call}`,
                opacity: 0.4 - i * 0.1,
                animation: `ring-expand 1.6s ease-out ${i * 0.4}s infinite`,
              }}
            />
          ))}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${COLORS.call}, ${COLORS.call}cc)`,
              boxShadow: `0 6px 20px ${COLORS.call}50`,
            }}
          >
            <Phone className="w-7 h-7 text-white" strokeWidth={1.5} />
          </div>
        </div>

        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: COLORS.call }}>
          {finished ? 'Campaign complete' : 'Calling'}
        </p>

        <AnimatePresence mode="wait">
          {!finished && (
            <motion.div
              key={lead.phone}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-center"
            >
              <p className="text-[14px] font-bold text-gray-900 font-mono">{lead.phone}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{lead.name}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function EmailView({ activeIdx }) {
  const visibleEmails = LEADS.slice(0, Math.min(activeIdx + 1, LEADS.length))
  return (
    <div className="flex flex-col gap-3 min-h-0">
      <div className="flex items-center gap-2 px-1 shrink-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${COLORS.email}18` }}
        >
          <Mail className="w-4.5 h-4.5" style={{ color: COLORS.email }} strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-gray-900 leading-tight">Sending emails</p>
          <p className="text-[9.5px] text-gray-500">Personalized for each lead</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-1.5">
        <AnimatePresence>
          {visibleEmails.map((lead, i) => {
            const isActive = i === activeIdx
            const firstName = lead.name.split(' ')[0]
            return (
              <motion.div
                key={`email-${i}`}
                initial={{ opacity: 0, x: -8, scale: 0.97 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg bg-white overflow-hidden shrink-0"
                style={{
                  border: `1px solid ${isActive ? `${COLORS.email}40` : '#e5e7eb'}`,
                  boxShadow: isActive ? `0 2px 10px ${COLORS.email}25` : 'none',
                }}
              >
                <div className="px-2 py-1 flex items-center gap-1 border-b border-gray-100">
                  <Mail className="w-2.5 h-2.5 shrink-0" style={{ color: COLORS.email }} strokeWidth={1.8} />
                  <p className="text-[9.5px] text-gray-500 truncate flex-1">
                    To: <span className="text-gray-900 font-mono">{lead.email}</span>
                  </p>
                  {isActive ? (
                    <span className="flex items-center gap-0.5 shrink-0">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="w-1 h-1 rounded-full"
                          style={{
                            backgroundColor: COLORS.email,
                            animation: `typing-dot 1.4s ease-in-out ${d * 0.2}s infinite`,
                          }}
                        />
                      ))}
                    </span>
                  ) : (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      className="w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: '#22c55e' }}
                    >
                      <Check className="w-2 h-2 text-white" strokeWidth={3} />
                    </motion.div>
                  )}
                </div>
                <div className="px-2 py-1.5">
                  <p className="text-[9px] font-bold text-gray-900 truncate mb-0.5">Quick idea for your team</p>
                  <p className="text-[9.5px] text-gray-600 leading-snug line-clamp-2">
                    Hi {firstName}, noticed your team is growing. Quick idea on streamlining your sales outreach...
                  </p>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

function SmsView({ activeIdx }) {
  const visibleSms = LEADS.slice(0, Math.min(activeIdx + 1, LEADS.length))
  return (
    <div className="flex flex-col gap-3 min-h-0">
      <div className="flex items-center gap-2 px-1 shrink-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: `${COLORS.sms}22` }}
        >
          <MessageCircle className="w-4.5 h-4.5" style={{ color: COLORS.sms }} strokeWidth={1.6} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-gray-900 leading-tight">Sending SMS</p>
          <p className="text-[9.5px] text-gray-500">Across the full contact list</p>
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col gap-2">
        <AnimatePresence>
          {visibleSms.map((lead, i) => {
            const isActive = i === activeIdx
            const firstName = lead.name.split(' ')[0]
            return (
              <motion.div
                key={`sms-${i}`}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-0.5 shrink-0"
              >
                <p className="text-[9px] text-gray-400 font-mono px-1">To: {lead.phone}</p>
                <div className="flex justify-end">
                  <div
                    className="max-w-[88%] px-2.5 py-1.5 rounded-xl rounded-br-sm text-white"
                    style={{
                      backgroundColor: COLORS.sms,
                      boxShadow: `0 2px 8px ${COLORS.sms}40`,
                    }}
                  >
                    <p className="text-[9px] leading-snug">
                      Hi {firstName}, this is JotilLabs. Got 2 mins to chat about your sales pipeline?
                    </p>
                  </div>
                </div>
                <div className="flex justify-end items-center gap-0.5 px-1.5">
                  {isActive ? (
                    <span className="text-[7.5px] text-gray-400">Sending...</span>
                  ) : (
                    <>
                      <Check className="w-2 h-2" style={{ color: COLORS.sms }} strokeWidth={3} />
                      <Check className="w-2 h-2 -ml-1" style={{ color: COLORS.sms }} strokeWidth={3} />
                      <span className="text-[7.5px] text-gray-400 ml-0.5">Delivered</span>
                    </>
                  )}
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}

function ResultCard({ icon: Icon, statValue, statSuffix, label, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.45, type: 'spring', stiffness: 200, damping: 20 }}
      className="rounded-xl p-3 flex items-center gap-3 shrink-0"
      style={{
        background: `linear-gradient(135deg, ${color}10, ${color}22)`,
        border: `1px solid ${color}38`,
      }}
    >
      <motion.div
        initial={{ scale: 0, rotate: -90 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.15, type: 'spring', stiffness: 400, damping: 18 }}
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{
          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
          boxShadow: `0 4px 14px ${color}50`,
        }}
      >
        <Icon className="w-5 h-5 text-white" strokeWidth={1.8} />
      </motion.div>
      <div className="flex-1 min-w-0">
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-[22px] font-bold tabular-nums leading-none"
          style={{ color }}
        >
          {statValue}
          {statSuffix && <span className="text-[14px]">{statSuffix}</span>}
        </motion.p>
        <p className="text-[10px] font-semibold text-gray-700 mt-0.5">{label}</p>
      </div>
    </motion.div>
  )
}

export function OutreachScreen({ isActive, onAction, onStep }) {
  const [phase, setPhase] = useState('idle')
  const [uploadProgress, setUploadProgress] = useState(0)
  const [sheetRows, setSheetRows] = useState(0)
  const [callIdx, setCallIdx] = useState(-1)
  const [callDone, setCallDone] = useState(false)
  const [emailIdx, setEmailIdx] = useState(-1)
  const [emailDone, setEmailDone] = useState(false)
  const [smsIdx, setSmsIdx] = useState(-1)
  const [smsDone, setSmsDone] = useState(false)
  const loopRef = useRef(null)

  useEffect(() => {
    if (!isActive) {
      setPhase('idle')
      setUploadProgress(0)
      setSheetRows(0)
      setCallIdx(-1)
      setCallDone(false)
      setEmailIdx(-1)
      setEmailDone(false)
      setSmsIdx(-1)
      setSmsDone(false)
      if (loopRef.current) loopRef.current.forEach(clearTimeout)
      return
    }

    const timers = []
    const t = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id }

    const runLoop = () => {
      // Reset
      setPhase('idle')
      setUploadProgress(0)
      setSheetRows(0)
      setCallIdx(-1)
      setCallDone(false)
      setEmailIdx(-1)
      setEmailDone(false)
      setSmsIdx(-1)
      setSmsDone(false)

      let now = PHASE_TIMES.uploadStart

      // Upload
      t(() => { setPhase('upload'); onStep?.(0) }, now)
      const uploadSteps = 30
      for (let i = 0; i <= uploadSteps; i++) {
        t(
          () => setUploadProgress(i / uploadSteps),
          now + (i / uploadSteps) * PHASE_TIMES.uploadDuration,
        )
      }
      now += PHASE_TIMES.uploadDuration

      // Sheet opens
      t(() => { setPhase('sheet'); onStep?.(1) }, now + 200)
      LEADS.forEach((_, i) => {
        t(() => setSheetRows(i + 1), now + 200 + (i + 1) * PHASE_TIMES.sheetRowDelay)
      })
      now += 200 + LEADS.length * PHASE_TIMES.sheetRowDelay + PHASE_TIMES.sheetHold

      // Calling
      t(() => {
        setPhase('calling')
        setCallIdx(0)
        onStep?.(2)
      }, now)
      LEADS.forEach((_, i) => {
        t(() => setCallIdx(i), now + i * PHASE_TIMES.callPerLead)
      })
      now += LEADS.length * PHASE_TIMES.callPerLead
      t(() => setCallDone(true), now)
      now += PHASE_TIMES.callResultHold

      // Email
      t(() => {
        setPhase('email')
        setEmailIdx(0)
        onStep?.(3)
      }, now)
      LEADS.forEach((_, i) => {
        t(() => setEmailIdx(i), now + i * PHASE_TIMES.emailPerLead)
      })
      now += LEADS.length * PHASE_TIMES.emailPerLead
      t(() => setEmailDone(true), now)
      t(() => setEmailIdx(LEADS.length), now)
      now += PHASE_TIMES.emailResultHold

      // SMS
      t(() => {
        setPhase('sms')
        setSmsIdx(0)
        onStep?.(4)
      }, now)
      LEADS.forEach((_, i) => {
        t(() => setSmsIdx(i), now + i * PHASE_TIMES.smsPerLead)
      })
      now += LEADS.length * PHASE_TIMES.smsPerLead
      t(() => setSmsDone(true), now)
      t(() => setSmsIdx(LEADS.length), now)
      now += PHASE_TIMES.smsResultHold

      // Loop
      t(runLoop, now + PHASE_TIMES.loopHold)
    }

    runLoop()
    loopRef.current = timers
    return () => timers.forEach(clearTimeout)
  }, [isActive, onStep])

  return (
    <div className="w-full h-full flex flex-col bg-white text-[11px]">
      <div className="pt-9 px-4 pb-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <p className="font-semibold text-xs text-gray-900">Campaign: Spring Launch</p>
        </div>
        <p className="text-[10px] text-gray-400">AI-powered multi-channel outreach</p>
      </div>

      <div className="flex-1 px-3 py-3 overflow-hidden flex flex-col gap-2.5 min-h-0">
        <AnimatePresence mode="wait">
          {(phase === 'idle' || phase === 'upload') && (
            <UploadView key="upload" progress={uploadProgress} isUploading={phase === 'upload'} />
          )}

          {phase === 'sheet' && <SheetView key="sheet" rowsVisible={sheetRows} />}

          {phase === 'calling' && (
            <motion.div
              key="calling"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2.5 min-h-0"
            >
              <CallingView activeIdx={callIdx} finished={callDone} />
              <AnimatePresence>
                {callDone && (
                  <ResultCard
                    icon={Phone}
                    statValue="90"
                    statSuffix="%"
                    label="calls received"
                    color={COLORS.call}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {phase === 'email' && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2.5 min-h-0"
            >
              <EmailView activeIdx={emailIdx} />
              <AnimatePresence>
                {emailDone && (
                  <ResultCard
                    icon={Mail}
                    statValue="100"
                    statSuffix="%"
                    label="emails delivered"
                    color={COLORS.email}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {phase === 'sms' && (
            <motion.div
              key="sms"
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2.5 min-h-0"
            >
              <SmsView activeIdx={smsIdx} />
              <AnimatePresence>
                {smsDone && (
                  <ResultCard
                    icon={MessageCircle}
                    statValue="1,000"
                    label="SMS sent successfully"
                    color={COLORS.sms}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
