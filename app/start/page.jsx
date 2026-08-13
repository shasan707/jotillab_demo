import { Badge } from '@/components/ui/Badge'
import { AnimatedSection } from '@/components/ui/AnimatedSection'
import { StartIntake } from '@/components/sections/industry/intake/StartIntake'
import { getIndustry } from '@/lib/industries'

/* Shareable intake page. Send a prospect jotillabs.com/start, or an
   industry-specific link like /start?industry=restaurant to skip the
   dropdown. Same guided chat and lead pipeline as the industry pages. */

export const metadata = {
  title: 'Get Started',
  description:
    'Tell us about your business in a couple of minutes and we will come back with a plan built for you.',
}

export default async function StartPage({ searchParams }) {
  const { industry } = await searchParams
  const validSlug = industry && getIndustry(industry) ? industry : null

  return (
    <section className="pt-36 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <AnimatedSection className="text-center mb-10">
          <Badge variant="blue" className="mb-5">Get started</Badge>
          <h1
            className="headline-shadow font-extrabold tracking-[-0.03em] leading-[1.1] text-text mb-3"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.4vw, 2.85rem)' }}
          >
            Tell us about your business
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto">
            Answer a few quick questions and we will come back with a setup built for you.
            It takes about two minutes.
          </p>
        </AnimatedSection>
        <AnimatedSection delay={0.08}>
          <StartIntake initialSlug={validSlug} />
        </AnimatedSection>
      </div>
    </section>
  )
}
