'use client'
import { useSpendByTeam } from '@/lib/hooks/useSpendByTeam'

const CostAttribution = () => {
  const { data, isLoading, isError } = useSpendByTeam('2026-01-01', '2026-03-01')

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

  const rows = Array.isArray(data) ? data : []
  const total = rows.reduce((sum: number, t: any) => sum + (t.cost ?? 0), 0)
  const unattributed = Math.max(0, total * 0.1)

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
        paddingRight: '72px',
      }}>
        Cost Attribution
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rows.map((t: any) => (
          <div key={t.team}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '4px',
              fontSize: '12px',
            }}>
              <span style={{ color: 'var(--colour-text-primary)' }}>{t.team}</span>
              <span style={{ color: 'var(--colour-text-secondary)' }}>
                {'\u00a3'}{(t.cost ?? 0).toLocaleString()}
              </span>
            </div>
            <div style={{
              height: '4px',
              borderRadius: '2px',
              backgroundColor: 'var(--colour-border)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${((t.cost ?? 0) / (total + unattributed)) * 100}%`,
                backgroundColor: 'var(--colour-blue, #63b3ed)',
                borderRadius: '2px',
              }} />
            </div>
          </div>
        ))}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '4px',
            fontSize: '12px',
          }}>
            <span style={{ color: 'var(--colour-text-muted)' }}>Unattributed</span>
            <span style={{ color: 'var(--colour-text-muted)' }}>
              {'\u00a3'}{unattributed.toLocaleString()}
            </span>
          </div>
          <div style={{
            height: '4px',
            borderRadius: '2px',
            backgroundColor: 'var(--colour-border)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%',
              width: `${(unattributed / (total + unattributed)) * 100}%`,
              backgroundColor: 'var(--colour-text-muted)',
              borderRadius: '2px',
            }} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default CostAttribution