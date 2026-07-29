# Site B: Sanity Blog Integration Handoff

Give this document to the session/developer working on the second site. It
contains everything needed to render the shared JotilLabs blog there. No
secrets are required: the dataset has public read access.

## Connection details (public, safe to commit as NEXT_PUBLIC_*)

- Sanity project ID: `flxwn209`
- Dataset: `production`
- API version: `2026-07-01`
- This site's ID in the content model: `site-b`
- The JotilLabs site (canonical partner): `https://www.jotillabs.com`

Do NOT use or request a write token or the JotilLabs revalidation secret.
Site B only reads. It should generate its own `SANITY_REVALIDATE_SECRET`.

## How content sharing works

All blog posts live in one Sanity project. The Studio (hosted on
jotillabs.com/studio) is the only writing surface. Each post has:

- `sites` (array of `'jotillabs'` / `'site-b'`): which sites show the post.
  Site B must filter with `$site in sites`, `$site = 'site-b'`.
- `canonicalSite` (`'jotillabs'` default, or `'site-b'`): which site search
  engines should credit when a post shows on both.

## Post document shape (GROQ projection used by the JotilLabs site)

```groq
*[_type == "post" && $site in sites && defined(slug.current)] | order(date desc){
  "slug": slug.current,
  title,
  excerpt,          // short summary for cards/meta description
  "date": date,     // YYYY-MM-DD
  author,
  category,         // one of: Voice AI, SMS & Messaging, Business Strategy,
                    //         AI Tools, Use Cases, Getting Started
  canonicalSite,
  sites,
  "image": mainImage,             // optional Sanity image (cover)
  "content": body[]{
    ...,
    _type == "video" => { ..., "fileUrl": file.asset->url }
  },
  "plaintext": pt::text(body),    // for reading-time calc
  "createdAt": _createdAt,
  "updatedAt": _updatedAt
}
```

Reading time (matches JotilLabs): `Math.max(1, Math.ceil(words / 200)) + ' min read'`
where `words` is the whitespace-split count of `plaintext`.

## Packages

```
npm i next-sanity @portabletext/react @sanity/image-url
```

(If Next.js 15: use `next-sanity@11`. Next.js 16: latest. No `sanity`
package needed — Site B hosts no Studio.)

Client setup:

```js
import { createClient } from 'next-sanity'
export const client = createClient({
  projectId: 'flxwn209',
  dataset: 'production',
  apiVersion: '2026-07-01',
  useCdn: true,
})
// fetch with: client.fetch(query, { site: 'site-b' }, { next: { revalidate: 300, tags: ['blog-posts'] } })
```

## Portable Text body: custom block types to render

Render `content` with `@portabletext/react`, styled to Site B's design.
Beyond standard blocks (normal/h2/h3/blockquote, bullet/number lists,
strong/em/code marks, `link` annotation with `value.href`), handle:

- `image` — Sanity image with optional `alt`. Build URLs with
  `@sanity/image-url` (`urlFor(value).width(1600).fit('max').auto('format').url()`).
- `video` — `{ url?, fileUrl?, title? }`. Play `fileUrl || url` in an HTML5
  `<video controls>` element.
- `youtube` — `{ id, title? }`. 16:9 iframe:
  `https://www.youtube-nocookie.com/embed/{id}`.
- `code` — `{ code, language? }`. Render in a `<pre><code>` block.

Reference implementation (JotilLabs styling, adapt freely):
`components/blog/PortableTextComponents.jsx` in the jotil_labs_website repo.

## SEO: canonical rule (important)

- If `post.canonicalSite === 'site-b'`: Site B self-canonicalizes
  (`<link rel="canonical" href="https://SITE-B-DOMAIN/blog/{slug}">`).
- Otherwise (default `'jotillabs'`): Site B's canonical must point at
  `https://www.jotillabs.com/blog/{slug}`, and the post should be EXCLUDED
  from Site B's sitemap.

## Instant publish (webhook)

1. Add an `app/api/revalidate/route.js` that verifies the Sanity webhook
   signature (`parseBody` from `next-sanity/webhook`) against Site B's own
   `SANITY_REVALIDATE_SECRET`, then calls `revalidateTag('blog-posts')` and
   `revalidatePath` for the blog routes.
2. Create a second webhook in the Sanity project (sanity.io/manage, project
   `flxwn209` → API → Webhooks): POST to
   `https://SITE-B-DOMAIN/api/revalidate`, filter `_type == "post"`,
   projection `{ "slug": slug.current }`, on create/update/delete, secret =
   Site B's secret. (The JotilLabs owner can create this; it requires
   project admin access.)

## Not applicable on Site B

- Comments: the comment system is JotilLabs-only (its own Redis). Site B
  should omit any comment UI.
- Studio: writers use jotillabs.com/studio. Site B needs no `sanity`
  dependency, no `/studio` route, and no write access of any kind.
