'use client'

import { useState } from 'react'

interface Step2Props {
  onComplete: () => void
  onBack: () => void
}

const CONNECTORS = [
  {
    id: 'aws_cur',
    name: 'AWS',
    description: 'Cost & Usage Report via IAM Role',
    icon: '☁️',
    available: true,
  },
  {
    id: 'gcp_billing',
    name: 'GCP',
    description: 'Billing export via service account',
    icon: '🟡',
    available: false,
  },
  {
    id: 'azure_cost',
    name: 'Azure',
    description: 'Cost Management via App Registration',
    icon: '🔷',
    available: false,
  },
  {
    id: 'datadog',
    name: 'Datadog',
    description: 'Infrastructure spend via API key',
    icon: '🐶',
    available: false,
  },
]

const Step2Connector = ({ onComplete, onBack }: Step2Props) => {
  const [selected, setSelected] = useState<string | null>(null)
  const [showAwsWizard, setShowAwsWizard] = useState(false)
  const [awsConnected, setAwsConnected] = useState(false)

  // Simple AWS sub-wizard state
  const [awsName, setAwsName] = useState('')
  const [awsRoleArn, setAwsRoleArn] = useState('')
  const [awsBucket, setAwsBucket] = useState('')
  const [awsPrefix, setAwsPrefix] = useState('')
  const [awsTesting, setAwsTesting] = useState(false)
  const [awsTestResult, setAwsTestResult] = useState<'success' | 'error' | null>(null)

  const handleConnectorClick = (id: string, available: boolean) => {
    if (!available) return
    setSelected(id)
    if (id === 'aws_cur') setShowAwsWizard(true)
  }

  const handleTestConnection = async () => {
    setAwsTesting(true)
    setAwsTestResult(null)
    // Mock test — real call to POST /api/connectors/test goes here when George's endpoint is ready
    await new Promise((r) => setTimeout(r, 1500))
    setAwsTestResult('success')
    setAwsTesting(false)
  }

  const handleAwsComplete = () => {
    setAwsConnected(true)
    setShowAwsWizard(false)
  }

  if (showAwsWizard) {
    return (
      <div>
        <button
          onClick={() => setShowAwsWizard(false)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--cp-text-muted)',
            fontSize: '13px',
            cursor: 'pointer',
            marginBottom: '20px',
            padding: 0,
          }}
        >
          ← Back to connectors
        </button>

        <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--cp-text)', marginBottom: '6px' }}>
          Connect AWS
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--cp-text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
          We'll read your Cost & Usage Report via an IAM Role — we never store your AWS credentials directly.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Connector name', value: awsName, set: setAwsName, placeholder: 'Production AWS' },
            { label: 'IAM Role ARN', value: awsRoleArn, set: setAwsRoleArn, placeholder: 'arn:aws:iam::123456789012:role/CostPrismRole' },
            { label: 'S3 Bucket name', value: awsBucket, set: setAwsBucket, placeholder: 'my-cur-bucket' },
            { label: 'CUR prefix (optional)', value: awsPrefix, set: setAwsPrefix, placeholder: 'cur/reports/' },
          ].map(({ label, value, set, placeholder }) => (
            <div key={label}>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 500, color: 'var(--cp-text)', marginBottom: '6px' }}>
                {label}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'var(--cp-bg)',
                  border: '1px solid var(--cp-border)',
                  borderRadius: '8px',
                  color: 'var(--cp-text)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}
        </div>

        {awsTestResult === 'success' && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.3)',
            borderRadius: '8px',
            color: '#22c55e',
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            ✓ Connection successful — we can reach your CUR bucket
          </div>
        )}

        {awsTestResult === 'error' && (
          <div style={{
            padding: '12px 16px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '8px',
            color: '#ef4444',
            fontSize: '13px',
            marginBottom: '16px',
          }}>
            ✗ Connection failed — check your IAM Role ARN and bucket name
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          {awsTestResult !== 'success' && (
            <button
              onClick={handleTestConnection}
              disabled={!awsName || !awsRoleArn || !awsBucket || awsTesting}
              style={{
                flex: 1,
                padding: '11px',
                background: 'var(--cp-bg)',
                border: '1px solid var(--cp-border)',
                borderRadius: '8px',
                color: 'var(--cp-text)',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              {awsTesting ? 'Testing...' : 'Test connection'}
            </button>
          )}
          <button
            onClick={handleAwsComplete}
            disabled={awsTestResult !== 'success'}
            style={{
              flex: 1,
              padding: '11px',
              background: awsTestResult === 'success' ? 'var(--cp-accent)' : 'var(--cp-border)',
              border: 'none',
              borderRadius: '8px',
              color: awsTestResult === 'success' ? '#fff' : 'var(--cp-text-muted)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: awsTestResult === 'success' ? 'pointer' : 'not-allowed',
            }}
          >
            Save connector →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--cp-text)', marginBottom: '8px' }}>
        Connect your first data source
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--cp-text-muted)', marginBottom: '24px', lineHeight: 1.6 }}>
        Connect at least one cloud account to start seeing your costs.
      </p>

      {awsConnected && (
        <div style={{
          padding: '12px 16px',
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.3)',
          borderRadius: '8px',
          color: '#22c55e',
          fontSize: '13px',
          marginBottom: '16px',
        }}>
          ✓ AWS connected — your first sync will run shortly
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
        {CONNECTORS.map((connector) => (
          <div
            key={connector.id}
            onClick={() => handleConnectorClick(connector.id, connector.available)}
            style={{
              padding: '16px',
              border: `1px solid ${selected === connector.id ? 'var(--cp-accent)' : 'var(--cp-border)'}`,
              borderRadius: '10px',
              cursor: connector.available ? 'pointer' : 'not-allowed',
              opacity: connector.available ? 1 : 0.45,
              background: selected === connector.id ? 'rgba(99,102,241,0.06)' : 'var(--cp-bg)',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              transition: 'all 0.15s ease',
            }}
          >
            <span style={{ fontSize: '24px' }}>{connector.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cp-text)' }}>{connector.name}</div>
              <div style={{ fontSize: '12px', color: 'var(--cp-text-muted)' }}>{connector.description}</div>
            </div>
            {!connector.available && (
              <span style={{
                fontSize: '11px',
                padding: '3px 8px',
                background: 'var(--cp-surface)',
                border: '1px solid var(--cp-border)',
                borderRadius: '20px',
                color: 'var(--cp-text-muted)',
              }}>
                Coming soon
              </span>
            )}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onBack}
          style={{
            padding: '11px 20px',
            background: 'var(--cp-bg)',
            border: '1px solid var(--cp-border)',
            borderRadius: '8px',
            color: 'var(--cp-text)',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          ← Back
        </button>
        <button
          onClick={onComplete}
          disabled={!awsConnected}
          style={{
            flex: 1,
            padding: '11px',
            background: awsConnected ? 'var(--cp-accent)' : 'var(--cp-border)',
            border: 'none',
            borderRadius: '8px',
            color: awsConnected ? '#fff' : 'var(--cp-text-muted)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: awsConnected ? 'pointer' : 'not-allowed',
          }}
        >
          Continue →
        </button>
      </div>
    </div>
  )
}

export default Step2Connector