/* One-time migration: MDX files (content/blog/*.mdx) + admin posts (Upstash
   Redis hash blog:posts) -> Sanity `post` documents with Portable Text bodies.

   Usage:
     node --env-file=.env.local scripts/migrate-to-sanity.mjs --dry-run
     node --env-file=.env.local scripts/migrate-to-sanity.mjs
     node --env-file=.env.local scripts/migrate-to-sanity.mjs --verify

   Requires SANITY_API_WRITE_TOKEN (Editor token) in the env for the real run.
   Idempotent: deterministic _id ('post-' + slug) + a local asset-map cache
   (scripts/.sanity-asset-map.json) so reruns update in place and never
   duplicate uploaded images. Slugs are preserved byte-for-byte (comments are
   keyed by slug). */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { marked } from 'marked'
import { JSDOM } from 'jsdom'
import { htmlToBlocks } from '@portabletext/block-tools'
import { Schema } from '@sanity/schema'
import { createClient } from '@sanity/client'
import { Redis } from '@upstash/redis'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BLOG_DIR = path.join(ROOT, 'content', 'blog')
const PUBLIC_DIR = path.join(ROOT, 'public')
const ASSET_MAP_FILE = path.join(ROOT, 'scripts', '.sanity-asset-map.json')

const DRY_RUN = process.argv.includes('--dry-run')
const VERIFY = process.argv.includes('--verify')

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  process.exit(1)
}
if (!DRY_RUN && !token) {
  console.error('Missing SANITY_API_WRITE_TOKEN (not needed for --dry-run)')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2026-07-01',
  token,
  useCdn: false,
})

/* ---------- sources ---------- */

function readMdxPosts() {
  if (!fs.existsSync(BLOG_DIR)) return []
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.mdx'))
    .map((file) => {
      const raw = fs.readFileSync(path.join(BLOG_DIR, file), 'utf8')
      const { data, content } = matter(raw)
      return {
        slug: file.replace(/\.mdx$/, ''),
        title: data.title,
        excerpt: data.excerpt,
        date: String(data.date).slice(0, 10),
        author: data.author || 'JotilLabs Team',
        category: data.category,
        content,
        origin: 'mdx',
      }
    })
}

async function readRedisPosts() {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN
  if (!url || !redisToken) {
    console.warn('No Upstash Redis env vars; skipping admin posts.')
    return []
  }
  const redis = new Redis({ url, token: redisToken })
  const all = (await redis.hgetall('blog:posts')) || {}
  return Object.values(all)
    .map((v) => (typeof v === 'object' ? v : safeJson(v)))
    .filter(Boolean)
    .map((p) => ({ ...p, date: String(p.date).slice(0, 10), origin: 'admin' }))
}

function safeJson(v) {
  try {
    return JSON.parse(v)
  } catch {
    return null
  }
}

/* ---------- markdown -> portable text ---------- */

/* Minimal standalone copy of the post body type, compiled so htmlToBlocks
   knows the allowed styles/marks/custom blocks. Keep in sync with
   sanity/schemaTypes/post.js (duplicated here because that file is ESM
   inside a CJS-default package and this script must run standalone). */
const compiledSchema = Schema.compile({
  name: 'migration',
  types: [
    {
      name: 'post',
      type: 'document',
      fields: [
        {
          name: 'body',
          type: 'array',
          of: [
            {
              type: 'block',
              styles: [
                { title: 'Normal', value: 'normal' },
                { title: 'H2', value: 'h2' },
                { title: 'H3', value: 'h3' },
                { title: 'Quote', value: 'blockquote' },
              ],
              lists: [
                { title: 'Bullet', value: 'bullet' },
                { title: 'Number', value: 'number' },
              ],
              marks: {
                decorators: [
                  { title: 'Strong', value: 'strong' },
                  { title: 'Em', value: 'em' },
                  { title: 'Code', value: 'code' },
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    fields: [{ name: 'href', type: 'url' }],
                  },
                ],
              },
            },
            /* Declared as a plain object (not sanity's image type) because this
               standalone compile has no built-in types; the deserialize rule
               builds the real image block with its asset reference. */
            { name: 'image', type: 'object', fields: [{ name: 'alt', type: 'string' }] },
            {
              name: 'video',
              type: 'object',
              fields: [
                { name: 'url', type: 'url' },
                { name: 'title', type: 'string' },
              ],
            },
            {
              name: 'youtube',
              type: 'object',
              fields: [
                { name: 'id', type: 'string' },
                { name: 'title', type: 'string' },
              ],
            },
            { name: 'code', type: 'object', fields: [{ name: 'code', type: 'text' }] },
          ],
        },
      ],
    },
  ],
})
const bodyType = compiledSchema
  .get('post')
  .fields.find((f) => f.name === 'body').type

