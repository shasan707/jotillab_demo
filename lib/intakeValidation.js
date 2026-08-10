/* Shared answer validation for the intake endpoints (/api/intake and
   /api/intake/lead). Walks the question list for a slug and returns either
   { answers } with only whitelisted, sanitized values, or { error } with a
   user-facing message. `requireRequired: false` (partial saves) skips the
   required check but still validates every value that was provided. */

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const SHORT_MAX = 200
export const LONG_MAX = 2000

/* Normalizes a user-typed website address to an https URL, or returns null
   when it cannot be a real web address. Mirrored client-side in the chat. */
export function normalizeUrl(value) {
  const trimmed = String(value).trim()
  if (!trimmed || trimmed.length > SHORT_MAX || /\s/.test(trimmed)) return null
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  try {
    const url = new URL(withProtocol)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    if (!url.hostname.includes('.')) return null
    return url.toString()
  } catch {
    return null
  }
}

export function validateAnswers(questions, rawAnswers, { requireRequired = true } = {}) {
  const source = rawAnswers && typeof rawAnswers === 'object' ? rawAnswers : {}
  const answers = {}

  for (const q of questions) {
    const raw = source[q.id]

    if (q.type === 'multiselect') {
      const list = Array.isArray(raw)
        ? [...new Set(raw.filter((v) => typeof v === 'string').map((v) => v.trim()).filter(Boolean))]
        : []
      if (requireRequired && q.required && list.length === 0) {
        return { error: `Please answer: ${q.label}` }
      }
      if (list.length === 0) continue
      if (list.length > (q.options?.length || 0) || list.some((v) => !q.options?.includes(v))) {
        return { error: `Please pick from the options for: ${q.label}` }
      }
      answers[q.id] = list
      continue
    }

    const value = typeof raw === 'string' ? raw.trim() : ''
    if (requireRequired && q.required && !value) {
      return { error: `Please answer: ${q.label}` }
    }
    if (!value) continue

    if (q.type === 'url') {
      const normalized = normalizeUrl(value)
      if (!normalized) {
        return { error: 'Please enter a valid website address.' }
      }
      answers[q.id] = normalized
      continue
    }

    const max = q.type === 'textarea' ? LONG_MAX : SHORT_MAX
    if (value.length > max) {
      return { error: `"${q.label}" is too long.` }
    }
    if (/https?:\/\//i.test(value)) {
      return { error: 'Please answer without links.' }
    }
    if (q.type === 'email' && !EMAIL_RE.test(value)) {
      return { error: 'Please enter a valid email address.' }
    }
    if (q.type === 'select' && q.options && !q.options.includes(value)) {
      return { error: `Please pick an option for: ${q.label}` }
    }
    answers[q.id] = value
  }

  return { answers }
}
