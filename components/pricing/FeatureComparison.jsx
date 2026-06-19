'use client'

import Link from 'next/link'
import { Check, X, ArrowRight, Mail } from 'lucide-react'

/**
 * Compare-plan matrix. Accepts tier data and a flat feature matrix now;
 * optional categorized featureGroups prop reserved for future grouped
 * rendering once per-product feature-group data is authored.
 *
 * Each feature row: { label: string, values: [true|false|string, ...] }
 * values array length === tiers length, same order.
 */
export function FeatureComparison({ tiers, features, productSlug }) {
  if (!tiers?.length || !features?.length) return null

  const columnCount = tiers.length
  const gridCols = `minmax(220px,1fr) repeat(${columnCount}, minmax(140px,1fr))`
  const gridStyle = { gridTemplateColumns: gridCols }

  return (
    <>
      {/* Desktop matrix */}
      <div className="hidden md:block">
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]">
          <ColumnHeaders tiers={tiers} gridStyle={gridStyle} />
          <FeatureRows
            tiers={tiers}
            features={features}
            gridStyle={gridStyle}
          />
          <BottomCtaRow
            tiers={tiers}
            productSlug={productSlug}
            gridStyle={gridStyle}
          />
        </div>
      </div>

      {/* Mobile: horizontally scrollable, sticky feature label column */}
      <div className="md:hidden -mx-4 px-4 overflow-x-auto">
        <div className="min-w-[720px] overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/[0.04]">
          <ColumnHeaders tiers={tiers} gridStyle={gridStyle} compact />
          <FeatureRows
            tiers={tiers}
            features={features}
            gridStyle={gridStyle}
            compact
          />
          <BottomCtaRow
            tiers={tiers}
            productSlug={productSlug}
            gridStyle={gridStyle}
            compact
          />
        </div>
      </div>
    </>
  )
}

function ColumnHeaders({ tiers, gridStyle, compact = false }) {
  return (
    <div
      className="grid border-b border-black/5"
      style={gridStyle}
    >
      <div className={compact ? 'p-4' : 'p-5'} />
      {tiers.map((tier) => (
        <div
          key={tier.slug}
          className={`text-center ${compact ? 'px-3 py-4' : 'px-4 py-5'} ${
            tier.highlighted ? 'bg-primary/[0.04]' : ''
          }`}
        >
          <p
            className={`font-semibold text-text ${compact ? 'text-xs' : 'text-sm'}`}
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {tier.name}
          </p>
          <p className={`mt-0.5 font-medium text-text-muted ${compact ? 'text-[11px]' : 'text-xs'}`}>
            {tier.slug === 'enterprise'
              ? 'Custom'
              : `${tier.price}${tier.period ?? ''}`}
          </p>
        </div>
      ))}
    </div>
  )
}

function FeatureRows({ tiers, features, gridStyle, compact = false }) {
  return (
    <div>
      {features.map((row, ri) => {
        const isOdd = ri % 2 === 1
        return (
          <div
            key={ri}
            className={`grid ${isOdd ? 'bg-black/[0.015]' : ''}`}
            style={gridStyle}
          >
            <div
              className={`flex items-center ${compact ? 'px-4 py-3' : 'px-5 py-3.5'} ${
                compact
                  ? 'sticky left-0 bg-white/95 backdrop-blur-sm z-10'
                  : ''
              }`}
            >
              <span className={`text-text-secondary ${compact ? 'text-xs' : 'text-sm'}`}>
                {row.label}
              </span>
            </div>
            {row.values.map((val, vi) => {
              const tier = tiers[vi]
              const cellBg = tier?.highlighted
                ? isOdd
                  ? 'bg-primary/[0.05]'
                  : 'bg-primary/[0.04]'
                : ''
              return (
                <div
                  key={vi}
                  className={`flex items-center justify-center ${
                    compact ? 'px-3 py-3' : 'px-4 py-3.5'
                  } ${cellBg}`}
                >
                  <FeatureValue value={val} />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

function FeatureValue({ value }) {
  if (typeof value === 'string') {
    return (
      <span className="text-sm font-medium text-text text-center">{value}</span>
    )
  }
  if (value === true) {
    return (
      <span
        className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100"
        aria-label="Included"
      >
        <Check size={12} strokeWidth={3} className="text-emerald-600" />
      </span>
    )
  }
  return (
    <X
      size={16}
      strokeWidth={2}
      className="text-red-300"
      aria-label="Not included"
    />
  )
}

function BottomCtaRow({ tiers, productSlug, gridStyle, compact = false }) {
  return (
    <div
      className="grid border-t border-black/5"
      style={gridStyle}
    >
      <div className={compact ? 'p-4' : 'p-5'} />
      {tiers.map((tier) => {
        const tierSlug = tier.slug || tier.name?.toLowerCase()
        const isEnterprise = tier.slug === 'enterprise'
        const href = productSlug
          ? `/contact?product=${productSlug}&tier=${tierSlug}`
          : '/contact'
        return (
          <div
            key={tier.slug}
            className={`flex items-center justify-center ${compact ? 'px-3 py-4' : 'px-4 py-5'} ${
              tier.highlighted ? 'bg-primary/[0.04]' : ''
            }`}
          >
            {isEnterprise ? (
              <Link
                href={href}
                className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 bg-white px-3 py-2 text-xs font-semibold text-text no-underline hover:border-primary/40 hover:text-primary transition-colors"
              >
                <Mail size={12} strokeWidth={2} />
                Contact Sales
              </Link>
            ) : (
              <Link
                href={href}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold no-underline transition-colors ${
                  tier.highlighted
                    ? 'bg-navy text-white hover:bg-primary-700'
                    : 'border border-black/10 bg-white text-text hover:border-primary/40 hover:text-primary'
                }`}
              >
                Get Started
                <ArrowRight size={12} strokeWidth={2} />
              </Link>
            )}
          </div>
        )
      })}
    </div>
  )
}
