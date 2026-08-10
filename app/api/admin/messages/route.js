import { NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { listContactSubmissions } from '@/lib/db'

/* Admin-only list of contact form and demo booking submissions. */

export async function GET(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }
  try {
    const params = request.nextUrl.searchParams
    const limit = Math.min(Number(params.get('limit')) || 50, 100)
    const offset = Math.max(Number(params.get('offset')) || 0, 0)

    const result = await listContactSubmissions({ limit, offset })
    if (!result) {
      return NextResponse.json(
        { ok: false, error: 'Message storage is not configured.' },
        { status: 503 }
      )
    }

    return NextResponse.json({ ok: true, items: result.rows, total: result.total })
  } catch (err) {
    console.error('[admin/messages] Error:', err)
    return NextResponse.json({ ok: false, error: 'Could not load messages.' }, { status: 500 })
  }
}
