import { NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { retellFetch } from '@/lib/retell'
import { listIntakeSubmissions, listContactSubmissions } from '@/lib/db'
import { getRedis } from '@/lib/comments'

/* Headline counts for the admin overview strip. Each source resolves
   independently; an unconfigured or failing service reports null
   instead of breaking the others. */

async function retellTotal(path) {
  const data = await retellFetch(path, {
    method: 'POST',
    body: { limit: 1, include_total: true, sort_order: 'descending' },
  })
  if (!data) return null
  // Retell returns total as a string (e.g. "146")
  const total = Number(data.total)
  return Number.isFinite(total) ? total : null
}

async function pendingCommentCount() {
  const redis = getRedis()
  if (!redis) return null
  let count = 0
  let cursor = 0
  do {
    const [next, batch] = await redis.scan(cursor, { match: 'comments:pending:*', count: 100 })
    cursor = Number(next)
    count += batch.length
  } while (cursor !== 0)
  return count
}

export async function GET(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }

  const settle = (p) => p.then((v) => v).catch(() => null)
  const [calls, chats, leads, messages, comments] = await Promise.all([
    settle(retellTotal('/v3/list-calls')),
    settle(retellTotal('/v3/list-chats')),
    settle(listIntakeSubmissions({ limit: 1 }).then((r) => (r ? r.total : null))),
    settle(listContactSubmissions({ limit: 1 }).then((r) => (r ? r.total : null))),
    settle(pendingCommentCount()),
  ])

  return NextResponse.json({ ok: true, stats: { calls, chats, leads, messages, comments } })
}
