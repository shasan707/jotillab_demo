import Link from 'next/link'
import { GitBranch } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function FlowCard() {
  return (
    <AnimatedSection className="py-20 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{
            background:
              'linear-gradient(135deg, rgba(56,89,168,0.08), rgba(59,130,246,0.06))',
            border: '1px solid rgba(56,89,168,0.10)',
          }}
        >
          <GitBranch size={24} strokeWidth={1.5} className="text-primary" />
        </div>
        <h2
          className="text-2xl font-bold tracking-[-0.02em] text-text mb-3"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Need something custom?
        </h2>
        <p className="text-text-secondary leading-relaxed mb-8 max-w-lg mx-auto">
          Every business runs differently. We design and build custom AI
          workflows, agent pipelines, and integrations tailored to how your team
          actually works.
        </p>
        <Link
          href="/products/flow"
          className="inline-flex items-center gap-2 px-7 py-3 rounded-[10px] text-sm font-medium text-white no-underline btn-gradient"
        >
          Talk to our team
        </Link>
      </div>
    </AnimatedSection>
  )
}
