import { NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { retellFetch, agentLabel } from '@/lib/retell'

/* Admin-only list of Retell voice calls, fetched live from Retell
   (v3 cursor pagination; the v2 list endpoints are deprecated). */

export async function GET(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }
  try {
    const params = request.nextUrl.searchParams
    const limit = Math.min(Number(params.get('limit')) || 50, 100)
    const paginationKey = params.get('paginationKey') || undefined

    const data = await retellFetch('/v3/list-calls', {
      method: 'POST',
      body: {
        sort_order: 'descending',
        limit,
        ...(paginationKey ? { pagination_key: paginationKey } : {}),
      },
    })
    if (!data) {
      return NextResponse.json(
        { ok: false, error: 'Voice service is not configured.' },
        { status: 503 }
      )
    }

    const items = (data.items || []).map((c) => ({
      id: c.call_id,
      type: c.call_type,
      agent: agentLabel(c.agent_id),
      status: c.call_status,
      startedAt: c.start_timestamp || null,
      durationMs: c.duration_ms ?? null,
      sentiment: c.call_analysis?.user_sentiment || null,
      summary: c.call_analysis?.call_summary || null,
      fromNumber: c.from_number || null,
      toNumber: c.to_number || null,
      disconnectionReason: c.disconnection_reason || null,
    }))

    return NextResponse.json({
      ok: true,
      items,
      paginationKey: data.pagination_key || null,
      hasMore: Boolean(data.has_more),
    })
  } catch (err) {
    console.error('[admin/calls] Error:', err)
    const busy = err?.status === 429
    return NextResponse.json(
      { ok: false, error: busy ? 'Retell is busy. Try again in a moment.' : 'Could not load calls.' },
      { status: busy ? 429 : 502 }
    )
  }
}
