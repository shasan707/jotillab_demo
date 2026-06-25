import dynamic from 'next/dynamic'
import { SplineAura } from '@/components/sections/SplineAura'

// Hero (SplineAura) stays in the main bundle for instant first paint. Every
// section below the fold is code-split into its own chunk so the homepage's
// initial JS/hydration only covers the hero. These still server-render (no
// ssr:false), so the HTML and SEO are unchanged — only the client JS is lazy.
const ScrollProductShowcase = dynamic(() =>
  import('@/components/sections/ScrollProductShowcase').then((m) => m.ScrollProductShowcase),
)
const SolutionsBento = dynamic(() =>
  import('@/components/sections/SolutionsBento').then((m) => m.SolutionsBento),
)
const HowItWorks = dynamic(() =>
  import('@/components/sections/HowItWorks').then((m) => m.HowItWorks),
)
const IntegrationStrip = dynamic(() =>
  import('@/components/sections/IntegrationStrip').then((m) => m.IntegrationStrip),
)
const LiveConsole = dynamic(() =>
  import('@/components/sections/LiveConsole').then((m) => m.LiveConsole),
)
const CTASection = dynamic(() =>
  import('@/components/sections/CTASection').then((m) => m.CTASection),
)

export const metadata = {
  title: 'JotilLabs - AI Voice, Chat & Automation Platform',
  description:
    'Never miss a customer again. JotilLabs AI voice agents, chatbots, and SMS automation handle your calls, chats, leads, and workflows 24/7.',
}

export default function Home() {
  return (
    <>
      <SplineAura />
      {/* Everything below the hero uses the professional Roboto heading
          treatment (see .home-pro-headings in globals.css). */}
      <div className="home-pro-headings">
        <ScrollProductShowcase />
        <SolutionsBento />
        <HowItWorks />
        <IntegrationStrip />
        <LiveConsole />
        <CTASection />
      </div>
    </>
  )
}
