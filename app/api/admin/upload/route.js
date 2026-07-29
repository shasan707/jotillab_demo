import { NextResponse } from 'next/server'
import { handleUpload } from '@vercel/blob/client'
import { verifyAdminRequest } from '@/lib/adminAuth'

/* Admin media uploads for blog posts. The browser uploads DIRECTLY to the
   public Vercel Blob store (client upload), so large videos never pass
   through a serverless function body limit. This route only authorizes the
   upload: it verifies the admin cookie and issues a scoped token limited
   to the requested kind's content types and size cap. */

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const VIDEO_TYPES = ['video/mp4', 'video/webm']
const IMAGE_MAX = 8 * 1024 * 1024
const VIDEO_MAX = 200 * 1024 * 1024

export async function POST(request) {
  try {
    if (!verifyAdminRequest(request)) {
      return NextResponse.json({ ok: false, error: 'Not signed in.' }, { status: 401 })
    }
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ ok: false, error: 'Media storage is not configured.' }, { status: 503 })
    }

    const body = await request.json()
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        let kind = 'image'
        try {
          kind = JSON.parse(clientPayload || '{}').kind === 'video' ? 'video' : 'image'
        } catch {}
        return {
          allowedContentTypes: kind === 'video' ? VIDEO_TYPES : IMAGE_TYPES,
          maximumSizeInBytes: kind === 'video' ? VIDEO_MAX : IMAGE_MAX,
          addRandomSuffix: true,
        }
      },
      // Fires from Blob's side after the upload lands (not on localhost).
      onUploadCompleted: async () => {},
    })
    return NextResponse.json(jsonResponse)
  } catch (err) {
    console.error('[admin/upload] Error:', err)
    return NextResponse.json(
      { ok: false, error: err.message || 'Upload failed. Please try again.' },
      { status: 400 }
    )
  }
}
