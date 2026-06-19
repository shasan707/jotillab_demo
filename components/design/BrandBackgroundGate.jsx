'use client'

import { usePathname } from 'next/navigation'
import { BrandBackground } from './BrandBackground'

/**
 * Chooses the BrandBackground variant based on current route.
 *
 *   - Homepage ("/")  -> "hero"  (full treatment: blob + grain + watermark + parallax)
 *   - Everywhere else -> "quiet" (blob + grain only, no watermark, no parallax)
 *
 * This is a thin client wrapper so the server-rendered layout.jsx can still
 * be a server component while pathname is resolved on the client.
 */
export function BrandBackgroundGate() {
  const pathname = usePathname()
  const variant = pathname === '/' ? 'hero' : 'quiet'
  return <BrandBackground variant={variant} />
}
