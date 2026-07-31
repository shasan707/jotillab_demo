import { revalidateTag, revalidatePath } from 'next/cache'
import { parseBody } from 'next-sanity/webhook'

/* Sanity webhook target: fires on post create/update/delete so both the
   index and the post page refresh within seconds instead of waiting out the
   5-minute ISR window. Configure in sanity.io/manage with filter
   _type == "post", projection { "slug": slug.current }, and the
   SANITY_REVALIDATE_SECRET as the webhook secret. */

export async function POST(req) {
  const secret = process.env.SANITY_REVALIDATE_SECRET
  if (!secret) {
    return Response.json({ ok: false, message: 'Revalidation not configured' }, { status: 503 })
  }
  try {
    const { isValidSignature, body } = await parseBody(req, secret)
    if (!isValidSignature) {
      return Response.json({ ok: false, message: 'Invalid signature' }, { status: 401 })
    }
    revalidateTag('blog-posts')
    revalidatePath('/blog')
    if (body?.slug) revalidatePath(`/blog/${body.slug}`)
    revalidatePath('/blog/[slug]', 'page')
    revalidatePath('/sitemap.xml')
    return Response.json({ ok: true, slug: body?.slug || null })
  } catch (err) {
    console.error('[revalidate] Webhook error:', err)
    return Response.json({ ok: false }, { status: 500 })
  }
}
