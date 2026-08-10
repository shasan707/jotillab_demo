'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUp, MapPin } from 'lucide-react'
import { EMAIL_RE, normalizeUrl, SHORT_MAX, LONG_MAX } from '@/lib/intakeValidation'

/* Typed-answer bar for text, email, tel, url, location and textarea
   questions. Validation mirrors the server so nobody types a whole answer
   only to be bounced at the end. Enter sends; Shift+Enter adds a line in
   textareas. Location questions add a share-my-location chip: browser
   geolocation (permission prompt, HTTPS only), softened into a readable
   place name via a keyless reverse-geocode with a raw-coordinates
   fallback, so it works even when that lookup is unreachable. */

async function readCurrentLocation() {
  const pos = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      timeout: 8000,
      maximumAge: 60000,
    })
  })
  const lat = pos.coords.latitude.toFixed(5)
  const lng = pos.coords.longitude.toFixed(5)
  try {
    const res = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
    )
    const data = await res.json()
    const place = [data.city || data.locality, data.principalSubdivision]
      .filter(Boolean)
      .join(', ')
    if (place) return `${place} (${lat}, ${lng})`
  } catch {
    // Lookup unavailable: coordinates alone are still a usable answer.
  }
  return `${lat}, ${lng}`
}

export function ChatInputBar({ question, onAnswer, onSkip, disabled }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [locating, setLocating] = useState(false)
  const inputRef = useRef(null)
  const isTextarea = question.type === 'textarea'
  const isLocation = question.type === 'location'

  async function shareLocation() {
    if (!navigator.geolocation) {
      setError('Location is not available in this browser. Please type it instead.')
      return
    }
    setError('')
    setLocating(true)
    try {
      onAnswer(await readCurrentLocation())
    } catch {
      setError('Could not get your location. Please type it instead.')
    } finally {
      setLocating(false)
    }
  }

  useEffect(() => {
    inputRef.current?.focus({ preventScroll: true })
  }, [question.id])

  function submit() {
    const trimmed = value.trim()
    if (!trimmed) {
      if (!question.required) {
        onSkip()
        return
      }
      setError('Please type an answer.')
      return
    }
    if (question.type === 'email' && !EMAIL_RE.test(trimmed)) {
      setError('Please enter a valid email address.')
      return
    }
    if (question.type === 'url' && !normalizeUrl(trimmed)) {
      setError('Please enter a valid website address.')
      return
    }
    setError('')
    setValue('')
    onAnswer(trimmed)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      submit()
    }
  }

  const sharedProps = {
    ref: inputRef,
    value,
    disabled,
    placeholder: question.placeholder || 'Type your answer',
    maxLength: isTextarea ? LONG_MAX : SHORT_MAX,
    onChange: (e) => {
      setValue(e.target.value)
      if (error) setError('')
    },
    onKeyDown: handleKeyDown,
    'aria-label': question.label,
    className:
      'flex-1 rounded-[11px] px-4 py-3 text-sm text-text bg-white border outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10 resize-none',
    style: { border: '1px solid rgba(0,0,0,0.1)' },
  }

  return (
    <div>
      {isLocation && (
        <button
          type="button"
          disabled={disabled || locating}
          onClick={shareLocation}
          className="mb-2.5 inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-[13px] font-semibold text-text bg-white cursor-pointer transition-all duration-200 hover:border-primary hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
          style={{ border: '1px solid rgba(15,17,41,0.12)' }}
        >
          <MapPin size={14} strokeWidth={1.8} color="#3859a8" />
          {locating ? 'Finding your location...' : 'Share my current location'}
        </button>
      )}
      <div className="flex items-end gap-2">
        {isTextarea ? (
          <textarea rows={3} {...sharedProps} />
        ) : (
          <input
            type={question.type === 'url' || isLocation ? 'text' : question.type}
            inputMode={question.type === 'url' ? 'url' : undefined}
            {...sharedProps}
          />
        )}
        <button
          type="button"
          onClick={submit}
          disabled={disabled}
          aria-label="Send answer"
          className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white btn-gradient shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          <ArrowUp size={17} strokeWidth={2.2} />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between gap-3 min-h-[18px]">
        {error ? (
          <p className="text-xs" style={{ color: '#DC2626' }}>{error}</p>
        ) : (
          <span />
        )}
        {!question.required && (
          <button
            type="button"
            disabled={disabled}
            onClick={onSkip}
            className="text-xs font-semibold text-text-secondary hover:text-text bg-transparent border-none cursor-pointer transition-colors"
          >
            {question.skipLabel || 'Skip this'}
          </button>
        )}
      </div>
    </div>
  )
}
