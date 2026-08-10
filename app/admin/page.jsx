import { cookies } from 'next/headers'
import { verifyAdminCookieValue, ADMIN_COOKIE } from '@/lib/adminAuth'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { AdminPanel } from '@/components/admin/AdminPanel'

/* Hidden admin area (not linked anywhere, blocked in robots.js).
   The server reads the signed session cookie: no cookie -> password
   screen; valid cookie -> the unified activity panel. Tabs fetch
   their own data client-side so each channel can fail independently. */

export const metadata = {
  title: 'Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const cookieStore = await cookies()
  const authed = verifyAdminCookieValue(cookieStore.get(ADMIN_COOKIE)?.value)

  if (!authed) {
    return <AdminLogin />
  }

  return <AdminPanel />
}
