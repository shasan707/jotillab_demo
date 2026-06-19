'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Plus, Minus } from 'lucide-react'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export function FAQAccordion({ faq }) {
  const [open, setOpen] = useState(null)

  return (
    <div className="py-20 px-4 bg-[#FAFBFD]">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary mb-3">FAQ</p>
          <h2
            className="text-3xl font-bold text-text tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Common questions
          </h2>
        </AnimatedSection>

        <div className="space-y-2">
          {faq.map((item, i) => {
            const isOpen = open === i
            return (
              <AnimatedSection key={i} delay={i * 0.05}>
                <div
                  className="bg-white border border-black/5 rounded-2xl overflow-hidden transition-all duration-200 hover:border-[#3859a8]/15"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
                    aria-expanded={isOpen}
                  >
                    <span
                      className="text-base font-semibold text-text"
                      style={{ fontFamily: 'var(--font-display)' }}
                    >
                      {item.question}
                    </span>
                    <span className="shrink-0 h-7 w-7 rounded-full bg-[#F0F4FF] flex items-center justify-center transition-colors duration-200">
                      {isOpen
                        ? <Minus size={14} className="text-primary" strokeWidth={2} />
                        : <Plus size={14} className="text-primary" strokeWidth={2} />}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="answer"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm text-text-secondary leading-relaxed">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </div>
  )
}
