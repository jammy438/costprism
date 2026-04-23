'use client'

import dynamic from 'next/dynamic'

const BudgetsList = dynamic(() => import('./components/BudgetsList'), { ssr: false })

const BudgetsPage = () => {
  return (
    <div style={{ padding: '24px 24px 48px 24px' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
      }}>
        <div>
          <h1 style={{
            fontSize: '20px',
            fontWeight: 700,
            color: 'var(--colour-text-primary)',
            letterSpacing: '-0.4px',
            margin: 0,
          }}>
            Budgets
          </h1>
          <p style={{
            fontSize: '13px',
            color: 'var(--colour-text-secondary)',
            margin: '4px 0 0 0',
          }}>
            Set spend limits and get alerted before you overshoot.
          </p>
        </div>
      </div>
      <BudgetsList />
    </div>
  )
}

export default BudgetsPage