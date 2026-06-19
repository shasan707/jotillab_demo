'use client'

import Link from 'next/link'
import { ArrowRight, Phone, MessageCircle, TrendingUp, LayoutGrid, GitBranch, UserCircle } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const CAPABILITIES = [
  {
    slug: 'receptionist',
    icon: Phone,
    title: 'Answer every call',
    desc: 'Your customers call and someone always picks up. Instantly. 24/7. No hold music, no voicemail, no missed opportunities.',
    outcome: '80% fewer missed calls',
  },
  {
    slug: 'messenger',
    icon: MessageCircle,
    title: 'Handle every conversation',
    desc: 'Whether it is a website visitor, a text message, or a WhatsApp chat, your business responds in seconds, not hours.',
    outcome: 'Under 3s response time',
  },
  {
    slug: 'outreach',
    icon: TrendingUp,
    title: 'Grow your pipeline',
    desc: 'Reach more leads with intelligent outbound campaigns that sound human and convert. Follow up automatically so nothing falls through.',
    outcome: '3x more leads contacted',
  },
  {
    slug: 'space',
    icon: LayoutGrid,
    title: 'Stay organized',
    desc: 'Every interaction logged. Every lead scored. Every appointment scheduled. One workspace that keeps your whole team aligned.',
    outcome: 'Zero manual data entry',
  },
  {
    slug: 'flow',
    icon: GitBranch,
    title: 'Automate the repetitive',
    desc: 'Connect your tools and let intelligent workflows handle the busy work. From follow-ups to invoicing, it runs while you sleep.',
    outcome: '12+ hours saved per week',
  },
  {
    slug: 'avatar',
    icon: UserCircle,
    title: 'Meet customers face to face',
    desc: 'A lifelike digital assistant that greets visitors on your website with real conversation, real expressions, and real personality.',
    outcome: '2x visitor engagement',
  },
]

export function ProductShowcase() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <AnimatedSection className="text-center mb-16">
          <p className="badge mx-auto mb-4 w-fit">
            What Changes for Your Business
          </p>
          <h2
            className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-extrabold tracking-[-0.04em] text-text mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            One platform.{' '}
            <span className="text-gradient">Every customer touchpoint.</span>
          </h2>
          <p
            className="text-base text-text-secondary leading-relaxed max-w-xl mx-auto"
            style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
          >
            Your business runs on conversations. We make sure every single one
            is handled, followed up, and turned into growth.
          </p>
        </AnimatedSection>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CAPABILITIES.map((cap, i) => (
            <AnimatedSection key={cap.slug} delay={i * 0.07}>
              <CapabilityCard capability={cap} />
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <AnimatedSection delay={0.4} className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary no-underline group"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            See how it all works together
            <ArrowRight
              size={15}
              strokeWidth={2}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </Link>
        </AnimatedSection>

      </div>
    </section>
  )
}

function CapabilityCard({ capability }) {
  const { slug, icon: Icon, title, desc, outcome } = capability

  return (
    <Link
      href={`/products/${slug}`}
      className="group block no-underline h-full"
    >
      <article
        className="h-full flex flex-col p-7 rounded-[20px] transition-all duration-300 cursor-pointer"
        style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(16px) saturate(1.8)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.8)',
          border: '1px solid rgba(255,255,255,0.70)',
          boxShadow: '0 2px 8px rgba(15,17,41,0.04), inset 0 1px 0 rgba(255,255,255,0.95)',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-3px)'
          e.currentTarget.style.boxShadow = '0 16px 48px rgba(56, 89, 168,0.12), 0 4px 16px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,1)'
          e.currentTarget.style.borderColor = 'rgba(56, 89, 168,0.22)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.70)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)'
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(15,17,41,0.04), inset 0 1px 0 rgba(255,255,255,0.95)'
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.70)'
          e.currentTarget.style.background = 'rgba(255,255,255,0.55)'
        }}
      >
        {/* Icon */}
        <div
          className="w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 mb-5"
          style={{
            background: 'linear-gradient(135deg, rgba(56, 89, 168,0.08), rgba(59, 130, 246,0.06))',
            border: '1px solid rgba(56, 89, 168,0.10)',
          }}
        >
          <Icon size={20} strokeWidth={1.5} style={{ color: 'var(--color-primary)' }} />
        </div>

        {/* Title */}
        <h3
          className="text-lg font-bold text-text mb-2 leading-tight tracking-[-0.02em]"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          {title}
        </h3>

        {/* Description */}
        <p
          className="text-sm text-text-secondary leading-relaxed mb-5 flex-1"
          style={{ fontFamily: 'var(--font-inter), Inter, sans-serif' }}
        >
          {desc}
        </p>

        {/* Outcome metric */}
        <div
          className="flex items-center justify-between pt-4 mt-auto"
          style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
        >
          <span
            className="text-xs font-semibold text-primary"
            style={{ fontFamily: 'var(--font-jetbrains), JetBrains Mono, monospace' }}
          >
            {outcome}
          </span>
          <ArrowRight
            size={14}
            strokeWidth={2}
            className="text-text-secondary transition-all duration-200 group-hover:text-primary group-hover:translate-x-1"
          />
        </div>
      </article>
    </Link>
  )
}
