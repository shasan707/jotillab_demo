/* Small formatting helpers shared by the admin panel tabs. */

export function fmtDateTime(value) {
  if (!value) return '—'
  const d = typeof value === 'number' ? new Date(value) : new Date(String(value))
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

/* Compact relative time ("2h ago"); pair with title={fmtDateTime(...)}
   so the exact moment is a hover away. */
export function timeAgo(value) {
  if (!value) return '—'
  const d = typeof value === 'number' ? new Date(value) : new Date(String(value))
  if (Number.isNaN(d.getTime())) return '—'
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000)
  if (seconds < 60) return 'Just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function fmtDuration(ms) {
  if (ms == null || !Number.isFinite(ms)) return '—'
  const totalSeconds = Math.round(ms / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

export const SENTIMENT_STYLES = {
  Positive: { background: 'rgba(34,197,94,0.10)', color: '#15803D' },
  Negative: { background: 'rgba(239,68,68,0.10)', color: '#DC2626' },
  Neutral: { background: 'rgba(15,17,41,0.06)', color: '#4A4D6A' },
  Unknown: { background: 'rgba(15,17,41,0.06)', color: '#6B7098' },
}
