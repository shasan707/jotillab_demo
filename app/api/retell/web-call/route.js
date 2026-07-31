import { NextResponse } from 'next/server'

/* Creates a Retell web-call session server-side and hands ONLY the short-lived
   access token to the browser. The API key and agent ids stay on the server
   (RETELL_* env vars — never NEXT_PUBLIC). The client may send an industry
   key; it is resolved against this server-side map, so agent ids are never
   accepted from or exposed to the browser. */
const INDUSTRY_AGENTS = {
  'beauty-spa': process.env.RETELL_AGENT_ID_BEAUTY_SPA,
  'finance-insurance': process.env.RETELL_AGENT_ID_FINANCE_INSURANCE,
  'health-wellness': process.env.RETELL_AGENT_ID_HEALTH_WELLNESS,
  'home-services': process.env.RETELL_AGENT_ID_HOME_SERVICES,
  legal: process.env.RETELL_AGENT_ID_LEGAL,
  'personal-secretary': process.env.RETELL_AGENT_ID_PERSONAL_SECRETARY,
  'real-estate': process.env.RETELL_AGENT_ID_REAL_ESTATE,
  restaurant: process.env.RETELL_AGENT_ID_RESTAURANT,
  'small-business': process.env.RETELL_AGENT_ID_SMALL_BUSINESS,
}

export async function POST(request) {
  try {
    const apiKey = process.env.RETELL_API_KEY
    const body = await request.json().catch(() => ({}))
    const agentId = INDUSTRY_AGENTS[body?.agent] || process.env.RETELL_AGENT_ID

    if (!apiKey || !agentId) {
      console.error('[retell/web-call] RETELL_API_KEY or RETELL_AGENT_ID is not set')
      return NextResponse.json(
        { ok: false, error: 'Voice service is not configured.' },
        { status: 503 }
      )
    }

    const res = await fetch('https://api.retellai.com/v2/create-web-call', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ agent_id: agentId }),
      cache: 'no-store',
    })

    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[retell/web-call] Retell API error:', res.status, detail)
      return NextResponse.json(
        { ok: false, error: 'Could not start the voice call. Please try again.' },
        { status: 502 }
      )
    }

    const data = await res.json()
    return NextResponse.json({ ok: true, accessToken: data.access_token })
  } catch (err) {
    console.error('[retell/web-call] Error:', err)
    return NextResponse.json(
      { ok: false, error: 'Could not start the voice call. Please try again.' },
      { status: 500 }
    )
  }
}
