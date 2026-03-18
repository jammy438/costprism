'use client'

import dynamic from 'next/dynamic'
import PageErrorBoundary from '@/app/components/dashboard/pageErrorBoundary'

const CostsChart = dynamic(() => import('./components/CostChart'), { ssr: false })
const CostsTable = dynamic(() => import('./components/CostTable'), { ssr: false })

const CostsPage = () => {
  return (
    <PageErrorBoundary>
      <div style={{ padding: '24px 24px 48px 24px', boxSizing: 'border-box' }}>
        <div style={{
          fontSize: '13px',
          fontWeight: 600,
          color: 'var(--colour-text-label)',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          marginBottom: '20px',
        }}>
          Cost Explorer
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <CostsChart />
          <CostsTable />
        </div>
      </div>
    </PageErrorBoundary>
  )
}

export default CostsPage