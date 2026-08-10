/* Intake form question sets for the industry pages (/use-cases/[slug]).
   Every industry shares the same core questions; each industry adds 3
   tailored questions so the sales team gets a qualified lead.
   Question shape: { id, label, type, options?, required, placeholder? }
   type: 'text' | 'email' | 'tel' | 'select' | 'textarea' */

const CONTACT_QUESTIONS = [
  { id: 'business_name', label: 'Business name', type: 'text', required: true, placeholder: 'Acme Salon' },
  { id: 'contact_name', label: 'Your name', type: 'text', required: true, placeholder: 'Jane Smith' },
  { id: 'contact_email', label: 'Email', type: 'email', required: true, placeholder: 'jane@company.com' },
  { id: 'contact_phone', label: 'Phone', type: 'tel', required: true, placeholder: '+1 (555) 000-0000' },
]

const OPERATIONS_QUESTIONS = [
  {
    id: 'locations',
    label: 'How many locations do you have?',
    type: 'select',
    options: ['1 location', '2 to 5 locations', '6 or more locations'],
    required: true,
  },
  {
    id: 'daily_volume',
    label: 'Roughly how many calls and messages come in per day?',
    type: 'select',
    options: ['Under 20', '20 to 50', 'More than 50', 'Not sure'],
    required: true,
  },
  {
    id: 'pain_point',
    label: 'What is your biggest headache today?',
    type: 'select',
    options: ['Missed calls', 'Slow replies to messages', 'No-shows', 'Manual scheduling', 'Something else'],
    required: true,
  },
]

const FIT_QUESTIONS = [
  {
    id: 'timeline',
    label: 'When would you like to get started?',
    type: 'select',
    options: ['As soon as possible', 'This month', 'This quarter', 'Just exploring'],
    required: true,
  },
  {
    id: 'budget',
    label: 'Monthly budget range',
    type: 'select',
    options: ['Under $500', '$500 to $2,000', 'More than $2,000', 'Not sure yet'],
    required: false,
  },
  {
    id: 'notes',
    label: 'Anything else we should know?',
    type: 'textarea',
    required: false,
    placeholder: 'Tell us anything that would help us prepare for your call.',
  },
]

