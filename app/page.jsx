import { SplineAura } from '@/components/sections/SplineAura'
import { LiveConsole } from '@/components/sections/LiveConsole'
import { ScrollProductShowcase } from '@/components/sections/ScrollProductShowcase'
import { SolutionsBento } from '@/components/sections/SolutionsBento'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { IntegrationStrip } from '@/components/sections/IntegrationStrip'
import { CTASection } from '@/components/sections/CTASection'

export const metadata = {
  title: 'JotilLabs - AI Voice, Chat & Automation Platform',
  description:
    'Never miss a customer again. JotilLabs AI voice agents, chatbots, and SMS automation handle your calls, chats, leads, and workflows 24/7.',
}

export default function Home() {
  return (
    <>
      <SplineAura />
      <LiveConsole />
      <ScrollProductShowcase />
      <SolutionsBento />
      <HowItWorks />
      <IntegrationStrip />
      <CTASection />
    </>
  )
}
