import { NextResponse } from 'next/server'
import { getIndustry } from '@/lib/industries'
import { getIntakeQuestions, CONTACT_QUESTION_IDS } from '@/lib/intakeQuestions'
import { validateAnswers } from '@/lib/intakeValidation'
import { allowIntakeRequest } from '@/lib/intakeRateLimit'
import { createIntakeLead, updateIntakeLead } from '@/lib/db'

/* Partial leads for the guided chat intake. POST creates a lead as soon
   as the contact block is answered and hands the browser an { id, key }
   pair; PATCH updates that lead with the accumulated answers as the
   conversation continues. Completion (and the notification email) happens
   only through the final /api/intake submit. Without DATABASE_URL the
   POST answers { lead: null } and the chat degrades to a single final
   submit, exactly like the old wizard. */

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))

    // Bots fill the hidden field; pretend success and store nothing.
    if (typeof body.website === 'string' && body.website.trim()) {
      return NextResponse.json({ ok: true, lead: null })
    }

    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
    const industry = getIndustry(slug)
    if (!industry) {
      return NextResponse.json({ ok: false, error: 'Unknown industry.' }, { status: 400 })
    }

    const result = validateAnswers(getIntakeQuestions(slug), body.answers, { requireRequired: false })
    if (result.error) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 })
    }
    const answers = result.answers

    // A lead only exists once the full contact block is in.
    if (CONTACT_QUESTION_IDS.some((id) => !answers[id])) {
      return NextResponse.json(
        { ok: false, error: 'Contact details are incomplete.' },
        { status: 400 }
      )
    }

    // A create IS the lead, so it shares the final-submit budget.
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

    if (!process.env.DATABASE_URL) {
      return NextResponse.json({ ok: true, lead: null })
    }

    try {
      const lead = await createIntakeLead({ slug, industryName: industry.name, answers })
      return NextResponse.json({ ok: true, lead })
    } catch (dbErr) {
      console.error('[intake] Lead create failed:', dbErr)
      return NextResponse.json({ ok: true, lead: null })
    }
  } catch (err) {
    console.error('[intake] Lead POST error:', err)
    return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json().catch(() => ({}))

    const lead =
      body.lead && Number.isInteger(body.lead.id) && typeof body.lead.key === 'string' && body.lead.key
        ? { id: body.lead.id, key: body.lead.key }
        : null
    if (!lead) {
      return NextResponse.json({ ok: false, error: 'Missing lead.' }, { status: 400 })
    }

    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
    const industry = getIndustry(slug)
    if (!industry) {
      return NextResponse.json({ ok: false, error: 'Unknown industry.' }, { status: 400 })
    }

    const result = validateAnswers(getIntakeQuestions(slug), body.answers, { requireRequired: false })
    if (result.error) {
      return NextResponse.json({ ok: false, error: result.error }, { status: 400 })
    }

    // A full conversation produces a stream of updates even debounced, so
    // this window is far looser than the create budget.
    const allowed = await allowIntakeRequest(request, {
      prefix: 'rl:intake-upd',
      tokens: 60,
      window: '10 m',
    })
    if (!allowed) {
      return NextResponse.json({ ok: false, error: 'Too many requests.' }, { status: 429 })
    }

    try {
      const outcome = await updateIntakeLead({
        id: lead.id,
        key: lead.key,
        answers: result.answers,
        industryName: industry.name,
        complete: false,
      })
      if (outcome !== 'updated') {
        return NextResponse.json({ ok: false, error: 'This lead cannot be updated.' }, { status: 403 })
      }
      return NextResponse.json({ ok: true })
    } catch (dbErr) {
      console.error('[intake] Lead update failed:', dbErr)
      return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 500 })
    }
  } catch (err) {
    console.error('[intake] Lead PATCH error:', err)
    return NextResponse.json({ ok: false, error: 'Something went wrong.' }, { status: 500 })
  }
}
