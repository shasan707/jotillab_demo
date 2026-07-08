import {
  Scissors, TrendingUp, HeartPulse, Wrench, Scale,
  ClipboardCheck, Home, UtensilsCrossed, Store,
} from 'lucide-react'

export const INDUSTRIES = [
  {
    slug: 'beauty-spa',
    name: 'Beauty & Spa',
    icon: Scissors,
    badge: 'Beauty & Spa',
    tagline: 'Fill every chair. Turn missed calls into booked appointments.',
    heroDescription:
      'Clients call while your hands are busy. Your AI books appointments, protects your calendar from no-shows, and brings regulars back for their next visit, all without you touching the phone.',
    problems: [
      {
        title: 'Calls ring while hands are busy',
        detail: 'Mid-color, mid-massage, mid-manicure. Every missed call is a client booking with the salon down the street.',
      },
      {
        title: 'No-shows leave empty chairs',
        detail: 'A skipped appointment is an hour of lost revenue. Manual reminder texts get forgotten on busy days.',
      },
      {
        title: 'Regulars drift away quietly',
        detail: 'Without a nudge to rebook, six-week clients become twelve-week clients. Nobody has time to chase them.',
      },
    ],
    solutions: [
      {
        title: 'Booking that never misses',
        detail: 'Clients book, reschedule, and cancel by phone or text, any hour. Appointments land straight on your calendar.',
        product: 'Receptionist',
      },
      {
        title: 'Automatic no-show protection',
        detail: 'Confirmation texts at 48 and 4 hours. Cancellations reopen the slot and offer it to your waitlist.',
        product: 'Outreach',
      },
      {
        title: 'Rebooking and quick answers',
        detail: 'When a regular is due, the AI reaches out to rebook. Gift card, pricing, and service questions get instant replies.',
        product: 'Messenger',
      },
    ],
    scenarios: [
      {
        channel: 'voice',
        title: 'Booked while the chair stays busy',
        messages: [
          { from: 'caller', text: 'Hi, can I get a balayage with Dana this week?' },
          { from: 'ai', text: 'Dana has Thursday at 1 or Saturday at 10. Which works?' },
          { from: 'caller', text: 'Saturday at 10.' },
          { from: 'ai', text: 'Booked. Confirmation and prep tips just texted to you.' },
        ],
      },
      {
        channel: 'sms',
        title: 'Reminder fills a cancelled slot',
        messages: [
          { from: 'ai', text: 'Hi Elena, your massage is tomorrow at 2 PM. Reply YES to confirm or RESCHEDULE.' },
          { from: 'caller', text: 'Reschedule, something came up.' },
          { from: 'ai', text: 'No problem. Friday at 2 or Saturday at 11?' },
          { from: 'caller', text: 'Friday at 2.' },
          { from: 'ai', text: 'Done. Your old slot just went out to the waitlist.' },
        ],
      },
      {
        channel: 'web',
        title: 'Gift card question',
        messages: [
          { from: 'caller', text: 'Do you sell gift cards for the holidays?' },
          { from: 'ai', text: 'Yes, any amount from $25 up. Digital or printed card?' },
          { from: 'caller', text: 'Digital, $100 for my mom.' },
          { from: 'ai', text: 'Perfect. Payment link sent. It lands in her inbox the moment you finish checkout.' },
        ],
      },
    ],
    outcomes: [
      { value: 85, suffix: '%', label: 'of missed calls turned into bookings' },
      { value: 60, suffix: '%', label: 'fewer no-shows' },
      { value: 2, suffix: 'x', label: 'more regulars rebooked on time' },
      { value: 24, suffix: '/7', label: 'booking availability' },
    ],
    quote: {
      text: 'I used to lose bookings every time I had my hands in foils. Now the calendar fills itself while I work.',
      author: 'Dana Whitfield',
      role: 'Owner',
      company: 'Willow & Sage Salon',
    },
    products: ['receptionist', 'messenger', 'outreach'],
    faq: [
      {
        q: 'Does it work with our booking software?',
        a: 'Yes. Vagaro, Booksy, GlossGenius, Square Appointments, and most major systems. Appointments sync both ways.',
      },
      {
        q: 'Can clients request a specific stylist or therapist?',
        a: "Yes. The AI knows each team member's schedule and services, and books clients with their usual person by default.",
      },
      {
        q: 'What about deposits and cancellation policies?',
        a: 'Your policies are built in. The AI collects deposits at booking and explains your cancellation window in plain language.',
      },
    ],
  },

  {
    slug: 'finance-insurance',
    name: 'Finance & Insurance',
    icon: TrendingUp,
    badge: 'Finance & Insurance',
    tagline: 'Pre-qualify prospects. Book meetings that actually happen.',
    heroDescription:
      'Compliance is non-negotiable. Speed-to-lead is everything. Our AI qualifies prospects, books advisor meetings, and runs TCPA-compliant outreach — with audit trails built in.',
    problems: [
      {
        title: 'Slow lead response loses deals',
        detail: 'A 30-minute response time cuts conversion in half. Your advisors can\'t answer every form fill instantly.',
      },
      {
        title: 'No-show meetings cost thousands',
        detail: 'Each no-show is an hour of advisor time and a lost commission. Manual reminders are spotty.',
      },
      {
        title: 'Compliance is a constant tax',
        detail: 'TCPA, opt-in tracking, recordkeeping — every outreach campaign needs legal review.',
      },
    ],
    solutions: [
      {
        title: 'Instant prospect qualification',
        detail: 'AI calls every lead inside 60 seconds, qualifies fit, and books the right advisor.',
        product: 'Outreach',
      },
      {
        title: 'Smart meeting reminders',
        detail: 'Personalized SMS at 48 and 4 hours. Easy reschedule, automatic confirm-or-reroute.',
        product: 'Outreach',
      },
      {
        title: 'Compliant by default',
        detail: 'Built-in TCPA opt-in management, A2P 10DLC registration, and full audit trail per contact.',
        product: 'Outreach',
      },
    ],
    scenarios: [
      {
        channel: 'voice',
        title: 'New prospect callback',
        messages: [
          { from: 'ai', text: "Hi Mark, you requested info on retirement planning. Got 5 minutes to chat?" },
          { from: 'caller', text: 'Sure.' },
          { from: 'ai', text: 'What\'s your current age and target retirement age?' },
          { from: 'caller', text: '52 and 65.' },
          { from: 'ai', text: "Got it. Vanessa would be your fit. She has Tuesday at 3 or Thursday at 10." },
        ],
      },
      {
        channel: 'sms',
        title: 'Meeting reminder + reschedule',
        messages: [
          { from: 'ai', text: 'Hi Mark, your call with Vanessa is tomorrow at 3 PM. Reply YES to confirm or RESCHEDULE.' },
          { from: 'caller', text: 'reschedule' },
          { from: 'ai', text: 'No problem. Vanessa has Wed at 2 or Thu at 10. Which works?' },
          { from: 'caller', text: 'thu 10' },
          { from: 'ai', text: 'Confirmed. New invite just sent.' },
        ],
      },
      {
        channel: 'web',
        title: 'Insurance quote inquiry',
        messages: [
          { from: 'caller', text: "I'm shopping homeowners insurance for a new house." },
          { from: 'ai', text: 'I can pull a quote. What\'s the address and approximate purchase price?' },
          { from: 'caller', text: '1234 Oak Lane, $750K.' },
          { from: 'ai', text: "Got it. I'll text you 3 quotes and route you to an agent for binding." },
        ],
      },
    ],
    outcomes: [
      { value: 60, suffix: 's', label: 'speed to first lead callback' },
      { value: 70, suffix: '%', label: 'fewer missed meetings' },
      { value: 3, suffix: 'x', label: 'qualified prospects per advisor' },
      { value: 100, suffix: '%', label: 'TCPA-compliant outreach' },
    ],
    quote: {
      text: 'Compliance was our nightmare. JotilLabs handles opt-ins and recordkeeping out of the box.',
      author: 'Vanessa Brooks',
      role: 'Founder',
      company: 'Brooks Wealth Advisors',
    },
    products: ['outreach', 'receptionist', 'space'],
    faq: [
      {
        q: 'Is this TCPA-compliant?',
        a: 'Yes. Built-in opt-in capture, A2P 10DLC registration, suppression list management, and per-message audit trail.',
      },
      {
        q: 'Does it integrate with Salesforce Financial Services Cloud?',
        a: 'Yes. FSC, Wealthbox, Redtail, and most major finance CRMs. Activity logs sync to compliance recordkeeping.',
      },
      {
        q: 'Can it handle licensed sales conversations?',
        a: 'Pre-licensed conversations are AI. Anything requiring a license — quoting, binding, advice — routes to a human with context.',
      },
    ],
  },

  {
    slug: 'health-wellness',
    name: 'Health & Wellness',
    icon: HeartPulse,
    badge: 'Health & Wellness Practices',
    tagline: 'Fewer no-shows, more booked appointments, happier patients.',
    heroDescription:
      'Patients call when your front desk is busiest. Our AI handles scheduling, reminders, and after-hours coverage for dental offices, chiropractors, physical therapy clinics, and counseling practices. HIPAA-aware and tuned to how you work.',
    problems: [
      {
        title: 'No-show rates near 20%',
        detail: 'Manual reminders take staff hours and patients still forget, costing thousands per provider every month.',
      },
      {
        title: 'Phone tag for appointments',
        detail: 'Front desk plays voicemail tag with patients trying to reschedule, while in-office patients wait.',
      },
      {
        title: 'After-hours calls go cold',
        detail: 'Urgent patient calls outside hours get a voicemail. By morning, they\'ve booked elsewhere.',
      },
    ],
    solutions: [
      {
        title: 'AI scheduler 24/7',
        detail: 'Patients book, reschedule, and confirm without waiting. Syncs with the practice software you already use.',
        product: 'Receptionist',
      },
      {
        title: 'Smart reminders',
        detail: 'Personalized SMS reminders 48 hours and 4 hours before. Confirms or auto-rebooks.',
        product: 'Outreach',
      },
      {
        title: 'After-hours coverage',
        detail: 'Routes urgent calls to your on-call provider. Logs everything else for the morning.',
        product: 'Receptionist',
      },
    ],
    scenarios: [
      {
        channel: 'voice',
        title: 'Saturday afternoon booking',
        messages: [
          { from: 'caller', text: "Hi, I'd like to book a cleaning." },
          { from: 'ai', text: 'Sure. I have Tuesday at 10 or Thursday at 2.' },
          { from: 'caller', text: 'Tuesday at 10.' },
          { from: 'ai', text: "Booked with Dr. Patel. I'll text you a confirmation and intake link." },
        ],
      },
      {
        channel: 'sms',
        title: 'Physical therapy reschedule',
        messages: [
          { from: 'caller', text: 'I need to move my physical therapy session on Thursday.' },
          { from: 'ai', text: 'No problem. Alex has Friday at 9 or Monday at 4.' },
          { from: 'caller', text: 'Friday at 9.' },
          { from: 'ai', text: 'Done. New confirmation sent, and your exercise reminder moves with it.' },
        ],
      },
      {
        channel: 'web',
        title: 'New client inquiry after hours',
        messages: [
          { from: 'caller', text: 'Are you accepting new counseling clients?' },
          { from: 'ai', text: 'Yes. I can book an intake session now. Do you prefer mornings or evenings?' },
          { from: 'caller', text: 'Evenings.' },
          { from: 'ai', text: 'Thursday at 6 PM with Jordan is open. Booked, and your intake forms just went to your email.' },
        ],
      },
    ],
    outcomes: [
      { value: 70, suffix: '%', label: 'reduction in no-shows' },
      { value: 35, suffix: '%', label: 'more bookings after hours' },
      { value: 8, suffix: '+ hrs', label: 'front desk time freed weekly' },
      { value: 95, suffix: '%', label: 'patient satisfaction with AI' },
    ],
    quote: {
      text: 'Our no-show rate dropped by two-thirds. That alone paid for the whole platform in the first month.',
      author: 'Dr. Adrian Kowalski',
      role: 'Practice Owner',
      company: 'Lakeside Dental',
    },
    products: ['receptionist', 'messenger', 'outreach'],
    faq: [
      {
        q: 'Is this HIPAA-compliant?',
        a: 'Yes. We sign BAAs and follow HIPAA-aware data handling. PHI is never stored beyond required retention windows.',
      },
      {
        q: 'Does it integrate with our practice software?',
        a: 'We support Dentrix, Open Dental, Jane, WebPT, SimplePractice, Athenahealth, and most major systems. Appointments sync both ways.',
      },
      {
        q: 'What happens with insurance questions?',
        a: 'The AI gathers insurance details and routes complex questions to your billing team with full context.',
      },
    ],
  },

  {
    slug: 'home-services',
    name: 'Home Services',
    icon: Wrench,
    badge: 'Home Services',
    tagline: 'Book jobs after hours. Dispatch the right crew without lifting a phone.',
    heroDescription:
      'Pipes burst at 2 AM. ACs fail on the hottest day. Our AI captures emergency calls, books quotes, and dispatches the right tech — so you never lose a weekend lead again.',
    problems: [
      {
        title: 'After-hours leads go cold',
        detail: 'Emergency calls during nights and weekends hit voicemail. By Monday, the customer called your competitor.',
      },
      {
        title: 'Dispatch is a juggling act',
        detail: 'Coordinating tech availability, job urgency, and routing eats hours of office time daily.',
      },
      {
        title: 'No follow-up, no recurring work',
        detail: 'Annual maintenance reminders are manual and skipped. Recurring revenue leaks every year.',
      },
    ],
    solutions: [
      {
        title: 'Emergency call capture',
        detail: 'AI triages urgency 24/7, gathers job details, and routes the right tech with photos.',
        product: 'Receptionist',
      },
      {
        title: 'Auto quote scheduling',
        detail: 'Books in-home quotes around tech routes. Confirms with customer and dispatches with all context.',
        product: 'Receptionist',
      },
      {
        title: 'Service reminder outreach',
        detail: 'Annual maintenance, filter changes, and renewal outreach run automatically.',
        product: 'Outreach',
      },
    ],
    scenarios: [
      {
        channel: 'voice',
        title: '2 AM burst pipe',
        messages: [
          { from: 'caller', text: 'My basement is flooding!' },
          { from: 'ai', text: 'Shut off the main valve if you can. Is anyone hurt?' },
          { from: 'caller', text: 'No. Just the pipe burst.' },
          { from: 'ai', text: "Tech dispatched. ETA 45 minutes. I'll text you their info now." },
        ],
      },
      {
        channel: 'sms',
        title: 'Quote scheduling',
        messages: [
          { from: 'caller', text: 'I need a quote on a new water heater install.' },
          { from: 'ai', text: 'Got it. Tank or tankless? And when does the current one need replacement?' },
          { from: 'caller', text: 'Tankless, this month if possible.' },
          { from: 'ai', text: "Tomorrow 2 PM or Thursday 10 AM for a quote visit?" },
        ],
      },
      {
        channel: 'web',
        title: 'Annual maintenance reminder',
        messages: [
          { from: 'ai', text: 'Hi Mike, your AC tune-up is due. Want to book before peak season?' },
          { from: 'caller', text: 'Yeah, schedule it.' },
          { from: 'ai', text: 'Tech available Friday at 9 or Saturday at 11. Which works?' },
        ],
      },
    ],
    outcomes: [
      { value: 90, suffix: '%', label: 'after-hours bookings captured' },
      { value: 4, suffix: 'x', label: 'maintenance plan signups' },
      { value: 30, suffix: '%', label: 'more emergency jobs booked' },
      { value: 20, suffix: '+ hrs', label: 'office time freed weekly' },
    ],
    quote: {
      text: 'After-hours calls now turn into Monday-morning jobs. We stopped losing weekend leads cold.',
      author: 'Mike Andersson',
      role: 'Owner',
      company: 'Andersson HVAC',
    },
    products: ['receptionist', 'messenger', 'outreach'],
    faq: [
      {
        q: 'Does it integrate with our dispatch software?',
        a: 'Yes. ServiceTitan, Housecall Pro, Jobber, and most major platforms. Jobs and customers sync both ways.',
      },
      {
        q: 'Can it triage urgency correctly?',
        a: 'Yes. Floods, gas leaks, and no-heat-in-winter route as emergencies. Quotes and routine work go to scheduling.',
      },
      {
        q: 'How does it handle recurring jobs?',
        a: 'Maintenance plans, filter changes, and seasonal tune-ups all auto-schedule based on customer history.',
      },
    ],
  },

  {
    slug: 'legal',
    name: 'Legal',
    icon: Scale,
    badge: 'Legal Practices',
    tagline: 'Capture intakes the first time. Free your team for billable work.',
    heroDescription:
      'Every missed intake call is a lost case. Our AI handles new client screening, books consultations, and answers process questions — so your paralegals can focus on legal work.',
    problems: [
      {
        title: 'Intakes lost to voicemail',
        detail: 'Potential clients calling at night or in crisis hang up at voicemail and call the next firm.',
      },
      {
        title: 'Front desk drowning in scheduling',
        detail: 'Booking consults, rescheduling depositions, sending reminders — all interrupting billable work.',
      },
      {
        title: 'Same questions, every day',
        detail: '"How much does it cost?" "What documents do I bring?" Hours per week answering basics.',
      },
    ],
    solutions: [
      {
        title: '24/7 intake automation',
        detail: 'AI captures full case details, conflict checks, and contact info on the first call — any hour.',
        product: 'Receptionist',
      },
      {
        title: 'Self-service consultations',
        detail: 'Clients book, reschedule, and pay deposits without staff involvement.',
        product: 'Receptionist',
      },
      {
        title: 'Process FAQ answers',
        detail: 'AI handles fee questions, document checklists, and procedural FAQs by call or chat.',
        product: 'Messenger',
      },
    ],
    scenarios: [
      {
        channel: 'voice',
        title: 'After-hours intake',
        messages: [
          { from: 'caller', text: 'I need to file for divorce. Are you taking new clients?' },
          { from: 'ai', text: "Yes. I'll capture some details and book a consult. What state and county?" },
          { from: 'caller', text: 'King County, Washington.' },
          { from: 'ai', text: "Got it. I'll run a quick conflict check and send a consult link to your phone." },
        ],
      },
      {
        channel: 'sms',
        title: 'Document checklist question',
        messages: [
          { from: 'caller', text: 'What do I need to bring to the consult?' },
          { from: 'ai', text: 'For employment cases: contract, termination letter, recent pay stubs, and any HR communications.' },
          { from: 'caller', text: 'Got it. Can I upload digitally?' },
          { from: 'ai', text: 'Yes — secure portal link sent.' },
        ],
      },
      {
        channel: 'web',
        title: 'Rescheduling a deposition',
        messages: [
          { from: 'caller', text: 'I need to move my deposition next Tuesday.' },
          { from: 'ai', text: 'Let me check with attorney Park. Your options are Wed at 2 or Thu at 10.' },
          { from: 'caller', text: 'Wednesday at 2.' },
          { from: 'ai', text: 'Done. New calendar invite sent. Court reporter rebooking.' },
        ],
      },
    ],
    outcomes: [
      { value: 60, suffix: '%', label: 'of intakes handled without staff' },
      { value: 100, suffix: '%', label: 'after-hours capture rate' },
      { value: 15, suffix: '+ hrs', label: 'paralegal time freed weekly' },
      { value: 2, suffix: 'x', label: 'consultations booked per week' },
    ],
    quote: {
      text: 'We capture every intake now, even at 2 AM. Our paralegals get to focus on real legal work.',
      author: 'Helena Park',
      role: 'Managing Partner',
      company: 'Park & Vasquez',
    },
    products: ['receptionist', 'messenger', 'space'],
    faq: [
      {
        q: 'How does conflict checking work?',
        a: 'Names, opposing parties, and matter types are checked against your firm database during intake. Conflicts flag instantly.',
      },
      {
        q: 'Is intake data privileged?',
        a: 'Yes. Conversations are treated as attorney-client communications. Storage and access controls are configurable per matter type.',
      },
      {
        q: 'Does it integrate with Clio or PracticePanther?',
        a: 'Yes. Clio, PracticePanther, MyCase, and most major practice management platforms. Matters and contacts sync.',
      },
    ],
  },

  {
    slug: 'personal-secretary',
    name: 'Personal Secretary',
    icon: ClipboardCheck,
    badge: 'Solo Professionals',
    tagline: 'Your own secretary. Answering, scheduling, and following up while you work.',
    heroDescription:
      'When you are with a client, everyone else hears voicemail. Your AI secretary answers every call in your name, screens what matters, books meetings straight into your calendar, and keeps every follow-up on time.',
    problems: [
      {
        title: 'You are the whole front office',
        detail: 'Every call, text, and follow-up lands on you. Client time and admin time fight for the same hours.',
      },
      {
        title: 'Calls come when you cannot answer',
        detail: 'Showings, client meetings, closings. The moments you are busiest are exactly when new business calls.',
      },
      {
        title: 'Follow-ups slip through the cracks',
        detail: 'Prospects who needed one more touch go quiet. A warm pipeline goes cold one forgotten call at a time.',
      },
    ],
    solutions: [
      {
        title: 'Every call answered in your name',
        detail: 'The AI picks up as your office, screens the caller, and handles routine questions on the spot.',
        product: 'Receptionist',
      },
      {
        title: 'Meetings booked while you work',
        detail: 'It checks your live calendar, books the meeting, and sends confirmations without interrupting you once.',
        product: 'Receptionist',
      },
      {
        title: 'Follow-ups that never slip',
        detail: 'Check-in texts, meeting reminders, and rebooking nudges go out on schedule. Your pipeline stays warm on its own.',
        product: 'Outreach',
      },
    ],
    scenarios: [
      {
        channel: 'voice',
        title: 'Answered during a client meeting',
        messages: [
          { from: 'caller', text: 'Hi, is Rachel available? I want to talk about listing my house.' },
          { from: 'ai', text: "She's with a client right now. I can book you a call at 4 today or 9:30 tomorrow." },
          { from: 'caller', text: 'Today at 4 works.' },
          { from: 'ai', text: "Booked. She'll have your address and goals in front of her when she calls." },
        ],
      },
      {
        channel: 'sms',
        title: 'Follow-up that lands on time',
        messages: [
          { from: 'ai', text: 'Hi Susan, following up for Daniel on the plan review you discussed. He has Tuesday at 11 or Wednesday at 3.' },
          { from: 'caller', text: 'Wednesday at 3.' },
          { from: 'ai', text: 'Booked. Calendar invite and the document checklist are on the way.' },
        ],
      },
      {
        channel: 'web',
        title: 'New lead screened and booked',
        messages: [
          { from: 'caller', text: "I got Daniel's name from a friend. Do I need a minimum to work with him?" },
          { from: 'ai', text: 'No minimum for a first conversation. Want me to set up a 20-minute intro call?' },
          { from: 'caller', text: 'Sure, sometime next week.' },
          { from: 'ai', text: "Monday at 10 is open. Booked. He'll come prepared for your questions." },
        ],
      },
    ],
    outcomes: [
      { value: 100, suffix: '%', label: 'of calls answered, even mid-meeting' },
      { value: 10, suffix: '+ hrs', label: 'of admin time back weekly' },
      { value: 2, suffix: 'x', label: 'more meetings on the calendar' },
      { value: 24, suffix: '/7', label: 'coverage while you work' },
    ],
    quote: {
      text: 'It runs my day like a full-time assistant. Calls answered, meetings booked, follow-ups sent, and I never touched my phone.',
      author: 'Rachel Odom',
      role: 'Realtor',
      company: 'Odom Homes',
    },
    products: ['receptionist', 'messenger', 'outreach'],
    faq: [
      {
        q: 'Does it sound like a bot answering my line?',
        a: 'No. It answers in your business name with a natural voice you choose, and callers can always reach you directly for anything urgent.',
      },
      {
        q: 'How does it know what to prioritize?',
        a: 'You set the rules. Hot leads and existing clients get through or get flagged instantly. Everything else becomes a tidy summary.',
      },
      {
        q: 'Will it work with my calendar?',
        a: 'Yes. Google Calendar, Outlook, and most scheduling tools. It only books the slots you leave open.',
      },
    ],
  },

  {
    slug: 'real-estate',
    name: 'Real Estate',
    icon: Home,
    badge: 'Real Estate',
    tagline: 'Qualify leads instantly. Book tours without the back-and-forth.',
    heroDescription:
      'Inbound buyers want answers in minutes, not hours. Your AI agent qualifies leads, answers listing questions, and books tours — so your agents only talk to ready buyers.',
    problems: [
      {
        title: 'Hot leads go cold in an hour',
        detail: 'Buyers fill a form, then call three other agents. Speed-to-lead determines who closes the deal.',
      },
      {
        title: 'Agents drown in tire-kickers',
        detail: 'Every "just looking" inquiry eats hours. Real buyers get the same generic email blast.',
      },
      {
        title: 'Tour booking is a phone-tag mess',
        detail: 'Coordinating buyer + listing agent + seller schedules takes 4-5 calls per showing.',
      },
    ],
    solutions: [
      {
        title: 'Instant lead qualification',
        detail: 'AI calls every new lead within 60 seconds, scores intent, and routes the hot ones to agents.',
        product: 'Outreach',
      },
      {
        title: '24/7 listing answers',
        detail: 'Buyers get instant answers about square footage, schools, HOA, and tax history — by call or text.',
        product: 'Messenger',
      },
      {
        title: 'Auto tour booking',
        detail: 'AI checks listing agent availability, syncs with your team calendar, sends confirmations all-around.',
        product: 'Receptionist',
      },
    ],
    scenarios: [
      {
        channel: 'voice',
        title: 'New lead callback in 60 seconds',
        messages: [
          { from: 'ai', text: "Hi Sarah, you inquired about 1234 Oak Lane. Got 2 minutes to chat?" },
          { from: 'caller', text: 'Sure. Is it still on the market?' },
          { from: 'ai', text: 'Yes. Are you pre-approved, and what neighborhoods are you considering?' },
          { from: 'caller', text: 'Pre-approved up to $850K. Westside or downtown.' },
          { from: 'ai', text: "Perfect. I'll have Tomás call you at 3 to schedule a tour." },
        ],
      },
      {
        channel: 'sms',
        title: 'Listing question on a Sunday',
        messages: [
          { from: 'caller', text: 'What schools are zoned for 1234 Oak Lane?' },
          { from: 'ai', text: 'Westside Elementary, Lincoln Middle, and Roosevelt High. All A-rated. Want the school report?' },
          { from: 'caller', text: 'Yes — and book a tour Saturday?' },
          { from: 'ai', text: '11 AM or 2 PM Saturday. Which works?' },
        ],
      },
      {
        channel: 'web',
        title: 'Showing coordination',
        messages: [
          { from: 'caller', text: 'Can I see 1234 Oak Lane today?' },
          { from: 'ai', text: 'Listing agent has 4 PM open. Can I confirm with the seller and text you back in 5?' },
          { from: 'ai', text: '[5 min later] Confirmed. 4 PM today. Address and access details just sent.' },
        ],
      },
    ],
    outcomes: [
      { value: 60, suffix: 's', label: 'speed to first lead callback' },
      { value: 3, suffix: 'x', label: 'more qualified leads per agent' },
      { value: 45, suffix: '%', label: 'more tours booked' },
      { value: 24, suffix: '/7', label: 'listing answers available' },
    ],
    quote: {
      text: 'My agents spend their time closing, not screening. Every lead they get is already pre-qualified.',
      author: 'Tomás Rivera',
      role: 'Broker',
      company: 'Coastal Properties',
    },
    products: ['outreach', 'receptionist', 'messenger'],
    faq: [
      {
        q: 'Does it integrate with our CRM?',
        a: 'Yes. Salesforce, HubSpot, Follow Up Boss, KvCORE, and most major real estate CRMs. Lead data syncs both ways.',
      },
      {
        q: 'How does it pull listing data?',
        a: 'Direct MLS integration where supported, or via your IDX feed. Listing details stay current automatically.',
      },
      {
        q: 'Can each agent have their own AI?',
        a: 'Yes. Per-agent voices, scripts, and routing rules. Leads stay attached to the right agent end to end.',
      },
    ],
  },

  {
    slug: 'restaurant',
    name: 'Restaurant',
    icon: UtensilsCrossed,
    badge: 'Restaurants',
    tagline: 'Fill tables. Capture every order. Keep guests coming back.',
    heroDescription:
      'Stop losing reservations to missed calls. Your AI host takes bookings, walks customers through the menu, and follows up after every visit — sounding like part of your team.',
    problems: [
      {
        title: '40% of calls ring out',
        detail: 'Hosts are seating tables, not picking up. Reservations leak to competitors at the busiest hours.',
      },
      {
        title: 'Phone orders interrupt service',
        detail: 'Re-reading the menu over the phone pulls staff off the floor and slows down dine-in guests.',
      },
      {
        title: 'No time for follow-up',
        detail: 'No texts after a visit means missed Google reviews, no birthday returns, no loyalty.',
      },
    ],
    solutions: [
      {
        title: 'AI host on every line',
        detail: 'Books tables, modifies reservations, sends confirmations — natively in OpenTable, Resy, or Tock.',
        product: 'Receptionist',
      },
      {
        title: 'Order-by-text',
        detail: 'Customers text your number, the AI walks them through the menu and locks in pickup or delivery.',
        product: 'Messenger',
      },
      {
        title: 'Auto guest follow-up',
        detail: 'Personalized texts after each visit. Review requests, returning offers, birthday outreach.',
        product: 'Outreach',
      },
    ],
    scenarios: [
      {
        channel: 'voice',
        title: 'Friday night reservation',
        messages: [
          { from: 'caller', text: 'Hi, do you have a table for 4 at 7 tonight?' },
          { from: 'ai', text: 'I have 7:00 or 7:30 Friday. Which works?' },
          { from: 'caller', text: '7:30 works.' },
          { from: 'ai', text: 'Booked. Confirmation just sent to your phone.' },
        ],
      },
      {
        channel: 'sms',
        title: 'Allergy question on a Saturday',
        messages: [
          { from: 'caller', text: 'Are your gluten-free options celiac-safe?' },
          { from: 'ai', text: 'Pasta and bread are GF, prepared on a separate surface. Kitchen flags allergies on the ticket.' },
          { from: 'caller', text: 'Perfect. Book us Saturday at 8?' },
          { from: 'ai', text: "Done. I'll note the allergy on your reservation." },
        ],
      },
      {
        channel: 'web',
        title: 'Post-visit review',
        messages: [
          { from: 'ai', text: 'Hi Jane, thanks for dining with us. How was everything?' },
          { from: 'caller', text: 'Loved it! The salmon was incredible.' },
          { from: 'ai', text: 'So glad. Mind leaving a quick Google review?' },
          { from: 'caller', text: 'Sure — link?' },
        ],
      },
    ],
    outcomes: [
      { value: 80, suffix: '%', label: 'fewer missed reservations' },
      { value: 24, suffix: '/7', label: 'booking availability' },
      { value: 3, suffix: 'x', label: 'more review requests' },
      { value: 12, suffix: '+ hrs', label: 'host time freed weekly' },
    ],
    quote: {
      text: 'We never miss a reservation now. Tuesdays I used to find 8-10 missed calls. Those bookings just happen.',
      author: 'Marisa Chen',
      role: 'Owner',
      company: 'Casa Vista',
    },
    products: ['receptionist', 'messenger', 'outreach'],
    faq: [
      {
        q: 'Can it handle our specific menu?',
        a: 'Yes. We feed your menu, allergens, and operating hours into the AI during setup. It speaks your specific dishes.',
      },
      {
        q: 'Does it integrate with our reservation system?',
        a: 'OpenTable, Resy, Tock, and most major systems are supported. Bookings flow directly into your existing setup.',
      },
      {
        q: 'Can it transfer to a human?',
        a: 'Always. Special requests, complaints, and edge cases route to your floor manager with full conversation context.',
      },
    ],
  },

  {
    slug: 'small-business',
    name: 'Small Business',
    icon: Store,
    badge: 'Local Businesses',
    tagline: 'Every call answered, every booking captured, whatever business you run.',
    heroDescription:
      'Hotels, event venues, dealerships, and every local business in between. Your AI answers the phone, books reservations, tours, and test drives, and follows up with customers, so nothing walks away unanswered.',
    problems: [
      {
        title: 'Peak hours break the phones',
        detail: 'Three calls ringing while a customer stands at the counter. Someone always waits too long, and some hang up for good.',
      },
      {
        title: 'Same questions, all day long',
        detail: 'Hours, availability, pricing, directions. Simple questions eat the time your team needs for in-person customers.',
      },
      {
        title: 'No follow-up, no repeat business',
        detail: 'Customers visit once and disappear. No review request, no reminder, no reason to come back.',
      },
    ],
    solutions: [
      {
        title: 'AI receptionist on every line',
        detail: 'Books rooms, tours, test drives, and appointments in parallel. Sounds like your brand.',
        product: 'Receptionist',
      },
      {
        title: 'Instant answers by text',
        detail: 'Customers text any question, hours, pricing, availability, and get an on-brand reply in seconds.',
        product: 'Messenger',
      },
      {
        title: 'Automatic follow-up',
        detail: 'Review requests, rebooking offers, and event reminders go out on their own.',
        product: 'Outreach',
      },
    ],
    scenarios: [
      {
        channel: 'voice',
        title: 'Weekend booking rush',
        messages: [
          { from: 'caller', text: 'Do you have anything for two nights starting tomorrow?' },
          { from: 'ai', text: 'Yes. King suite at $289 or queen double at $229. Which fits?' },
          { from: 'caller', text: 'King suite.' },
          { from: 'ai', text: 'Confirmed. Confirmation and check-in details just texted.' },
        ],
      },
      {
        channel: 'sms',
        title: 'Test drive booked after close',
        messages: [
          { from: 'caller', text: 'Is the blue 2023 Outback still on the lot?' },
          { from: 'ai', text: 'It is. Want to take it out? I can book you a test drive for tomorrow.' },
          { from: 'caller', text: 'Tomorrow at noon.' },
          { from: 'ai', text: 'Booked. Ask for Marcus at the front desk, the car will be ready.' },
        ],
      },
      {
        channel: 'web',
        title: 'Event space inquiry',
        messages: [
          { from: 'caller', text: 'Can your venue hold a 120-person wedding reception in October?' },
          { from: 'ai', text: 'Yes. October 10 and 24 are open. Want a tour before you decide?' },
          { from: 'caller', text: 'The 24th, and yes to the tour.' },
          { from: 'ai', text: 'Tour booked for Saturday at 2. Pricing sheet and floor plan just sent.' },
        ],
      },
    ],
    outcomes: [
      { value: 100, suffix: '%', label: 'of calls answered, even at peak' },
      { value: 3, suffix: 'x', label: 'more direct bookings' },
      { value: 40, suffix: '%', label: 'fewer front-desk interruptions' },
      { value: 24, suffix: '/7', label: 'availability for customers' },
    ],
    quote: {
      text: 'Peak season used to break us. Now the AI handles three calls at once and the desk team can be present.',
      author: 'Jordan Albright',
      role: 'General Manager',
      company: 'The Riverwalk Inn',
    },
    products: ['receptionist', 'messenger', 'outreach'],
    faq: [
      {
        q: 'Will it work for my type of business?',
        a: 'If customers call, text, or book with you, yes. Setup tunes the AI to your services, hours, pricing, and the way you talk to customers.',
      },
      {
        q: 'Does it connect to the tools we already use?',
        a: 'Most major booking, calendar, and customer systems are supported. Bookings and customer details flow into your existing setup.',
      },
      {
        q: 'How does it hand off to my team?',
        a: 'Complaints, special requests, and big-ticket conversations route to the right person with the full conversation attached.',
      },
    ],
  },
]

export function getIndustry(slug) {
  return INDUSTRIES.find((i) => i.slug === slug)
}

export function getRelatedIndustries(currentSlug, count = 3) {
  return INDUSTRIES.filter((i) => i.slug !== currentSlug).slice(0, count)
}

export const INDUSTRY_SLUGS = INDUSTRIES.map((i) => i.slug)
