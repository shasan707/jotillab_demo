'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Send, ChevronDown, Check, Paperclip, Mic,
  MessageSquare, Users, Inbox, BarChart3, Settings,
  Trophy, Sparkles, ChevronRight,
} from 'lucide-react'
import Logo from '@/components/ui/Logo'

const BRAND_BLUE = '#3859a8'

const MODELS = [
  { name: 'GPT-4o', provider: 'OpenAI', color: '#10a37f' },
  { name: 'Claude 4.7', provider: 'Anthropic', color: '#d97706' },
  { name: 'Gemini 2.5', provider: 'Google', color: '#4285f4' },
  { name: 'Llama 3', provider: 'Meta', color: '#7c3aed' },
]

const TURN_1 = {
  user: 'Prepare my quarterly sales report',
  ai: "Q4 totals: $847K revenue, up 23% YoY. Here's the breakdown by channel:",
  bars: [
    { label: 'Voice', value: 342, color: '#3859a8' },
    { label: 'Email', value: 251, color: '#7c3aed' },
    { label: 'Web', value: 172, color: '#06b6d4' },
    { label: 'SMS', value: 82, color: '#10B981' },
  ],
}

const TURN_2 = {
  user: 'Who is the best sales person?',
  ai: 'Sarah Chen leads the team with 42 deals closed and $186K in revenue this quarter.',
  person: {
    name: 'Sarah Chen',
    role: 'Senior Sales Executive',
    stats: [
      { label: 'Deals', value: '42' },
      { label: 'Revenue', value: '$186K' },
      { label: 'Conv', value: '38%' },
    ],
  },
}

const AGENT = {
  name: 'Sales Qualifier',
  role: 'Lead Qualification',
  greeting: "Hi! I'm here to help you find the right plan.",
  channels: ['Voice', 'SMS', 'Email'],
}

const SIDEBAR_ITEMS = [
  { id: 'chat', icon: MessageSquare },
  { id: 'agents', icon: Users },
  { id: 'inbox', icon: Inbox },
  { id: 'analytics', icon: BarChart3 },
  { id: 'settings', icon: Settings },
]

