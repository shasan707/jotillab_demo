'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

export function CopyLinkButton({ postUrl }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(postUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }).catch(() => {})
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? 'Link copied to clipboard' : 'Copy article link to clipboard'}
      className="inline-flex items-center gap-2 rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm font-600 text-[var(--color-text-secondary)] transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/5 hover:text-primary hover:shadow-sm cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
    >
      {copied
        ? <Check className="h-4 w-4 text-emerald-500" strokeWidth={2} />
        : <Link2 className="h-4 w-4" strokeWidth={1.5} />}
      {copied ? 'Copied!' : 'Copy link'}
    </button>
  )
}
