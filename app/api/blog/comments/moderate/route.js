import {
  getRedis,
  pendingKey,
  approvedKey,
  decidedKey,
  DECIDED_TTL_SECONDS,
  verifyModerationToken,
} from '@/lib/comments'

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

    const redis = getRedis()
    if (!redis) {
      return page('Comments not configured', 'The comment storage is not set up yet.', null, null)
    }

    const decided = await redis.get(decidedKey(id))
    if (decided) {
      return page(
        decided === 'approved' ? 'Already approved' : 'Already rejected',
        decided === 'approved'
          ? 'This comment was already approved and is live on the post.'
          : 'This comment was already rejected and deleted.',
        null,
        null
      )
    }

    const raw = await redis.get(pendingKey(id))
    if (!raw) {
      return page('Link expired', 'This comment is no longer pending. It may have expired.', null, null)
    }
    const record = typeof raw === 'string' ? JSON.parse(raw) : raw
    const base = process.env.SITE_URL || 'https://jotillabs.com'
    const postUrl = `${base}/blog/${record.slug}`

    if (action === 'approve') {
      const publicComment = {
        id: record.id,
        name: record.name,
        message: record.message,
        createdAt: record.createdAt,
      }
      await redis.lpush(approvedKey(record.slug), JSON.stringify(publicComment))
      await redis.set(decidedKey(id), 'approved', { ex: DECIDED_TTL_SECONDS })
      await redis.del(pendingKey(id))
      return page('Comment approved', 'It is now live on the post.', postUrl, 'View the post')
    }

    await redis.set(decidedKey(id), 'rejected', { ex: DECIDED_TTL_SECONDS })
    await redis.del(pendingKey(id))
    return page('Comment rejected', 'The comment was deleted and will not appear on the site.', postUrl, 'View the post')
  } catch (err) {
    console.error('[blog/comments/moderate] Error:', err)
    return page('Something went wrong', 'Please try the link again in a moment.', null, null)
  }
}
