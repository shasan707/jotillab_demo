import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { getPostBySlug } from '@/lib/mdx'
import {
  getRedis,
  pendingKey,
  approvedKey,
  PENDING_TTL_SECONDS,
  signModerationToken,
} from '@/lib/comments'

/* Public blog comments, moderated by email.
   GET  ?slug=   -> approved comments for a post (public fields only)
   POST          -> stores a PENDING comment and emails contact@jotillabs.com
                    one-click approve / reject links. Nothing shows publicly
                    until approved via /api/blog/comments/moderate. */

const SLUG_RE = /^[a-z0-9-]+$/
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function GET(request) {
  try {
    const slug = request.nextUrl.searchParams.get('slug') || ''
    if (!SLUG_RE.test(slug)) {
      return NextResponse.json({ ok: false, error: 'Invalid post.' }, { status: 400 })
    }
    const redis = getRedis()
    if (!redis) {
      return NextResponse.json({ ok: false, error: 'Comments are not available.' }, { status: 503 })
    }
    const raw = await redis.lrange(approvedKey(slug), 0, -1)
    const comments = raw
      .map((item) => {
        try {
          return typeof item === 'string' ? JSON.parse(item) : item
        } catch {
          return null
        }
      })
      .filter(Boolean)
    return NextResponse.json({ ok: true, comments })
  } catch (err) {
    console.error('[blog/comments] GET error:', err)
    return NextResponse.json({ ok: false, error: 'Could not load comments.' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const redis = getRedis()
    if (!redis) {
      return NextResponse.json({ ok: false, error: 'Comments are not available.' }, { status: 503 })
    }

    const body = await request.json().catch(() => ({}))
    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
    const name = typeof body.name === 'string' ? body.name.trim() : ''
    const email = typeof body.email === 'string' ? body.email.trim() : ''
    const message = typeof body.message === 'string' ? body.message.trim() : ''
    const honeypot = typeof body.website === 'string' ? body.website.trim() : ''

    // Bots fill the hidden field; pretend success and store nothing.
    if (honeypot) {
      return NextResponse.json({ ok: true })
    }

    if (!SLUG_RE.test(slug) || !getPostBySlug(slug)) {
      return NextResponse.json({ ok: false, error: 'Invalid post.' }, { status: 400 })
    }
    if (name.length < 2 || name.length > 60) {
      return NextResponse.json({ ok: false, error: 'Please enter your name.' }, { status: 400 })
    }
    if (email && !EMAIL_RE.test(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (message.length < 10 || message.length > 2000) {
      return NextResponse.json(
        { ok: false, error: 'Please write at least a sentence (10 to 2000 characters).' },
        { status: 400 }
      )
    }
    if (/https?:\/\//i.test(message)) {
      return NextResponse.json(
        { ok: false, error: 'Please share your thoughts without links.' },
        { status: 400 }
      )
    }

    // Rate limit: 3 comments per 10 minutes per IP.
    const ip =
      (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      'anonymous'
    const ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, '10 m'),
      prefix: 'rl:comments',
    })
    const { success } = await ratelimit.limit(ip)
    if (!success) {
      return NextResponse.json(
        { ok: false, error: 'You are commenting too quickly. Please try again in a few minutes.' },
        { status: 429 }
      )
    }

    const id = crypto.randomUUID()
    const createdAt = new Date().toISOString()
    const record = { id, slug, name, message, createdAt }
    if (email) record.email = email
    await redis.set(pendingKey(id), JSON.stringify(record), { ex: PENDING_TTL_SECONDS })

    // Notify the owner. A failed email must not fail the submission.
    try {
      const apiKey = process.env.RESEND_API_KEY
      const approveToken = signModerationToken(id, 'approve')
      const rejectToken = signModerationToken(id, 'reject')
      if (apiKey && approveToken && rejectToken) {
        const post = getPostBySlug(slug)
        const base = process.env.SITE_URL || 'https://jotillabs.com'
        const moderate = (action, token) =>
          `${base}/api/blog/comments/moderate?id=${id}&action=${action}&token=${token}`
        const btn = (href, label, color) =>
          `<a href="${href}" style="display:inline-block;padding:12px 22px;border-radius:10px;background:${color};color:#ffffff;font-weight:600;text-decoration:none;margin-right:12px;">${label}</a>`
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'JotilLabs <onboarding@resend.dev>',
            to: ['contact@jotillabs.com'],
            subject: `New blog comment on "${post.title}"`,
            html: `
              <div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#0F1129;">
                <h2 style="color:#3859a8;">New comment awaiting review</h2>
                <p style="margin:4px 0;"><strong>Post:</strong> <a href="${base}/blog/${slug}">${escapeHtml(post.title)}</a></p>
                <p style="margin:4px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
                ${email ? `<p style="margin:4px 0;"><strong>Email (not shown publicly):</strong> ${escapeHtml(email)}</p>` : ''}
                <div style="background:#F4F6FB;border-radius:12px;padding:16px;margin:16px 0;white-space:pre-wrap;">${escapeHtml(message)}</div>
                <p>
                  ${btn(moderate('approve', approveToken), 'Approve', '#12a06b')}
                  ${btn(moderate('reject', rejectToken), 'Reject', '#DC2626')}
                </p>
                <p style="color:#6B7098;font-size:12px;">Approving publishes the comment on the post. Rejecting deletes it.</p>
              </div>
            `,
          }),
        }).then((res) => {
          if (!res.ok) console.error('[blog/comments] Resend notify failed:', res.status)
        })
      } else {
        console.warn('[blog/comments] Notification skipped (missing RESEND_API_KEY or moderation secret)')
      }
    } catch (mailErr) {
      console.error('[blog/comments] Notify error:', mailErr)
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[blog/comments] POST error:', err)
    return NextResponse.json(
      { ok: false, error: 'Could not submit your comment. Please try again.' },
      { status: 500 }
    )
  }
}
