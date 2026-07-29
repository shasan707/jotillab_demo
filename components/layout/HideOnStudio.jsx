'use client'

import { usePathname } from 'next/navigation'

/* The Sanity Studio at /studio is a full-screen app: site chrome (navbar,
   footer, floating widgets) must not render over it. Everything else in the
   layout stays server-rendered; this gate only reads the pathname. */
export function HideOnStudio({ children }) {
  const pathname = usePathname()
  if (pathname && pathname.startsWith('/studio')) return null
  return children
}
