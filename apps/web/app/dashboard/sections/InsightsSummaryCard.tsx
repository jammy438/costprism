'use client'

import { useState } from 'react'
import { useAnomalies } from '@/lib/hooks/useAnomalies'
import { useQueryClient } from '@tanstack/react-query'
import SkeletonRow from '@/app/components/skeletons/SkeletonRow'

const SEVERITY_COLOURS: Record<string, string> = {
  critical: 'var(--colour-red)',
  warning: 'var(--colour-yellow)',
  info: 'var(--colour-blue)',
}

const InsightsSummary = () => {
  const { data, isLoading, isError } = useAnomalies(5)
  const queryClient = useQueryClient()
  const [acknowledged, setAcknowledged] = useState<Set<string>>(new Set())

  const handleAcknowledge = (id: string) => {
    setAcknowledged((prev) => new Set([...prev, id]))
  }

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['anomalies'] })
  }

  const rows = Array.isArray(data) ? data : []
  const unacknowledged = rows.filter((a: any) => !acknowledged.has(a.id))
  const acknowledgedRows = rows.filter((a: any) => acknowledged.has(a.id))

  return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600, color: 'var(--colour-text-label)' }}>
          Insights Summary
          {unacknowledged.length > 0 && (
            <span style={{
              marginLeft: '8px',
              fontSize: '10px',
              padding: '1px 6px',
              borderRadius: '10px',
              background: 'var(--colour-red)',
              color: '#fff',
              fontWeight: 700,
            }}>
              {unacknowledged.length}
            </span>
          )}
        </div>
        <button
          onClick={handleRefresh}
          style={{ background: 'none', border: 'none', color: 'var(--colour-text-muted)', cursor: 'pointer', fontSize: '11px', padding: 0 }}
        >
          Refresh
        </button>
      </div>

      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {isError && (
        <div style={{ color: 'var(--colour-red)', fontSize: '13px' }}>Failed to load insights</div>
      )}

      {!isLoading && !isError && rows.length === 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '24px 0', color: 'var(--colour-text-muted)' }}>
          <span style={{ fontSize: '20px' }}>{'\u2713'}</span>
          <span style={{ fontSize: '13px' }}>Everything looks healthy</span>
        </div>
      )}

      {/* Unacknowledged */}
      {unacknowledged.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {unacknowledged.map((insight: any) => {
            const colour = SEVERITY_COLOURS[insight.severity] ?? 'var(--colour-text-muted)'
            return (
              <div
                key={insight.id}
                style={{
                  padding: '12px 14px',
                  borderRadius: '10px',
                  background: 'var(--colour-bg-page)',
                  border: `1px solid ${colour}33`,
                  borderLeft: `3px solid ${colour}`,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '10px',
                        padding: '1px 6px',
                        borderRadius: '20px',
                        background: `${colour}18`,
                        color: colour,
                        border: `1px solid ${colour}33`,
                        fontWeight: 500,
                        textTransform: 'uppercase' as const,
                      }}>
                        {insight.severity}
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-primary)', marginBottom: '2px' }}>
                      {insight.title}
                    </div>
                    <div style={{ fontSize: '12px', color: 'var(--colour-text-secondary)' }}>
                      {insight.description}
                    </div>
                  </div>
                  <button
                    onClick={() => handleAcknowledge(insight.id)}
                    title="Acknowledge — marks as seen, stays until resolved"
                    style={{
                      padding: '4px 10px',
                      background: 'var(--colour-bg-card)',
                      border: '1px solid var(--colour-border)',
                      borderRadius: '6px',
                      color: 'var(--colour-text-muted)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap' as const,
                      flexShrink: 0,
                    }}
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Acknowledged section */}
      {acknowledgedRows.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontSize: '10px', color: 'var(--colour-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.6px', marginBottom: '8px' }}>
            Acknowledged ({acknowledgedRows.length})
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {acknowledgedRows.map((insight: any) => (
              <div
                key={insight.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: '10px',
                  background: 'transparent',
                  border: '1px solid var(--colour-border)',
                  opacity: 0.5,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '12px', color: 'var(--colour-text-secondary)' }}>{insight.title}</span>
                <span style={{ fontSize: '10px', color: 'var(--colour-text-muted)' }}>Acknowledged</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default InsightsSummary