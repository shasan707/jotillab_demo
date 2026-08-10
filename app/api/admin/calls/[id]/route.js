import { NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { retellFetch, agentLabel } from '@/lib/retell'

/* Full detail for one Retell call. Always fetched fresh: signed
   recording URLs can expire, so nothing here is ever cached. */

export async function GET(request, { params }) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }
  try {
    const { id } = await params
    const c = await retellFetch(`/v2/get-call/${encodeURIComponent(id)}`)
    if (!c) {
      return NextResponse.json(
        { ok: false, error: 'Voice service is not configured.' },
        { status: 503 }
      )
    }

    return NextResponse.json({
      ok: true,
      call: {
        id: c.call_id,
        type: c.call_type,
        agent: agentLabel(c.agent_id),
        status: c.call_status,
        startedAt: c.start_timestamp || null,
        endedAt: c.end_timestamp || null,
        durationMs: c.duration_ms ?? null,
        transcript: c.transcript || null,
        transcriptObject: Array.isArray(c.transcript_object)
          ? c.transcript_object.map((u) => ({ role: u.role, content: u.content }))
          : null,
        recordingUrl: c.recording_url || null,
        fromNumber: c.from_number || null,
        toNumber: c.to_number || null,
        disconnectionReason: c.disconnection_reason || null,
        analysis: c.call_analysis
          ? {
              summary: c.call_analysis.call_summary || null,
              sentiment: c.call_analysis.user_sentiment || null,
              successful: c.call_analysis.call_successful ?? null,
            }
          : null,
      },
    })
  } catch (err) {
    console.error('[admin/calls/id] Error:', err)
    return NextResponse.json({ ok: false, error: 'Could not load the call.' }, { status: 502 })
  }
}
