'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageSquare, CheckCircle2, AlertCircle } from 'lucide-react'

/* Reader comments under a blog post. Approved comments are fetched at
   runtime (the page itself stays static); new submissions go to
   /api/blog/comments where they wait for email approval before showing.
   If the comments backend is not configured the whole section renders
   nothing, so the page never shows a broken box. */

const inputClass =
  'w-full rounded-[11px] px-4 py-3 text-sm bg-white border outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10'
const inputStyle = { border: '1px solid rgba(0,0,0,0.1)' }
const labelClass =
  'block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)] mb-1.5'

function relativeDate(iso) {
  const then = new Date(iso).getTime()
  if (Number.isNaN(then)) return ''
  const mins = Math.max(1, Math.round((Date.now() - then) / 60000))
  if (mins < 60) return mins === 1 ? '1 minute ago' : `${mins} minutes ago`
  const hours = Math.round(mins / 60)
  if (hours < 24) return hours === 1 ? '1 hour ago' : `${hours} hours ago`
  const days = Math.round(hours / 24)
  if (days < 30) return days === 1 ? '1 day ago' : `${days} days ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function CommentSection({ slug }) {
  const [view, setView] = useState('loading') // loading | ready | unavailable
  const [comments, setComments] = useState([])
  const [form, setForm] = useState({ name: '', email: '', message: '', website: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch(`/api/blog/comments?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error('unavailable'))))
      .then((data) => {
        if (cancelled) return
        if (!data.ok) throw new Error('unavailable')
        setComments(Array.isArray(data.comments) ? data.comments : [])
        setView('ready')
      })
      .catch(() => {
        if (!cancelled) setView('unavailable')
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/blog/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, ...form }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not submit your comment.')
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Could not submit your comment. Please try again.')
    }
  }

  if (view === 'unavailable') return null

  return (
    <section aria-label="Comments">
      <div className="my-12 h-px w-full bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <p className="mb-4 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
        Comments
      </p>

      <div className="rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8">
        {view === 'loading' ? (
          <div className="min-h-[160px] space-y-4" aria-hidden="true">
            <div className="h-4 w-1/3 animate-pulse rounded-full bg-black/[0.06]" />
            <div className="h-4 w-2/3 animate-pulse rounded-full bg-black/[0.05]" />
            <div className="h-24 animate-pulse rounded-xl bg-black/[0.04]" />
          </div>
        ) : (
          <>
            {/* Approved comments */}
            {comments.length === 0 ? (
              <div className="mb-8 flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                <MessageSquare size={18} strokeWidth={1.5} className="shrink-0 text-primary/60" />
                No comments yet. Be the first to share your thoughts.
              </div>
            ) : (
              <ul className="mb-8 m-0 list-none space-y-5 p-0">
                {comments.map((c) => (
                  <li key={c.id} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                      {(c.name || '?').charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="m-0 text-sm font-semibold text-text">
                        {c.name}
                        <span className="ml-2 text-xs font-normal text-[var(--color-text-secondary)]">
                          {relativeDate(c.createdAt)}
                        </span>
                      </p>
                      <p className="m-0 mt-1 whitespace-pre-wrap text-[15px] leading-relaxed text-[#374151]">
                        {c.message}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Submission form / success panel */}
            <AnimatePresence mode="wait" initial={false}>
              {status === 'success' ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="rounded-xl px-6 py-8 text-center"
                  style={{ background: 'rgba(18,160,107,0.05)', border: '1px solid rgba(18,160,107,0.2)' }}
                >
                  <span
                    className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ background: 'rgba(18,160,107,0.1)' }}
                  >
                    <CheckCircle2 size={26} strokeWidth={1.5} style={{ color: '#12a06b' }} />
                  </span>
                  <p className="m-0 text-base font-semibold text-text">Thanks for sharing your thoughts</p>
                  <p className="mx-auto mt-1.5 max-w-sm text-sm text-[var(--color-text-secondary)]">
                    Your comment is awaiting review and will appear here once approved.
                  </p>
                  <button
                    onClick={() => {
                      setForm({ name: '', email: '', message: '', website: '' })
                      setStatus('idle')
                    }}
                    className="mt-4 cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
                  >
                    Write another comment
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={false}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit}
                >
                  <p className="m-0 mb-4 text-base font-bold text-text">Share your thoughts</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label htmlFor="comment-name" className={labelClass}>Name</label>
                      <input
                        id="comment-name"
                        type="text"
                        required
                        minLength={2}
                        maxLength={60}
                        value={form.name}
                        onChange={set('name')}
                        placeholder="Your name"
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label htmlFor="comment-email" className={labelClass}>Email</label>
                      <input
                        id="comment-email"
                        type="email"
                        value={form.email}
                        onChange={set('email')}
                        placeholder="you@company.com"
                        className={inputClass}
                        style={inputStyle}
                      />
                      <p className="m-0 mt-1 text-[11px] text-[var(--color-text-secondary)]">
                        Optional. Only used if we reply to you. Never shown publicly.
                      </p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label htmlFor="comment-message" className={labelClass}>Comment</label>
                    <textarea
                      id="comment-message"
                      required
                      minLength={10}
                      maxLength={2000}
                      rows={4}
                      value={form.message}
                      onChange={set('message')}
                      placeholder="What did you think of this article?"
                      className={`${inputClass} resize-y`}
                      style={inputStyle}
                    />
                  </div>

                  {/* Honeypot: humans never see or fill this */}
                  <input
                    type="text"
                    name="website"
                    value={form.website}
                    onChange={set('website')}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-px w-px opacity-0"
                  />

                  {status === 'error' && (
                    <div
                      className="mt-4 flex items-center gap-2 rounded-[11px] px-4 py-3 text-sm"
                      style={{ background: 'rgba(239,68,68,0.06)', color: '#DC2626' }}
                    >
                      <AlertCircle size={16} strokeWidth={1.5} className="shrink-0" />
                      {errorMessage}
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <p className="m-0 text-[11px] text-[var(--color-text-secondary)]">
                      Comments appear after a quick review.
                    </p>
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-gradient inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-[11px] border-none px-6 py-3 text-sm font-semibold text-white transition-all disabled:opacity-60"
                    >
                      {status === 'loading' && (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      )}
                      {status === 'loading' ? 'Posting...' : 'Post comment'}
                    </button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </section>
  )
}
