import { NextResponse } from 'next/server'
import { getIndustry } from '@/lib/industries'
import { getIntakeQuestions } from '@/lib/intakeQuestions'
import { validateAnswers } from '@/lib/intakeValidation'
import { allowIntakeRequest } from '@/lib/intakeRateLimit'
import { saveIntakeSubmission, updateIntakeLead } from '@/lib/db'

/* Industry intake final-submit endpoint. Stores the submission in Neon
   Postgres (intake_submissions) and emails contact@jotillabs.com via
   Resend. Either channel alone is enough for a 200: the database is the
   system of record, the email is the notification. Both missing -> 503.
   When the chat created a partial lead first (/api/intake/lead), the body
   carries { lead: { id, key } } and this route completes that row instead
   of inserting a new one; a row that is already complete answers 200
   without a second email (double-submit dedup). */

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
    const result = validateAnswers(questions, body.answers, { requireRequired: true })
    if (result.error) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 })
    }
    const answers = result.answers

    const lead =
      body.lead && Number.isInteger(body.lead.id) && typeof body.lead.key === 'string' && body.lead.key
        ? { id: body.lead.id, key: body.lead.key }
        : null

    // Preferred path: complete the partial lead the chat already created.
    // The create consumed the rate-limit budget, so no second check here.
    let saved = false
    if (hasDb && lead) {
      try {
        const outcome = await updateIntakeLead({
          id: lead.id,
          key: lead.key,
          answers,
          industryName: industry.name,
          complete: true,
        })
        if (outcome === 'updated') saved = true
        // Already completed with the same key: a double submit. Succeed
        // quietly without a second email or a duplicate row.
        if (outcome === 'completed') return NextResponse.json({ ok: true })
      } catch (dbErr) {
        console.error('[intake] Lead completion failed:', dbErr)
      }
    }

    // Fresh insert path (no lead, wrong key, or update failure): rate
    // limit 3 submissions per 10 minutes per IP, like the lead creates.
    if (!saved) {
      const allowed = await allowIntakeRequest(request, {
        prefix: 'rl:intake',
        tokens: 3,
        window: '10 m',
      })
      if (!allowed) {
        return NextResponse.json(
          { ok: false, error: 'Too many submissions. Please try again in a few minutes.' },
          { status: 429 }
        )
      }
      try {
        saved = await saveIntakeSubmission({ slug, industryName: industry.name, answers })
      } catch (dbErr) {
        console.error('[intake] Postgres save failed:', dbErr)
      }
    }

    // Notification: Resend email to the team.
    let mailed = false
    if (hasEmail) {
      try {
        const rows = questions
          .filter((q) => answers[q.id])
          .map((q) => {
            const value = Array.isArray(answers[q.id]) ? answers[q.id].join(', ') : answers[q.id]
            return `
              <tr>
                <td style="padding: 10px 0; color: #999; font-weight: 600; width: 220px; vertical-align: top;">${escapeHtml(q.label)}</td>
                <td style="padding: 10px 0; color: #111; white-space: pre-wrap;">${escapeHtml(value)}</td>
              </tr>`
          })
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
