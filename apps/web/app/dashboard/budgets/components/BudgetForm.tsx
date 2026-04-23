'use client'

import { useState } from 'react'
import { useCreateBudget, useUpdateBudget, Budget, CreateBudgetInput } from '@/lib/hooks/useBudgets'

interface BudgetFormProps {
  existing?: Budget | null
  onSuccess: () => void
  onCancel: () => void
}

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

const BudgetForm = ({ existing, onSuccess, onCancel }: BudgetFormProps) => {
  const createBudget = useCreateBudget()
  const updateBudget = useUpdateBudget()

  const [name, setName] = useState(existing?.name ?? '')
  const [scopeType, setScopeType] = useState<Budget['scopeType']>(existing?.scopeType ?? 'ORG')
  const [scopeValue, setScopeValue] = useState(existing?.scopeValue ?? '')
  const [amount, setAmount] = useState(existing?.amount ? String(existing.amount) : '')
  const [currency, setCurrency] = useState(existing?.currency ?? 'GBP')
  const [period, setPeriod] = useState<Budget['period']>(existing?.period ?? 'MONTHLY')
  const [alert70, setAlert70] = useState(existing?.alertThreshold70 ?? true)
  const [alert90, setAlert90] = useState(existing?.alertThreshold90 ?? true)
  const [alert100, setAlert100] = useState(existing?.alertThreshold100 ?? true)
  const [error, setError] = useState('')

  const isValid = name.trim().length > 0 && parseFloat(amount) > 0
  const isLoading = createBudget.isPending || updateBudget.isPending

  const handleSubmit = async () => {
    if (!isValid) return
    setError('')

    const input: CreateBudgetInput = {
      name: name.trim(),
      scopeType,
      scopeValue: scopeValue || undefined,
      amount: parseFloat(amount),
      currency,
      period,
      alertThreshold70: alert70,
      alertThreshold90: alert90,
      alertThreshold100: alert100,
      alertChannels: ['EMAIL'],
    }

    try {
      if (existing) {
        await updateBudget.mutateAsync({ id: existing.id, ...input })
      } else {
        await createBudget.mutateAsync(input)
      }
      onSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Name */}
      <div>
        <label style={labelStyle}>Budget name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Production AWS"
          style={inputStyle}
        />
      </div>

      {/* Scope */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Scope type</label>
          <select
            value={scopeType}
            onChange={(e) => setScopeType(e.target.value as Budget['scopeType'])}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="ORG">Organisation</option>
            <option value="TEAM">Team</option>
            <option value="SERVICE">Service</option>
            <option value="ACCOUNT">Account</option>
            <option value="ENVIRONMENT">Environment</option>
          </select>
        </div>
        {scopeType !== 'ORG' && (
          <div>
            <label style={labelStyle}>Scope value</label>
            <input
              type="text"
              value={scopeValue}
              onChange={(e) => setScopeValue(e.target.value)}
              placeholder="e.g. backend"
              style={inputStyle}
            />
          </div>
        )}
      </div>

      {/* Amount + currency */}
      <div style={{ display: 'grid', gridTemplateColumns: '80px 1fr', gap: '12px' }}>
        <div>
          <label style={labelStyle}>Currency</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            <option value="GBP">GBP</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="5000"
            min="1"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Period */}
      <div>
        <label style={labelStyle}>Period</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['MONTHLY', 'QUARTERLY', 'ANNUAL'] as Budget['period'][]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              style={{
                flex: 1,
                padding: '8px',
                background: period === p ? 'var(--colour-blue)' : 'var(--colour-bg-page)',
                border: `1px solid ${period === p ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
                borderRadius: '8px',
                color: period === p ? '#fff' : 'var(--colour-text-secondary)',
                fontSize: '12px',
                fontWeight: period === p ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {p.charAt(0) + p.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Alert thresholds */}
      <div>
        <label style={labelStyle}>Alert thresholds</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { label: '70%', value: alert70, set: setAlert70, colour: 'var(--colour-yellow)' },
            { label: '90%', value: alert90, set: setAlert90, colour: 'var(--colour-orange)' },
            { label: '100%', value: alert100, set: setAlert100, colour: 'var(--colour-red)' },
          ].map(({ label, value, set, colour }) => (
            <button
              key={label}
              onClick={() => set(!value)}
              style={{
                flex: 1,
                padding: '8px',
                background: value ? `${colour}18` : 'var(--colour-bg-page)',
                border: `1px solid ${value ? colour : 'var(--colour-border)'}`,
                borderRadius: '8px',
                color: value ? colour : 'var(--colour-text-muted)',
                fontSize: '12px',
                fontWeight: value ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && <p style={{ color: 'var(--colour-red)', fontSize: '12px', margin: 0 }}>{error}</p>}

      {/* Actions */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
        <button
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '11px',
            background: 'var(--colour-bg-page)',
            border: '1px solid var(--colour-border)',
            borderRadius: '8px',
            color: 'var(--colour-text-secondary)',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          style={{
            flex: 2,
            padding: '11px',
            background: isValid && !isLoading ? 'var(--colour-blue)' : 'var(--colour-border)',
            border: 'none',
            borderRadius: '8px',
            color: isValid && !isLoading ? '#fff' : 'var(--colour-text-muted)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: isValid && !isLoading ? 'pointer' : 'not-allowed',
          }}
        >
          {isLoading ? 'Saving...' : existing ? 'Save changes' : 'Create budget'}
        </button>
      </div>
    </div>
  )
}

export default BudgetForm