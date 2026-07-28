import { createHash, createHmac, timingSafeEqual } from 'node:crypto'

/* Shared-password admin auth for the blog admin area.
   The password lives in BLOG_ADMIN_PASSWORD (server-only). A successful
   login sets an httpOnly cookie whose value is `${expiry}.${hmac}`,
   signed with COMMENT_MODERATION_SECRET, valid for 30 days. */

export const ADMIN_COOKIE = 'jotil_admin'
export const ADMIN_SESSION_MS = 30 * 24 * 60 * 60 * 1000

function hmacFor(payload) {
  const secret = process.env.COMMENT_MODERATION_SECRET
  if (!secret) return null
  return createHmac('sha256', secret).update(payload).digest('hex')
}

export function makeAdminCookieValue() {
  const expiresAt = Date.now() + ADMIN_SESSION_MS
  const sig = hmacFor(`admin:${expiresAt}`)
  return sig ? `${expiresAt}.${sig}` : null
}

export function verifyAdminCookieValue(value) {
  if (typeof value !== 'string') return false
  const dot = value.indexOf('.')
  if (dot < 1) return false
  const expiresAt = Number(value.slice(0, dot))
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) return false
  const expected = hmacFor(`admin:${expiresAt}`)
  if (!expected) return false
  const given = value.slice(dot + 1)
  const a = Buffer.from(expected, 'hex')
  let b
  try {
    b = Buffer.from(given, 'hex')
  } catch {
    return false
  }
  return a.length === b.length && timingSafeEqual(a, b)
}

export function verifyAdminRequest(request) {
  return verifyAdminCookieValue(request.cookies.get(ADMIN_COOKIE)?.value)
}

/* Length-safe constant-time password check (hash both sides first). */
export function checkAdminPassword(input) {
  const expected = process.env.BLOG_ADMIN_PASSWORD
  if (!expected || typeof input !== 'string') return false
  const a = createHash('sha256').update(input).digest()
  const b = createHash('sha256').update(expected).digest()
  return timingSafeEqual(a, b)
}
