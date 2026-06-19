import { Calendar, MessageSquare, UserPlus, Bell, Ticket, UserCheck, Mail, Phone, BarChart3, Brain, Inbox, Camera, Route, Sparkles } from 'lucide-react'

export const FLOATING_CARDS = {
  receptionist: [
    { id: 'calendar', icon: Calendar, label: 'Thu 10:00 AM', sublabel: 'Appointment booked', top: '-30px', right: '-60px', rotate: '4deg', depth: '-50px' },
    { id: 'sms', icon: MessageSquare, label: 'Confirmation sent', sublabel: 'SMS delivered', bottom: '60px', right: '-65px', rotate: '-3deg', depth: '-30px' },
    { id: 'crm', icon: UserPlus, label: 'Sarah Mitchell', sublabel: 'Added to CRM', top: '80px', left: '-55px', rotate: '-5deg', depth: '-60px' },
  ],
  messenger: [
    { id: 'calendar', icon: Calendar, label: 'Thu 10:00 AM', sublabel: 'Booked', top: '-30px', right: '-60px', rotate: '4deg', depth: '-50px' },
    { id: 'reminder', icon: Bell, label: 'Reminder set', sublabel: 'SMS 9:00 AM', bottom: '60px', right: '-65px', rotate: '-3deg', depth: '-30px' },
    { id: 'ticket', icon: Ticket, label: 'Ticket #4821', sublabel: 'CRM', top: '80px', left: '-55px', rotate: '-5deg', depth: '-60px' },
  ],
  outreach: [
    { id: 'email', icon: Mail, label: 'Drip sent', sublabel: 'Email sequence', top: '-30px', right: '-60px', rotate: '4deg', depth: '-50px' },
    { id: 'dialer', icon: Phone, label: 'Auto-dial', sublabel: 'Queued', bottom: '60px', right: '-65px', rotate: '-3deg', depth: '-30px' },
    { id: 'analytics', icon: BarChart3, label: '3x meetings', sublabel: 'Booked', top: '80px', left: '-55px', rotate: '-5deg', depth: '-60px' },
  ],
  space: [
    { id: 'model', icon: Brain, label: 'GPT-4o', sublabel: 'Generating', top: '-40px', right: '-20px', rotate: '4deg', depth: '-50px' },
    { id: 'perf', icon: BarChart3, label: 'Performance', sublabel: '94% quality', bottom: '40px', right: '-30px', rotate: '-3deg', depth: '-30px' },
    { id: 'inbox', icon: Inbox, label: 'Unified inbox', sublabel: '12 conversations', top: '60px', left: '-30px', rotate: '-5deg', depth: '-60px' },
  ],
  avatar: [
    { id: 'video', icon: Camera, label: 'Live presence', sublabel: 'Active', top: '-40px', right: '-20px', rotate: '4deg', depth: '-50px' },
    { id: 'onboarding', icon: Route, label: 'Guided selling', sublabel: 'Step 2 of 4', bottom: '40px', right: '-30px', rotate: '-3deg', depth: '-30px' },
    { id: 'personality', icon: Sparkles, label: 'Brand voice', sublabel: 'Custom tone', top: '60px', left: '-30px', rotate: '-5deg', depth: '-60px' },
  ],
}
