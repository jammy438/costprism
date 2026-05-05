'use client'
import PageErrorBoundary from '@/app/components/dashboard/pageErrorBoundary'

import dynamic from 'next/dynamic'

const ConnectorsList = dynamic(() => import('./components/ConnectorsList'), { ssr: false })

const ConnectorsPage = () => {
  return (
    <PageErrorBoundary>
    <div style={{ padding: '24px 24px 48px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--colour-text-primary)',
          letterSpacing: '-0.4px',
          margin: 0,
        }}>
          Connectors
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--colour-text-secondary)',
          margin: '4px 0 0 0',
        }}>
          Manage your cloud data sources and monitor sync status.
        </p>
      </div>
      <ConnectorsList />
    </div>
  )
}

export default ConnectorsPage
