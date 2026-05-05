'use client'

import { mockBudgetStatusResponse } from '@/lib/mockData'

const BudgetStatusCard = () => {
  const budgets = mockBudgetStatusResponse

  return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '20px',
    }}>
      <div style={{
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        fontWeight: 600,
        color: 'var(--colour-text-label)',
        marginBottom: '16px',
      }}>
        Budget Status
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {budgets.map((budget) => {
          const pct = Math.min(100, (budget.spent / budget.limit) * 100)
          const isOver = pct >= 100
          const isWarning = pct >= 90
          const colour = isOver
            ? 'var(--colour-red)'
            : isWarning
            ? 'var(--colour-yellow)'
            : 'var(--colour-green)'

          return (
            <div key={budget.id}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
                    {budget.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', marginTop: '2px' }}>
                    {budget.scopeType} {'\u00b7'} {budget.period}
                  </div>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: colour }}>
                    {'\u00a3'}{budget.spent.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)' }}>
                    of {'\u00a3'}{budget.limit.toLocaleString()}
                  </div>
                </div>
              </div>
              <div style={{ position: 'relative', height: '6px', borderRadius: '3px', background: 'var(--colour-border)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: colour,
                  borderRadius: '3px',
                  transition: 'width 0.6s ease',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                <span style={{ fontSize: '10px', color: colour, fontWeight: 500 }}>
                  {isOver ? 'Over budget' : isWarning ? 'Approaching limit' : `${pct.toFixed(0)}% used`}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--colour-text-muted)' }}>
                  {'\u00a3'}{(budget.limit - budget.spent).toLocaleString()} remaining
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default BudgetStatusCard