const assetMap = fs.existsSync(ASSET_MAP_FILE)
  ? JSON.parse(fs.readFileSync(ASSET_MAP_FILE, 'utf8'))
  : {}

function saveAssetMap() {
  fs.writeFileSync(ASSET_MAP_FILE, JSON.stringify(assetMap, null, 2))
}

async function uploadImage(src) {
  if (assetMap[src]) return assetMap[src]
  if (DRY_RUN) return 'image-dry-run-placeholder'
  /* Dead source images (deleted from Blob, missing local file) are dropped
     with a warning; they render broken on the live site today anyway. */
  try {
    let buffer
    if (/^https?:\/\//.test(src)) {
      const res = await fetch(src)
      if (!res.ok) throw new Error(`download failed: ${res.status}`)
      buffer = Buffer.from(await res.arrayBuffer())
    } else {
      const localPath = path.join(PUBLIC_DIR, src.replace(/^\//, ''))
      if (!fs.existsSync(localPath)) throw new Error('local file not found')
      buffer = fs.readFileSync(localPath)
    }
    const filename = decodeURIComponent(src.split('/').pop().split('?')[0]) || 'image'
    const asset = await client.assets.upload('image', buffer, { filename })
    assetMap[src] = asset._id
    saveAssetMap()
    return asset._id
  } catch (err) {
    console.warn(`[warn] Skipping image ${src}: ${err.message}`)
    return null
  }
}

function attr(str, name) {
  const m = str.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`))
  return m ? m[1] : undefined
}

/* Replace JSX media tags with figure markers marked can pass through as HTML. */
function preprocess(markdown) {
  return markdown
    .replace(/<Video\b([^>]*?)\/?>(\s*<\/Video>)?/g, (_, attrs) => {
      const src = attr(attrs, 'src') || ''
      const title = attr(attrs, 'title') || ''
      return `\n\n<figure data-kind="video" data-src="${src}" data-title="${title}"></figure>\n\n`
    })
    .replace(/<YouTube\b([^>]*?)\/?>(\s*<\/YouTube>)?/g, (_, attrs) => {
      const id = attr(attrs, 'id') || ''
      const title = attr(attrs, 'title') || ''
      return `\n\n<figure data-kind="youtube" data-id="${id}" data-title="${title}"></figure>\n\n`
    })
}

let keyCounter = 0
function nextKey() {
  keyCounter += 1
  return `mig${keyCounter.toString(36).padStart(6, '0')}`
}

async function markdownToPortableText(markdown) {
  const html = marked.parse(preprocess(markdown), { async: false })

  // Pre-pass: upload every referenced image so the deserializer rule can
  // synchronously map src -> asset _id.
  const dom = new JSDOM(html)
  const imgs = [...dom.window.document.querySelectorAll('img')]
  for (const img of imgs) {
    const src = img.getAttribute('src')
    if (src) await uploadImage(src)
  }

  const rules = [
    {
      deserialize(el, next, block) {
        const tag = el.tagName?.toLowerCase()
        if (tag === 'img') {
          const src = el.getAttribute('src')
          if (!src || !assetMap[src]) return undefined
          return block({
            _type: 'image',
            asset: { _type: 'reference', _ref: assetMap[src] },
            alt: el.getAttribute('alt') || '',
          })
        }
        if (tag === 'figure' && el.getAttribute?.('data-kind') === 'video') {
          return block({
            _type: 'video',
            url: el.getAttribute('data-src') || undefined,
            title: el.getAttribute('data-title') || undefined,
          })
        }
        if (tag === 'figure' && el.getAttribute?.('data-kind') === 'youtube') {
          return block({
            _type: 'youtube',
            id: el.getAttribute('data-id') || '',
            title: el.getAttribute('data-title') || undefined,
          })
        }
        if (tag === 'pre') {
          const code = el.textContent || ''
          return block({ _type: 'code', code: code.replace(/\n$/, '') })
        }
        return undefined
      },
    },
  ]

  const blocks = htmlToBlocks(html, bodyType, {
    parseHtml: (h) => new JSDOM(h).window.document,
    rules,
  })
  return blocks.map((b) => ({ _key: nextKey(), ...b }))
}

/* ---------- verify ---------- */

async function verify(sourcePosts) {
  const remote = await client.fetch(
    `*[_type == "post"]{ "slug": slug.current, date, "blocks": count(body), "chars": length(pt::text(body)) } | order(slug asc)`
  )
  const remoteSlugs = new Set(remote.map((r) => r.slug))
  const sourceSlugs = new Set(sourcePosts.map((p) => p.slug))
  const missing = [...sourceSlugs].filter((s) => !remoteSlugs.has(s))
  const extra = [...remoteSlugs].filter((s) => !sourceSlugs.has(s))
  const empty = remote.filter((r) => !r.chars)

  console.log('\nslug'.padEnd(61) + 'date'.padEnd(12) + 'blocks'.padEnd(8) + 'chars')
  for (const r of remote) {
    console.log(String(r.slug).padEnd(60) + String(r.date).padEnd(12) + String(r.blocks).padEnd(8) + r.chars)
  }
  console.log(`\n${remote.length} posts in Sanity, ${sourcePosts.length} in local sources.`)
  if (missing.length) console.error('MISSING from Sanity:', missing)
  if (extra.length) console.warn('Extra in Sanity (not in local sources):', extra)
  if (empty.length) console.error('EMPTY bodies:', empty.map((r) => r.slug))
  if (!missing.length && !empty.length) console.log('Verification passed.')
  process.exit(missing.length || empty.length ? 1 : 0)
}

/* ---------- main ---------- */

async function main() {
  const mdx = readMdxPosts()
  const admin = await readRedisPosts()
  const posts = [...mdx, ...admin]

  const seen = new Set()
  for (const p of posts) {
    if (seen.has(p.slug)) {
      console.error(`Duplicate slug across sources: ${p.slug}`)
      process.exit(1)
    }
    seen.add(p.slug)
  }

  if (VERIFY) return verify(posts)

  console.log(`Migrating ${posts.length} posts (${mdx.length} MDX, ${admin.length} admin)${DRY_RUN ? ' [dry run]' : ''}\n`)

  for (const p of posts) {
    if (!/^[a-z0-9-]+$/.test(p.slug)) {
      console.error(`Skipping invalid slug: ${p.slug}`)
      continue
    }
    const body = await markdownToPortableText(p.content || '')
    const doc = {
      _id: `post-${p.slug}`,
      _type: 'post',
      title: p.title,
      slug: { current: p.slug },
      excerpt: p.excerpt,
      author: p.author || 'JotilLabs Team',
      category: p.category,
      date: p.date,
      sites: ['jotillabs', 'site-b'],
      canonicalSite: 'jotillabs',
      body,
    }
    if (DRY_RUN) {
      const media = body.filter((b) => ['image', 'video', 'youtube'].includes(b._type)).length
      console.log(`[dry] ${p.slug} (${p.origin}): ${body.length} blocks, ${media} media`)
    } else {
      await client.createOrReplace(doc)
      console.log(`[ok]  ${p.slug} (${p.origin}): ${body.length} blocks`)
    }
  }
  console.log('\nDone. Run with --verify to check parity.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
