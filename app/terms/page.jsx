import Link from 'next/link'
import { AnimatedSection } from '@/components/ui/AnimatedSection'

export const metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for JotilLabs AI-powered communication services, including TCPA compliance and AI disclosure.',
}

export default function TermsPage() {
  return (
    <>
      {/* Hero */}
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
              Terms & Conditions
            </h1>
            <p className="text-sm text-text-secondary mt-4">
              Last updated: March 15, 2025
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Content */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-6">
          <AnimatedSection>
            <div className="glass rounded-[20px] p-8 sm:p-12">
              <div className="glass-dark rounded-[12px] px-4 py-3 mb-10 text-sm text-text-secondary">
                Note: This is a template for informational purposes. Consult qualified
                legal counsel before publishing.
              </div>

              <div className="space-y-8 text-sm text-text-secondary leading-relaxed">
                {/* 1. Introduction */}
                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">
                    1. Introduction & Acceptance
                  </h2>
                  <p>
                    Welcome to Jotil Labs (&ldquo;Company,&rdquo; &ldquo;we,&rdquo;
                    &ldquo;us,&rdquo; or &ldquo;our&rdquo;). These Terms and Conditions
                    (&ldquo;Terms&rdquo;) govern your access to and use of the Jotil Labs
                    website, products, and services, including but not limited to our AI
                    voice agents, chatbots, SMS messaging systems, and CRM tools
                    (collectively, the &ldquo;Services&rdquo;).
                  </p>
                  <p className="mt-3">
                    By accessing or using our Services, you agree to be bound by these
                    Terms. If you do not agree to these Terms, you may not access or use
                    the Services.
                  </p>
                </div>

                {/* 2. Description of Services */}
                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">
                    2. Description of Services
                  </h2>
                  <p>
                    Jotil Labs provides AI-powered business communication and automation
                    services, including:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-1.5">
                    <li>AI Voice Agents for inbound and outbound telephone calls</li>
                    <li>AI-powered web chatbots for customer engagement</li>
                    <li>Automated SMS and text messaging services</li>
                    <li>AI-driven CRM and lead management tools</li>
                    <li>Smart ticketing and calendar scheduling systems</li>
                    <li>Enterprise automation and AI consultancy services</li>
                  </ul>
                </div>

                {/* 3. AI-Powered Communications */}
                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">
                    3. AI-Powered Communications Disclosure
                  </h2>
                  <p>
                    <strong className="text-text">
                      You acknowledge and understand that communications facilitated
                      through our Services may be generated, conducted, or assisted by
                      artificial intelligence (AI) technology.
                    </strong>
                  </p>
                  <p className="mt-3">
                    This includes, but is not limited to:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-1.5">
                    <li>Telephone calls that are answered, placed, or conducted by AI voice agents</li>
                    <li>SMS/text messages that are composed and sent by AI systems</li>
                    <li>Chat conversations that are handled by AI-powered chatbots</li>
                    <li>Automated responses and follow-up communications generated by AI</li>
                  </ul>
                  <p className="mt-3">
                    While our AI systems are designed to communicate naturally and
                    effectively, they are artificial intelligence systems and not human
                    agents. We strive for transparency in all AI-powered interactions.
                  </p>
                </div>

                {/* 4. Consent */}
                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">
                    4. Consent to Receive Communications
                  </h2>
                  <p>
                    By providing your phone number, email address, or other contact
                    information through our Services, website forms, or opt-in processes,
                    you expressly consent to receive communications from Jotil Labs and
                    its clients, including:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-1.5">
                    <li>AI-generated and AI-assisted telephone calls</li>
                    <li>Automated and AI-generated SMS/text messages</li>
                    <li>AI-powered chat communications</li>
                    <li>Service notifications and updates</li>
                  </ul>
                  <p className="mt-3">
                    This consent is provided in accordance with the Telephone Consumer
                    Protection Act (TCPA) and applicable state laws. For detailed
                    information about our consent and opt-in practices, please review
                    our{' '}
                    <Link href="/opt-in" className="text-primary hover:underline">
                      Opt-In Consent Policy
                    </Link>
                    .
                  </p>
                  <p className="mt-3">
                    Message and data rates may apply. Message frequency varies. You may
                    opt out at any time by replying STOP to any SMS message or by
                    contacting us at contact@jotillabs.com.
                  </p>
                </div>

                {/* 5. Data Collection */}
                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">
                    5. Data Collection & Privacy
                  </h2>
                  <p>
                    In the course of providing our Services, we collect and process
                    personal data including names, phone numbers, email addresses, and
                    communication records. Our Services integrate with and may share
                    data with third-party service providers including, but not limited to:
                  </p>
                  <ul className="list-disc list-inside mt-3 space-y-1.5">
                    <li><strong className="text-text">Twilio</strong> — for voice calling and SMS messaging infrastructure</li>
                    <li><strong className="text-text">Retell AI</strong> — for AI voice agent technology</li>
                    <li><strong className="text-text">OpenAI</strong> — for natural language processing and AI chat capabilities</li>
                  </ul>
                  <p className="mt-3">
                    We implement industry-standard security measures to protect your data.
                    Data is processed in accordance with applicable data protection laws.
                    For specific details about data handling, please refer to our Privacy
                    Policy.
                  </p>
                </div>

                {/* 6. Opt-Out */}
                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">
                    6. Opt-Out Instructions
                  </h2>
                  <p>You may opt out of communications at any time through the following methods:</p>
                  <ul className="list-disc list-inside mt-3 space-y-1.5">
                    <li><strong className="text-text">SMS:</strong> Reply STOP to any text message</li>
                    <li><strong className="text-text">Email:</strong> Contact contact@jotillabs.com with the subject line &ldquo;Opt Out&rdquo;</li>
                    <li><strong className="text-text">Phone:</strong> Request removal during any call with our team or AI agent</li>
                  </ul>
                  <p className="mt-3">
                    Opt-out requests will be processed within 10 business days. You may
                    continue to receive transactional or service-related communications
                    as permitted by law.
                  </p>
                </div>

                {/* 7. Intellectual Property */}
                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">
                    7. Intellectual Property
                  </h2>
                  <p>
                    All content, features, functionality, software, and technology
                    associated with our Services are owned by Jotil Labs or its licensors
                    and are protected by intellectual property laws. You may not copy,
                    modify, distribute, sell, or lease any part of our Services without
                    our express written consent.
                  </p>
                </div>

                {/* 8. Limitation of Liability */}
                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">
                    8. Limitation of Liability
                  </h2>
                  <p>
                    TO THE MAXIMUM EXTENT PERMITTED BY LAW, JOTIL LABS SHALL NOT BE
                    LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR
                    PUNITIVE DAMAGES ARISING FROM YOUR USE OF THE SERVICES. OUR TOTAL
                    LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SERVICES
                    IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.
                  </p>
                  <p className="mt-3">
                    AI-generated communications are provided &ldquo;as-is.&rdquo; While
                    we strive for accuracy, we do not guarantee that AI responses will be
                    error-free or suitable for all purposes.
                  </p>
                </div>

                {/* 9. Governing Law */}
                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">
                    9. Governing Law
                  </h2>
                  <p>
                    These Terms shall be governed by and construed in accordance with the
                    laws of the State of New York, without regard to its conflict of law
                    provisions. Any disputes arising under these Terms shall be subject to
                    the exclusive jurisdiction of the courts located in New York County,
                    New York.
                  </p>
                </div>

                {/* 10. Changes */}
                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">
                    10. Changes to These Terms
                  </h2>
                  <p>
                    We reserve the right to modify these Terms at any time. Material
                    changes will be communicated via email or through our website. Your
                    continued use of the Services after such changes constitutes
                    acceptance of the updated Terms.
                  </p>
                </div>

                {/* Contact */}
                <div>
                  <h2 className="text-lg font-semibold text-text mb-3">
                    Contact
                  </h2>
                  <p>
                    If you have questions about these Terms, please contact us at:
                  </p>
                  <p className="mt-3">
                    <strong className="text-text">Jotil Labs</strong><br />
                    Email:{' '}
                    <a href="mailto:contact@jotillabs.com" className="text-primary hover:underline">
                      contact@jotillabs.com
                    </a>
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
