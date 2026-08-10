import { redirect } from 'next/navigation'

/* The blog editor moved to Sanity Studio (/studio); the old bookmark
   now lands on the unified admin panel. */
export default function BlogAdminRedirect() {
  redirect('/admin')
}
