import { Redis } from '@upstash/redis'
import { getAllPosts, getPostBySlug } from './mdx'

/* Combined blog post access: MDX files (content/blog/*.mdx, code-managed)
   plus admin-created posts stored in the Upstash Redis hash `blog:posts`
   (field = slug, value = JSON with the exact same shape MDX posts resolve
   to, incl. a precomputed readingTime string). One HGETALL serves the
   index; fine to hundreds of posts — if the blog ever outgrows that,
   migrate to per-post keys plus a slug set. */

export const POSTS_HASH_KEY = 'blog:posts'

/* Page-safe Redis client: uses cacheable fetches ('force-cache') so ISR
   pages and the sitemap can prerender (the comments client's default
   no-store fetch would force them dynamic). Freshness comes from the
   revalidatePath calls the admin CRUD route makes on every mutation. */
let pageRedis
function getPageRedis() {
  if (pageRedis) return pageRedis
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !token) return null
  pageRedis = new Redis({ url, token, cache: 'force-cache' })
  return pageRedis
}

function parseMaybeJson(value) {
  if (!value) return null
  if (typeof value === 'object') return value
  try {
    return JSON.parse(value)
  } catch {
    return null
  }
}

export async function getAllPostsCombined() {
  const mdx = getAllPosts().map((p) => ({ ...p, source: 'mdx' }))
  let admin = []
  const redis = getPageRedis()
  if (redis) {
    try {
      const all = await redis.hgetall(POSTS_HASH_KEY)
      admin = Object.values(all || {})
        .map(parseMaybeJson)
        .filter(Boolean)
        .map((p) => ({ ...p, source: 'admin' }))
    } catch (err) {
      console.error('[blog] Failed to read admin posts:', err)
    }
  }
  return [...mdx, ...admin].sort((a, b) => new Date(b.date) - new Date(a.date))
}

export async function getPostBySlugCombined(slug) {
  const mdxPost = getPostBySlug(slug)
  if (mdxPost) return { ...mdxPost, source: 'mdx' }
  const redis = getPageRedis()
  if (!redis) return null
  try {
    const post = parseMaybeJson(await redis.hget(POSTS_HASH_KEY, slug))
    return post ? { ...post, source: 'admin' } : null
  } catch (err) {
    console.error('[blog] Failed to read admin post:', err)
    return null
  }
}

/* Turns a title into a URL slug matching the comments API's slug rule. */
export function slugify(title) {
  return String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}
