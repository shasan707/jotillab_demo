'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export function OptInForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
  })

  const [consents, setConsents] = useState({
    aiCalls: false,
    sms: false,
    dataRates: false,
    agreeTerms: false,
  })

  const allRequired = consents.aiCalls && consents.sms && consents.dataRates && consents.agreeTerms

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleConsent = (key) => {
    setConsents((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Connect to backend API
  }

  return (
    <div className="glass rounded-[20px] p-8 sm:p-12">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Your Information</h2>

          <div>
            <label className="block text-sm font-medium text-text mb-1.5" htmlFor="fullName">
              Full Name *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full bg-white/60 border border-border rounded-[10px] px-4 py-3 text-sm text-text placeholder:text-text-secondary/50 outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(56, 89, 168,0.06)] transition-all"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1.5" htmlFor="optPhone">
                Phone Number *
              </label>
              <input
                id="optPhone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-white/60 border border-border rounded-[10px] px-4 py-3 text-sm text-text placeholder:text-text-secondary/50 outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(56, 89, 168,0.06)] transition-all"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text mb-1.5" htmlFor="optEmail">
                Email Address *
              </label>
              <input
                id="optEmail"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-white/60 border border-border rounded-[10px] px-4 py-3 text-sm text-text placeholder:text-text-secondary/50 outline-none focus:border-primary/30 focus:shadow-[0_0_0_3px_rgba(56, 89, 168,0.06)] transition-all"
                placeholder="john@company.com"
              />
            </div>
          </div>
        </div>

        {/* Consent Checkboxes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-text">Consent</h2>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={consents.aiCalls}
              onChange={() => handleConsent('aiCalls')}
              className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer accent-primary"
            />
            <span className="text-sm text-text-secondary group-hover:text-text transition-colors">
              I consent to receive AI-powered and automated telephone calls from
              Jotil Labs LLC and its clients at the phone number provided above. I
              understand these calls may be generated or conducted by artificial
              intelligence technology.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={consents.sms}
              onChange={() => handleConsent('sms')}
              className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer accent-primary"
            />
            <span className="text-sm text-text-secondary group-hover:text-text transition-colors">
              I consent to receive automated SMS/text messages from Jotil Labs LLC and
              its clients at the phone number provided above, including
              appointment reminders, follow-ups, and promotional messages.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={consents.dataRates}
              onChange={() => handleConsent('dataRates')}
              className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer accent-primary"
            />
            <span className="text-sm text-text-secondary group-hover:text-text transition-colors">
              I acknowledge that message and data rates may apply. Message
              frequency varies based on the services used.
            </span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={consents.agreeTerms}
              onChange={() => handleConsent('agreeTerms')}
              className="mt-0.5 w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer accent-primary"
            />
            <span className="text-sm text-text-secondary group-hover:text-text transition-colors">
              I have read and agree to the Jotil Labs LLC{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Terms & Conditions
              </Link>
              .
            </span>
          </label>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={!allRequired}
          style={{
            opacity: allRequired ? 1 : 0.5,
            cursor: allRequired ? 'pointer' : 'not-allowed',
          }}
        >
          Submit Consent
        </Button>
      </form>

      {/* Opt-out & TCPA */}
      <div className="mt-8 pt-6 border-t border-border space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-text mb-2">
            How to Opt Out
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            You may withdraw your consent at any time:
          </p>
          <ul className="list-disc list-inside mt-2 text-sm text-text-secondary space-y-1">
            <li>Reply <strong className="text-text">STOP</strong> to any SMS message to stop text communications</li>
            <li>Email <a href="mailto:contact@jotillabs.com" className="text-primary hover:underline">contact@jotillabs.com</a> with the subject &ldquo;Opt Out&rdquo;</li>
            <li>Request opt-out during any phone call</li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text mb-2">
            TCPA Disclosure
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            By providing your phone number and checking the consent boxes above,
            you provide your prior express written consent under the Telephone
            Consumer Protection Act (TCPA), 47 U.S.C. &sect; 227, to receive
            autodialed calls and text messages, including AI-generated
            communications, from Jotil Labs LLC and its clients. This consent is not
            a condition of purchase. You may revoke consent at any time using the
            opt-out methods described above.
          </p>
        </div>

        <p className="text-xs text-text-secondary/70">
          For full terms, see our{' '}
          <Link href="/terms" className="text-primary hover:underline">
            Terms & Conditions
          </Link>
          .
        </p>
      </div>
    </div>
  )
}
