import { NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { retellFetch } from '@/lib/retell'
import { intakeCreatedSince, contactCreatedSince } from '@/lib/db'

/* Raw event timestamps for the Overview charts, covering the last 30
   days. The client buckets them by day and hour in the viewer's own
   timezone. Each source resolves independently: null means the service
   is not configured, an array (possibly empty) means it answered. */

const WINDOW_DAYS = 30

async function retellEvents(path, map) {
  const data = await retellFetch(path, {
    method: 'POST',
    body: { limit: 1000, sort_order: 'descending' },
  })
  if (!data) return null
  const cutoff = Date.now() - WINDOW_DAYS * 24 * 60 * 60 * 1000
  return (data.items || [])
    .filter((item) => (item.start_timestamp || 0) >= cutoff)
    .map(map)
}

export async function GET(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }

  const settle = (p) => p.then((v) => v).catch(() => null)
  const [calls, chats, leads, messages] = await Promise.all([
    settle(
      retellEvents('/v3/list-calls', (c) => ({
        t: c.start_timestamp,
        sentiment: c.call_analysis?.user_sentiment || 'Unknown',
        durationMs: c.duration_ms ?? 0,
      }))
    ),
    settle(
      retellEvents('/v3/list-chats', (chat) => ({
        t: chat.start_timestamp,
        hasMessages: Array.isArray(chat.message_with_tool_calls)
          ? chat.message_with_tool_calls.some((m) => m?.role === 'user')
          : false,
      }))
    ),
    settle(intakeCreatedSince(WINDOW_DAYS)),
    settle(contactCreatedSince(WINDOW_DAYS)),
  ])

  return NextResponse.json({ ok: true, windowDays: WINDOW_DAYS, calls, chats, leads, messages })
}
