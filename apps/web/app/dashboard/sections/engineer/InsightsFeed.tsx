'use client'

import { useState } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { useAnomalies } from '@/lib/hooks/useAnomalies'

const severityColour: Record<string, string> = {
  critical: 'var(--colour-red)',
  warning: '#f6ad55',
  info: 'var(--colour-blue, #63b3ed)',
}

const InsightsFeed = () => {
  const { data, isLoading, isError } = useAnomalies(10)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())

  const handleDismiss = async (id: string) => {
    setDismissed(prev => new Set(prev).add(id))
    try {
      await fetch(`/api/anomalies/${id}/acknowledge`, { method: 'DELETE' })
    } catch {
    }
  }

  if (isLoading) return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
      color: 'var(--colour-text-muted)',
      fontSize: '13px',
    }}>Loading...</div>
  )

  if (isError) return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
      color: 'var(--colour-red)',
      fontSize: '13px',
    }}>Failed to load</div>
  )

  const visible = data?.filter(a => !dismissed.has(a.id)) ?? []

  return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
      flex: 1,
    }}>
      <div style={{
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        fontWeight: 600,
        color: 'var(--colour-text-label)',
        marginBottom: '16px',
      }}>
        Insights
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        flex: 1,
        overflowY: 'auto',
      }}>
        {visible.length === 0 && (
          <div style={{ fontSize: '13px', color: 'var(--colour-text-muted)' }}>
            No active insights
          </div>
        )}
        {visible.map((a) => (
          <div key={a.id} style={{
            display: 'flex',
            gap: '12px',
            padding: '10px 12px',
            borderRadius: '8px',
            backgroundColor: 'var(--colour-bg-surface, rgba(255,255,255,0.03))',
            borderLeft: `3px solid ${severityColour[a.severity] ?? 'var(--colour-border)'}`,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--colour-text-primary)',
                marginBottom: '2px',
              }}>
                {a.title}
              </div>
              <div style={{
                fontSize: '11px',
                color: 'var(--colour-text-muted)',
              }}>
                {formatDistanceToNow(new Date(a.lastSynced ?? Date.now()), { addSuffix: true })}
              </div>
            </div>
            <button
              onClick={() => handleDismiss(a.id)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--colour-text-muted)',
                cursor: 'pointer',
                fontSize: '16px',
                lineHeight: 1,
                padding: '0 4px',
                flexShrink: 0,
              }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InsightsFeed