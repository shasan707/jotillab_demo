import { NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { retellFetch, agentLabel, chatPlatform } from '@/lib/retell'

/* Full message history for one Retell chat session. */

export async function GET(request, { params }) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }
  try {
    const { id } = await params
    const chat = await retellFetch(`/get-chat/${encodeURIComponent(id)}`)
    if (!chat) {
      return NextResponse.json(
        { ok: false, error: 'Chat service is not configured.' },
        { status: 503 }
      )
    }

    const messages = Array.isArray(chat.message_with_tool_calls)
      ? chat.message_with_tool_calls
          .filter((m) => m?.role && typeof m.content === 'string' && m.content.trim())
          .map((m) => ({
            role: m.role,
            content: m.content,
            at: m.created_timestamp || null,
          }))
      : []

    return NextResponse.json({
      ok: true,
      chat: {
        id: chat.chat_id,
        agent: agentLabel(chat.agent_id),
        platform: chatPlatform(chat),
        status: chat.chat_status,
        startedAt: chat.start_timestamp || null,
        endedAt: chat.end_timestamp || null,
        messages,
        analysis: chat.chat_analysis
          ? {
              summary: chat.chat_analysis.chat_summary || null,
              sentiment: chat.chat_analysis.user_sentiment || null,
              successful: chat.chat_analysis.chat_successful ?? null,
            }
          : null,
      },
    })
  } catch (err) {
    console.error('[admin/chats/id] Error:', err)
    return NextResponse.json({ ok: false, error: 'Could not load the chat.' }, { status: 502 })
  }
}
