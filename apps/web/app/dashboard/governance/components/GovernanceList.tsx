'use client'

import { useState } from 'react'
import { useGovernancePolicies, useUpdatePolicy, useDeletePolicy, GovernancePolicy } from '@/lib/hooks/useGovernancePolicies'
import PolicyForm from './PolicyForm'

const TYPE_LABELS: Record<GovernancePolicy['type'], string> = {
  BUDGET_GUARDRAIL: 'Budget Guardrail',
  TAGGING_REQUIRED: 'Tagging Required',
  DRIFT_DETECTION: 'Drift Detection',
  SPEND_ANOMALY: 'Spend Anomaly',
}

const TYPE_DESCRIPTIONS: Record<GovernancePolicy['type'], string> = {
  BUDGET_GUARDRAIL: 'Alert when spend exceeds a threshold of your budget',
  TAGGING_REQUIRED: 'Flag resources missing required tags',
  DRIFT_DETECTION: 'Detect when spend drifts significantly from forecast',
  SPEND_ANOMALY: 'Alert on unexpected day-on-day spend spikes',
}

const TYPE_ICONS: Record<GovernancePolicy['type'], string> = {
  BUDGET_GUARDRAIL: '£',
  TAGGING_REQUIRED: '#',
  DRIFT_DETECTION: '~',
  SPEND_ANOMALY: '⚡',
}

const SEVERITY_COLOURS: Record<GovernancePolicy['severity'], { bg: string; color: string; border: string }> = {
  LOW: { bg: 'rgba(76,187,23,0.1)', color: 'var(--colour-green)', border: 'rgba(76,187,23,0.3)' },
  MEDIUM: { bg: 'rgba(252,174,30,0.1)', color: 'var(--colour-yellow)', border: 'rgba(252,174,30,0.3)' },
  HIGH: { bg: 'rgba(255,132,0,0.1)', color: 'var(--colour-orange)', border: 'rgba(255,132,0,0.3)' },
  CRITICAL: { bg: 'rgba(247,49,18,0.1)', color: 'var(--colour-red)', border: 'rgba(247,49,18,0.3)' },
}

const SeverityBadge = ({ severity }: { severity: GovernancePolicy['severity'] }) => {
  const c = SEVERITY_COLOURS[severity]
  return (
    <span style={{
      fontSize: '11px',
      padding: '2px 8px',
      borderRadius: '20px',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      fontWeight: 500,
    }}>
      {severity.charAt(0) + severity.slice(1).toLowerCase()}
    </span>
  )
}

const PolicyCard = ({ policy, onEdit }: { policy: GovernancePolicy; onEdit: (p: GovernancePolicy) => void }) => {
  const updatePolicy = useUpdatePolicy()
  const deletePolicy = useDeletePolicy()
  const [deleting, setDeleting] = useState(false)

  const handleToggle = () => {
    updatePolicy.mutate({ id: policy.id, enabled: !policy.enabled })
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deletePolicy.mutateAsync(policy.id)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div style={{
      background: 'var(--colour-bg-card)',
      border: `1px solid ${policy.enabled ? 'var(--colour-border)' : 'var(--colour-border-subtle)'}`,
      borderRadius: '12px',
      padding: '20px',
      opacity: policy.enabled ? 1 : 0.6,
      transition: 'opacity 0.2s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', flex: 1 }}>
          {/* Icon */}
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: 'var(--colour-bg-page)',
            border: '1px solid var(--colour-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--colour-text-secondary)',
            flexShrink: 0,
          }}>
            {TYPE_ICONS[policy.type]}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
                {policy.name}
              </span>
              <SeverityBadge severity={policy.severity} />
            </div>
            <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', marginBottom: '4px' }}>
              {TYPE_LABELS[policy.type]}
            </div>
            {policy.description && (
              <div style={{ fontSize: '12px', color: 'var(--colour-text-secondary)' }}>
                {policy.description}
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {/* Toggle */}
          <button
            onClick={handleToggle}
            disabled={updatePolicy.isPending}
            style={{
              width: '36px',
              height: '20px',
              borderRadius: '10px',
              background: policy.enabled ? 'var(--colour-blue)' : 'var(--colour-border)',
              border: 'none',
              cursor: 'pointer',
              position: 'relative' as const,
              transition: 'background 0.2s ease',
              padding: 0,
            }}
          >
            <div style={{
              position: 'absolute' as const,
              top: '2px',
              left: policy.enabled ? '18px' : '2px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#fff',
              transition: 'left 0.2s ease',
            }} />
          </button>

          <button
            onClick={() => onEdit(policy)}
            style={{
              padding: '4px 10px',
              background: 'var(--colour-bg-card-hover)',
              border: '1px solid var(--colour-border)',
              borderRadius: '6px',
              color: 'var(--colour-text-secondary)',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            Edit
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              padding: '4px 10px',
              background: 'rgba(247,49,18,0.08)',
              border: '1px solid rgba(247,49,18,0.2)',
              borderRadius: '6px',
              color: 'var(--colour-red)',
              fontSize: '11px',
              cursor: 'pointer',
            }}
          >
            {deleting ? '...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

const GovernanceList = () => {
  const { data: policies, isLoading, isError } = useGovernancePolicies()
  const [showForm, setShowForm] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<GovernancePolicy | null>(null)

  const handleEdit = (policy: GovernancePolicy) => {
    setEditingPolicy(policy)
    setShowForm(true)
  }

  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          height: '88px',
          background: 'var(--colour-bg-card)',
          border: '1px solid var(--colour-border)',
          borderRadius: '12px',
          opacity: 0.5,
        }} />
      ))}
    </div>
  )

  if (isError) return (
    <div style={{
      padding: '24px',
      background: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '12px',
      color: 'var(--colour-red)',
      fontSize: '13px',
    }}>
      Failed to load policies.
    </div>
  )

  return (
    <div>
      {/* Create button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => { setEditingPolicy(null); setShowForm(true) }}
          style={{
            padding: '10px 20px',
            background: 'var(--colour-blue)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + New policy
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '24px',
        }}>
          <div style={{
            background: 'var(--colour-bg-card)',
            border: '1px solid var(--colour-border)',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '520px',
            maxHeight: '90vh',
            overflowY: 'auto' as const,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--colour-text-primary)', margin: 0 }}>
                {editingPolicy ? 'Edit policy' : 'New policy'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: 'none', border: 'none', color: 'var(--colour-text-muted)', cursor: 'pointer', fontSize: '20px' }}
              >
                {'\u00d7'}
              </button>
            </div>
            <PolicyForm
              existing={editingPolicy}
              onSuccess={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {policies && policies.length === 0 && (
        <div style={{
          padding: '48px 24px',
          background: 'var(--colour-bg-card)',
          border: '1px solid var(--colour-border)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>🛡️</div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colour-text-primary)', margin: '0 0 8px' }}>
            No policies yet
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--colour-text-secondary)', margin: '0 0 20px' }}>
            Create policies to automatically detect budget breaches, tagging gaps, and cost anomalies.
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '10px 20px',
              background: 'var(--colour-blue)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Create your first policy
          </button>
        </div>
      )}

      {/* Policy list */}
      {policies && policies.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {policies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} onEdit={handleEdit} />
          ))}
        </div>
      )}
    </div>
  )
}

export default GovernanceList