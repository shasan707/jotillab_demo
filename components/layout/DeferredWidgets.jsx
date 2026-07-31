'use client'

import dynamic from 'next/dynamic'

/* Non-critical, interaction-only chrome. Not needed at first paint, so we
   load them client-side after hydration (ssr:false) to keep them out of the
   initial render/hydration path. (The old back-to-top button was removed:
   it shared the bottom-left corner with the voice agent and read as a
   glitch.) */
const AIWidget = dynamic(
  () => import('@/components/widgets/AIWidget').then((m) => m.AIWidget),
  { ssr: false },
)
const VoiceWidget = dynamic(
  () => import('@/components/widgets/VoiceWidget').then((m) => m.VoiceWidget),
  { ssr: false },
)

export function DeferredWidgets() {
  return (
    <>
      <AIWidget />
      <VoiceWidget />
    </>
  )
}
