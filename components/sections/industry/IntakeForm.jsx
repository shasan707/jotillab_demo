'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, CheckCircle2, AlertCircle, ArrowLeft, ArrowRight } from 'lucide-react'
import { getIntakeSteps } from '@/lib/intakeQuestions'

/* Multi-step intake wizard on each industry page. A few questions per
   screen with a progress bar; answers post to /api/intake which stores
   them and notifies the team. Follows the ContactForm conventions. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const inputClass =
  'w-full rounded-[11px] px-4 py-3 text-sm text-text bg-white border outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10'
const inputStyle = { border: '1px solid rgba(0,0,0,0.1)' }
const labelClass = 'block text-xs font-semibold text-text mb-1.5 tracking-wide uppercase'

function Field({ question, value, onChange, disabled }) {
  const id = `intake-${question.id}`
  if (question.type === 'select') {
    return (
      <div>
        <label htmlFor={id} className={labelClass}>
          {question.label}
          {question.required ? ' *' : ''}
        </label>
        <div className="relative">
          <select
            id={id}
            value={value}
            onChange={onChange}
            className={`${inputClass} appearance-none pr-10 cursor-pointer`}
            style={inputStyle}
            disabled={disabled}
          >
            <option value="">Select an option</option>
            {question.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
            strokeWidth={1.5}
          />
        </div>
      </div>
    )
  }
  if (question.type === 'textarea') {
    return (
      <div>
        <label htmlFor={id} className={labelClass}>
          {question.label}
          {question.required ? ' *' : ''}
        </label>
        <textarea
          id={id}
          rows={4}
          placeholder={question.placeholder}
          value={value}
          onChange={onChange}
          className={`${inputClass} resize-none`}
          style={inputStyle}
          disabled={disabled}
        />
      </div>
    )
  }
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {question.label}
        {question.required ? ' *' : ''}
      </label>
      <input
        id={id}
        type={question.type}
        placeholder={question.placeholder}
        value={value}
        onChange={onChange}
        className={inputClass}
        style={inputStyle}
        disabled={disabled}
      />
    </div>
  )
}

export function IntakeForm({ slug, industryName }) {
  const steps = getIntakeSteps(slug)
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [honeypot, setHoneypot] = useState('')
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  const set = (id) => (e) => setAnswers((prev) => ({ ...prev, [id]: e.target.value }))

  const current = steps[step]
  const isLast = step === steps.length - 1

  const stepComplete = current.questions.every((q) => {
    if (!q.required) return true
    const value = (answers[q.id] || '').trim()
    if (!value) return false
    if (q.type === 'email') return EMAIL_RE.test(value)
    return true
  })

  async function handleSubmit() {
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, answers, website: honeypot }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Could not send your answers. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[20px] bg-white p-8 md:p-12"
        style={{ border: '1px solid rgba(15,17,41,0.06)', boxShadow: '0 1px 2px rgba(15,17,41,0.04)' }}
      >
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
            style={{ background: 'rgba(56,89,168,0.1)' }}
          >
            <CheckCircle2 size={28} color="#3859a8" strokeWidth={1.5} />
          </div>
          <h3 className="font-bold text-text text-lg mb-2">Thanks, we have everything we need</h3>
          <p className="text-sm text-text-secondary max-w-sm">
            Our team will review your answers and reach out within one business day with a plan
            built for your {industryName.toLowerCase()} business.
          </p>
        </div>
      </motion.div>
    )
  }

  return (
    <div
      className="relative rounded-[20px] bg-white p-8 md:p-10"
      style={{ border: '1px solid rgba(15,17,41,0.06)', boxShadow: '0 1px 2px rgba(15,17,41,0.04)' }}
    >
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            Step {step + 1} of {steps.length}: {current.title}
          </p>
          <p className="text-xs text-text-secondary">
            {Math.round(((step + 1) / steps.length) * 100)}%
          </p>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(56,89,168,0.1)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #3859a8, #3B82F6)' }}
            animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Honeypot: hidden from people, tempting for bots */}
      <div className="absolute w-px h-px overflow-hidden -m-px" aria-hidden="true" style={{ clip: 'rect(0 0 0 0)' }}>
        <label htmlFor={`intake-website-${slug}`}>Website</label>
        <input
          id={`intake-website-${slug}`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          className="space-y-5"
        >
          {current.questions.map((q) => (
            <Field
              key={q.id}
              question={q}
              value={answers[q.id] || ''}
              onChange={set(q.id)}
              disabled={status === 'loading'}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {status === 'error' && (
        <div
          className="mt-5 flex items-center gap-2.5 rounded-[11px] px-4 py-3 text-sm"
          style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}
        >
          <AlertCircle size={16} strokeWidth={1.5} />
          {errorMessage}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s - 1)}
            disabled={status === 'loading'}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-text bg-transparent border-none cursor-pointer transition-colors disabled:opacity-60"
          >
            <ArrowLeft size={14} strokeWidth={2.2} />
            Back
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          onClick={isLast ? handleSubmit : () => setStep((s) => s + 1)}
          disabled={!stepComplete || status === 'loading'}
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-white btn-gradient px-8 py-3.5 rounded-[11px] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {status === 'loading' ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Sending...
            </>
          ) : isLast ? (
            'Send my answers'
          ) : (
            <>
              Next
              <ArrowRight size={14} strokeWidth={2.2} />
            </>
          )}
        </button>
      </div>
    </div>
  )
}
