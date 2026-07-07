'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Calendar, Clock, ChevronLeft, ChevronRight,
  CheckCircle2, AlertCircle,
} from 'lucide-react'

/* ── Booking rules (tune here) ────────────────────────────────────────────── */
const MAX_DAYS_AHEAD = 60           // how far out a visitor can book
const DISABLE_WEEKENDS = true       // demos run on weekdays only
const BUSINESS_HOURS = { startHour: 9, endHour: 17, stepMin: 30 } // 9:00 AM–4:30 PM, 30-min slots

const BRAND = '#3859a8'
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

const inputClass =
  'w-full rounded-[11px] px-4 py-3 text-sm text-text bg-white border outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10'
const inputStyle = { border: '1px solid rgba(0,0,0,0.1)' }
const labelClass = 'block text-xs font-semibold text-text mb-1.5 tracking-wide uppercase'

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n)
const monthFirst = (d) => new Date(d.getFullYear(), d.getMonth(), 1)
const sameDay = (a, b) =>
  a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

export function DemoScheduler() {
  const reduced = useReducedMotion()

  // Client-only date state (avoids SSR/CSR hydration mismatch on "today").
  const [mounted, setMounted] = useState(false)
  const [viewMonth, setViewMonth] = useState(null)
  const todayRef = useRef(null)
  const tzRef = useRef('')

  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null) // { hour, minute }
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '', note: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const now = new Date()
    todayRef.current = startOfDay(now)
    tzRef.current = Intl.DateTimeFormat().resolvedOptions().timeZone || 'your local time'
    setViewMonth(monthFirst(now))
    setMounted(true)
  }, [])

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  const maxDate = useMemo(
    () => (todayRef.current ? addDays(todayRef.current, MAX_DAYS_AHEAD) : null),
    [mounted]
  )

  const dayIsDisabled = (date) => {
    const today = todayRef.current
    if (!today || !maxDate) return true
    if (date < today || date > maxDate) return true
    if (DISABLE_WEEKENDS && (date.getDay() === 0 || date.getDay() === 6)) return true
    return false
  }

  // Cells for the visible month: leading blanks + each day.
  const cells = useMemo(() => {
    if (!viewMonth) return []
    const y = viewMonth.getFullYear()
    const m = viewMonth.getMonth()
    const lead = new Date(y, m, 1).getDay()
    const days = new Date(y, m + 1, 0).getDate()
    return [
      ...Array.from({ length: lead }, () => null),
      ...Array.from({ length: days }, (_, i) => new Date(y, m, i + 1)),
    ]
  }, [viewMonth])

  const prevDisabled = viewMonth && todayRef.current && monthFirst(viewMonth) <= monthFirst(todayRef.current)
  const nextDisabled = viewMonth && maxDate && monthFirst(viewMonth) >= monthFirst(maxDate)

  const goMonth = (delta) =>
    setViewMonth((vm) => new Date(vm.getFullYear(), vm.getMonth() + delta, 1))

  const slots = useMemo(() => {
    const out = []
    for (let h = BUSINESS_HOURS.startHour; h < BUSINESS_HOURS.endHour; h++) {
      for (let mi = 0; mi < 60; mi += BUSINESS_HOURS.stepMin) out.push({ hour: h, minute: mi })
    }
    return out
  }, [])

  const slotLabel = (s) =>
    new Date(2000, 0, 1, s.hour, s.minute).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
  const monthLabel = viewMonth
    ? viewMonth.toLocaleDateString([], { month: 'long', year: 'numeric' })
    : ''
  const dayLabel = (d) =>
    d.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const canSubmit =
    selectedDate && selectedTime && form.name.trim().length >= 2 && isValidEmail(form.email) && status !== 'loading'

  async function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    setStatus('loading')
    setErrorMessage('')

    const slotTime = new Date(
      selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(),
      selectedTime.hour, selectedTime.minute
    )
    const demoSlot = `${dayLabel(selectedDate)} · ${slotLabel(selectedTime)} (${tzRef.current})`
    const note = form.note.trim()

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          phone: form.phone,
          inquiryType: 'Product Demo',
          message: note ? `Live demo requested. Note: ${note}` : 'Live demo requested.',
          demoSlot,
          demoISO: slotTime.toISOString(),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Something went wrong.')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Failed to send. Please try again.')
    }
  }

  function reset() {
    setStatus('idle')
    setSelectedDate(null)
    setSelectedTime(null)
    setForm({ name: '', email: '', company: '', phone: '', note: '' })
  }

  return (
    <div
      className="rounded-[20px] overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #3859a8, #2a4688)',
        boxShadow: '0 12px 40px rgba(56, 89, 168,0.35)',
      }}
    >
      {/* Header */}
      <div className="p-7 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <Calendar size={16} className="text-white/90" strokeWidth={1.8} />
          <h3 className="font-bold text-white text-base">Book a Live Demo</h3>
        </div>
        <p className="text-sm text-white/80 leading-relaxed">
          Pick a time and see our AI handle a real call in 15 minutes. No slides, no fluff.
        </p>
      </div>

      {/* Body */}
      <div className="bg-white rounded-t-2xl p-5">
        {status === 'success' ? (
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-10 text-center"
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
              style={{ background: 'rgba(56, 89, 168,0.1)' }}
            >
              <CheckCircle2 size={26} color={BRAND} strokeWidth={1.5} />
            </div>
            <h4 className="font-bold text-text text-base mb-1.5">Demo request received</h4>
            <p className="text-sm text-text-secondary max-w-xs">
              Thanks! We&rsquo;ll confirm your live demo by email shortly. Keep an eye on your inbox.
            </p>
            <button
              onClick={reset}
              className="mt-6 text-sm font-medium text-primary hover:underline bg-transparent border-none cursor-pointer"
            >
              Book another time
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Calendar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <button
                  type="button"
                  onClick={() => goMonth(-1)}
                  disabled={!mounted || prevDisabled}
                  aria-label="Previous month"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary transition-colors hover:bg-[rgba(56,89,168,0.08)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <ChevronLeft size={18} strokeWidth={1.8} />
                </button>
                <span className="text-sm font-semibold text-text">{mounted ? monthLabel : ' '}</span>
                <button
                  type="button"
                  onClick={() => goMonth(1)}
                  disabled={!mounted || nextDisabled}
                  aria-label="Next month"
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-text-secondary transition-colors hover:bg-[rgba(56,89,168,0.08)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                >
                  <ChevronRight size={18} strokeWidth={1.8} />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-1.5">
                {WEEKDAYS.map((d, i) => (
                  <div key={i} className="text-center text-[10px] font-semibold uppercase tracking-wide text-text-muted py-1">
                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1" style={{ minHeight: 200 }}>
                {mounted && cells.map((date, i) => {
                  if (!date) return <div key={`b-${i}`} />
                  const disabled = dayIsDisabled(date)
                  const selected = sameDay(date, selectedDate)
                  const isToday = sameDay(date, todayRef.current)
                  return (
                    <button
                      key={date.toISOString()}
                      type="button"
                      disabled={disabled}
                      aria-pressed={selected}
                      aria-label={dayLabel(date)}
                      onClick={() => { setSelectedDate(date); setSelectedTime(null) }}
                      className={`aspect-square rounded-lg text-sm font-medium flex items-center justify-center transition-all duration-150 ${
                        disabled
                          ? 'text-text-muted/40 cursor-not-allowed'
                          : selected
                            ? 'text-white'
                            : 'text-text hover:bg-[rgba(56,89,168,0.08)] cursor-pointer'
                      }`}
                      style={{
                        background: selected ? BRAND : undefined,
                        boxShadow: selected ? '0 4px 12px rgba(56,89,168,0.35)' : undefined,
                        ...(isToday && !selected ? { boxShadow: 'inset 0 0 0 1px rgba(56,89,168,0.35)' } : {}),
                      }}
                    >
                      {date.getDate()}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time slots */}
            <AnimatePresence initial={false}>
              {selectedDate && (
                <motion.div
                  initial={reduced ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="pt-1">
                    <div className="flex items-center gap-1.5 mb-2.5">
                      <Clock size={13} className="text-primary" strokeWidth={1.8} />
                      <span className="text-xs font-semibold text-text">
                        Times in {tzRef.current}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {slots.map((s) => {
                        const sel = selectedTime && selectedTime.hour === s.hour && selectedTime.minute === s.minute
                        return (
                          <button
                            key={`${s.hour}:${s.minute}`}
                            type="button"
                            onClick={() => setSelectedTime(s)}
                            aria-pressed={sel}
                            className={`rounded-[10px] py-2 text-sm font-medium transition-all duration-150 ${
                              sel ? 'text-white' : 'text-text hover:border-primary cursor-pointer'
                            }`}
                            style={
                              sel
                                ? { background: BRAND, boxShadow: '0 4px 12px rgba(56,89,168,0.30)' }
                                : { border: '1px solid rgba(0,0,0,0.1)' }
                            }
                          >
                            {slotLabel(s)}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Details */}
            <div className="space-y-3 pt-1">
              <div>
                <label htmlFor="demo-name" className={labelClass}>Full Name *</label>
                <input
                  id="demo-name" type="text" required placeholder="Jane Smith"
                  value={form.name} onChange={set('name')}
                  className={inputClass} style={inputStyle} disabled={status === 'loading'}
                />
              </div>
              <div>
                <label htmlFor="demo-email" className={labelClass}>Email *</label>
                <input
                  id="demo-email" type="email" required placeholder="jane@company.com"
                  value={form.email} onChange={set('email')}
                  className={inputClass} style={inputStyle} disabled={status === 'loading'}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="demo-company" className={labelClass}>Company</label>
                  <input
                    id="demo-company" type="text" placeholder="Acme Corp"
                    value={form.company} onChange={set('company')}
                    className={inputClass} style={inputStyle} disabled={status === 'loading'}
                  />
                </div>
                <div>
                  <label htmlFor="demo-phone" className={labelClass}>Phone</label>
                  <input
                    id="demo-phone" type="tel" placeholder="+1 (555) 000-0000"
                    value={form.phone} onChange={set('phone')}
                    className={inputClass} style={inputStyle} disabled={status === 'loading'}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="demo-note" className={labelClass}>Anything specific you&rsquo;d like to see?</label>
                <textarea
                  id="demo-note" rows={2} placeholder="Optional — e.g. inbound calls for a dental office"
                  value={form.note} onChange={set('note')}
                  className={`${inputClass} resize-none`} style={inputStyle} disabled={status === 'loading'}
                />
              </div>
            </div>

            {status === 'error' && (
              <div
                className="flex items-center gap-2.5 rounded-[11px] px-4 py-3 text-sm"
                style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}
              >
                <AlertCircle size={16} strokeWidth={1.5} />
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full inline-flex items-center justify-center gap-2 text-sm font-semibold text-white btn-gradient px-8 py-3.5 rounded-[11px] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
            >
              {status === 'loading' ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Requesting...
                </>
              ) : selectedDate && selectedTime ? (
                `Request demo · ${slotLabel(selectedTime)}`
              ) : (
                'Request demo'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
