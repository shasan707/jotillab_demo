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
const TestimonialSpotlight = dynamic(() =>
  import('@/components/sections/TestimonialSpotlight').then((m) => m.TestimonialSpotlight),
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

// Hairline seam between sections so each block reads as its own section
// (paired with the alternating section backgrounds below).
function Seam() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto h-px max-w-7xl bg-gradient-to-r from-transparent via-[rgba(15,17,41,0.10)] to-transparent"
    />
  )
}

export default function Home() {
  return (
    <>
      <SplineAura />
      {/* Everything below the hero uses the professional Roboto heading
          treatment (see .home-pro-headings in globals.css). Sections alternate
          background (alt / white) and are split by a hairline Seam so the page
          reads as distinct sections rather than one continuous block. */}
      <div className="home-pro-headings">
        <ScrollProductShowcase />
        <Seam />
        <SolutionsBento />
        <Seam />
        <HowItWorks />
        <Seam />
        <IntegrationStrip />
        <Seam />
        <TestimonialSpotlight />
        <Seam />
        <LiveConsole />
        <CTASection />
      </div>
    </>
  )
}
