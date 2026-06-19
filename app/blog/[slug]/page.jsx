import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getAllPosts, getPostBySlug } from '@/lib/mdx'
import { Calendar, Clock, ArrowLeft, ArrowRight, Twitter, Linkedin, BookOpen } from 'lucide-react'
import { CopyLinkButton } from '@/components/blog/CopyLinkButton'

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.slug }))
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return { title: 'Not Found' }
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}

const CATEGORY_COLORS = {
  'Voice AI': 'bg-blue-50 text-blue-700 border-blue-100',
  'SMS & Messaging': 'bg-violet-50 text-violet-700 border-violet-100',
  'Business Strategy': 'bg-emerald-50 text-emerald-700 border-emerald-100',
  'AI Tools': 'bg-amber-50 text-amber-700 border-amber-100',
}

function categoryClass(category) {
  return CATEGORY_COLORS[category] ?? 'bg-slate-50 text-slate-700 border-slate-100'
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// MDX component overrides -- maps to Tailwind prose-compatible styling
const mdxComponents = {
  h2: ({ children }) => (
    <h2 className="mb-4 mt-10 font-[var(--font-sans)] text-2xl font-700 tracking-[-0.02em] text-text first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-8 font-[var(--font-sans)] text-xl font-700 tracking-[-0.015em] text-text">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="mb-5 text-[17px] leading-[1.75] text-[#374151]">{children}</p>
  ),
  ul: ({ children }) => (
    <ul className="mb-5 space-y-2 pl-6">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-5 list-decimal space-y-2 pl-6">{children}</ol>
  ),
  li: ({ children }) => (
    <li className="text-[17px] leading-[1.75] text-[#374151] marker:text-primary [&::marker]:font-600">
      {children}
    </li>
  ),
  strong: ({ children }) => (
    <strong className="font-700 text-text">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-4 border-primary/30 bg-primary/[0.03] py-3 pl-5 pr-4 text-[17px] italic text-[#374151]">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-[var(--font-mono)] text-[13px] text-slate-800">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="mb-5 overflow-x-auto rounded-xl bg-slate-900 p-5 text-sm text-slate-100">
      {children}
    </pre>
  ),
  hr: () => (
    <hr className="my-10 border-0 border-t border-black/[0.07]" />
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      className="font-500 text-primary underline underline-offset-2 transition-colors hover:text-primary-dark"
      target={href?.startsWith('http') ? '_blank' : undefined}
      rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  ),
}

function RelatedPostCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.07]">
        <div className="mb-3 flex items-center gap-2.5">
          <span
            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-600 ${categoryClass(post.category)}`}
          >
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-[11px] text-[var(--color-text-secondary)]">
            <Clock className="h-3 w-3" strokeWidth={1.5} />
            {post.readingTime}
          </span>
        </div>
        <h4 className="mb-2 font-[var(--font-sans)] text-[16px] font-700 leading-snug tracking-[-0.015em] text-text transition-colors group-hover:text-primary">
          {post.title}
        </h4>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
          {post.excerpt}
        </p>
        <div className="mt-4 flex items-center gap-1.5 text-sm font-600 text-primary">
          Read article
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" strokeWidth={2} />
        </div>
      </article>
    </Link>
  )
}

export default async function BlogPost({ params }) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  // Related posts: other posts (excluding current), up to 2
  const allPosts = getAllPosts()
  const related = allPosts.filter(p => p.slug !== slug).slice(0, 2)

  const postUrl = `https://jotillabs.com/blog/${slug}`
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: 'JotilLabs' },
    description: post.excerpt,
    url: postUrl,
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Article header */}
      <header className="relative overflow-hidden border-b border-black/[0.05] bg-white px-6 pb-12 pt-32 sm:px-8 sm:pt-36">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[400px] w-[400px] rounded-full bg-gradient-to-br from-primary/[0.06] to-secondary/[0.05] blur-[80px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-10 left-1/3 h-[200px] w-[400px] rounded-full bg-gradient-to-r from-accent/[0.04] to-primary/[0.04] blur-[60px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-3xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-sm font-500 text-[var(--color-text-secondary)] transition-colors hover:text-text"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            All posts
          </Link>

          {/* Category + reading time */}
          <div className="mb-5 flex items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full border px-3 py-0.5 text-xs font-600 ${categoryClass(post.category)}`}
            >
              {post.category}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
              <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
              {post.readingTime}
            </span>
          </div>

          {/* Title */}
          <h1 className="mb-6 font-[var(--font-sans)] text-3xl font-800 leading-tight tracking-[-0.03em] text-text sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Author + date */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-700 text-white">
              {post.author?.charAt(0) ?? 'J'}
            </div>
            <div>
              <p className="text-sm font-600 text-text">{post.author}</p>
              <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                <Calendar className="h-3 w-3" strokeWidth={1.5} />
                {formatDate(post.date)}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Article body */}
      <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8">
        {/* Gradient divider */}
        <div className="mb-12 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* MDX content */}
        <article className="min-w-0">
          <MDXRemote source={post.content} components={mdxComponents} />
        </article>

        {/* Gradient divider */}
        <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

        {/* Share section */}
        <div className="rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8">
          <p className="mb-4 text-sm font-600 text-text">Share this article</p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={tweetUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share this article on X (Twitter)"
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-600 text-text transition-all hover:-translate-y-0.5 hover:border-[#1DA1F2]/30 hover:bg-[#1DA1F2]/5 hover:text-[#1DA1F2] hover:shadow-sm"
            >
              <Twitter className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Share on X
            </a>
            <a
              href={linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share this article on LinkedIn"
              className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-600 text-text transition-all hover:-translate-y-0.5 hover:border-[#0A66C2]/30 hover:bg-[#0A66C2]/5 hover:text-[#0A66C2] hover:shadow-sm"
            >
              <Linkedin className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              Share on LinkedIn
            </a>
            {/* Copy link -- client interaction handled via JS in a client wrapper would be ideal,
                but for SSR safety we use a plain anchor that opens the URL */}
            <CopyLinkButton postUrl={postUrl} />
          </div>
        </div>
      </div>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="border-t border-black/[0.05] bg-white px-6 py-16 sm:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="mb-8 text-xs font-700 uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
              More Articles
            </p>
            <div className="grid gap-5 sm:grid-cols-2">
              {related.map(p => (
                <RelatedPostCard key={p.slug} post={p} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-5 py-2.5 text-sm font-600 text-text transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 hover:text-primary hover:shadow-sm"
              >
                <BookOpen className="h-4 w-4" strokeWidth={1.5} />
                View all articles
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
