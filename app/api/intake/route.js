import { NextResponse } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { getRedis } from '@/lib/comments'
import { getIndustry } from '@/lib/industries'
import { getIntakeQuestions } from '@/lib/intakeQuestions'
import { saveIntakeSubmission } from '@/lib/db'

/* Industry intake form endpoint. Stores every submission in Neon Postgres
   (intake_submissions) and emails contact@jotillabs.com via Resend. Either
   channel alone is enough for a 200: the database is the system of record,
   the email is the notification. Both missing -> 503. */

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SHORT_MAX = 200
const LONG_MAX = 2000

function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request) {
  try {
    const hasDb = Boolean(process.env.DATABASE_URL)
    const hasEmail = Boolean(process.env.RESEND_API_KEY)
    if (!hasDb && !hasEmail) {
      return NextResponse.json(
        { ok: false, error: 'This form is not available right now. Please call us instead.' },
        { status: 503 }
      )
    }

    const body = await request.json().catch(() => ({}))

    // Bots fill the hidden field; pretend success and store nothing.
    if (typeof body.website === 'string' && body.website.trim()) {
      return NextResponse.json({ ok: true })
    }

    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
    const industry = getIndustry(slug)
    if (!industry) {
      return NextResponse.json({ ok: false, error: 'Unknown industry.' }, { status: 400 })
    }

    const questions = getIntakeQuestions(slug)
    const rawAnswers = body.answers && typeof body.answers === 'object' ? body.answers : {}
    const answers = {}

    for (const q of questions) {
      const value = typeof rawAnswers[q.id] === 'string' ? rawAnswers[q.id].trim() : ''
      if (q.required && !value) {
        return NextResponse.json(
          { ok: false, error: `Please answer: ${q.label}` },
          { status: 400 }
        )
      }
      if (!value) continue
      const max = q.type === 'textarea' ? LONG_MAX : SHORT_MAX
      if (value.length > max) {
        return NextResponse.json(
          { ok: false, error: `"${q.label}" is too long.` },
          { status: 400 }
        )
      }
      if (/https?:\/\//i.test(value)) {
        return NextResponse.json(
          { ok: false, error: 'Please answer without links.' },
          { status: 400 }
        )
      }
      if (q.type === 'email' && !EMAIL_RE.test(value)) {
        return NextResponse.json(
          { ok: false, error: 'Please enter a valid email address.' },
          { status: 400 }
        )
      }
      if (q.type === 'select' && q.options && !q.options.includes(value)) {
        return NextResponse.json(
          { ok: false, error: `Please pick an option for: ${q.label}` },
          { status: 400 }
        )
      }
      answers[q.id] = value
    }

    // Rate limit: 3 submissions per 10 minutes per IP. Redis unavailable ->
    // skip limiting rather than block real submissions.
    try {
      const redis = getRedis()
      if (redis) {
        const ip =
          (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() ||
          request.headers.get('x-real-ip') ||
          'anonymous'
        const ratelimit = new Ratelimit({
          redis,
          limiter: Ratelimit.slidingWindow(3, '10 m'),
          prefix: 'rl:intake',
        })
        const { success } = await ratelimit.limit(ip)
        if (!success) {
          return NextResponse.json(
            { ok: false, error: 'Too many submissions. Please try again in a few minutes.' },
            { status: 429 }
          )
        }
      }
    } catch (rlErr) {
      console.error('[intake] Rate limit check failed, continuing:', rlErr)
    }

    // System of record: Neon Postgres.
    let saved = false
    try {
      saved = await saveIntakeSubmission({ slug, industryName: industry.name, answers })
    } catch (dbErr) {
      console.error('[intake] Postgres save failed:', dbErr)
    }

    // Notification: Resend email to the team.
    let mailed = false
    if (hasEmail) {
      try {
        const rows = questions
          .filter((q) => answers[q.id])
          .map(
            (q) => `
              <tr>
                <td style="padding: 10px 0; color: #999; font-weight: 600; width: 220px; vertical-align: top;">${escapeHtml(q.label)}</td>
                <td style="padding: 10px 0; color: #111; white-space: pre-wrap;">${escapeHtml(answers[q.id])}</td>
              </tr>`
          )
          .join('')
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: process.env.RESEND_FROM_EMAIL || 'JotilLabs <onboarding@resend.dev>',
            to: ['contact@jotillabs.com'],
            reply_to: answers.contact_email,
            subject: `New ${industry.name} intake: ${answers.business_name || 'Unknown business'}`,
            html: `
              <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 640px; margin: 0 auto; padding: 32px 24px; background: #FAFBFD; border-radius: 12px;">
                <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #E5E7EB;">
                  <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #111111;">New ${escapeHtml(industry.name)} intake</h2>
                  <p style="margin: 4px 0 0; font-size: 14px; color: #999999;">From the ${escapeHtml(slug)} page on jotillabs.com</p>
                </div>
                <table style="width: 100%; border-collapse: collapse; font-size: 14px;">${rows}
                </table>
                <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #999;">
                  Sent from jotillabs.com on ${new Date().toUTCString()}
                </div>
              </div>
            `,
          }),
        })
        mailed = res.ok
        if (!res.ok) console.error('[intake] Resend notify failed:', res.status)
      } catch (mailErr) {
        console.error('[intake] Notify error:', mailErr)
      }
    }

    if (!saved && !mailed) {
      return NextResponse.json(
        { ok: false, error: 'Something went wrong on our side. Please try again or call us.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[intake] POST error:', err)
    return NextResponse.json(
      { ok: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
