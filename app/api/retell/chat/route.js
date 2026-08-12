import { NextResponse } from 'next/server'

/* Proxies the site chatbot to a Retell chat agent entirely server-side.
   The browser sends { chatId?, message } and gets back { chatId, reply }.
   RETELL_API_KEY and RETELL_CHAT_AGENT_ID never leave the server
   (never NEXT_PUBLIC), and no agent id appears in any response. */
export async function POST(request) {
  try {
    const apiKey = process.env.RETELL_API_KEY
    const agentId = process.env.RETELL_CHAT_AGENT_ID

    if (!apiKey || !agentId) {
      console.error('[retell/chat] RETELL_API_KEY or RETELL_CHAT_AGENT_ID is not set')
      return NextResponse.json(
        { ok: false, error: 'Chat service is not configured.' },
        { status: 503 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const message = typeof body?.message === 'string' ? body.message.trim() : ''
    if (!message || message.length > 4000) {
      return NextResponse.json(
        { ok: false, error: 'Please send a message.' },
        { status: 400 }
      )
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    }

    // Start a chat session on first message; reuse it afterwards.
    let chatId = typeof body?.chatId === 'string' ? body.chatId : ''
    if (!chatId) {
      const created = await fetch('https://api.retellai.com/create-chat', {
        method: 'POST',
        headers,
        // metadata.channel lets the admin panel label where a chat came
        // from once other platforms (WhatsApp, Messenger) are wired in.
        body: JSON.stringify({ agent_id: agentId, metadata: { channel: 'website' } }),
        cache: 'no-store',
      })
      if (!created.ok) {
        const detail = await created.text().catch(() => '')
        console.error('[retell/chat] create-chat error:', created.status, detail)
        return NextResponse.json(
          { ok: false, error: 'Could not start the chat. Please try again.' },
          { status: 502 }
        )
      }
      chatId = (await created.json()).chat_id
    }

    const res = await fetch('https://api.retellai.com/create-chat-completion', {
      method: 'POST',
      headers,
      body: JSON.stringify({ chat_id: chatId, content: message }),
      cache: 'no-store',
    })
    if (!res.ok) {
      const detail = await res.text().catch(() => '')
      console.error('[retell/chat] create-chat-completion error:', res.status, detail)
      return NextResponse.json(
        { ok: false, error: 'Could not send that. Please try again.' },
        { status: 502 }
      )
    }

    const data = await res.json()
    const reply = (data.messages || [])
      .filter((m) => m?.role !== 'user' && typeof m?.content === 'string')
      .map((m) => m.content)
      .join('\n\n')
      // The widget renders plain text; drop markdown emphasis markers.
      .replace(/\*\*/g, '')

    return NextResponse.json({ ok: true, chatId, reply })
  } catch (err) {
    console.error('[retell/chat] Error:', err)
    return NextResponse.json(
      { ok: false, error: 'Could not send that. Please try again.' },
      { status: 500 }
    )
  }
}
