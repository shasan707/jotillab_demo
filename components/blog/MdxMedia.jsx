/* Media renderers for blog post content (server-safe, no client JS).
   Markdown images (![alt](url)) map to MdxImage via the mdxComponents map;
   admin posts can also use <Video src="..." /> and <YouTube id="..." />. */

export function MdxImage({ src, alt = '' }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      className="my-8 h-auto w-full rounded-2xl border border-black/[0.06]"
    />
  )
}

export function Video({ src, title = 'Video' }) {
  return (
    <video
      controls
      playsInline
      preload="metadata"
      aria-label={title}
      className="my-8 h-auto w-full rounded-2xl border border-black/[0.06] bg-black/[0.02]"
    >
      <source src={src} />
      Your browser does not support video playback.
    </video>
  )
}

export function YouTube({ id, title = 'Video' }) {
  if (!id) return null
  return (
    <div className="relative my-8 w-full overflow-hidden rounded-2xl border border-black/[0.06]" style={{ paddingTop: '56.25%' }}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full border-0"
      />
    </div>
  )
}
