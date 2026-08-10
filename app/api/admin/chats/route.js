import { NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { retellFetch, agentLabel } from '@/lib/retell'

/* Admin-only list of Retell chat sessions, fetched live from Retell. */

function chatMessages(chat) {
  return Array.isArray(chat.message_with_tool_calls)
    ? chat.message_with_tool_calls.filter((m) => m?.role && typeof m.content === 'string')
    : []
}

export async function GET(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }
  try {
    const params = request.nextUrl.searchParams
    const limit = Math.min(Number(params.get('limit')) || 50, 100)
    const paginationKey = params.get('paginationKey') || undefined

    const data = await retellFetch('/v3/list-chats', {
      method: 'POST',
      body: {
        sort_order: 'descending',
        limit,
        ...(paginationKey ? { pagination_key: paginationKey } : {}),
      },
    })
    if (!data) {
      return NextResponse.json(
        { ok: false, error: 'Chat service is not configured.' },
        { status: 503 }
      )
    }

    const items = (data.items || []).map((chat) => {
      const messages = chatMessages(chat)
      const firstUser = messages.find((m) => m.role === 'user')
      return {
        id: chat.chat_id,
        agent: agentLabel(chat.agent_id),
        status: chat.chat_status,
        startedAt: chat.start_timestamp || null,
        endedAt: chat.end_timestamp || null,
        sentiment: chat.chat_analysis?.user_sentiment || null,
        summary: chat.chat_analysis?.chat_summary || null,
        preview: firstUser?.content?.slice(0, 120) || null,
        messageCount: messages.length,
        userMessageCount: messages.filter((m) => m.role === 'user').length,
      }
    })

    return NextResponse.json({
      ok: true,
      items,
      paginationKey: data.pagination_key || null,
      hasMore: Boolean(data.has_more),
    })
  } catch (err) {
    console.error('[admin/chats] Error:', err)
    const busy = err?.status === 429
    return NextResponse.json(
      { ok: false, error: busy ? 'Retell is busy. Try again in a moment.' : 'Could not load chats.' },
      { status: busy ? 429 : 502 }
    )
  }
}
