'use client'

import { useEffect, useRef } from 'react'
import { PRODUCT_SLIDES } from './showcase/data'
import { ProductSlide } from './showcase/ProductSlide'
import { FlowCard } from './showcase/FlowCard'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

const MESSENGER_INDEX = 1
const MESSENGER_CYCLE_MS = 6000

function SectionHeading() {
  return (
    <AnimatedSection className="text-center pt-24 pb-12 px-6">
      <p
        className="text-sm font-semibold tracking-wide uppercase mb-3"
        style={{ color: '#3859a8' }}
      >
        What Changes for Your Business
      </p>
      <h2
        className="text-[clamp(1.75rem,4vw,3rem)] font-bold tracking-[-0.03em] text-text max-w-2xl mx-auto"
        style={{ fontFamily: 'var(--font-display)' }}
      >
        One platform. Every customer touchpoint.
      </h2>
    </AnimatedSection>
  )
}

function useMessengerProgress() {
  const ref = useRef(0)
  useEffect(() => {
    let raf
    const start = performance.now()
    const tick = (now) => {
      const elapsed = (now - start) % MESSENGER_CYCLE_MS
      ref.current = elapsed / MESSENGER_CYCLE_MS
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])
  return ref
}

function ProductSection({ product, index }) {
  const isMessenger = index === MESSENGER_INDEX
  const messengerProgressRef = useMessengerProgress()

  return (
    <ProductSlide
      product={product}
      index={index}
      isActive={true}
      messengerProgressRef={isMessenger ? messengerProgressRef : undefined}
    />
  )
}

export function ScrollProductShowcase() {
  return (
    <>
      <section className="bg-[#F4F6FB] py-20 md:py-28">
        <SectionHeading />
        <ProductSection product={PRODUCT_SLIDES[0]} index={0} />
      </section>
      {PRODUCT_SLIDES.slice(1).map((product, i) => {
        const realIndex = i + 1
        const bgClass = realIndex % 2 === 1 ? 'bg-white' : 'bg-[#F4F6FB]'
        return (
          <section key={product.slug} className={`${bgClass} py-20 md:py-28`}>
            <ProductSection product={product} index={realIndex} />
          </section>
        )
      })}
      <section className="bg-white">
        <FlowCard />
      </section>
    </>
  )
}
