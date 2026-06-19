import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { OptInForm } from '@/components/sections/OptInForm'

export const metadata = {
  title: 'Communication Consent',
  description:
    'Provide your consent to receive AI-powered communications from JotilLabs, including voice calls, SMS, and chat messages. TCPA-compliant opt-in form.',
}

export default function OptInPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute w-[400px] h-[400px] opacity-15"
            style={{
              top: '-5%',
              left: '60%',
              background: 'radial-gradient(circle, rgba(37, 99, 235, 0.3) 0%, transparent 60%)',
              filter: 'blur(100px)',
            }}
          />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <AnimatedSection>
            <span className="text-xs font-semibold text-primary tracking-widest uppercase">
              Legal
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-[-0.04em] text-text mt-3 leading-tight">
              Communication Consent
            </h1>
            <p className="text-text-secondary mt-4 max-w-lg mx-auto leading-relaxed">
              By submitting this form, you consent to receive AI-powered communications
              from JotilLabs. Please review each section carefully.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Form */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection>
            <OptInForm />
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
