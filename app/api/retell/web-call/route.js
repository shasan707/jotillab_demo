import { NextResponse } from 'next/server'

/* Creates a Retell web-call session server-side and hands ONLY the short-lived
   access token to the browser. The API key and agent id stay on the server
   (RETELL_API_KEY / RETELL_AGENT_ID env vars — never NEXT_PUBLIC). */
export async function POST() {
  try {
    const apiKey = process.env.RETELL_API_KEY
    const agentId = process.env.RETELL_AGENT_ID

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
