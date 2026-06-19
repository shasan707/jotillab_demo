import {
  UtensilsCrossed, Stethoscope, Home, Scale, Hotel,
  TrendingUp, ShoppingCart, Wrench,
} from 'lucide-react'

export const INDUSTRIES = [
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
    slug: 'dental-medical',
    name: 'Dental & Medical',
    icon: Stethoscope,
    badge: 'Dental & Medical Practices',
    tagline: 'Fewer no-shows, more booked appointments, happier patients.',
    heroDescription:
      'Patients call when your front desk is busiest. Our AI handles scheduling, reminders, and after-hours triage — HIPAA-aware and tuned to your practice.',
    problems: [
      {
        title: 'No-show rates near 20%',
        detail: 'Manual reminders take staff hours and patients still forget — losing thousands per chair per month.',
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
        detail: 'Patients book, reschedule, and confirm without waiting. Syncs with your existing PMS.',
        product: 'Receptionist',
      },
      {
        title: 'Smart reminders',
        detail: 'Personalized SMS reminders 48 hours and 4 hours before. Confirms or auto-rebooks.',
        product: 'Outreach',
      },
      {
        title: 'After-hours triage',
        detail: 'Routes urgent calls to on-call clinicians. Logs everything else for the morning.',
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
        title: 'Reminder confirms attendance',
        messages: [
          { from: 'ai', text: "Hi Mark, you're scheduled with Dr. Patel tomorrow at 10 AM. Reply YES to confirm or RESCHEDULE." },
          { from: 'caller', text: 'Yes' },
          { from: 'ai', text: "Great. See you then. I'll send a final reminder 4 hours before." },
        ],
      },
      {
        channel: 'web',
        title: 'After-hours urgency',
        messages: [
          { from: 'caller', text: 'I broke a crown — what should I do?' },
          { from: 'ai', text: 'I can connect you to our on-call dentist now or book the first slot tomorrow at 8 AM.' },
          { from: 'caller', text: 'Connect me, please.' },
          { from: 'ai', text: "Routing you to Dr. Patel. I'll log the issue in your chart." },
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
        q: 'Does it integrate with our practice management system?',
        a: 'We support Dentrix, Eaglesoft, Open Dental, Athenahealth, and most major systems. Appointments sync both ways.',
      },
      {
        q: 'What happens with insurance questions?',
        a: 'The AI gathers insurance details and routes complex questions to your billing team with full context.',
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
    slug: 'hospitality',
    name: 'Hospitality',
    icon: Hotel,
    badge: 'Hotels & Hospitality',
    tagline: 'Handle bookings and guest questions without extra desk staff.',
    heroDescription:
      'From the front desk to post-stay outreach, our AI handles reservations, concierge questions, and review collection — so your team stays present with guests in the lobby.',
    problems: [
      {
        title: 'Peak season breaks the desk',
        detail: 'Three calls ringing while a line builds at check-in. Someone always waits too long.',
      },
      {
        title: 'Concierge questions all night',
        detail: 'Late-night "where\'s the gym" and "what time is breakfast" interrupt overnight staff.',
      },
      {
        title: 'No follow-up, no reviews',
        detail: 'Guests check out and disappear. No personalized review request, no rebook outreach.',
      },
    ],
    solutions: [
      {
        title: 'AI front desk',
        detail: 'Handles bookings, modifications, and amenity questions in parallel. Sounds like your brand.',
        product: 'Receptionist',
      },
      {
        title: '24/7 concierge by text',
        detail: 'Guests text any question — pool hours, wifi, restaurant recs — and get an instant on-brand reply.',
        product: 'Messenger',
      },
      {
        title: 'Post-stay outreach',
        detail: 'Personalized review requests and rebooking offers. Loyalty enrollment without a phone call.',
        product: 'Outreach',
      },
    ],
    scenarios: [
      {
        channel: 'voice',
        title: 'Booking during a peak Friday',
        messages: [
          { from: 'caller', text: 'Do you have anything for two nights starting tomorrow?' },
          { from: 'ai', text: 'Yes. King suite at $289 or queen double at $229. Which fits?' },
          { from: 'caller', text: 'King suite.' },
          { from: 'ai', text: "Confirmed. Confirmation and check-in details just texted." },
        ],
      },
      {
        channel: 'sms',
        title: 'Late-night concierge',
        messages: [
          { from: 'caller', text: 'Is the gym open right now?' },
          { from: 'ai', text: '24-hour gym, 3rd floor. Use your room key for access.' },
          { from: 'caller', text: 'And breakfast tomorrow?' },
          { from: 'ai', text: '6:30-10 AM in the Garden Room. Free for suite guests.' },
        ],
      },
      {
        channel: 'web',
        title: 'Post-stay review',
        messages: [
          { from: 'ai', text: 'Hi Tom, hope you enjoyed your stay at Riverwalk. Mind sharing how it went?' },
          { from: 'caller', text: 'Loved it. Quiet room, great breakfast.' },
          { from: 'ai', text: 'Wonderful. Would you share that on TripAdvisor? Takes 30 seconds.' },
        ],
      },
    ],
    outcomes: [
      { value: 40, suffix: '%', label: 'fewer front-desk interruptions' },
      { value: 3, suffix: 'x', label: 'more direct bookings' },
      { value: 60, suffix: '%', label: 'review request response rate' },
      { value: 24, suffix: '/7', label: 'concierge availability' },
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
        q: 'Does it integrate with our PMS?',
        a: 'Yes. Mews, Cloudbeds, OPERA, and most major PMS platforms. Reservations and rates flow through your existing system.',
      },
      {
        q: 'Can it handle multiple languages?',
        a: 'Yes. English, Spanish, French, Mandarin, and German out of the box. Other languages on request.',
      },
      {
        q: 'How does it route to staff?',
        a: 'Complaints, special requests, and high-value bookings escalate to a manager with full transcript context.',
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
    slug: 'ecommerce',
    name: 'E-commerce',
    icon: ShoppingCart,
    badge: 'E-commerce',
    tagline: 'Recover carts. Send order updates. Handle returns without staff.',
    heroDescription:
      'Most carts get abandoned. Most "where\'s my order" tickets are simple. Our AI recovers checkouts, answers shipping questions, and processes returns — automatically.',
    problems: [
      {
        title: '70% of carts get abandoned',
        detail: 'Generic "you forgot something" emails barely move the needle. Most shoppers never come back.',
      },
      {
        title: 'Support drowns in tracking questions',
        detail: '"Where\'s my order?" and "When will it ship?" eat 60% of support tickets.',
      },
      {
        title: 'Returns process is slow + manual',
        detail: 'Customers wait days for return labels. Each request is hand-processed by a human.',
      },
    ],
    solutions: [
      {
        title: 'AI cart recovery',
        detail: 'Personalized SMS within minutes of abandonment. Includes the cart, an answer, sometimes a discount.',
        product: 'Outreach',
      },
      {
        title: 'Automated order updates',
        detail: 'Proactive shipping, tracking, and delivery notifications — without ticket creation.',
        product: 'Messenger',
      },
      {
        title: 'Self-service returns',
        detail: 'AI handles return requests, generates labels, and updates inventory automatically.',
        product: 'Flow',
      },
    ],
    scenarios: [
      {
        channel: 'sms',
        title: 'Cart recovery',
        messages: [
          { from: 'ai', text: 'Hi Priya, you left the navy backpack in your cart. Still interested?' },
          { from: 'caller', text: 'Yes — does it come in black?' },
          { from: 'ai', text: 'Yes. Want me to swap it? 10% off as a thank-you for coming back.' },
          { from: 'caller', text: 'Sold.' },
          { from: 'ai', text: 'Done. Checkout link just sent.' },
        ],
      },
      {
        channel: 'sms',
        title: 'Order tracking',
        messages: [
          { from: 'caller', text: "Where's my order?" },
          { from: 'ai', text: 'Order #4821 shipped yesterday via UPS, arriving Friday by 8 PM. Tracking: 1Z123...' },
          { from: 'caller', text: 'Can I change the delivery address?' },
          { from: 'ai', text: 'Yes if it hasn\'t been picked up. What\'s the new address?' },
        ],
      },
      {
        channel: 'web',
        title: 'Return request',
        messages: [
          { from: 'caller', text: "I need to return order #4821." },
          { from: 'ai', text: "Sorry it didn't work out. What\'s the reason?" },
          { from: 'caller', text: 'Wrong size.' },
          { from: 'ai', text: "Got it. Want a size exchange or refund?" },
          { from: 'caller', text: 'Exchange — medium please.' },
          { from: 'ai', text: 'Done. Label and exchange instructions just sent.' },
        ],
      },
    ],
    outcomes: [
      { value: 25, suffix: '%', label: 'cart recovery rate' },
      { value: 60, suffix: '%', label: 'fewer support tickets' },
      { value: 90, suffix: '%', label: 'returns handled without staff' },
      { value: 5, suffix: 'min', label: 'avg response time' },
    ],
    quote: {
      text: 'A quarter of every abandoned cart now turns into a paid order. The math is wild.',
      author: 'Priya Desai',
      role: 'Head of Growth',
      company: 'Looma',
    },
    products: ['messenger', 'outreach', 'flow'],
    faq: [
      {
        q: 'Does it work with Shopify?',
        a: 'Yes. Shopify, BigCommerce, Magento, WooCommerce, and most major platforms. Cart events flow in real-time.',
      },
      {
        q: 'How fast does cart recovery fire?',
        a: 'You set the timing. Most stores fire 15 minutes after abandonment, with a follow-up at 24 hours.',
      },
      {
        q: 'Can it handle international orders?',
        a: 'Yes. Multi-currency, multi-language. Customs and shipping rules update per region automatically.',
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
]

export function getIndustry(slug) {
  return INDUSTRIES.find((i) => i.slug === slug)
}

export function getRelatedIndustries(currentSlug, count = 3) {
  return INDUSTRIES.filter((i) => i.slug !== currentSlug).slice(0, count)
}

export const INDUSTRY_SLUGS = INDUSTRIES.map((i) => i.slug)
