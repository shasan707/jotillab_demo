import { NextResponse } from 'next/server'

/* Shared-password gate in front of the Sanity Studio (defense in depth on
   top of Sanity's own account login). Browser-native Basic Auth prompt:
   any username, password = STUDIO_PASSWORD env var. Unset var = gate stays
   closed rather than silently open. */

export const config = {
  matcher: ['/studio/:path*'],
}

export function middleware(req) {
  const expected = process.env.STUDIO_PASSWORD
  if (!expected) {
    return new NextResponse('Studio access is not configured.', { status: 503 })
  }
  const auth = req.headers.get('authorization') || ''
  if (auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6))
      const password = decoded.slice(decoded.indexOf(':') + 1)
      if (password === expected) return NextResponse.next()
    } catch {
      /* fall through to the challenge */
    }
  }
  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="JotilLabs Studio"' },
  })
}
