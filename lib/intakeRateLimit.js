import { Ratelimit } from '@upstash/ratelimit'
import { getRedis } from '@/lib/comments'

/* Per-IP sliding-window rate limit shared by the intake endpoints.
   Redis unavailable or erroring -> fail open (allow) rather than block a
   real lead; the intake endpoints already validate everything else. */
export async function allowIntakeRequest(request, { prefix, tokens, window }) {
  try {
    const redis = getRedis()
    if (!redis) return true
    const ip =
      (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous'
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(tokens, window),
      prefix,
    })
    const { success } = await ratelimit.limit(ip)
    return success
  } catch (err) {
    console.error(`[intake] Rate limit check failed (${prefix}), continuing:`, err)
    return true
  }
}
