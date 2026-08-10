import { getSanityClient } from './sanity/client'

/* Blog post access, backed by Sanity (single content source shared with the
   second site). The exported names predate the migration: every consumer
   (blog pages, sitemap, comments API) reads through these two functions, so
   they keep their signatures and resolved post shape:
   { slug, title, excerpt, date, author, category, readingTime, content,
     image?, canonicalSite, sites, source, createdAt, updatedAt }
   `content` is a Portable Text array rendered by PortableTextComponents. */

export const SITE_ID = 'jotillabs'
export const SITE_URL = 'https://www.jotillabs.com'
/* Second site's public origin, used for canonical tags on posts whose
   canonicalSite is 'site-b'. Optional until that site launches. */
export const SITE_B_URL = process.env.NEXT_PUBLIC_SITE_B_URL || ''

const POST_FIELDS = `
  "slug": slug.current,
  title,
  excerpt,
  "date": date,
  author,
  category,
  canonicalSite,
  sites,
  "image": mainImage,
  "content": body[]{
    ...,
    _type == "video" => { ..., "fileUrl": file.asset->url }
  },
  "plaintext": pt::text(body),
  "createdAt": _createdAt,
  "updatedAt": _updatedAt
`

const FETCH_OPTS = { next: { revalidate: 300, tags: ['blog-posts'] } }

/* Matches the old reading-time package behavior: 200 wpm, rounded up. */
function readingTimeFrom(plaintext) {
  const words = String(plaintext || '').trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 200))} min read`
}

function resolvePost(raw) {
  if (!raw) return null
  const { plaintext, ...post } = raw
  return { ...post, readingTime: readingTimeFrom(plaintext), source: 'sanity' }
}

export async function getAllPostsCombined() {
  const client = getSanityClient()
  if (!client) return []
  try {
    const posts = await client.fetch(
      `*[_type == "post" && $site in sites && defined(slug.current)] | order(date desc){ ${POST_FIELDS} }`,
      { site: SITE_ID },
      FETCH_OPTS
    )
    return (posts || []).map(resolvePost)
  } catch (err) {
    console.error('[blog] Failed to read posts from Sanity:', err)
    return []
  }
}

export async function getPostBySlugCombined(slug) {
  const client = getSanityClient()
  if (!client) return null
  try {
    const post = await client.fetch(
      `*[_type == "post" && slug.current == $slug && $site in sites][0]{ ${POST_FIELDS} }`,
      { slug, site: SITE_ID },
      FETCH_OPTS
    )
    return resolvePost(post)
  } catch (err) {
    console.error('[blog] Failed to read post from Sanity:', err)
    return null
  }
}

export async function getAllPostSlugs() {
  const client = getSanityClient()
  if (!client) return []
  try {
    const slugs = await client.fetch(
      `*[_type == "post" && $site in sites && defined(slug.current)].slug.current`,
      { site: SITE_ID },
      FETCH_OPTS
    )
    return slugs || []
  } catch (err) {
    console.error('[blog] Failed to read slugs from Sanity:', err)
    return []
  }
}
