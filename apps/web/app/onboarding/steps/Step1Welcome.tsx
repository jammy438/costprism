'use client'

import { useState } from 'react'

interface Step1Props {
  onComplete: () => void
}

const INDUSTRIES = [
  'SaaS / Software',
  'Fintech',
  'E-commerce',
  'Healthcare',
  'Media & Entertainment',
  'Gaming',
  'Other',
]

const SPEND_RANGES = [
  { label: '£0 – £100k / year', value: '0-100k' },
  { label: '£100k – £500k / year', value: '100k-500k' },
  { label: '£500k+ / year', value: '500k+' },
]

const Step1Welcome = ({ onComplete }: Step1Props) => {
  const [orgName, setOrgName] = useState('')
  const [industry, setIndustry] = useState('')
  const [spendRange, setSpendRange] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isValid = orgName.trim().length > 0 && industry && spendRange

  const handleSubmit = async () => {
    if (!isValid) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/onboarding/org-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orgName: orgName.trim(), industry, spendRange }),
      })
      if (!res.ok) throw new Error('Failed to save')
      onComplete()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{
        fontSize: '22px',
        fontWeight: 700,
        color: 'var(--colour-text-primary)',
        marginBottom: '8px',
        letterSpacing: '-0.4px',
      }}>
        Welcome to CostPrism
      </h1>
      <p style={{
        fontSize: '14px',
        color: 'var(--colour-text-secondary)',
        marginBottom: '32px',
        lineHeight: 1.6,
      }}>
        Let's get your account set up. This takes about 30 minutes to your first cost chart.
      </p>

      {/* Org name */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--colour-text-primary)',
          marginBottom: '8px',
        }}>
          Organisation name
        </label>
        <input
          type="text"
          value={orgName}
          onChange={(e) => setOrgName(e.target.value)}
          placeholder="Acme Ltd"
          maxLength={50}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'var(--colour-bg-page)',
            border: '1px solid var(--colour-border)',
            borderRadius: '8px',
            color: 'var(--colour-text-primary)',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Industry */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--colour-text-primary)',
          marginBottom: '8px',
        }}>
          Industry
        </label>
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'var(--colour-bg-page)',
            border: '1px solid var(--colour-border)',
            borderRadius: '8px',
            color: industry ? 'var(--colour-text-primary)' : 'var(--colour-text-secondary)',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
            cursor: 'pointer',
          }}
        >
          <option value="" disabled>Select industry</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {/* Spend range */}
      <div style={{ marginBottom: '32px' }}>
        <label style={{
          display: 'block',
          fontSize: '13px',
          fontWeight: 500,
          color: 'var(--colour-text-primary)',
          marginBottom: '8px',
        }}>
          Annual cloud spend
        </label>
        <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
          {SPEND_RANGES.map((range) => (
            <div
              key={range.value}
              onClick={() => setSpendRange(range.value)}
              style={{
                padding: '12px 16px',
                border: `1px solid ${spendRange === range.value ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                background: spendRange === range.value ? 'rgba(99,102,241,0.08)' : 'var(--colour-bg-page)',
                color: 'var(--colour-text-primary)',
                fontSize: '14px',
                fontWeight: spendRange === range.value ? 500 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              {range.label}
            </div>
          ))}
        </div>
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: '13px', marginBottom: '16px' }}>{error}</p>
      )}

      <button
        onClick={handleSubmit}
        disabled={!isValid || loading}
        style={{
          width: '100%',
          padding: '12px',
          background: isValid && !loading ? 'var(--colour-blue)' : 'var(--colour-border)',
          color: isValid && !loading ? '#fff' : 'var(--colour-text-secondary)',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          cursor: isValid && !loading ? 'pointer' : 'not-allowed',
          transition: 'all 0.15s ease',
        }}
      >
        {loading ? 'Saving...' : 'Continue →'}
      </button>
    </div>
  )
}

export default Step1Welcome