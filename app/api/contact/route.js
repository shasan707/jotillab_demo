import { Resend } from 'resend'
import { NextResponse } from 'next/server'

/** Escape HTML special characters to prevent injection in email body */
function escapeHtml(str) {
  if (!str) return ''
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request) {
  try {
    // Ensure Resend is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('[contact/route] RESEND_API_KEY is not set')
      return NextResponse.json(
        { ok: false, error: 'Email service is not configured.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { name, email, company, phone, inquiryType, message } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json({ ok: false, error: 'Valid name is required.' }, { status: 400 })
    }
    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ ok: false, error: 'Valid email is required.' }, { status: 400 })
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json({ ok: false, error: 'Message must be at least 10 characters.' }, { status: 400 })
    }

    const resend = new Resend(process.env.RESEND_API_KEY)
    const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@meet.jotillabs.com'

    // Sanitize all user inputs before inserting into HTML
    const safeName = escapeHtml(name.trim())
    const safeEmail = escapeHtml(email.trim())
    const safeCompany = company ? escapeHtml(company.trim()) : ''
    const safePhone = phone ? escapeHtml(phone.trim()) : ''
    const safeInquiry = escapeHtml(inquiryType) || 'General Inquiry'
    const safeMessage = escapeHtml(message.trim())

    const { error } = await resend.emails.send({
      from: `JotilLabs Website <${fromEmail}>`,
      to: 'contact@jotillabs.com',
      replyTo: email.trim(),
      subject: `New Contact Form Submission - ${safeInquiry}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #FAFBFD; border-radius: 12px;">
          <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #E5E7EB;">
            <h2 style="margin: 0; font-size: 22px; font-weight: 700; color: #111111;">New Contact Submission</h2>
            <p style="margin: 4px 0 0; font-size: 14px; color: #999999;">From jotillabs.com contact form</p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
              <td style="padding: 10px 0; color: #999; font-weight: 600; width: 140px; vertical-align: top;">Name</td>
              <td style="padding: 10px 0; color: #111;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #999; font-weight: 600; vertical-align: top;">Email</td>
              <td style="padding: 10px 0; color: #111;"><a href="mailto:${safeEmail}" style="color: #3859a8;">${safeEmail}</a></td>
            </tr>
            ${safeCompany ? `
            <tr>
              <td style="padding: 10px 0; color: #999; font-weight: 600; vertical-align: top;">Company</td>
              <td style="padding: 10px 0; color: #111;">${safeCompany}</td>
            </tr>` : ''}
            ${safePhone ? `
            <tr>
              <td style="padding: 10px 0; color: #999; font-weight: 600; vertical-align: top;">Phone</td>
              <td style="padding: 10px 0; color: #111;">${safePhone}</td>
            </tr>` : ''}
            <tr>
              <td style="padding: 10px 0; color: #999; font-weight: 600; vertical-align: top;">Inquiry Type</td>
              <td style="padding: 10px 0; color: #111;">${safeInquiry}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #999; font-weight: 600; vertical-align: top;">Message</td>
              <td style="padding: 10px 0; color: #111; white-space: pre-wrap;">${safeMessage}</td>
            </tr>
          </table>

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #999;">
            Sent from jotillabs.com on ${new Date().toUTCString()}
          </div>
        </div>
      `,
    })

    if (error) {
      console.error('[contact/route] Resend API error:', error)
      return NextResponse.json(
        { ok: false, error: 'Failed to send message. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[contact/route] Error:', err)
    return NextResponse.json(
      { ok: false, error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
