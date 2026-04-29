'use client'

import { useState } from 'react'
import { useCreatePolicy, useUpdatePolicy, GovernancePolicy, CreatePolicyInput } from '@/lib/hooks/useGovernancePolicies'

interface PolicyFormProps {
  existing?: GovernancePolicy | null
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

// Default configs based on our research-backed suggestions
const DEFAULT_CONFIGS: Record<GovernancePolicy['type'], Record<string, unknown>> = {
  BUDGET_GUARDRAIL: {
    threshold_percent: 90,
    scope: 'ORG',
  },
  TAGGING_REQUIRED: {
    required_keys: ['environment', 'team', 'application', 'cost-centre'],
    score_thresholds: { green: 80, amber: 60 },
  },
  DRIFT_DETECTION: {
    drift_percent_threshold: 20,
    lookback_days: 7,
  },
  SPEND_ANOMALY: {
    day_on_day_threshold_percent: 20,
    absolute_threshold_gbp: 200,
    lookback_days: 7,
  },
}

const TYPE_CONFIG_LABELS: Record<GovernancePolicy['type'], string> = {
  BUDGET_GUARDRAIL: 'Alert when spend reaches this % of budget',
  TAGGING_REQUIRED: 'Minimum required tag keys (comma separated)',
  DRIFT_DETECTION: 'Alert when spend drifts by this % from 7-day average',
  SPEND_ANOMALY: 'Alert when day-on-day spend increases by this % AND exceeds absolute threshold',
}

const PolicyForm = ({ existing, onSuccess, onCancel }: PolicyFormProps) => {
  const createPolicy = useCreatePolicy()
  const updatePolicy = useUpdatePolicy()

  const [name, setName] = useState(existing?.name ?? '')
  const [description, setDescription] = useState(existing?.description ?? '')
  const [type, setType] = useState<GovernancePolicy['type']>(existing?.type ?? 'SPEND_ANOMALY')
  const [severity, setSeverity] = useState<GovernancePolicy['severity']>(existing?.severity ?? 'MEDIUM')
  const [config, setConfig] = useState<Record<string, unknown>>(existing?.config ?? DEFAULT_CONFIGS['SPEND_ANOMALY'])
  const [error, setError] = useState('')

  const isLoading = createPolicy.isPending || updatePolicy.isPending
  const isValid = name.trim().length > 0

  const handleTypeChange = (newType: GovernancePolicy['type']) => {
    setType(newType)
    if (!existing) setConfig(DEFAULT_CONFIGS[newType])
  }

  const handleSubmit = async () => {
    if (!isValid) return
    setError('')

    const input: CreatePolicyInput = {
      name: name.trim(),
      description: description || undefined,
      type,
      severity,
      config,
      enabled: true,
    }

    try {
      if (existing) {
        await updatePolicy.mutateAsync({ id: existing.id, ...input })
      } else {
        await createPolicy.mutateAsync(input)
      }
      onSuccess()
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  const renderConfigFields = () => {
    switch (type) {
      case 'BUDGET_GUARDRAIL':
        return (
          <div>
            <label style={labelStyle}>Alert threshold (%)</label>
            <input
              type="number"
              value={String(config.threshold_percent ?? 90)}
              onChange={(e) => setConfig({ ...config, threshold_percent: parseInt(e.target.value) })}
              min="1"
              max="100"
              style={inputStyle}
            />
            <p style={{ fontSize: '11px', color: 'var(--colour-text-muted)', margin: '4px 0 0' }}>
              Alert when spend reaches this percentage of the org budget (e.g. 90 = alert at 90%)
            </p>
          </div>
        )

      case 'TAGGING_REQUIRED':
        return (
          <div>
            <label style={labelStyle}>Required tag keys</label>
            <input
              type="text"
              value={Array.isArray(config.required_keys) ? (config.required_keys as string[]).join(', ') : ''}
              onChange={(e) => setConfig({
                ...config,
                required_keys: e.target.value.split(',').map((k) => k.trim()).filter(Boolean),
              })}
              placeholder="environment, team, application, cost-centre"
              style={inputStyle}
            />
            <p style={{ fontSize: '11px', color: 'var(--colour-text-muted)', margin: '4px 0 0' }}>
              Resources missing any of these tags will be flagged. Coverage score thresholds: green &gt;80%, amber &gt;60%, red &lt;60%.
            </p>
          </div>
        )

      case 'DRIFT_DETECTION':
        return (
          <div>
            <label style={labelStyle}>Drift threshold (%)</label>
            <input
              type="number"
              value={String(config.drift_percent_threshold ?? 20)}
              onChange={(e) => setConfig({ ...config, drift_percent_threshold: parseInt(e.target.value) })}
              min="1"
              style={inputStyle}
            />
            <p style={{ fontSize: '11px', color: 'var(--colour-text-muted)', margin: '4px 0 0' }}>
              Alert when current spend deviates by more than this % from the 7-day rolling average.
            </p>
          </div>
        )

      case 'SPEND_ANOMALY':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={labelStyle}>Day-on-day increase threshold (%)</label>
              <input
                type="number"
                value={String(config.day_on_day_threshold_percent ?? 20)}
                onChange={(e) => setConfig({ ...config, day_on_day_threshold_percent: parseInt(e.target.value) })}
                min="1"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={labelStyle}>Minimum absolute threshold (£)</label>
              <input
                type="number"
                value={String(config.absolute_threshold_gbp ?? 200)}
                onChange={(e) => setConfig({ ...config, absolute_threshold_gbp: parseInt(e.target.value) })}
                min="1"
                style={inputStyle}
              />
            </div>
            <p style={{ fontSize: '11px', color: 'var(--colour-text-muted)', margin: 0 }}>
              Alert fires only when BOTH thresholds are exceeded — reduces noise from small services with volatile but low-value spend.
            </p>
          </div>
        )
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Name */}
      <div>
        <label style={labelStyle}>Policy name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Production anomaly detection"
          style={inputStyle}
        />
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description (optional)</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What does this policy do?"
          style={inputStyle}
        />
      </div>

      {/* Type */}
      <div>
        <label style={labelStyle}>Policy type</label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          {(['BUDGET_GUARDRAIL', 'TAGGING_REQUIRED', 'DRIFT_DETECTION', 'SPEND_ANOMALY'] as GovernancePolicy['type'][]).map((t) => (
            <button
              key={t}
              onClick={() => handleTypeChange(t)}
              style={{
                padding: '10px 12px',
                background: type === t ? 'rgba(48,110,255,0.1)' : 'var(--colour-bg-page)',
                border: `1px solid ${type === t ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
                borderRadius: '8px',
                color: type === t ? 'var(--colour-blue)' : 'var(--colour-text-secondary)',
                fontSize: '12px',
                fontWeight: type === t ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left' as const,
              }}
            >
              {t.replace(/_/g, ' ').charAt(0) + t.replace(/_/g, ' ').slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Severity */}
      <div>
        <label style={labelStyle}>Severity</label>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as GovernancePolicy['severity'][]).map((s) => (
            <button
              key={s}
              onClick={() => setSeverity(s)}
              style={{
                flex: 1,
                padding: '8px',
                background: severity === s ? 'var(--colour-bg-card-hover)' : 'var(--colour-bg-page)',
                border: `1px solid ${severity === s ? 'var(--colour-text-secondary)' : 'var(--colour-border)'}`,
                borderRadius: '8px',
                color: severity === s ? 'var(--colour-text-primary)' : 'var(--colour-text-muted)',
                fontSize: '11px',
                fontWeight: severity === s ? 600 : 400,
                cursor: 'pointer',
              }}
            >
              {s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Type-specific config */}
      <div>
        <label style={labelStyle}>Configuration</label>
        {renderConfigFields()}
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
          {isLoading ? 'Saving...' : existing ? 'Save changes' : 'Create policy'}
        </button>
      </div>
    </div>
  )
}

export default PolicyForm