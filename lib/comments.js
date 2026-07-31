import { createHmac, timingSafeEqual } from 'node:crypto'
import { Redis } from '@upstash/redis'

/* Server-side helpers for moderated blog comments.
   Data model (Upstash Redis):
   - comments:pending:{id}   JSON {id, slug, name, email?, message, createdAt}, TTL 30d.
                             The ONLY place a commenter email ever lives.
   - comments:approved:{slug} LIST of public-field JSON {id, name, message, createdAt}
   - comments:decided:{id}   "approved" | "rejected", TTL 90d (idempotent links)
   Moderation links are HMAC-signed with COMMENT_MODERATION_SECRET so nobody
   can approve or reject a comment without the emailed link. */

let redisClient

/* Returns a Redis client, or null when the integration is not configured
   (callers turn that into a 503 and the UI hides the whole section). The
   Vercel Marketplace install may provision either UPSTASH_* or KV_* names. */
export function getRedis() {
  if (redisClient) return redisClient
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  redisClient = new Redis({ url, token })
  return redisClient
}

export const pendingKey = (id) => `comments:pending:${id}`
export const approvedKey = (slug) => `comments:approved:${slug}`
export const decidedKey = (id) => `comments:decided:${id}`

export const PENDING_TTL_SECONDS = 30 * 24 * 60 * 60
export const DECIDED_TTL_SECONDS = 90 * 24 * 60 * 60

export function signModerationToken(id, action) {
  const secret = process.env.COMMENT_MODERATION_SECRET
  if (!secret) return null
  return createHmac('sha256', secret).update(`${id}:${action}`).digest('hex')
}

export function verifyModerationToken(id, action, token) {
  const expected = signModerationToken(id, action)
  if (!expected || typeof token !== 'string') return false
  const a = Buffer.from(expected, 'hex')
  let b
  try {
    b = Buffer.from(token, 'hex')
  } catch {
    return false
  }
  return a.length === b.length && timingSafeEqual(a, b)
}
