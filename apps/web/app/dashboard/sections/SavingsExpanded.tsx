'use client'

import { useSavingsOpportunities } from '@/lib/hooks/useSavingsOpportunities'

const SavingsExpanded = () => {
  const { data, isLoading, isError } = useSavingsOpportunities()

  if (isLoading) return <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px' }}>Loading...</div>

  if (isError || !data) return (
    <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px', textAlign: 'center' as const, padding: '40px' }}>
      No savings data available.
    </div>
  )

  const { savings } = data
  const formatted = `£${savings.toLocaleString()}`

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
          background: 'var(--colour-green)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '28px',
        }}>
          💰
        </div>
        <div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: 'var(--colour-green)', marginBottom: '4px' }}>
            {formatted}
            <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--colour-text-secondary)', marginLeft: '6px' }}>/month</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--colour-text-secondary)' }}>
            Potential savings identified across your infrastructure
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--colour-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.8px', margin: '0 0 14px' }}>
          Opportunity summary
        </h3>
        <div style={{
          padding: '14px 16px',
          background: 'var(--colour-bg-page)',
          borderRadius: '10px',
          border: '1px solid var(--colour-border)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>Monthly savings potential</span>
            <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colour-green)' }}>{formatted}</span>
          </div>
          <div style={{ fontSize: '12px', color: 'var(--colour-text-secondary)', marginTop: '8px' }}>
            Annualised: {`£${(savings * 12).toLocaleString()}`}/year
          </div>
        </div>
      </div>
    </div>
  )
}

export default SavingsExpanded
