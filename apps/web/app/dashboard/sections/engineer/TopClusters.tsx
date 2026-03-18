'use client'

import { useSpendByService } from '@/lib/hooks/useSpendByService'

const TopClusters = () => {
  const { data, isLoading, isError } = useSpendByService('2026-01-01', '2026-03-01', 3)

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

  return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
    }}>
      <div style={{
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        fontWeight: 600,
        color: 'var(--colour-text-label)',
        marginBottom: '16px',
      }}>
        Top Clusters
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {data?.map((s) => (
          <div key={s.service} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid rgba(99, 179, 237, 0.15)',
            boxShadow: 'inset 0 0 12px rgba(99, 179, 237, 0.05)',
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: 'var(--colour-blue, #63b3ed)',
              flexShrink: 0,
            }} />
            <span style={{
              fontSize: '13px',
              color: 'var(--colour-text-primary)',
              flex: 1,
            }}>
              {s.service}
            </span>
            <span style={{
              fontSize: '13px',
              color: 'var(--colour-text-secondary)',
              fontWeight: 500,
            }}>
              £{s.cost.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopClusters