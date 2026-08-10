'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, AlertCircle } from 'lucide-react'

const inputClass =
  'w-full rounded-[11px] px-4 py-3 text-sm bg-white border outline-none transition-all focus:border-primary/40 focus:ring-2 focus:ring-primary/10'
const inputStyle = { border: '1px solid rgba(0,0,0,0.1)' }

export function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | error
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('loading')
    setErrorMessage('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) throw new Error(data.error || 'Could not sign in.')
      router.refresh()
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Could not sign in.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] px-6 pt-20">
      <div className="w-full max-w-sm rounded-2xl border border-black/[0.06] bg-white p-8">
        <span
          className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
          style={{ background: 'rgba(56,89,168,0.08)' }}
        >
          <Lock size={20} strokeWidth={1.5} className="text-primary" />
        </span>
        <h1 className="m-0 mb-1 text-center text-xl font-bold text-text">Admin</h1>
        <p className="m-0 mb-6 text-center text-sm text-[var(--color-text-secondary)]">
          Enter the admin password to view activity.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="admin-password" className="sr-only">Admin password</label>
          <input
            id="admin-password"
            type="password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={inputClass}
            style={inputStyle}
          />
          {status === 'error' && (
            <div
              className="mt-3 flex items-center gap-2 rounded-[11px] px-4 py-3 text-sm"
              style={{ background: 'rgba(239,68,68,0.06)', color: '#DC2626' }}
            >
              <AlertCircle size={16} strokeWidth={1.5} className="shrink-0" />
              {errorMessage}
            </div>
          )}
          <button
            type="submit"
            disabled={status === 'loading' || !password}
            className="btn-gradient mt-4 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-[11px] border-none px-6 py-3 text-sm font-semibold text-white transition-all disabled:opacity-60"
          >
            {status === 'loading' && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {status === 'loading' ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
