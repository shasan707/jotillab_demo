import Link from 'next/link'
import { getAllPosts } from '@/lib/mdx'
import { Calendar, Clock, ArrowRight, BookOpen } from 'lucide-react'

export const metadata = {
  title: 'Blog',
  description:
    'Expert insights on AI voice agents, SMS automation, and business process automation. Learn how JotilLabs helps modern businesses grow with AI.',
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

function FeaturedPost({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/[0.08]">
        {/* Image placeholder */}
        <div className="relative h-64 w-full overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 sm:h-80">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/60 backdrop-blur-sm">
              <BookOpen className="h-9 w-9 text-primary" strokeWidth={1.5} />
            </div>
          </div>
          {/* Top-right label */}
          <div className="absolute left-5 top-5">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-600 tracking-wide text-white">
              Featured
            </span>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          {/* Category + reading time */}
          <div className="mb-4 flex items-center gap-3">
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
          <h2 className="mb-3 font-[var(--font-sans)] text-2xl font-800 leading-tight tracking-[-0.02em] text-text transition-colors group-hover:text-primary sm:text-3xl">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="mb-6 text-base leading-relaxed text-[var(--color-text-secondary)]">
            {post.excerpt}
          </p>

          {/* Author + date + CTA */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-sm font-700 text-white">
                {post.author?.charAt(0) ?? 'J'}
              </div>
              <div>
                <p className="text-sm font-600 text-text">{post.author}</p>
                <p className="flex items-center gap-1 text-xs text-[var(--color-text-secondary)]">
                  <Calendar className="h-3 w-3" strokeWidth={1.5} />
                  {formatDate(post.date)}
                </p>
              </div>
            </div>
            <span className="flex items-center gap-1.5 text-sm font-600 text-primary transition-all group-hover:gap-2.5">
              Read article
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </span>
          </div>
        </div>
      </article>
    </Link>
  )
}

function PostCard({ post }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/[0.07]">
        {/* Image placeholder */}
        <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-primary/8 via-secondary/8 to-accent/8">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/60 backdrop-blur-sm">
              <BookOpen className="h-5 w-5 text-primary" strokeWidth={1.5} />
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col p-6">
          {/* Category + reading time */}
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

          {/* Title */}
          <h3 className="mb-2 font-[var(--font-sans)] text-[17px] font-700 leading-snug tracking-[-0.02em] text-text transition-colors group-hover:text-primary">
            {post.title}
          </h3>

          {/* Excerpt -- 2 lines */}
          <p className="mb-4 line-clamp-2 flex-1 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            {post.excerpt}
          </p>

          {/* Author + date */}
          <div className="flex items-center gap-2 border-t border-black/[0.05] pt-4">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-[11px] font-700 text-white">
              {post.author?.charAt(0) ?? 'J'}
            </div>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2">
              <p className="truncate text-xs font-600 text-text">{post.author}</p>
              <p className="flex shrink-0 items-center gap-1 text-[11px] text-[var(--color-text-secondary)]">
                <Calendar className="h-3 w-3" strokeWidth={1.5} />
                {formatDate(post.date)}
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

export default function BlogPage() {
  const posts = getAllPosts()
  const [featured, ...rest] = posts

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-black/[0.05] bg-white px-6 pb-16 pt-32 sm:px-8 sm:pt-36">
        {/* Subtle orb */}
        <div className="pointer-events-none absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-primary/[0.06] to-secondary/[0.06] blur-[80px]" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-gradient-to-br from-accent/[0.06] to-primary/[0.06] blur-[60px]" aria-hidden="true" />

        <div className="relative mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5">
              <BookOpen className="h-3.5 w-3.5 text-primary" strokeWidth={1.5} />
              <span className="text-xs font-600 text-primary">JotilLabs Blog</span>
            </div>
            <h1 className="mb-4 font-[var(--font-sans)] text-4xl font-800 leading-tight tracking-[-0.03em] text-text sm:text-5xl">
              Insights &amp;{' '}
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Resources
              </span>
            </h1>
            <p className="text-lg leading-relaxed text-[var(--color-text-secondary)]">
              Expert perspectives on AI voice agents, SMS automation, and how modern businesses
              leverage AI to grow faster.
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20">
        {posts.length === 0 ? (
          <div className="py-24 text-center text-[var(--color-text-secondary)]">
            No posts published yet. Check back soon.
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <div className="mb-16">
                <p className="mb-6 text-xs font-700 uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                  Featured Article
                </p>
                <FeaturedPost post={featured} />
              </div>
            )}

            {/* Posts grid */}
            {rest.length > 0 && (
              <>
                <p className="mb-8 text-xs font-700 uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
                  More Articles
                </p>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {rest.map(post => (
                    <PostCard key={post.slug} post={post} />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </section>
    </div>
  )
}
