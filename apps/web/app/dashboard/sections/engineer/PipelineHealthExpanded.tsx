'use client'

import { usePipelineHealth } from '@/lib/hooks/usePipelineHealth'

const PipelineHealthExpanded = () => {
  const { data, isLoading, isError } = usePipelineHealth()

  if (isLoading) return <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px' }}>Loading...</div>

  if (isError || !data) return (
    <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px', textAlign: 'center' as const, padding: '40px' }}>
      No pipeline health data available.
    </div>
  )

  const { successRate, jobs } = data
  const colour = successRate >= 95 ? 'var(--colour-green)' : successRate >= 80 ? 'var(--colour-yellow)' : 'var(--colour-red)'
  const label = successRate >= 95 ? 'Healthy' : successRate >= 80 ? 'Degraded' : 'Critical'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
          background: `conic-gradient(${colour} ${successRate * 3.6}deg, var(--colour-border) 0deg)`,
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
            fontSize: '16px',
            fontWeight: 700,
            color: colour,
          }}>
            {successRate}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colour-text-primary)', marginBottom: '4px' }}>
            Pipeline Health — {label}
          </div>
          <div style={{ fontSize: '13px', color: 'var(--colour-text-secondary)' }}>
            {jobs} jobs tracked
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--colour-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.8px', margin: '0 0 14px' }}>
          Success rate
        </h3>
        <div style={{
          padding: '14px 16px',
          background: 'var(--colour-bg-page)',
          borderRadius: '10px',
          border: '1px solid var(--colour-border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>Job success rate</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: colour }}>{successRate}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'var(--colour-border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${successRate}%`, background: colour, borderRadius: '3px' }} />
          </div>
          <div style={{ fontSize: '12px', color: 'var(--colour-text-secondary)', marginTop: '8px' }}>
            {jobs} total jobs · target ≥ 95%
          </div>
        </div>
      </div>
    </div>
  )
}

export default PipelineHealthExpanded
