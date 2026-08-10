/* Guided chat intake question sets for the industry pages (/use-cases/[slug]).
   Every industry shares the same core questions; each industry adds 3
   tailored questions so the sales team gets a qualified lead.
   Question shape: { id, label, type, options?, required, placeholder?, prompt?, skipLabel? }
   type: 'text' | 'email' | 'tel' | 'url' | 'location' | 'select' | 'multiselect' | 'textarea'
   - label: terse phrasing used in the notification email and the admin drawer
   - prompt: what the chat assistant says when asking; falls back to label
   - skipLabel: chip text for skipping an optional question (default 'Skip this')
   - multiselect answers are arrays of option strings; url answers are
     validated and normalized server-side and exempt from the no-links rule */

const CONTACT_QUESTIONS = [
  { id: 'business_name', label: 'Business name', type: 'text', required: true, placeholder: 'Acme Salon', prompt: 'What is the name of your business?' },
  { id: 'contact_name', label: 'Your name', type: 'text', required: true, placeholder: 'Jane Smith', prompt: 'And your name?' },
  { id: 'contact_email', label: 'Email', type: 'email', required: true, placeholder: 'jane@company.com', prompt: 'What email should we use to reach you?' },
  { id: 'contact_phone', label: 'Phone', type: 'tel', required: true, placeholder: '+1 (555) 000-0000', prompt: 'And the best phone number for you?' },
]

/* Sits in the About you group but outside CONTACT_QUESTION_IDS so the
   partial lead is still created right after the four contact fields.
   type 'location' renders a typed input plus a share-my-location chip in
   the chat; the answer is plain text, optionally with coordinates the
   admin panel turns into a map link. */
const LOCATION_QUESTION = {
  id: 'business_location',
  label: 'Business location',
  type: 'location',
  required: true,
  placeholder: 'Street, city and state',
  prompt: 'Where is your business located? Type the address, or share your location and we will fill it in.',
}

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

const TEAM_QUESTIONS = [
  {
    id: 'employee_count',
    label: 'How many people work at your business?',
    type: 'select',
    options: ['Just me', '2 to 5 people', '6 to 20 people', 'More than 20'],
    required: true,
  },
  {
    id: 'call_coverage',
    label: 'Who answers your calls and messages today?',
    type: 'select',
    options: ['I answer them myself', 'Front desk or office staff', 'An answering service', 'Nobody after hours', 'It depends on the day'],
    required: true,
  },
]

const TOOLS_QUESTIONS = [
  {
    id: 'current_tools',
    label: 'Tools in use today',
    type: 'multiselect',
    options: ['Booking or scheduling software', 'A CRM', 'A shared inbox', 'A business phone system', 'None of these'],
    required: false,
    prompt: 'Which of these do you use today? Pick all that apply.',
  },
  {
    id: 'website_url',
    label: 'Business website',
    type: 'url',
    required: false,
    placeholder: 'yourbusiness.com',
    prompt: 'Do you have a business website? Share the address if so.',
    skipLabel: 'No website yet',
  },
]

/* Options mirror the 9 solution names in data/products.js. Kept as plain
   strings so the chat island does not bundle the full products data file. */
const INTEREST_QUESTIONS = [
  {
    id: 'solutions_interest',
    label: 'Solutions that caught their eye',
    type: 'multiselect',
    options: [
      'JotilReceptionist',
      'JotilMessenger',
      'JotilOutreach',
      'JotilSpace',
      'JotilFlow',
      'JotilAvatar',
      'JotilDevs',
      'JotilConsult',
      'JotilEducation',
    ],
    required: false,
    prompt: 'Did any of our solutions catch your eye? Pick any that look interesting.',
    skipLabel: 'Not sure yet',
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
    prompt: 'Do you have a monthly budget in mind?',
  },
]

const REACH_QUESTIONS = [
  {
    id: 'contact_method',
    label: 'How should we reach you?',
    type: 'select',
    options: ['Call me', 'Text me', 'Email me'],
    required: true,
  },
  {
    id: 'contact_time',
    label: 'Best time to reach you',
    type: 'select',
    options: ['Morning', 'Afternoon', 'Evening', 'Any time works'],
    required: false,
    prompt: 'When is the best time to reach you?',
  },
  {
    id: 'referral_source',
    label: 'How did you hear about us?',
    type: 'select',
    options: ['Searching online', 'Social media', 'A friend or colleague', 'An ad', 'Somewhere else'],
    required: false,
  },
  {
    id: 'notes',
    label: 'Anything else we should know?',
    type: 'textarea',
    required: false,
    placeholder: 'Tell us anything that would help us prepare for your call.',
    prompt: 'Last one. Anything else we should know before we reach out?',
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

/* The ids that make up the contact block. Once all four are answered the
   chat creates a partial lead, so the client and the API must agree here. */
export const CONTACT_QUESTION_IDS = CONTACT_QUESTIONS.map((q) => q.id)

/* Conversation groups for one industry: contact info first (so a partial
   lead exists as early as possible), then the tailored industry questions,
   then the shared blocks. `intro` is one short line the assistant says
   before the group's first question; null means no intro. */
export function getIntakeConversation(slug) {
  const industry = INDUSTRY_QUESTIONS[slug] || []
  return [
    { title: 'About you', intro: null, questions: [...CONTACT_QUESTIONS, LOCATION_QUESTION] },
    { title: 'Your business', intro: 'Now a little about your business.', questions: industry },
    { title: 'Day to day', intro: 'A bit about how your days run.', questions: [...OPERATIONS_QUESTIONS, ...TEAM_QUESTIONS] },
    { title: 'Your setup', intro: 'What does your setup look like today?', questions: TOOLS_QUESTIONS },
    { title: 'What you are looking for', intro: 'Now for what you are looking for.', questions: [...INTEREST_QUESTIONS, ...FIT_QUESTIONS] },
    { title: 'Wrapping up', intro: 'Almost done. A few quick ones to wrap up.', questions: REACH_QUESTIONS },
  ].filter((group) => group.questions.length > 0)
}

/* Flat ordered list, used by the API route for validation and the email. */
export function getIntakeQuestions(slug) {
  return getIntakeConversation(slug).flatMap((group) => group.questions)
}
