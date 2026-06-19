import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export const metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for JotilLabs - how we collect, use, and protect your data across AI voice, chat, and SMS services.',
}

export default function PrivacyPage() {
  return (
    <>
      <section className="relative pt-36 pb-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div
            className="absolute w-[400px] h-[400px] opacity-15"
            style={{
              top: '-5%',
              right: '10%',
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 60%)',
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
              Privacy Policy
            </h1>
            <p className="text-sm text-text-secondary mt-4">
              Last updated: March 15, 2025
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection>
            <div className="glass rounded-[20px] p-8 sm:p-12">
              <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">1. Overview</h2>
                  <p>
                    Jotil Labs (&ldquo;Jotil Labs,&rdquo; &ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;)
                    values your privacy. This Privacy Policy explains what information we collect,
                    how we use it, and your choices when you use our website and services,
                    including AI voice, AI chat, and SMS communications.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">2. Information We Collect</h2>
                  <p>We may collect the following categories of information:</p>
                  <ul className="list-disc list-inside mt-3 space-y-1.5">
                    <li>Contact information (name, phone number, email address)</li>
                    <li>Communication data (SMS, call metadata, support messages, chatbot transcripts)</li>
                    <li>Device and usage data (IP address, browser type, pages visited, timestamps)</li>
                    <li>Business information you provide through forms, demos, and onboarding</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">3. How We Use Information</h2>
                  <p>We use personal information to:</p>
                  <ul className="list-disc list-inside mt-3 space-y-1.5">
                    <li>Provide and improve our products and services</li>
                    <li>Send service, support, and account-related communications</li>
                    <li>Deliver opted-in SMS and voice communications</li>
                    <li>Maintain security, prevent abuse, and comply with legal obligations</li>
                    <li>Analyze usage and performance of our website and services</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">4. Twilio and Communication Providers</h2>
                  <p>
                    We use third-party providers, including <strong className="text-text">Twilio</strong>,
                    to support voice and SMS functionality. When you interact with our communication
                    services, relevant data (such as phone numbers, message content, call records,
                    timestamps, and delivery status) may be processed by these providers on our behalf.
                  </p>
                  <p className="mt-3">
                    We only use this data for legitimate business purposes such as communication
                    delivery, service operations, troubleshooting, and compliance.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">5. SMS Consent and Opt-Out</h2>
                  <p>
                    We only send SMS messages where consent is provided or otherwise permitted by law.
                    Message and data rates may apply. Message frequency may vary.
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-1.5">
                    <li>To opt out of SMS, reply <strong className="text-text">STOP</strong> to any message</li>
                    <li>For help, reply <strong className="text-text">HELP</strong> or email contact@jotillabs.com</li>
                  </ul>
                  <p className="mt-3">
                    For additional consent details, review our{' '}
                    <Link href="/opt-in" className="text-primary hover:underline">
                      Opt-In Consent Policy
                    </Link>
                    .
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">6. Sharing of Information</h2>
                  <p>
                    We do not sell personal information. We may share information with service
                    providers and integration partners only as needed to operate our services,
                    meet contractual obligations, protect rights and safety, and comply with law.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">7. Data Retention</h2>
                  <p>
                    We retain information only as long as needed for operational, legal, and
                    compliance purposes. Retention periods vary by data type, service context,
                    and applicable legal requirements.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">8. Data Security</h2>
                  <p>
                    We use reasonable administrative, technical, and organizational safeguards
                    to protect personal information. No method of transmission or storage is
                    completely secure, and we cannot guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">9. Your Rights and Choices</h2>
                  <p>
                    Depending on your location, you may have rights to request access, correction,
                    deletion, or restriction of certain personal information. To submit a request,
                    contact us at contact@jotillabs.com.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">10. Changes to this Policy</h2>
                  <p>
                    We may update this Privacy Policy from time to time. Updates become effective
                    when posted on this page. Continued use of our services after updates indicates
                    acceptance of the revised policy.
                  </p>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">Contact</h2>
                  <p>If you have privacy questions, contact us at:</p>
                  <p className="mt-3">
                    <strong className="text-text">Jotil Labs</strong><br />
                    Email: contact@jotillabs.com
                  </p>
                  <p className="mt-4 text-xs text-text-secondary">
                    Related legal pages:{' '}
                    <Link href="/terms" className="text-primary hover:underline">Terms &amp; Conditions</Link>
                    {' '}&bull;{' '}
                    <Link href="/opt-in" className="text-primary hover:underline">Opt-In Consent</Link>
                  </p>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </>
  )
}
