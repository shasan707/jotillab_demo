import { NextResponse } from 'next/server'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { listIntakeSubmissions } from '@/lib/db'

/* Admin-only list of industry intake leads from Neon Postgres. */

export async function GET(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }
  try {
    const params = request.nextUrl.searchParams
    const limit = Math.min(Number(params.get('limit')) || 50, 100)
    const offset = Math.max(Number(params.get('offset')) || 0, 0)

    const result = await listIntakeSubmissions({ limit, offset })
    if (!result) {
      return NextResponse.json(
        { ok: false, error: 'Lead storage is not configured.' },
        { status: 503 }
      )
    }

    return NextResponse.json({ ok: true, items: result.rows, total: result.total })
  } catch (err) {
    console.error('[admin/leads] Error:', err)
    return NextResponse.json({ ok: false, error: 'Could not load leads.' }, { status: 500 })
  }
}
