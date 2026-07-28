import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import readingTime from 'reading-time'
import { getPostBySlug } from '@/lib/mdx'
import { getRedis } from '@/lib/comments'
import { POSTS_HASH_KEY, slugify } from '@/lib/blog'
import { verifyAdminRequest } from '@/lib/adminAuth'
import { BLOG_CATEGORIES } from '@/data/blogCategories'

/* Admin blog post CRUD. Every method requires the signed admin cookie.
   Posts live in the Redis hash blog:posts keyed by slug, shaped exactly
   like resolved MDX posts. Slugs are immutable after creation (comments
   are keyed by slug) and can never collide with or touch MDX file posts. */

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function validate(body) {
  const title = typeof body.title === 'string' ? body.title.trim() : ''
  const excerpt = typeof body.excerpt === 'string' ? body.excerpt.trim() : ''
  const content = typeof body.content === 'string' ? body.content.trim() : ''
  const author = (typeof body.author === 'string' ? body.author.trim() : '') || 'JotilLabs Team'
  const category = typeof body.category === 'string' ? body.category.trim() : ''
  const date =
    typeof body.date === 'string' && DATE_RE.test(body.date.trim())
      ? body.date.trim()
      : new Date().toISOString().slice(0, 10)

  if (title.length < 3 || title.length > 120) return { error: 'Title must be 3 to 120 characters.' }
  if (excerpt.length < 10 || excerpt.length > 300) return { error: 'Summary must be 10 to 300 characters.' }
  if (content.length < 50 || content.length > 50000) return { error: 'Post content must be 50 to 50000 characters.' }
  if (author.length < 2 || author.length > 60) return { error: 'Author must be 2 to 60 characters.' }
  if (!BLOG_CATEGORIES.includes(category)) return { error: 'Please pick a category.' }
  return { fields: { title, excerpt, content, author, category, date } }
}

function refresh(slug) {
  revalidatePath('/blog')
  revalidatePath(`/blog/${slug}`)
  // Purge the whole dynamic segment too: the concrete-path purge alone can
  // leave the cached Redis fetch behind on ISR-rendered slugs.
  revalidatePath('/blog/[slug]', 'page')
  revalidatePath('/sitemap.xml')
  revalidatePath('/admin/blog')
}

function guard(request) {
  if (!verifyAdminRequest(request)) {
    return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
  }
  const redis = getRedis()
  if (!redis) {
    return NextResponse.json({ ok: false, error: 'Post storage is not configured.' }, { status: 503 })
  }
  return redis
}

export async function POST(request) {
  try {
    const redis = guard(request)
    if (redis instanceof NextResponse) return redis

    const body = await request.json().catch(() => ({}))
    const { error, fields } = validate(body)
    if (error) return NextResponse.json({ ok: false, error }, { status: 400 })

    // Unique slug against both MDX files and existing admin posts.
    let base = slugify(fields.title)
    if (!base) return NextResponse.json({ ok: false, error: 'Title must contain letters or numbers.' }, { status: 400 })
    let slug = base
    let n = 2
    while (getPostBySlug(slug) || (await redis.hexists(POSTS_HASH_KEY, slug))) {
      slug = `${base}-${n}`
      n += 1
    }

    const now = new Date().toISOString()
    const post = {
      slug,
      ...fields,
      readingTime: readingTime(fields.content).text,
      createdAt: now,
      updatedAt: now,
    }
    await redis.hset(POSTS_HASH_KEY, { [slug]: JSON.stringify(post) })
    refresh(slug)
    return NextResponse.json({ ok: true, slug })
  } catch (err) {
    console.error('[admin/posts] POST error:', err)
    return NextResponse.json({ ok: false, error: 'Could not publish the post.' }, { status: 500 })
  }
}

export async function PUT(request) {
  try {
    const redis = guard(request)
    if (redis instanceof NextResponse) return redis

    const body = await request.json().catch(() => ({}))
    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
    if (getPostBySlug(slug)) {
      return NextResponse.json({ ok: false, error: 'This post is file-managed and cannot be edited here.' }, { status: 403 })
    }
    const existing = await redis.hget(POSTS_HASH_KEY, slug)
    if (!existing) return NextResponse.json({ ok: false, error: 'Post not found.' }, { status: 404 })
    const prev = typeof existing === 'object' ? existing : JSON.parse(existing)

    const { error, fields } = validate(body)
    if (error) return NextResponse.json({ ok: false, error }, { status: 400 })

    const post = {
      ...prev,
      ...fields,
      slug,
      readingTime: readingTime(fields.content).text,
      updatedAt: new Date().toISOString(),
    }
    await redis.hset(POSTS_HASH_KEY, { [slug]: JSON.stringify(post) })
    refresh(slug)
    return NextResponse.json({ ok: true, slug })
  } catch (err) {
    console.error('[admin/posts] PUT error:', err)
    return NextResponse.json({ ok: false, error: 'Could not update the post.' }, { status: 500 })
  }
}

export async function DELETE(request) {
  try {
    const redis = guard(request)
    if (redis instanceof NextResponse) return redis

    const body = await request.json().catch(() => ({}))
    const slug = typeof body.slug === 'string' ? body.slug.trim() : ''
    if (getPostBySlug(slug)) {
      return NextResponse.json({ ok: false, error: 'This post is file-managed and cannot be deleted here.' }, { status: 403 })
    }
    const removed = await redis.hdel(POSTS_HASH_KEY, slug)
    if (!removed) return NextResponse.json({ ok: false, error: 'Post not found.' }, { status: 404 })
    refresh(slug)
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[admin/posts] DELETE error:', err)
    return NextResponse.json({ ok: false, error: 'Could not delete the post.' }, { status: 500 })
  }
}
