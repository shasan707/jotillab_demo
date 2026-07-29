'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PenSquare, Plus, Trash2, FileText, ChevronDown, CheckCircle2, AlertCircle, LogOut, ExternalLink, X,
  Image as ImageIcon, Film, MonitorPlay,
} from 'lucide-react'
import { BLOG_CATEGORIES, categoryClass } from '@/data/blogCategories'

/* Blog writing dashboard for admins. Lists every post (MDX file posts are
   read-only with a badge; admin posts get Edit/Delete) and hosts the
   simple markdown editor. All mutations go through /api/admin/posts with
   the signed session cookie. */

const inputClass =
  'w-full rounded-[11px] px-4 py-3 text-sm bg-white border outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10'
const inputStyle = { border: '1px solid rgba(0,0,0,0.1)' }
const labelClass =
  'block text-[11px] font-semibold uppercase tracking-[0.08em] text-[var(--color-text-secondary)] mb-1.5'

const EMPTY = { title: '', category: BLOG_CATEGORIES[0], excerpt: '', author: '', content: '' }

export function AdminDashboard({ posts }) {
  const router = useRouter()
  const [mode, setMode] = useState(null) // null | 'create' | 'edit'
  const [editingSlug, setEditingSlug] = useState('')
  const [form, setForm] = useState(EMPTY)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState('')
  const [publishedSlug, setPublishedSlug] = useState('')
  const [confirmDelete, setConfirmDelete] = useState('')
  const [deleting, setDeleting] = useState('')
  const [uploading, setUploading] = useState('') // '' | 'image' | 'video'
  const [ytOpen, setYtOpen] = useState(false)
  const [ytUrl, setYtUrl] = useState('')
  const contentRef = useRef(null)
  const imageInputRef = useRef(null)
  const videoInputRef = useRef(null)

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))

  /* Insert a snippet at the cursor position in the content box. */
  function insertSnippet(snippet) {
    const el = contentRef.current
    setForm((f) => {
      const content = f.content
      const start = el ? el.selectionStart : content.length
      const end = el ? el.selectionEnd : content.length
      const before = content.slice(0, start)
      const after = content.slice(end)
      const pad = before && !before.endsWith('\n\n') ? (before.endsWith('\n') ? '\n' : '\n\n') : ''
      return { ...f, content: `${before}${pad}${snippet}\n\n${after}` }
    })
    el?.focus()
  }

  function showError(message) {
    setStatus('error')
    setErrorMessage(message)
  }

  async function handleUpload(kind, e) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploading(kind)
    setErrorMessage('')
    if (status === 'error') setStatus('idle')
    try {
      const body = new FormData()
      body.append('file', file)
      const res = await fetch('/api/admin/upload', { method: 'POST', body })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Upload failed.')
      insertSnippet(
        data.kind === 'video' ? `<Video src="${data.url}" />` : `![Describe this image](${data.url})`
      )
    } catch (err) {
      showError(err.message || 'Upload failed. Please try again.')
    } finally {
      setUploading('')
    }
  }

  function handleYouTubeInsert() {
    const match = ytUrl.match(
      /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{6,20})/
    )
    if (!match) {
      showError('That does not look like a YouTube link. Paste the full video address.')
      return
    }
    insertSnippet(`<YouTube id="${match[1]}" />`)
    setYtUrl('')
    setYtOpen(false)
  }

  function openCreate() {
    setMode('create')
    setEditingSlug('')
    setForm(EMPTY)
    setStatus('idle')
    setErrorMessage('')
  }

  function openEdit(post) {
    setMode('edit')
    setEditingSlug(post.slug)
    setForm({
      title: post.title,
      category: BLOG_CATEGORIES.includes(post.category) ? post.category : BLOG_CATEGORIES[0],
      excerpt: post.excerpt,
      author: post.author,
      content: post.content,
    })
    setStatus('idle')
    setErrorMessage('')
  }

  function closeEditor() {
    setMode(null)
    setStatus('idle')
    setErrorMessage('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/admin/posts', {
        method: mode === 'edit' ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(mode === 'edit' ? { slug: editingSlug, ...form } : form),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not save the post.')
      setPublishedSlug(data.slug)
      setStatus('success')
      router.refresh()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Could not save the post.')
    }
  }

  async function handleDelete(slug) {
    if (confirmDelete !== slug) {
      setConfirmDelete(slug)
      return
    }
    setDeleting(slug)
    setConfirmDelete('')
    try {
      const res = await fetch('/api/admin/posts', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not delete the post.')
      if (editingSlug === slug) closeEditor()
      router.refresh()
    } catch (err) {
      setErrorMessage(err.message || 'Could not delete the post.')
    } finally {
      setDeleting('')
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-6 pb-24 pt-28 sm:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="m-0 text-2xl font-bold tracking-[-0.02em] text-text">Blog admin</h1>
            <p className="m-0 mt-1 text-sm text-[var(--color-text-secondary)]">
              Write, edit, and manage the articles on your blog.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <button
              onClick={openCreate}
              className="btn-gradient inline-flex cursor-pointer items-center gap-2 rounded-[11px] border-none px-5 py-2.5 text-sm font-semibold text-white"
            >
              <Plus size={16} strokeWidth={2} />
              New post
            </button>
            <button
              onClick={handleLogout}
              aria-label="Sign out"
              className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-[11px] border border-black/10 bg-white text-text-secondary transition-colors hover:text-text"
            >
              <LogOut size={16} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* Editor */}
        <AnimatePresence>
          {mode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-8 rounded-2xl border border-black/[0.06] bg-white p-6 sm:p-8"
            >
              {status === 'success' ? (
                <div className="py-6 text-center">
                  <span
                    className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full"
                    style={{ background: 'rgba(18,160,107,0.1)' }}
                  >
                    <CheckCircle2 size={26} strokeWidth={1.5} style={{ color: '#12a06b' }} />
                  </span>
                  <p className="m-0 text-base font-semibold text-text">
                    {mode === 'edit' ? 'Post updated' : 'Post published'}
                  </p>
                  <p className="m-0 mt-1 text-sm text-[var(--color-text-secondary)]">
                    It is live on the blog now.
                  </p>
                  <div className="mt-4 flex items-center justify-center gap-4">
                    <Link
                      href={`/blog/${publishedSlug}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary no-underline hover:underline"
                    >
                      View post
                      <ExternalLink size={13} strokeWidth={2} />
                    </Link>
                    <button
                      onClick={closeEditor}
                      className="cursor-pointer border-none bg-transparent p-0 text-sm font-semibold text-text-secondary hover:text-text"
                    >
                      Done
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-5 flex items-center justify-between">
                    <p className="m-0 text-base font-bold text-text">
                      {mode === 'edit' ? 'Edit post' : 'Write a new post'}
                    </p>
                    <button
                      type="button"
                      onClick={closeEditor}
                      aria-label="Close editor"
                      className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border-none bg-black/[0.04] text-text-secondary transition-colors hover:text-text"
                    >
                      <X size={15} strokeWidth={2} />
                    </button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="post-title" className={labelClass}>Title</label>
                      <input
                        id="post-title"
                        type="text"
                        required
                        minLength={3}
                        maxLength={120}
                        value={form.title}
                        onChange={set('title')}
                        placeholder="A clear, helpful headline"
                        className={inputClass}
                        style={inputStyle}
                      />
                      {mode === 'edit' && (
                        <p className="m-0 mt-1 text-[11px] text-[var(--color-text-secondary)]">
                          The web address of the post stays the same when you edit.
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="post-category" className={labelClass}>Category</label>
                      <div className="relative">
                        <select
                          id="post-category"
                          value={form.category}
                          onChange={set('category')}
                          className={`${inputClass} cursor-pointer appearance-none pr-10`}
                          style={inputStyle}
                        >
                          {BLOG_CATEGORIES.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                        <ChevronDown
                          size={16}
                          strokeWidth={1.5}
                          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="post-author" className={labelClass}>Author</label>
                      <input
                        id="post-author"
                        type="text"
                        maxLength={60}
                        value={form.author}
                        onChange={set('author')}
                        placeholder="JotilLabs Team"
                        className={inputClass}
                        style={inputStyle}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="post-excerpt" className={labelClass}>Short summary</label>
                      <textarea
                        id="post-excerpt"
                        required
                        minLength={10}
                        maxLength={300}
                        rows={2}
                        value={form.excerpt}
                        onChange={set('excerpt')}
                        placeholder="One or two sentences shown on the blog page and in search results."
                        className={`${inputClass} resize-y`}
                        style={inputStyle}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <div className="mb-1.5 flex items-end justify-between gap-3">
                        <label htmlFor="post-content" className={`${labelClass} mb-0`}>Post content</label>
                        {/* Media toolbar */}
                        <div className="flex items-center gap-1.5">
                          <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(e) => handleUpload('image', e)} />
                          <input ref={videoInputRef} type="file" accept="video/mp4,video/webm" className="hidden" onChange={(e) => handleUpload('video', e)} />
                          <button
                            type="button"
                            onClick={() => imageInputRef.current?.click()}
                            disabled={!!uploading}
                            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-[9px] border border-black/10 bg-white px-2.5 text-[11.5px] font-semibold text-text-secondary transition-colors hover:text-primary disabled:opacity-50"
                          >
                            {uploading === 'image'
                              ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                              : <ImageIcon size={13} strokeWidth={1.5} />}
                            Image
                          </button>
                          <button
                            type="button"
                            onClick={() => videoInputRef.current?.click()}
                            disabled={!!uploading}
                            className="flex h-8 cursor-pointer items-center gap-1.5 rounded-[9px] border border-black/10 bg-white px-2.5 text-[11.5px] font-semibold text-text-secondary transition-colors hover:text-primary disabled:opacity-50"
                          >
                            {uploading === 'video'
                              ? <span className="h-3 w-3 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
                              : <Film size={13} strokeWidth={1.5} />}
                            Video
                          </button>
                          <button
                            type="button"
                            onClick={() => setYtOpen((v) => !v)}
                            disabled={!!uploading}
                            className={`flex h-8 cursor-pointer items-center gap-1.5 rounded-[9px] border px-2.5 text-[11.5px] font-semibold transition-colors disabled:opacity-50 ${ytOpen ? 'border-primary/40 text-primary' : 'border-black/10 bg-white text-text-secondary hover:text-primary'}`}
                          >
                            <MonitorPlay size={13} strokeWidth={1.5} />
                            YouTube
                          </button>
                        </div>
                      </div>
                      {ytOpen && (
                        <div className="mb-2 flex items-center gap-2">
                          <input
                            type="url"
                            value={ytUrl}
                            onChange={(e) => setYtUrl(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleYouTubeInsert() } }}
                            placeholder="Paste a YouTube link, e.g. https://youtu.be/..."
                            className={`${inputClass} py-2 text-[13px]`}
                            style={inputStyle}
                          />
                          <button
                            type="button"
                            onClick={handleYouTubeInsert}
                            disabled={!ytUrl.trim()}
                            className="btn-gradient h-9 shrink-0 cursor-pointer rounded-[9px] border-none px-4 text-[12px] font-semibold text-white disabled:opacity-50"
                          >
                            Insert
                          </button>
                        </div>
                      )}
                      <textarea
                        id="post-content"
                        ref={contentRef}
                        required
                        minLength={50}
                        maxLength={50000}
                        value={form.content}
                        onChange={set('content')}
                        placeholder={'Write your article here.\n\n## A section heading\n\nRegular paragraphs are plain text with a blank line between them. Use **bold** for emphasis.\n\n- A bullet point\n- Another bullet point\n\nUse the buttons above to add pictures, videos, or a YouTube embed.'}
                        className={`${inputClass} min-h-[400px] resize-y font-mono text-[13px] leading-relaxed`}
                        style={inputStyle}
                      />
                      <p className="m-0 mt-1 text-[11px] text-[var(--color-text-secondary)]">
                        Formatting: ## Heading, **bold**, - list item, blank line between paragraphs.
                        Pictures and videos upload with the buttons above and drop in where your cursor is.
                      </p>
                    </div>
                  </div>

                  {status === 'error' && (
                    <div
                      className="mt-4 flex items-center gap-2 rounded-[11px] px-4 py-3 text-sm"
                      style={{ background: 'rgba(239,68,68,0.06)', color: '#DC2626' }}
                    >
                      <AlertCircle size={16} strokeWidth={1.5} className="shrink-0" />
                      {errorMessage}
                    </div>
                  )}

                  <div className="mt-5 flex justify-end">
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-gradient inline-flex cursor-pointer items-center gap-2 rounded-[11px] border-none px-6 py-3 text-sm font-semibold text-white transition-all disabled:opacity-60"
                    >
                      {status === 'loading' && (
                        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      )}
                      {status === 'loading'
                        ? 'Saving...'
                        : mode === 'edit'
                          ? 'Save changes'
                          : 'Publish post'}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Post list */}
        <p className="mb-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-text-secondary)]">
          All posts
        </p>
        <div className="space-y-3">
          {posts.map((post) => (
            <div
              key={post.slug}
              className="flex items-center gap-4 rounded-2xl border border-black/[0.06] bg-white px-5 py-4"
            >
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="truncate text-[15px] font-semibold text-text no-underline hover:text-primary"
                  >
                    {post.title}
                  </Link>
                  {post.source === 'mdx' && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-black/[0.08] bg-black/[0.03] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-text-secondary">
                      <FileText size={10} strokeWidth={2} />
                      File
                    </span>
                  )}
                </div>
                <p className="m-0 mt-0.5 text-xs text-[var(--color-text-secondary)]">
                  <span className={`mr-2 inline-block rounded-full border px-2 py-px text-[10px] font-medium ${categoryClass(post.category)}`}>
                    {post.category}
                  </span>
                  {post.date} {post.author ? `· ${post.author}` : ''}
                </p>
              </div>
              {post.source === 'admin' && (
                <div className="flex shrink-0 items-center gap-1.5">
                  <button
                    onClick={() => openEdit(post)}
                    aria-label={`Edit ${post.title}`}
                    className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-[10px] border border-black/10 bg-white text-text-secondary transition-colors hover:text-primary"
                  >
                    <PenSquare size={15} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={() => handleDelete(post.slug)}
                    aria-label={confirmDelete === post.slug ? `Confirm delete ${post.title}` : `Delete ${post.title}`}
                    disabled={deleting === post.slug}
                    className={`flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-[10px] border px-2.5 text-xs font-semibold transition-all disabled:opacity-50 ${
                      confirmDelete === post.slug
                        ? 'border-transparent text-white'
                        : 'border-black/10 bg-white text-text-secondary hover:text-[#DC2626]'
                    }`}
                    style={confirmDelete === post.slug ? { background: '#DC2626' } : undefined}
                  >
                    <Trash2 size={14} strokeWidth={1.5} />
                    {confirmDelete === post.slug ? 'Sure?' : null}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
