import { ContactForm } from '@/components/sections/ContactForm'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { Badge } from '@/components/ui/Badge'
import { AtmosphericDivider } from '@/components/design'

export const metadata = {
  title: 'Contact JotilLabs',
  description:
    'Get in touch with the JotilLabs team. Book a demo, ask about enterprise pricing, or reach out with any questions about our AI voice, chat, and automation products.',
}

const localBusinessJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'JotilLabs',
  telephone: '+1-358-900-0040',
  email: 'contact@jotillabs.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Lehi',
    addressRegion: 'Utah',
    addressCountry: 'US',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
      />
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div
          className="pointer-events-none absolute top-[-100px] right-[-60px] rounded-full"
          aria-hidden="true"
          style={{
            width: 480,
            height: 480,
            background: 'radial-gradient(circle, rgba(56, 89, 168,0.08) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <AnimatedSection>
            <Badge variant="blue" className="mb-5">Contact</Badge>
          </AnimatedSection>

          <AnimatedSection delay={0.08}>
            <h1
              className="font-extrabold tracking-[-0.04em] leading-[1.06] text-text mb-5"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)' }}
            >
              Let us talk about{' '}
              <span className="text-gradient">your needs</span>
            </h1>
          </AnimatedSection>

          <AnimatedSection delay={0.14}>
            <p className="text-lg text-text-secondary leading-relaxed max-w-xl mx-auto">
              Whether you want a product demo, have an enterprise requirement, or just want to learn more. We are here.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <AtmosphericDivider from="var(--color-bg)" to="var(--color-primary-50)" height={40} />

      {/* Form + Sidebar + FAQ */}
      <section className="py-16 pb-28">
        <AnimatedSection>
          <div className="max-w-6xl mx-auto px-6">
            <ContactForm />
          </div>
        </AnimatedSection>
      </section>
    </div>
  )
}