const INDUSTRY_QUESTIONS = {
  'beauty-spa': [
    {
      id: 'services',
      label: 'What services do you offer?',
      type: 'select',
      options: ['Hair', 'Nails', 'Skin and facials', 'Massage and spa', 'Multiple services'],
      required: true,
    },
    {
      id: 'booking_method',
      label: 'How do clients book with you today?',
      type: 'select',
      options: ['Phone calls', 'Online booking', 'Walk-ins', 'Social media messages', 'A mix of these'],
      required: true,
    },
    {
      id: 'no_shows',
      label: 'How often do no-shows happen?',
      type: 'select',
      options: ['Rarely', 'A few each week', 'Almost daily', 'Not sure'],
      required: true,
    },
  ],
  'finance-insurance': [
    {
      id: 'focus_area',
      label: 'What does your firm focus on?',
      type: 'select',
      options: ['Insurance', 'Financial planning', 'Lending', 'Accounting and tax', 'A mix of these'],
      required: true,
    },
    {
      id: 'client_volume',
      label: 'How many active clients do you serve?',
      type: 'select',
      options: ['Under 100', '100 to 500', 'More than 500'],
      required: true,
    },
    {
      id: 'appointment_type',
      label: 'What are most of your appointments about?',
      type: 'select',
      options: ['New client consultations', 'Policy or account reviews', 'Claims and support', 'A mix of these'],
      required: true,
    },
  ],
  'health-wellness': [
    {
      id: 'practice_type',
      label: 'What kind of practice do you run?',
      type: 'select',
      options: ['Medical or dental', 'Chiropractic or physical therapy', 'Fitness or coaching', 'Mental health', 'Other wellness'],
      required: true,
    },
    {
      id: 'patient_volume',
      label: 'How many patients or clients do you see per week?',
      type: 'select',
      options: ['Under 50', '50 to 150', 'More than 150'],
      required: true,
    },
    {
      id: 'payment_mix',
      label: 'How do most patients pay?',
      type: 'select',
      options: ['Mostly insurance', 'Mostly self-pay', 'An even mix', 'Not sure'],
      required: true,
    },
  ],
  'home-services': [
    {
      id: 'trade',
      label: 'What kind of work do you do?',
      type: 'select',
      options: ['Plumbing', 'HVAC', 'Electrical', 'Cleaning', 'Landscaping', 'General contracting', 'Other'],
      required: true,
    },
    {
      id: 'after_hours',
      label: 'How many calls come in after hours?',
      type: 'select',
      options: ['Hardly any', 'A few each week', 'Several every day', 'Not sure'],
      required: true,
    },
    {
      id: 'job_value',
      label: 'What is your average job worth?',
      type: 'select',
      options: ['Under $200', '$200 to $1,000', 'More than $1,000', 'It varies a lot'],
      required: true,
    },
  ],
  legal: [
    {
      id: 'practice_area',
      label: 'What is your main practice area?',
      type: 'select',
      options: ['Personal injury', 'Family law', 'Criminal defense', 'Immigration', 'Estate planning', 'Business law', 'Other'],
      required: true,
    },
    {
      id: 'consult_volume',
      label: 'How many new consultation requests do you get per month?',
      type: 'select',
      options: ['Under 10', '10 to 40', 'More than 40'],
      required: true,
    },
    {
      id: 'intake_process',
      label: 'How do new clients reach you today?',
      type: 'select',
      options: ['Phone calls', 'Website form', 'Referrals', 'A mix of these'],
      required: true,
    },
  ],
  'personal-secretary': [
    {
      id: 'team_size',
      label: 'How many people need support?',
      type: 'select',
      options: ['Just me', '2 to 5 people', '6 or more people'],
      required: true,
    },
    {
      id: 'first_tasks',
      label: 'What would you hand off first?',
      type: 'select',
      options: ['Scheduling and calendar', 'Call screening', 'Reminders and follow-ups', 'Email and messages', 'All of it'],
      required: true,
    },
    {
      id: 'current_solution',
      label: 'Who handles this today?',
      type: 'select',
      options: ['I do it myself', 'An assistant', 'An answering service', 'No one, things slip through'],
      required: true,
    },
  ],
  'real-estate': [
    {
      id: 'role',
      label: 'What describes you best?',
      type: 'select',
      options: ['Solo agent', 'Team lead', 'Brokerage', 'Property management'],
      required: true,
    },
    {
      id: 'listings',
      label: 'How many active listings do you have right now?',
      type: 'select',
      options: ['Under 5', '5 to 20', 'More than 20'],
      required: true,
    },
    {
      id: 'lead_sources',
      label: 'Where do most of your leads come from?',
      type: 'select',
      options: ['Zillow and portals', 'Referrals', 'Social media', 'Open houses', 'A mix of these'],
      required: true,
    },
  ],
  restaurant: [
    {
      id: 'service_style',
      label: 'What kind of restaurant do you run?',
      type: 'select',
      options: ['Dine-in', 'Takeout and delivery', 'Both'],
      required: true,
    },
    {
      id: 'call_volume',
      label: 'How many reservation or order calls come in per day?',
      type: 'select',
      options: ['Under 10', '10 to 40', 'More than 40'],
      required: true,
    },
    {
      id: 'peak_misses',
      label: 'When do you miss the most calls?',
      type: 'select',
      options: ['Lunch rush', 'Dinner rush', 'Weekends', 'After closing', 'All the time'],
      required: true,
    },
  ],
  'small-business': [
    {
      id: 'business_type',
      label: 'What kind of business do you run?',
      type: 'text',
      required: true,
      placeholder: 'e.g. auto repair shop',
    },
    {
      id: 'customer_volume',
      label: 'How many customers do you serve per week?',
      type: 'select',
      options: ['Under 25', '25 to 100', 'More than 100'],
      required: true,
    },
    {
      id: 'after_hours_coverage',
      label: 'Who answers when you are closed?',
      type: 'select',
      options: ['Voicemail', 'My cell phone', 'An answering service', 'No one'],
      required: true,
    },
  ],
}

/* Wizard steps for one industry: contact info first, then the tailored
   industry questions, then shared operations and fit questions. */
export function getIntakeSteps(slug) {
  const industry = INDUSTRY_QUESTIONS[slug] || []
  return [
    { title: 'About you', questions: CONTACT_QUESTIONS },
    { title: 'Your business', questions: industry },
    { title: 'Day to day', questions: OPERATIONS_QUESTIONS },
    { title: 'Timing and fit', questions: FIT_QUESTIONS },
  ].filter((step) => step.questions.length > 0)
}

/* Flat ordered list, used by the API route for validation and the email. */
export function getIntakeQuestions(slug) {
  return getIntakeSteps(slug).flatMap((step) => step.questions)
}
