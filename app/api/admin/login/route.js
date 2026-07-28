import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { getRedis } from '@/lib/comments'
import { ADMIN_COOKIE, ADMIN_SESSION_MS, checkAdminPassword, makeAdminCookieValue } from '@/lib/adminAuth'

/* Blog admin sign-in. POST {password} sets the signed httpOnly session
   cookie; DELETE clears it. Brute force is slowed by a per-IP rate limit. */

export async function POST(request) {
  try {
    if (!process.env.BLOG_ADMIN_PASSWORD || !process.env.COMMENT_MODERATION_SECRET) {
      return NextResponse.json({ ok: false, error: 'Admin access is not configured.' }, { status: 503 })
    }

    // Rate limit: 5 attempts per 15 minutes per IP.
    const redis = getRedis()
    if (redis) {
      const ip =
        (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
        request.headers.get('x-real-ip') ||
        'anonymous'
      const ratelimit = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(5, '15 m'),
        prefix: 'rl:admin-login',
      })
      const { success } = await ratelimit.limit(ip)
      if (!success) {
        return NextResponse.json(
          { ok: false, error: 'Too many attempts. Please wait a few minutes.' },
          { status: 429 }
        )
      }
    }

    const body = await request.json().catch(() => ({}))
    if (!checkAdminPassword(body?.password)) {
      return NextResponse.json({ ok: false, error: 'Wrong password.' }, { status: 401 })
    }

    const value = makeAdminCookieValue()
    const res = NextResponse.json({ ok: true })
    res.cookies.set(ADMIN_COOKIE, value, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: Math.floor(ADMIN_SESSION_MS / 1000),
    })
    return res
  } catch (err) {
    console.error('[admin/login] Error:', err)
    return NextResponse.json({ ok: false, error: 'Could not sign in. Please try again.' }, { status: 500 })
  }
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE, '', { httpOnly: true, path: '/', maxAge: 0 })
  return res
}
