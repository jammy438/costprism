'use client'

import { useHealthScore, HealthScoreComponent } from '@/lib/hooks/useHealthScore'

const STATUS_COLOURS: Record<string, string> = {
  good: 'var(--colour-green)',
  amber: 'var(--colour-yellow)',
  critical: 'var(--colour-red)',
}

const HealthScoreExpanded = () => {
  const { data, isLoading } = useHealthScore('2026-01-01', '2026-03-01')

  if (isLoading) return <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px' }}>Loading...</div>

  if (!data) return (
    <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px', textAlign: 'center' as const, padding: '40px' }}>
      No health score data available.
    </div>
  )

  const colour = data.total_score >= 80 ? 'var(--colour-green)' : data.total_score >= 60 ? 'var(--colour-yellow)' : 'var(--colour-red)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Total score */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        padding: '20px',
        background: 'var(--colour-bg-page)',
        borderRadius: '12px',
        border: '1px solid var(--colour-border)',
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `conic-gradient(${colour} ${data.total_score * 3.6}deg, var(--colour-border) 0deg)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          position: 'relative' as const,
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: 'var(--colour-bg-page)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '18px',
            fontWeight: 700,
            color: colour,
          }}>
            {data.total_score}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colour-text-primary)', marginBottom: '4px' }}>
            FinOps Health Score
          </div>
          <div style={{ fontSize: '13px', color: 'var(--colour-text-secondary)' }}>
            {data.total_score >= 80 ? 'Good — your FinOps practice is healthy' : data.total_score >= 60 ? 'Needs attention — some areas require improvement' : 'Critical — significant FinOps gaps detected'}
          </div>
        </div>
      </div>

      {/* Component breakdown */}
      <div>
        <h3 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--colour-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.8px', margin: '0 0 14px' }}>
          Score breakdown
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.components.map((c: HealthScoreComponent) => {
            const colour = STATUS_COLOURS[c.status] ?? 'var(--colour-text-muted)'
            return (
              <div key={c.name} style={{
                padding: '14px 16px',
                background: 'var(--colour-bg-page)',
                borderRadius: '10px',
                border: '1px solid var(--colour-border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>{c.name}</span>
                    <span style={{ fontSize: '10px', color: 'var(--colour-text-muted)' }}>weight: {(c.weight * 100).toFixed(0)}%</span>
                  </div>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: colour }}>{c.score}</span>
                </div>
                <div style={{ height: '4px', borderRadius: '2px', background: 'var(--colour-border)', overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ height: '100%', width: `${c.score}%`, background: colour, borderRadius: '2px' }} />
                </div>
                <div style={{ fontSize: '12px', color: 'var(--colour-text-secondary)' }}>{c.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default HealthScoreExpanded