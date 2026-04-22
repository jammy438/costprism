'use client'

import { useState } from 'react'

interface Step3Props {
  onComplete: () => void
  onSkip: () => void
  onBack: () => void
}

const ROLES = ['Admin', 'Member', 'Viewer']

const Step3Invite = ({ onComplete, onSkip, onBack }: Step3Props) => {
  const [invites, setInvites] = useState([{ email: '', role: 'Member' }])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const addRow = () => {
    if (invites.length >= 5) return
    setInvites([...invites, { email: '', role: 'Member' }])
  }

  const updateInvite = (index: number, field: 'email' | 'role', value: string) => {
    const updated = [...invites]
    const item = updated[index]
    if (!item) return
    item[field] = value
    setInvites(updated)
  }

  const removeRow = (index: number) => {
    setInvites(invites.filter((_, i) => i !== index))
  }

  const validInvites = invites.filter((inv) => inv.email.includes('@'))
  const hasValid = validInvites.length > 0

  const handleSubmit = async () => {
    if (!hasValid) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invites: validInvites }),
      })
      if (!res.ok) throw new Error('Failed to send invitations')
      onComplete()
    } catch {
      setError('Failed to send some invitations. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--colour-text-primary)', marginBottom: '8px' }}>
        Invite your team
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--colour-text-secondary)', marginBottom: '24px', lineHeight: 1.6 }}>
        Add teammates who should have access. You can always invite more later.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
        {invites.map((invite, i) => (
          <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <input
              type="email"
              value={invite.email}
              onChange={(e) => updateInvite(i, 'email', e.target.value)}
              placeholder="colleague@company.com"
              style={{
                flex: 1,
                padding: '10px 14px',
                background: 'var(--colour-bg-page)',
                border: '1px solid var(--colour-border)',
                borderRadius: '8px',
                color: 'var(--colour-text-primary)',
                fontSize: '13px',
                outline: 'none',
              }}
            />
            <select
              value={invite.role}
              onChange={(e) => updateInvite(i, 'role', e.target.value)}
              style={{
                padding: '10px 12px',
                background: 'var(--colour-bg-page)',
                border: '1px solid var(--colour-border)',
                borderRadius: '8px',
                color: 'var(--colour-text-primary)',
                fontSize: '13px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            {invites.length > 1 && (
              <button
                onClick={() => removeRow(i)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--colour-text-secondary)',
                  cursor: 'pointer',
                  fontSize: '16px',
                  padding: '0 4px',
                }}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>

      {invites.length < 5 && (
        <button
          onClick={addRow}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--colour-blue)',
            fontSize: '13px',
            cursor: 'pointer',
            padding: 0,
            marginBottom: '24px',
          }}
        >
          + Add another
        </button>
      )}

      {error && (
        <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '11px 20px',
            background: 'var(--colour-bg-page)',
            border: '1px solid var(--colour-border)',
            borderRadius: '8px',
            color: 'var(--colour-text-primary)',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <button
          onClick={onSkip}
          style={{
            padding: '11px 20px',
            background: 'var(--colour-bg-page)',
            border: '1px solid var(--colour-border)',
            borderRadius: '8px',
            color: 'var(--colour-text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Skip
        </button>
        <button
          onClick={handleSubmit}
          disabled={!hasValid || loading}
          style={{
            flex: 1,
            padding: '11px',
            background: hasValid && !loading ? 'var(--colour-blue)' : 'var(--colour-border)',
            border: 'none',
            borderRadius: '8px',
            color: hasValid && !loading ? '#fff' : 'var(--colour-text-secondary)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: hasValid && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Sending...' : 'Send invites →'}
        </button>
      </div>
    </div>
  )
}

export default Step3Invite