'use client'

import { useState } from 'react'

interface Step4Props {
  onComplete: () => void
  onSkip: () => void
  onBack: () => void
}

const CURRENCIES = ['GBP', 'USD', 'EUR']

const Step4Budget = ({ onComplete, onSkip, onBack }: Step4Props) => {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('GBP')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValid = amount && parseFloat(amount) > 0

  const handleSubmit = async () => {
    if (!isValid) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Monthly org budget',
          scopeType: 'ORG',
          amount: parseFloat(amount),
          currency,
          period: 'MONTHLY',
          alertThreshold70: true,
          alertThreshold90: true,
          alertThreshold100: true,
          alertChannels: ['EMAIL'],
        }),
      })
      if (!res.ok) throw new Error('Failed to create budget')
      onComplete()
    } catch {
      setError('Failed to save budget. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--colour-text-primary)', marginBottom: '8px' }}>
        Set your first budget
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--colour-text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
        Set a monthly cloud spend limit for your whole organisation. You'll get alerts at 70%, 90%, and 100%.
      </p>

      <div style={{ marginBottom: '24px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--colour-text-primary)',
          marginBottom: '8px',
        }}>
          Monthly budget
        </label>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{
              padding: '10px 12px',
              background: 'var(--colour-bg-page)',
              border: '1px solid var(--colour-border)',
              borderRadius: '8px',
              color: 'var(--colour-text-primary)',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
            min="1"
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'var(--colour-bg-page)',
              border: '1px solid var(--colour-border)',
              borderRadius: '8px',
              color: 'var(--colour-text-primary)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      <div style={{
        padding: '14px 16px',
        background: 'var(--colour-bg-page)',
        border: '1px solid var(--colour-border)',
        borderRadius: '8px',
        marginBottom: '32px',
      }}>
        <p style={{ fontSize: '12px', color: 'var(--colour-text-secondary)', margin: 0, lineHeight: 1.6 }}>
          You'll receive email alerts when your spend reaches <strong style={{ color: 'var(--colour-text-primary)' }}>70%</strong>, <strong style={{ color: 'var(--colour-text-primary)' }}>90%</strong>, and <strong style={{ color: 'var(--colour-text-primary)' }}>100%</strong> of this budget. You can adjust thresholds and add Slack alerts later.
        </p>
      </div>

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
          disabled={!isValid || loading}
          style={{
            flex: 1,
            padding: '11px',
            background: isValid && !loading ? 'var(--colour-blue)' : 'var(--colour-border)',
            border: 'none',
            borderRadius: '8px',
            color: isValid && !loading ? '#fff' : 'var(--colour-text-secondary)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: isValid && !loading ? 'pointer' : 'not-allowed',
          }}
        >
          {loading ? 'Saving...' : 'Set budget →'}
        </button>
      </div>
    </div>
  )
}

export default Step4Budget