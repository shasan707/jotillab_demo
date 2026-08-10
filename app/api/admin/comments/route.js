import { NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { getRedis, decideComment } from '@/lib/comments'

/* Admin comment moderation: list pending comments and apply decisions.
   The signed admin cookie replaces the emailed HMAC token; both paths
   go through the same idempotent decideComment. */

export async function GET(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }
  try {
    const redis = getRedis()
    if (!redis) {
      return NextResponse.json(
        { ok: false, error: 'Comment storage is not configured.' },
        { status: 503 }
      )
    }

    const keys = []
    let cursor = 0
    do {
      const [next, batch] = await redis.scan(cursor, {
        match: 'comments:pending:*',
        count: 100,
      })
      cursor = Number(next)
      keys.push(...batch)
    } while (cursor !== 0)

    let items = []
    if (keys.length > 0) {
      const values = await redis.mget(...keys)
      items = values
        .filter(Boolean)
        .map((raw) => (typeof raw === 'string' ? JSON.parse(raw) : raw))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }

    return NextResponse.json({ ok: true, items })
  } catch (err) {
    console.error('[admin/comments] Error:', err)
    return NextResponse.json({ ok: false, error: 'Could not load comments.' }, { status: 500 })
  }
}

export async function POST(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const id = typeof body.id === 'string' ? body.id : ''
    const action = body.action
    if (!id || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
    }

    const { outcome } = await decideComment(id, action)
    if (outcome === 'unconfigured') {
      return NextResponse.json(
        { ok: false, error: 'Comment storage is not configured.' },
        { status: 503 }
      )
    }
    return NextResponse.json({ ok: true, outcome })
  } catch (err) {
    console.error('[admin/comments] Error:', err)
    return NextResponse.json({ ok: false, error: 'Could not apply the decision.' }, { status: 500 })
  }
}
