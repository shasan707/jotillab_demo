import { NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { verifyAdminRequest } from '@/lib/adminAuth'

/* Admin media uploads for blog posts. Files land in the public Vercel Blob
   store (jotil-blog-media) and the editor inserts the returned URL into the
   post content. Cookie-guarded: only signed-in admins can store media. */

const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' }
const VIDEO_TYPES = { 'video/mp4': 'mp4', 'video/webm': 'webm' }
const IMAGE_MAX = 8 * 1024 * 1024
const VIDEO_MAX = 80 * 1024 * 1024

export async function POST(request) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ ok: false, error: 'Media storage is not configured.' }, { status: 503 })
    }

    const form = await request.formData().catch(() => null)
    const file = form?.get('file')
    if (!file || typeof file === 'string') {
      return NextResponse.json({ ok: false, error: 'Please choose a file.' }, { status: 400 })
    }

    const kind = IMAGE_TYPES[file.type] ? 'image' : VIDEO_TYPES[file.type] ? 'video' : null
    if (!kind) {
      return NextResponse.json(
        { ok: false, error: 'Use a JPG, PNG, WebP, or GIF image, or an MP4 or WebM video.' },
        { status: 400 }
      )
    }
    const maxBytes = kind === 'image' ? IMAGE_MAX : VIDEO_MAX
    if (file.size > maxBytes) {
      return NextResponse.json(
        {
          ok: false,
          error:
            kind === 'image'
              ? 'Images can be up to 8 MB.'
              : 'Videos can be up to 80 MB. For longer videos, upload to YouTube and embed it instead.',
        },
        { status: 400 }
      )
    }

    const ext = IMAGE_TYPES[file.type] || VIDEO_TYPES[file.type]
    const base = (file.name || 'upload')
      .replace(/\.[^.]*$/, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 60) || 'upload'

    const blob = await put(`blog/${Date.now()}-${base}.${ext}`, file, { access: 'public' })
    return NextResponse.json({ ok: true, url: blob.url, kind })
  } catch (err) {
    console.error('[admin/upload] Error:', err)
    return NextResponse.json({ ok: false, error: 'Upload failed. Please try again.' }, { status: 500 })
  }
}