function Sidebar({ active }) {
  return (
    <div
      className="w-12 shrink-0 flex flex-col items-center py-3 gap-1.5 border-r border-gray-100"
      style={{ backgroundColor: '#fafbfd' }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center mb-2"
        style={{ background: `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_BLUE}cc)` }}
      >
        <Logo size={12} tone="on-dark" animate={false} />
      </div>
      {SIDEBAR_ITEMS.map((item) => {
        const Icon = item.icon
        const isActive = item.id === active
        return (
          <div
            key={item.id}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
            style={{
              backgroundColor: isActive ? `${BRAND_BLUE}18` : 'transparent',
            }}
          >
            <Icon
              className="w-3.5 h-3.5"
              strokeWidth={1.6}
              style={{ color: isActive ? BRAND_BLUE : '#9ca3af' }}
            />
          </div>
        )
      })}
    </div>
  )
}

function BarChartCard({ bars, animate }) {
  const max = Math.max(...bars.map((b) => b.value))
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl bg-white border border-gray-100 p-3 mt-1.5"
      style={{ boxShadow: `0 4px 12px ${BRAND_BLUE}10` }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-bold text-gray-700 uppercase tracking-wider">Q4 by channel</p>
        <p className="text-[16px] text-gray-400 font-mono">total $847K</p>
      </div>
      <div className="flex items-end justify-around gap-2 h-20">
        {bars.map((bar, i) => {
          const heightPct = (bar.value / max) * 100
          return (
            <div key={bar.label} className="flex-1 flex flex-col items-center gap-1 h-full">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: animate ? 1 : 0 }}
                transition={{ duration: 0.3, delay: 0.4 + i * 0.1 }}
                className="text-[16px] font-bold text-gray-700 font-mono tabular-nums"
              >
                ${bar.value}K
              </motion.div>
              <div className="w-full flex-1 flex items-end">
                <motion.div
                  className="w-full rounded-t-md"
                  initial={{ height: '0%' }}
                  animate={{ height: animate ? `${heightPct}%` : '0%' }}
                  transition={{ duration: 0.7, delay: 0.15 + i * 0.1, ease: 'easeOut' }}
                  style={{
                    backgroundColor: bar.color,
                    minHeight: 2,
                    boxShadow: `0 -2px 8px ${bar.color}40`,
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex items-center justify-around gap-2 mt-1">
        {bars.map((bar) => (
          <div key={bar.label} className="flex-1 text-center">
            <p className="text-[16px] text-gray-500">{bar.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function SalespersonCard({ data }) {
  const initials = data.name
    .split(' ')
    .map((n) => n[0])
    .join('')
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="rounded-xl bg-white border p-2.5 mt-1.5 flex items-center gap-2.5"
      style={{ borderColor: `${BRAND_BLUE}25`, boxShadow: `0 4px 12px ${BRAND_BLUE}12` }}
    >
      <div className="relative shrink-0">
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_BLUE}cc)` }}
        >
          <span className="text-white font-bold text-[15px]">{initials}</span>
        </div>
        <div
          className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white"
          style={{ backgroundColor: '#fbbf24' }}
        >
          <Trophy className="w-2 h-2 text-white" strokeWidth={2.5} />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[15px] font-bold text-gray-900 truncate">{data.name}</p>
        <p className="text-[16px] text-gray-500 truncate">{data.role}</p>
      </div>
      <div className="flex gap-2.5 shrink-0">
        {data.stats.map((s) => (
          <div key={s.label} className="text-center">
            <p
              className="text-[15px] font-bold tabular-nums leading-none"
              style={{ color: BRAND_BLUE }}
            >
              {s.value}
            </p>
            <p className="text-[15px] text-gray-400 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

function ChatTopBar({ model, pickerOpen, highlightedModel, selectedModel }) {
  return (
    <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-gray-100 relative">
      <div className="relative">
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-lg"
          style={{
            backgroundColor: pickerOpen ? `${model.color}10` : 'transparent',
            border: `1px solid ${pickerOpen ? `${model.color}40` : '#e5e7eb'}`,
          }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />
          <span className="text-[14px] font-semibold text-gray-900">{model.name}</span>
          <ChevronDown
            className="w-2.5 h-2.5 text-gray-400 transition-transform duration-300"
            strokeWidth={2}
            style={{ transform: pickerOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
          />
        </div>

        <AnimatePresence>
          {pickerOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full left-0 mt-1 w-45 rounded-xl bg-white z-30 overflow-hidden"
              style={{
                border: '1px solid #e5e7eb',
                boxShadow: '0 12px 32px rgba(15,17,41,0.10), 0 2px 8px rgba(15,17,41,0.05)',
              }}
            >
              <div className="px-2 py-1.5 border-b border-gray-100">
                <p className="text-[16px] uppercase tracking-wider text-gray-400 font-semibold">Models</p>
              </div>
              <div className="py-1">
                {MODELS.map((m, i) => {
                  const isHighlighted = i === highlightedModel
                  const isSelected = i === selectedModel
                  return (
                    <div
                      key={m.name}
                      className="flex items-center gap-2 px-2 py-1.5"
                      style={{ backgroundColor: isHighlighted ? `${m.color}10` : 'transparent' }}
                    >
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: m.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-gray-900">{m.name}</p>
                        <p className="text-[16px] text-gray-400">{m.provider}</p>
                      </div>
                      {isSelected && (
                        <Check className="w-2.5 h-2.5" style={{ color: m.color }} strokeWidth={2.5} />
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        <span className="text-[16px] text-green-600">Online</span>
      </div>
    </div>
  )
}

function ChatView({
  model,
  pickerOpen,
  highlightedModel,
  selectedModel,
  sentMessages,
  aiInflight,
  typedInput,
  sendPulse,
  showTurn1Graph,
  showTurn2Card,
}) {
  return (
    <>
      <ChatTopBar
        model={model}
        pickerOpen={pickerOpen}
        highlightedModel={highlightedModel}
        selectedModel={selectedModel}
      />

      <div className="flex-1 px-4 py-3 overflow-y-auto flex flex-col gap-2">
        {sentMessages.length === 0 && !aiInflight && (
          <div className="flex-1 flex flex-col items-center justify-center gap-2">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_BLUE}cc)`,
                boxShadow: `0 4px 14px ${BRAND_BLUE}33`,
              }}
            >
              <Logo size={18} tone="on-dark" animate={false} />
            </div>
            <div className="text-center">
              <p className="text-[16px] font-bold text-gray-900">Good afternoon</p>
              <p className="text-[13px] text-gray-400 mt-0.5">Powered by {model.name}</p>
            </div>
          </div>
        )}

        {sentMessages.map((msg, i) => {
          if (msg.role === 'user') {
            return (
              <motion.div
                key={`msg-${i}`}
                initial={{ opacity: 0, y: 6, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex justify-end"
              >
                <div
                  className="max-w-[78%] px-3 py-1.5 text-[14px] leading-snug rounded-xl rounded-br-sm text-gray-900"
                  style={{ backgroundColor: '#f1f3f5' }}
                >
                  {msg.text}
                </div>
              </motion.div>
            )
          }
          return (
            <motion.div
              key={`msg-${i}`}
              initial={{ opacity: 0, y: 6, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-start gap-1 max-w-[88%]"
            >
              <div className="flex items-end gap-1.5">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_BLUE}cc)` }}
                >
                  <Logo size={11} tone="on-dark" animate={false} />
                </div>
                <div
                  className="px-3 py-1.5 text-[14px] leading-snug rounded-xl rounded-bl-sm text-white"
                  style={{ backgroundColor: BRAND_BLUE }}
                >
                  {msg.text}
                </div>
              </div>
              {msg.attachment === 'graph' && showTurn1Graph && (
                <div className="ml-7 w-full">
                  <BarChartCard bars={TURN_1.bars} animate={true} />
                </div>
              )}
              {msg.attachment === 'person' && showTurn2Card && (
                <div className="ml-7 w-full">
                  <SalespersonCard data={TURN_2.person} />
                </div>
              )}
            </motion.div>
          )
        })}

        {aiInflight && (
          <div className="flex items-end gap-1.5">
            <div className="relative shrink-0" style={{ width: 24, height: 24 }}>
              {aiInflight.phase === 'thinking' && [0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: 24, height: 24,
                    top: 0, left: 0,
                    border: `1.5px solid ${BRAND_BLUE}`,
                    opacity: 0.35 - i * 0.08,
                    animation: `ring-expand 1.4s ease-out ${i * 0.35}s infinite`,
                  }}
                />
              ))}
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center relative"
                style={{
                  background: `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_BLUE}cc)`,
                  animation: aiInflight.phase === 'thinking' ? 'orb-pulse 1.2s ease-in-out infinite' : 'none',
                }}
              >
                <Logo size={11} tone="on-dark" animate={false} />
              </div>
            </div>

            {aiInflight.phase === 'thinking' ? (
              <div
                className="flex items-center gap-1 px-3 py-2 rounded-xl rounded-bl-sm"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                {[0, 1, 2].map((d) => (
                  <span
                    key={d}
                    className="w-1 h-1 rounded-full"
                    style={{
                      backgroundColor: '#ffffff',
                      opacity: 0.7,
                      animation: `typing-dot 1.4s ease-in-out ${d * 0.2}s infinite`,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div
                className="max-w-[80%] px-3 py-1.5 text-[14px] leading-snug rounded-xl rounded-bl-sm text-white"
                style={{ backgroundColor: BRAND_BLUE }}
              >
                {aiInflight.text}
                <span
                  className="inline-block w-px ml-px align-middle"
                  style={{
                    height: 10,
                    backgroundColor: 'rgba(255,255,255,0.8)',
                    animation: 'caret-blink 0.8s step-end infinite',
                  }}
                />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="shrink-0 px-3 py-2 border-t border-gray-100 flex items-center gap-2">
        <Paperclip className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.6} />
        <div className="flex-1 bg-gray-50 rounded-full px-3 py-1.5 text-[14px] flex items-center min-h-6">
          {typedInput ? (
            <span className="text-gray-800">
              {typedInput}
              <span
                className="inline-block w-px ml-px align-middle"
                style={{
                  height: 10,
                  backgroundColor: BRAND_BLUE,
                  animation: 'caret-blink 0.8s step-end infinite',
                }}
              />
            </span>
          ) : (
            <span className="text-gray-400">Ask anything...</span>
          )}
        </div>
        <Mic className="w-3.5 h-3.5 text-gray-400 shrink-0" strokeWidth={1.6} />
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{
            backgroundColor: BRAND_BLUE,
            transform: sendPulse ? 'scale(1.18)' : 'scale(1)',
            boxShadow: sendPulse ? `0 0 0 4px ${BRAND_BLUE}33` : 'none',
            transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
          }}
        >
          <Send className="w-3 h-3 text-white" strokeWidth={1.8} />
        </div>
      </div>
    </>
  )
}

function AgentView({
  agentNameTyped,
  agentRoleSelected,
  agentGreetingTyped,
  agentChannelsChecked,
  agentSubmitPulse,
  agentSuccess,
}) {
  return (
    <>
      <div className="shrink-0 flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" style={{ color: BRAND_BLUE }} strokeWidth={1.8} />
          <p className="text-[15px] font-bold text-gray-900">Create new agent</p>
        </div>
        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${BRAND_BLUE}10` }}>
          <span className="text-[16px] font-semibold" style={{ color: BRAND_BLUE }}>Draft</span>
        </div>
      </div>

      <div className="flex-1 px-4 py-3 overflow-y-auto flex flex-col gap-2.5">
        <AnimatePresence mode="wait">
          {agentSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center gap-2"
            >
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ backgroundColor: '#22c55e', boxShadow: '0 6px 20px rgba(34,197,94,0.35)' }}
              >
                <Check className="w-7 h-7 text-white" strokeWidth={3} />
              </motion.div>
              <div className="text-center">
                <p className="text-[16px] font-bold text-gray-900">Agent deployed</p>
                <p className="text-[13px] text-gray-500 mt-0.5">
                  {AGENT.name} is now handling leads across {AGENT.channels.length} channels
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col gap-2"
            >
              <div>
                <p className="text-[16px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Agent name</p>
                <div
                  className="rounded-lg px-2.5 py-1.5 text-[14px] bg-white"
                  style={{ border: `1px solid ${agentNameTyped ? `${BRAND_BLUE}40` : '#e5e7eb'}` }}
                >
                  {agentNameTyped ? (
                    <span className="text-gray-900 font-medium">
                      {agentNameTyped}
                      {agentNameTyped.length < AGENT.name.length && (
                        <span
                          className="inline-block w-px ml-px align-middle"
                          style={{ height: 10, backgroundColor: BRAND_BLUE, animation: 'caret-blink 0.8s step-end infinite' }}
                        />
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-400">e.g. Sales Qualifier</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[16px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Role</p>
                <div
                  className="rounded-lg px-2.5 py-1.5 text-[14px] bg-white flex items-center justify-between"
                  style={{ border: `1px solid ${agentRoleSelected ? `${BRAND_BLUE}40` : '#e5e7eb'}` }}
                >
                  <span className={agentRoleSelected ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                    {agentRoleSelected ? AGENT.role : 'Select a role...'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-gray-400" strokeWidth={2} />
                </div>
              </div>

              <div>
                <p className="text-[16px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Greeting</p>
                <div
                  className="rounded-lg px-2.5 py-1.5 text-[14px] bg-white min-h-7"
                  style={{ border: `1px solid ${agentGreetingTyped ? `${BRAND_BLUE}40` : '#e5e7eb'}` }}
                >
                  {agentGreetingTyped ? (
                    <span className="text-gray-900">
                      {agentGreetingTyped}
                      {agentGreetingTyped.length < AGENT.greeting.length && (
                        <span
                          className="inline-block w-px ml-px align-middle"
                          style={{ height: 10, backgroundColor: BRAND_BLUE, animation: 'caret-blink 0.8s step-end infinite' }}
                        />
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-400">First message your agent will say...</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-[16px] font-semibold text-gray-500 uppercase tracking-wider mb-1">Channels</p>
                <div className="flex gap-1.5 flex-wrap">
                  {AGENT.channels.map((ch, i) => {
                    const isChecked = agentChannelsChecked > i
                    return (
                      <div
                        key={ch}
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-[13px] transition-all"
                        style={{
                          backgroundColor: isChecked ? `${BRAND_BLUE}12` : '#f4f6fb',
                          border: `1px solid ${isChecked ? `${BRAND_BLUE}40` : '#e5e7eb'}`,
                          color: isChecked ? BRAND_BLUE : '#9ca3af',
                          fontWeight: isChecked ? 600 : 400,
                        }}
                      >
                        <span
                          className="w-3 h-3 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: isChecked ? BRAND_BLUE : 'transparent',
                            border: `1.5px solid ${isChecked ? BRAND_BLUE : '#cbd5e1'}`,
                          }}
                        >
                          {isChecked && <Check className="w-2 h-2 text-white" strokeWidth={3} />}
                        </span>
                        {ch}
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="mt-1.5">
                <div
                  className="rounded-lg px-3 py-1.5 flex items-center justify-center gap-1.5 text-[14px] font-semibold text-white"
                  style={{
                    background: `linear-gradient(135deg, ${BRAND_BLUE}, ${BRAND_BLUE}dd)`,
                    transform: agentSubmitPulse ? 'scale(1.02)' : 'scale(1)',
                    boxShadow: agentSubmitPulse
                      ? `0 0 0 4px ${BRAND_BLUE}33, 0 4px 12px ${BRAND_BLUE}40`
                      : `0 2px 8px ${BRAND_BLUE}30`,
                    transition: 'transform 0.2s ease-out, box-shadow 0.2s ease-out',
                  }}
                >
                  <Sparkles className="w-3 h-3" strokeWidth={2} />
                  Deploy agent
                  <ChevronRight className="w-3 h-3" strokeWidth={2} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export function SpaceScreen({ isActive, onAction, onStep }) {
  const [view, setView] = useState('chat')
  const [selectedModel, setSelectedModel] = useState(0)
  const [highlightedModel, setHighlightedModel] = useState(-1)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [typedInput, setTypedInput] = useState('')
  const [sentMessages, setSentMessages] = useState([])
  const [aiInflight, setAiInflight] = useState(null)
  const [sendPulse, setSendPulse] = useState(false)
  const [showTurn1Graph, setShowTurn1Graph] = useState(false)
  const [showTurn2Card, setShowTurn2Card] = useState(false)

  const [agentNameTyped, setAgentNameTyped] = useState('')
  const [agentRoleSelected, setAgentRoleSelected] = useState(false)
  const [agentGreetingTyped, setAgentGreetingTyped] = useState('')
  const [agentChannelsChecked, setAgentChannelsChecked] = useState(0)
  const [agentSubmitPulse, setAgentSubmitPulse] = useState(false)
  const [agentSuccess, setAgentSuccess] = useState(false)

  const loopRef = useRef(null)

  useEffect(() => {
    if (!isActive) {
      setView('chat')
      setSelectedModel(0)
      setHighlightedModel(-1)
      setPickerOpen(false)
      setTypedInput('')
      setSentMessages([])
      setAiInflight(null)
      setSendPulse(false)
      setShowTurn1Graph(false)
      setShowTurn2Card(false)
      setAgentNameTyped('')
      setAgentRoleSelected(false)
      setAgentGreetingTyped('')
      setAgentChannelsChecked(0)
      setAgentSubmitPulse(false)
      setAgentSuccess(false)
      if (loopRef.current) loopRef.current.forEach(clearTimeout)
      return
    }

    const timers = []
    const t = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); return id }

    const typeText = (text, speed, startMs, setter) => {
      text.split('').forEach((_, i) => {
        t(() => setter(text.slice(0, i + 1)), startMs + (i + 1) * speed)
      })
      return startMs + text.length * speed
    }

    const runLoop = () => {
      setView('chat')
      setPickerOpen(false)
      setHighlightedModel(-1)
      setTypedInput('')
      setSentMessages([])
      setAiInflight(null)
      setSendPulse(false)
      setShowTurn1Graph(false)
      setShowTurn2Card(false)
      setAgentNameTyped('')
      setAgentRoleSelected(false)
      setAgentGreetingTyped('')
      setAgentChannelsChecked(0)
      setAgentSubmitPulse(false)
      setAgentSuccess(false)
      setSelectedModel(0)

      t(() => { setPickerOpen(true); onStep?.(0) }, 600)
      const hoverSchedule = [0, 1, 2, 1]
      hoverSchedule.forEach((idx, i) => {
        t(() => setHighlightedModel(idx), 1100 + i * 220)
      })
      t(() => {
        setSelectedModel(1)
        setHighlightedModel(-1)
      }, 2200)
      t(() => setPickerOpen(false), 2500)

      let now = 2900

      // Turn 1: quarterly report + graph
      now = typeText(TURN_1.user, 30, now, setTypedInput)
      now += 220
      t(() => setSendPulse(true), now)
      t(() => setSendPulse(false), now + 280)
      now += 280
      t(() => {
        setSentMessages((prev) => [...prev, { role: 'user', text: TURN_1.user }])
        setTypedInput('')
        onStep?.(1)
      }, now)
      now += 350

      t(() => setAiInflight({ phase: 'thinking', text: '' }), now)
      now += 1000

      const aiText1 = TURN_1.ai
      const aiSpeed = 20
      t(() => setAiInflight({ phase: 'typing', text: '' }), now)
      aiText1.split('').forEach((_, i) => {
        t(
          () => setAiInflight({ phase: 'typing', text: aiText1.slice(0, i + 1) }),
          now + (i + 1) * aiSpeed,
        )
      })
      now += aiText1.length * aiSpeed + 80
      t(() => {
        setSentMessages((prev) => [...prev, { role: 'ai', text: aiText1, attachment: 'graph' }])
        setAiInflight(null)
        setShowTurn1Graph(true)
      }, now)
      now += 1700

      // Turn 2: best sales person + card
      now = typeText(TURN_2.user, 30, now, setTypedInput)
      now += 220
      t(() => setSendPulse(true), now)
      t(() => setSendPulse(false), now + 280)
      now += 280
      t(() => {
        setSentMessages((prev) => [...prev, { role: 'user', text: TURN_2.user }])
        setTypedInput('')
      }, now)
      now += 350

      t(() => setAiInflight({ phase: 'thinking', text: '' }), now)
      now += 900

      const aiText2 = TURN_2.ai
      t(() => setAiInflight({ phase: 'typing', text: '' }), now)
      aiText2.split('').forEach((_, i) => {
        t(
          () => setAiInflight({ phase: 'typing', text: aiText2.slice(0, i + 1) }),
          now + (i + 1) * aiSpeed,
        )
      })
      now += aiText2.length * aiSpeed + 80
      t(() => {
        setSentMessages((prev) => [...prev, { role: 'ai', text: aiText2, attachment: 'person' }])
        setAiInflight(null)
        setShowTurn2Card(true)
      }, now)
      now += 1800

      // Transition to Agent view
      t(() => { setView('agent'); onStep?.(2) }, now)
      now += 600

      now = typeText(AGENT.name, 38, now, setAgentNameTyped)
      now += 400

      t(() => setAgentRoleSelected(true), now)
      now += 600

      now = typeText(AGENT.greeting, 22, now, setAgentGreetingTyped)
      now += 400

      AGENT.channels.forEach((_, i) => {
        t(() => setAgentChannelsChecked(i + 1), now + i * 280)
      })
      now += AGENT.channels.length * 280 + 400

      t(() => setAgentSubmitPulse(true), now)
      t(() => setAgentSubmitPulse(false), now + 350)
      now += 600

      t(() => { setAgentSuccess(true); onStep?.(3) }, now)
      now += 2200

      t(runLoop, now + 800)
    }

    runLoop()
    loopRef.current = timers
    return () => timers.forEach(clearTimeout)
  }, [isActive, onStep])

  const model = MODELS[selectedModel]
  const sidebarActive = view === 'agent' ? 'agents' : 'chat'

  return (
    <div className="w-full h-full flex bg-white relative overflow-hidden">
      <Sidebar active={sidebarActive} />

      <div className="flex-1 flex flex-col min-w-0">
        <AnimatePresence mode="wait">
          {view === 'chat' ? (
            <motion.div
              key="chat-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <ChatView
                model={model}
                pickerOpen={pickerOpen}
                highlightedModel={highlightedModel}
                selectedModel={selectedModel}
                sentMessages={sentMessages}
                aiInflight={aiInflight}
                typedInput={typedInput}
                sendPulse={sendPulse}
                showTurn1Graph={showTurn1Graph}
                showTurn2Card={showTurn2Card}
              />
            </motion.div>
          ) : (
            <motion.div
              key="agent-view"
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.35 }}
              className="flex-1 flex flex-col min-h-0"
            >
              <AgentView
                agentNameTyped={agentNameTyped}
                agentRoleSelected={agentRoleSelected}
                agentGreetingTyped={agentGreetingTyped}
                agentChannelsChecked={agentChannelsChecked}
                agentSubmitPulse={agentSubmitPulse}
                agentSuccess={agentSuccess}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
