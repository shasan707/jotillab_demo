import { cookies } from 'next/headers'
import { verifyAdminCookieValue, ADMIN_COOKIE } from '@/lib/adminAuth'
import { getAllPostsCombined } from '@/lib/blog'
import { AdminLogin } from '@/components/admin/AdminLogin'
import { AdminDashboard } from '@/components/admin/AdminDashboard'

/* Hidden blog admin area (not linked anywhere, blocked in robots.js).
   The server reads the signed session cookie: no cookie -> password
   screen; valid cookie -> the writing dashboard. */

export const metadata = {
  title: 'Blog Admin',
  robots: { index: false, follow: false },
}

export const dynamic = 'force-dynamic'

export default async function BlogAdminPage() {
  const cookieStore = await cookies()
  const authed = verifyAdminCookieValue(cookieStore.get(ADMIN_COOKIE)?.value)

  if (!authed) {
    return <AdminLogin />
  }

  const posts = await getAllPostsCombined()
  // The dashboard needs full content for editing admin posts; MDX posts
  // are read-only so their content can stay behind.
  const list = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt || '',
    category: p.category || '',
    author: p.author || '',
    date: p.date || '',
    source: p.source,
    content: p.source === 'admin' ? p.content : '',
  }))

  return <AdminDashboard posts={list} />
}
