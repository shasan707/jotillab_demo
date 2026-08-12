import { NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { getRedis } from '@/lib/comments'

/* Per-record admin metadata (read state, flag, notes) stored in Redis:
   admin:meta:{kind}:{id} -> JSON { read, flagged, notes: [{text, at}] }.
   This is panel-only state; the source records (Retell, Neon) are never
   touched. */

const KINDS = new Set(['call', 'chat', 'lead', 'message'])

const metaKey = (kind, id) => `admin:meta:${kind}:${id}`

export async function GET(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }
  try {
    const params = request.nextUrl.searchParams
    const kind = params.get('kind') || ''
    const ids = (params.get('ids') || '')
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s && s.length <= 100)
      .slice(0, 200)

    if (!KINDS.has(kind) || ids.length === 0) {
      return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
    }

    const redis = getRedis()
    if (!redis) return NextResponse.json({ ok: true, meta: {} })

    const values = await redis.mget(...ids.map((id) => metaKey(kind, id)))
    const meta = {}
    ids.forEach((id, i) => {
      const raw = values[i]
      if (!raw) return
      meta[id] = typeof raw === 'string' ? JSON.parse(raw) : raw
    })
    return NextResponse.json({ ok: true, meta })
  } catch (err) {
    console.error('[admin/meta] Error:', err)
    return NextResponse.json({ ok: false, error: 'Could not load metadata.' }, { status: 500 })
  }
}

export async function POST(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const kind = body.kind
    const id = typeof body.id === 'string' || typeof body.id === 'number' ? String(body.id) : ''
    if (!KINDS.has(kind) || !id || id.length > 100) {
      return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
    }

    const redis = getRedis()
    if (!redis) {
      return NextResponse.json({ ok: false, error: 'Storage is not configured.' }, { status: 503 })
    }

    const key = metaKey(kind, id)
    const raw = await redis.get(key)
    const existing = raw ? (typeof raw === 'string' ? JSON.parse(raw) : raw) : {}
    const meta = { ...existing }

    if (typeof body.read === 'boolean') meta.read = body.read
    if (typeof body.flagged === 'boolean') meta.flagged = body.flagged
    if (typeof body.note === 'string' && body.note.trim()) {
      meta.notes = [
        ...(existing.notes || []),
        { text: body.note.trim().slice(0, 1000), at: new Date().toISOString() },
      ].slice(-50)
    }

    await redis.set(key, JSON.stringify(meta))
    return NextResponse.json({ ok: true, meta })
  } catch (err) {
    console.error('[admin/meta] Error:', err)
    return NextResponse.json({ ok: false, error: 'Could not save.' }, { status: 500 })
  }
}
