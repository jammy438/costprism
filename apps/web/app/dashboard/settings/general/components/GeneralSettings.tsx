'use client'

import { useState, useEffect } from 'react'

const CURRENCIES = ['GBP', 'USD', 'EUR']

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: 'var(--colour-bg-page)',
  border: '1px solid var(--colour-border)',
  borderRadius: '8px',
  color: 'var(--colour-text-primary)',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box' as const,
}

const labelStyle = {
  display: 'block' as const,
  fontSize: '12px',
  fontWeight: 500 as const,
  color: 'var(--colour-text-secondary)',
  marginBottom: '6px',
}

const GeneralSettings = () => {
  const [orgName, setOrgName] = useState('')
  const [currency, setCurrency] = useState('GBP')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/settings/general')
      .then((res) => res.json())
      .then((data) => {
        if (data.org) {
          setOrgName(data.org.name ?? '')
          setCurrency(data.org.displayCurrency ?? 'GBP')
        }
      })
      .catch(() => setError('Failed to load settings'))
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/settings/general', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: orgName, displayCurrency: currency }),
      })
      if (!res.ok) throw new Error('Failed to save')
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px' }}>Loading...</div>
  )

  return (
    <div style={{ maxWidth: '520px' }}>
      <div style={{
        background: 'var(--colour-bg-card)',
        border: '1px solid var(--colour-border)',
        borderRadius: '12px',
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colour-text-primary)', margin: 0 }}>
          Organisation
        </h2>

        {/* Org name */}
        <div>
          <label style={labelStyle}>Organisation name</label>
          <input
            type="text"
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            placeholder="Acme Ltd"
            maxLength={100}
            style={inputStyle}
          />
        </div>

        {/* Display currency */}
        <div>
          <label style={labelStyle}>Display currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <p style={{ fontSize: '11px', color: 'var(--colour-text-muted)', margin: '6px 0 0 0' }}>
            All cost figures will be displayed in this currency.
          </p>
        </div>

        {error && <p style={{ color: 'var(--colour-red)', fontSize: '12px', margin: 0 }}>{error}</p>}

        {saved && (
          <div style={{
            padding: '10px 14px',
            background: 'rgba(76,187,23,0.1)',
            border: '1px solid rgba(76,187,23,0.3)',
            borderRadius: '8px',
            color: 'var(--colour-green)',
            fontSize: '12px',
          }}>
            Settings saved successfully.
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={handleSave}
            disabled={saving || !orgName.trim()}
            style={{
              padding: '10px 24px',
              background: saving || !orgName.trim() ? 'var(--colour-border)' : 'var(--colour-blue)',
              border: 'none',
              borderRadius: '8px',
              color: saving || !orgName.trim() ? 'var(--colour-text-muted)' : '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: saving || !orgName.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GeneralSettings