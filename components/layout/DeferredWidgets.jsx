'use client'

import dynamic from 'next/dynamic'

/* Non-critical, interaction-only chrome. Neither is needed at first paint, so
   we load them client-side after hydration (ssr:false) to keep them out of the
   initial render/hydration path. The floating chat button and back-to-top
   button look and behave exactly the same once mounted. */
const AIWidget = dynamic(
  () => import('@/components/widgets/AIWidget').then((m) => m.AIWidget),
  { ssr: false },
)
const ScrollToTop = dynamic(
  () => import('@/components/layout/ScrollToTop').then((m) => m.ScrollToTop),
  { ssr: false },
)

export function DeferredWidgets() {
  return (
    <>
      <ScrollToTop />
      <AIWidget />
    </>
  )
}
