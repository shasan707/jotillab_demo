'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react'

const INQUIRY_TYPES = [
  'General Inquiry',
  'Product Demo',
  'Enterprise Sales',
  'Technical Support',
  'Partnership',
]

const FAQ_ITEMS = [
  {
    question: 'How quickly can I get started with JotilLabs?',
    answer:
      'Most clients are live within 2–5 business days. After an initial setup call, we configure your AI agent, connect it to your phone number or website, and handle testing before go-live. No long implementation cycles.',
  },
  {
    question: 'Is JotilLabs TCPA and HIPAA compliant?',
    answer:
      'Yes. Our platform is built with regulatory compliance as a core design principle. SMS campaigns use opt-in flows aligned with TCPA and A2P 10DLC requirements. Healthcare clients can operate under a BAA arrangement. We are happy to discuss your specific compliance needs during a demo.',
  },
  {
    question: 'What integrations does JotilLabs support?',
    answer:
      'We integrate with 50+ platforms including major CRMs (HubSpot, Salesforce, Zoho), calendaring tools (Google Calendar, Calendly, Acuity), helpdesk platforms, and custom webhooks. JotilFlow can connect to virtually any API-enabled system.',
  },
  {
    question: 'Do I need technical expertise to use the platform?',
    answer:
      'No. All of our products are designed for business owners and operators, not developers. Our onboarding team handles the technical setup. Day-to-day usage is through a simple dashboard. For custom workflow automation (JotilFlow), a non-technical admin can manage most configurations.',
  },
]

