import { Video, YouTube } from '@/components/blog/MdxMedia'
import { urlFor } from '@/lib/sanity/image'

/* Portable Text renderer map for blog posts. Styling mirrors the MDX
   component overrides the blog used before the Sanity migration, so posts
   look identical to the old pipeline. */

function PtImage({ value }) {
  const builder = value?.asset ? urlFor(value) : null
  const src = builder ? builder.width(1600).fit('max').auto('format').url() : null
  if (!src) return null
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={value.alt || ''}
      loading="lazy"
      className="my-8 h-auto w-full rounded-2xl border border-black/[0.06]"
    />
  )
}

export const portableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mb-5 text-[17px] leading-[1.75] text-[#374151]">{children}</p>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 font-[var(--font-sans)] text-2xl font-bold tracking-[-0.02em] text-text first:mt-0">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 font-[var(--font-sans)] text-xl font-bold tracking-[-0.015em] text-text">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-primary/30 bg-primary/[0.03] py-3 pl-5 pr-4 text-[17px] italic text-[#374151]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-5 space-y-2 pl-6">{children}</ul>,
    number: ({ children }) => <ol className="mb-5 list-decimal space-y-2 pl-6">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="text-[17px] leading-[1.75] text-[#374151] marker:text-primary [&::marker]:font-semibold">
        {children}
      </li>
    ),
    number: ({ children }) => (
      <li className="text-[17px] leading-[1.75] text-[#374151] marker:text-primary [&::marker]:font-semibold">
        {children}
      </li>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-bold text-text">{children}</strong>,
    em: ({ children }) => <em>{children}</em>,
    code: ({ children }) => (
      <code className="rounded-md bg-slate-100 px-1.5 py-0.5 font-[var(--font-mono)] text-[13px] text-slate-800">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = value?.href || '#'
      const external = href.startsWith('http')
      return (
        <a
          href={href}
          className="font-medium text-primary underline underline-offset-2 transition-colors hover:text-primary-dark"
          target={external ? '_blank' : undefined}
          rel={external ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      )
    },
  },
  types: {
    image: PtImage,
    video: ({ value }) => {
      const src = value?.fileUrl || value?.url
      if (!src) return null
      return <Video src={src} title={value.title || 'Video'} />
    },
    youtube: ({ value }) => <YouTube id={value?.id} title={value?.title || 'Video'} />,
    code: ({ value }) => (
      <pre className="mb-5 overflow-x-auto rounded-xl bg-slate-900 p-5 text-sm text-slate-100">
        <code className="font-[var(--font-mono)]">{value?.code || ''}</code>
      </pre>
    ),
  },
}
