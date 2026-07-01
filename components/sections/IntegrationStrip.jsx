'use client'

import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { getBrandLogo } from '@/components/ui/BrandLogos'

const INTEGRATIONS = [
  { label: 'Twilio', color: '#F22F46' },
  { label: 'OpenAI', color: '#10A37F' },
  { label: 'Slack', color: '#4A154B' },
  { label: 'HubSpot', color: '#FF7A59' },
  { label: 'Salesforce', color: '#00A1E0' },
  { label: 'Google Calendar', color: '#4285F4' },
  { label: 'Microsoft Teams', color: '#6264A7' },
  { label: 'Zapier', color: '#FF4A00' },
  { label: 'WhatsApp', color: '#25D366' },
  { label: 'Stripe', color: '#635BFF' },
  { label: 'Airtable', color: '#18BFFF' },
  { label: 'Retell AI', color: '#3859a8' },
  { label: 'Google Sheets', color: '#34A853' },
  { label: 'Calendly', color: '#006BFF' },
  { label: 'Zoho CRM', color: '#D32011' },
  { label: 'Mailchimp', color: '#FFE01B' },
  { label: 'QuickBooks', color: '#2CA01C' },
  { label: 'Notion', color: '#111111' },
  { label: 'Monday.com', color: '#FF3D57' },
  { label: 'Freshdesk', color: '#22C55E' },
]

function IntegrationPill({ label }) {
  const LogoComponent = getBrandLogo(label)

  return (
    <div
      className="flex items-center gap-2.5 px-4 py-2.5 rounded-full shrink-0 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      style={{
        // Solid chip (was translucent + blur) — over the light section the blur
        // was invisible anyway, and ~40 of these in the marquee were the bulk of
        // the page's backdrop-filter cost during scroll.
        background: '#ffffff',
        border: '1px solid rgba(15,17,41,0.06)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
      }}
    >
      {LogoComponent && (
        <span className="shrink-0 flex items-center justify-center">
          <LogoComponent />
        </span>
      )}
      <span
        className="text-[13px] font-medium text-text whitespace-nowrap"
        style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
      >
        {label}
      </span>
    </div>
  )
}

function MarqueeRow({ items, reverse = false, speed = 30 }) {
  const duration = items.length * speed

  return (
    <div className="relative overflow-hidden">
      {/* Fade edges */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(to right, var(--color-bg), transparent)' }} />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-20 z-10" style={{ background: 'linear-gradient(to left, var(--color-bg), transparent)' }} />

      <div
        className="flex gap-3 w-max"
        style={{
          animation: `${reverse ? 'marquee-reverse' : 'marquee'} ${duration}s linear infinite`,
        }}
      >
        {/* Double the items for seamless loop */}
        {[...items, ...items].map((item, i) => (
          <IntegrationPill key={`${item.label}-${i}`} {...item} />
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-reverse {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  )
}

export function IntegrationStrip() {
  const row1 = INTEGRATIONS.slice(0, 10)
  const row2 = INTEGRATIONS.slice(10, 20)

  return (
    <section className="cv-auto py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <AnimatedSection className="text-center mb-14">
          <p className="badge mx-auto mb-4 w-fit">Integrations</p>
          <h2
            className="headline-shadow text-[clamp(1.9rem,3.5vw,2.75rem)] font-extrabold tracking-[-0.04em] text-text mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Works with{' '}
            <span className="text-gradient">300+ tools</span>{' '}
            you already use
          </h2>
          <p
            className="text-base text-text-secondary leading-relaxed max-w-lg mx-auto"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Plug Jotil into your existing stack in minutes. No ripping and
            replacing. Just seamless AI on top of what you already have.
          </p>
        </AnimatedSection>

        {/* Marquee rows */}
        <AnimatedSection delay={0.15}>
          <div className="space-y-3">
            <MarqueeRow items={row1} speed={25} />
            <MarqueeRow items={row2} speed={30} reverse />
          </div>
        </AnimatedSection>

        {/* Bottom note */}
        <AnimatedSection delay={0.3} className="text-center mt-10">
          <p
            className="text-sm text-text-secondary"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Plus any REST API, webhook, or custom integration your business needs.
          </p>
        </AnimatedSection>

      </div>
    </section>
  )
}
