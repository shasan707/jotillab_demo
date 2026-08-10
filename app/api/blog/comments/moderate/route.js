import { decideComment, verifyModerationToken } from '@/lib/comments'

/* One-click comment moderation from the notification email.
   GET ?id=&action=approve|reject&token=  (token = HMAC over id:action)
   Approve publishes PUBLIC FIELDS ONLY to the post's approved list;
   reject deletes the pending record. Both are idempotent via a
   "decided" marker so re-clicked email links show a friendly page. */

function page(title, body, linkHref, linkLabel) {
  return new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${title} | JotilLabs</title>
</head>
<body style="margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#F4F6FB;font-family:Arial,Helvetica,sans-serif;">
  <div style="background:#ffffff;border:1px solid rgba(15,17,41,0.08);border-radius:20px;padding:40px 44px;max-width:420px;text-align:center;box-shadow:0 14px 36px rgba(15,17,41,0.10);">
    <h1 style="margin:0 0 10px;font-size:22px;color:#3859a8;">${title}</h1>
    <p style="margin:0 0 22px;font-size:15px;line-height:1.6;color:#4A4D6A;">${body}</p>
    ${linkHref ? `<a href="${linkHref}" style="display:inline-block;padding:11px 22px;border-radius:10px;background:#3859a8;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">${linkLabel}</a>` : ''}
  </div>
</body>
</html>`,
    { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  )
}

export async function GET(request) {
  try {
    const params = request.nextUrl.searchParams
    const id = params.get('id') || ''
    const action = params.get('action') || ''
    const token = params.get('token') || ''

    if (!['approve', 'reject'].includes(action) || !verifyModerationToken(id, action, token)) {
      return page('Link not valid', 'This moderation link is not valid.', null, null)
    }

    const { outcome, slug } = await decideComment(id, action)
    const base = process.env.SITE_URL || 'https://jotillabs.com'
    const postUrl = slug ? `${base}/blog/${slug}` : null

    switch (outcome) {
      case 'unconfigured':
        return page('Comments not configured', 'The comment storage is not set up yet.', null, null)
      case 'already-approved':
        return page('Already approved', 'This comment was already approved and is live on the post.', null, null)
      case 'already-rejected':
        return page('Already rejected', 'This comment was already rejected and deleted.', null, null)
      case 'missing':
        return page('Link expired', 'This comment is no longer pending. It may have expired.', null, null)
      case 'approved':
        return page('Comment approved', 'It is now live on the post.', postUrl, 'View the post')
      default:
        return page('Comment rejected', 'The comment was deleted and will not appear on the site.', postUrl, 'View the post')
    }
  } catch (err) {
    console.error('[blog/comments/moderate] Error:', err)
    return page('Something went wrong', 'Please try the link again in a moment.', null, null)
  }
}
