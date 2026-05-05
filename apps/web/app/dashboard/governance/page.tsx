'use client'
import PageErrorBoundary from '@/app/components/dashboard/pageErrorBoundary'
import dynamic from 'next/dynamic'

const GovernanceList = dynamic(() => import('./components/GovernanceList'), { ssr: false })

const GovernancePage = () => {
  return (
    <PageErrorBoundary>
      <div style={{ padding: '24px 24px 48px 24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '20px', fontWeight: 700, color: 'var(--colour-text-primary)', letterSpacing: '-0.4px', margin: 0 }}>Governance</h1>
          <p style={{ fontSize: '13px', color: 'var(--colour-text-secondary)', margin: '4px 0 0 0' }}>Define policies to detect budget breaches, tagging gaps, cost drift, and anomalies.</p>
        </div>
        <GovernanceList />
      </div>
    </PageErrorBoundary>
  )
}

export default GovernancePage