/* Server-side Retell API helper for the admin panel.
   Calls and chats are never stored locally; the panel reads them live
   from Retell's cloud through these admin-guarded proxies. The API key
   stays server-only (RETELL_API_KEY, never NEXT_PUBLIC). */

const RETELL_BASE = 'https://api.retellai.com'

/* Fetches a Retell API path. Returns parsed JSON, or null when the
   integration is not configured (callers turn that into a 503).
   Throws with the upstream status attached on a real API error. */
export async function retellFetch(path, { method = 'GET', body } = {}) {
  const apiKey = process.env.RETELL_API_KEY
  if (!apiKey) return null

  const res = await fetch(`${RETELL_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    cache: 'no-store',
  })

  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    const err = new Error(`Retell API ${res.status}: ${detail.slice(0, 200)}`)
    err.status = res.status
    throw err
  }
  return res.json()
}

/* Maps a Retell agent id back to a human label using the same env vars
   the web-call and chat routes resolve agents from. Only the label ever
   reaches the browser. */
const AGENT_LABELS = [
  [process.env.RETELL_AGENT_ID_BEAUTY_SPA, 'Beauty & Spa'],
  [process.env.RETELL_AGENT_ID_FINANCE_INSURANCE, 'Finance & Insurance'],
  [process.env.RETELL_AGENT_ID_HEALTH_WELLNESS, 'Health & Wellness'],
  [process.env.RETELL_AGENT_ID_HOME_SERVICES, 'Home Services'],
  [process.env.RETELL_AGENT_ID_LEGAL, 'Legal'],
  [process.env.RETELL_AGENT_ID_PERSONAL_SECRETARY, 'Personal Secretary'],
  [process.env.RETELL_AGENT_ID_REAL_ESTATE, 'Real Estate'],
  [process.env.RETELL_AGENT_ID_RESTAURANT, 'Restaurant'],
  [process.env.RETELL_AGENT_ID_SMALL_BUSINESS, 'Small Business'],
  [process.env.RETELL_AGENT_ID, 'Default voice'],
  [process.env.RETELL_CHAT_AGENT_ID, 'Website chat'],
]

export function agentLabel(agentId) {
  if (!agentId) return 'Unknown agent'
  for (const [id, label] of AGENT_LABELS) {
    if (id && id === agentId) return label
  }
  return agentId
}

/* Human platform labels for where an interaction happened.
   Calls: Retell distinguishes web calls (the site's voice orbs) from
   phone calls (a connected phone number). Chats: the site widget tags
   its sessions with metadata.channel = "website"; other channels wired
   into Retell later (WhatsApp, Messenger, SMS) are recognized from
   their metadata hints or chat_type. */
export function callPlatform(call) {
  return call?.call_type === 'phone_call' ? 'Phone' : 'Website'
}

export function chatPlatform(chat) {
  const hint = String(
    chat?.metadata?.channel || chat?.metadata?.platform || chat?.metadata?.source || ''
  ).toLowerCase()
  if (hint.includes('whatsapp')) return 'WhatsApp'
  if (hint.includes('messenger') || hint.includes('facebook')) return 'Messenger'
  if (hint.includes('instagram')) return 'Instagram'
  if (hint.includes('sms')) return 'SMS'
  if (hint.includes('web')) return 'Website'
  if (chat?.chat_type === 'sms_chat') return 'SMS'
  return 'Website'
}