function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: 'rgba(0,0,0,0.06)' }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-5 text-left bg-transparent border-none cursor-pointer gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 rounded-lg"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-text leading-snug pr-2">{question}</span>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-text-secondary"
        >
          <ChevronDown size={18} strokeWidth={1.5} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="text-sm text-text-secondary leading-relaxed pb-5">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function ContactForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    inquiryType: 'General Inquiry',
    message: '',
  })
  const [status, setStatus] = useState('idle') // 'idle' | 'loading' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState('')

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok || !data.ok) {
        throw new Error(data.error || 'Something went wrong.')
      }

      setStatus('success')
      setForm({ name: '', email: '', company: '', phone: '', inquiryType: 'General Inquiry', message: '' })
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Failed to send. Please try again.')
    }
  }

  const inputClass =
    'w-full rounded-[11px] px-4 py-3 text-sm text-text bg-white border outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10'
  const inputStyle = { border: '1px solid rgba(0,0,0,0.1)' }
  const labelClass = 'block text-xs font-semibold text-text mb-1.5 tracking-wide uppercase'

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-12">
        {/* Form (2/3 width) */}
        <div className="lg:col-span-2">
          <div className="card p-8 md:p-10">
            <h2 className="font-bold text-text text-xl mb-1">Send us a message</h2>
            <p className="text-sm text-text-secondary mb-8">
              Fill in the form and a member of our team will respond within one business day.
            </p>

            {status === 'success' ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-14 text-center"
              >
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-5"
                  style={{ background: 'rgba(56, 89, 168,0.1)' }}
                >
                  <CheckCircle2 size={28} color="#3859a8" strokeWidth={1.5} />
                </div>
                <h3 className="font-bold text-text text-lg mb-2">Message received</h3>
                <p className="text-sm text-text-secondary max-w-sm">
                  Thank you for reaching out. We will get back to you at{' '}
                  <span className="text-primary font-medium">contact@jotillabs.com</span> within one business day.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="mt-7 text-sm font-medium text-primary hover:underline bg-transparent border-none cursor-pointer"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-name" className={labelClass}>Full Name *</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Jane Smith"
                      value={form.name}
                      onChange={set('name')}
                      className={inputClass}
                      style={inputStyle}
                      disabled={status === 'loading'}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className={labelClass}>Email *</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="jane@company.com"
                      value={form.email}
                      onChange={set('email')}
                      className={inputClass}
                      style={inputStyle}
                      disabled={status === 'loading'}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="contact-company" className={labelClass}>Company</label>
                    <input
                      id="contact-company"
                      type="text"
                      placeholder="Acme Corp"
                      value={form.company}
                      onChange={set('company')}
                      className={inputClass}
                      style={inputStyle}
                      disabled={status === 'loading'}
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className={labelClass}>Phone</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      value={form.phone}
                      onChange={set('phone')}
                      className={inputClass}
                      style={inputStyle}
                      disabled={status === 'loading'}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-inquiry" className={labelClass}>Inquiry Type</label>
                  <div className="relative">
                    <select
                      id="contact-inquiry"
                      value={form.inquiryType}
                      onChange={set('inquiryType')}
                      className={`${inputClass} appearance-none pr-10 cursor-pointer`}
                      style={inputStyle}
                      disabled={status === 'loading'}
                    >
                      {INQUIRY_TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown
                      size={16}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className={labelClass}>Message *</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    placeholder="Tell us about your business and what you are hoping to automate..."
                    value={form.message}
                    onChange={set('message')}
                    className={`${inputClass} resize-none`}
                    style={inputStyle}
                    disabled={status === 'loading'}
                  />
                </div>

                {status === 'error' && (
                  <div
                    className="flex items-center gap-2.5 rounded-[11px] px-4 py-3 text-sm"
                    style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)', color: '#DC2626' }}
                  >
                    <AlertCircle size={16} strokeWidth={1.5} />
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-sm font-semibold text-white btn-gradient px-8 py-3.5 rounded-[11px] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/35 hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
                >
                  {status === 'loading' ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    'Send Message'
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar (1/3 width) */}
        <div className="space-y-5">
          {/* Contact info */}
          <div className="card p-7">
            <h3 className="font-semibold text-text mb-5">Contact Details</h3>
            <div className="space-y-4">
              <a
                href="mailto:contact@jotillabs.com"
                className="flex items-center gap-3 no-underline group"
              >
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(56, 89, 168,0.08)' }}
                >
                  <Mail size={16} color="#3859a8" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-0.5">Email</p>
                  <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                    contact@jotillabs.com
                  </p>
                </div>
              </a>

              <a
                href="tel:+13589000040"
                className="flex items-center gap-3 no-underline group"
              >
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(56, 89, 168,0.08)' }}
                >
                  <Phone size={16} color="#3859a8" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-0.5">Phone</p>
                  <p className="text-sm font-medium text-text group-hover:text-primary transition-colors">
                    +1 (358) 900-0040
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(56, 89, 168,0.08)' }}
                >
                  <MapPin size={16} color="#3859a8" strokeWidth={1.5} />
                </div>
                <div>
                  <p className="text-xs text-text-secondary mb-0.5">Location</p>
                  <p className="text-sm font-medium text-text">Lehi, Utah</p>
                </div>
              </div>
            </div>
          </div>

          {/* Book a Demo card with inline Calendly */}
          <div
            className="rounded-[20px] overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #3859a8, #2a4688)',
              boxShadow: '0 12px 40px rgba(56, 89, 168,0.35)',
            }}
          >
            <div className="p-7 pb-4">
              <h3 className="font-bold text-white text-base mb-2">Book a Live Demo</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                See our AI handle a real call in 15 minutes. No slides, no fluff.
              </p>
            </div>
            <div className="bg-white rounded-t-2xl p-1">
              <iframe
                src="https://calendly.com/jotillabs/15min?hide_gdpr_banner=1&hide_landing_page_details=1"
                width="100%"
                height="380"
                frameBorder="0"
                title="Book a demo with JotilLabs"
                className="rounded-xl"
                loading="lazy"
              />
            </div>
          </div>

          {/* Response time note */}
          <div
            className="glass-dark rounded-[16px] p-5"
          >
            <p className="text-xs text-text-secondary leading-relaxed">
              <span className="font-semibold text-text">Response time:</span> We reply to all inquiries within 1 business day. For urgent matters, call us directly at{' '}
              <a href="tel:+13589000040" className="text-primary no-underline font-medium">
                +1 (358) 900-0040
              </a>.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-20">
        <div className="text-center mb-12">
          <h2
            className="font-bold tracking-[-0.03em] text-text mb-3"
            style={{ fontSize: 'clamp(1.6rem, 3vw, 2.25rem)' }}
          >
            Frequently asked questions
          </h2>
          <p className="text-text-secondary text-sm">
            Quick answers to the questions we hear most often.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card p-8">
            {FAQ_ITEMS.map((item) => (
              <FAQItem key={item.question} {...item} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
