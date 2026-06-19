import { Sparkles } from 'lucide-react'

export function ConciergeSetupBanner({ setupFee }) {
  if (!setupFee) return null

  return (
    <div className="mt-10 rounded-xl border border-primary/20 bg-primary/[0.03] px-6 py-5">
      <div className="flex items-start gap-3">
        <Sparkles size={18} strokeWidth={1.5} className="text-primary mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-semibold text-text mb-1 font-display">
            Concierge Setup included{' '}
            <span className="text-text-secondary">
              <span className="line-through">{setupFee.strikethrough}</span>{' '}
              <span className="text-primary">{setupFee.current}</span>
            </span>
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            Our team configures your AI, knowledge base, and channels. No technical skills required. You are live in days, not weeks.
          </p>
        </div>
      </div>
    </div>
  )
}
