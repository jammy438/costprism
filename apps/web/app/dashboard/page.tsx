'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PageErrorBoundary from '@/app/components/dashboard/pageErrorBoundary'
import ViewGate from '@/app/components/dashboard/viewGate'

const HealthScoreCard = dynamic(() => import('./sections/HealthScoreCard'), { ssr: false })
const TotalSpendCard = dynamic(() => import('./sections/TotalSpendCard'), { ssr: false })
const SavingsCard = dynamic(() => import('./sections/SavingsCard'), { ssr: false })
const RiskAlertsCard = dynamic(() => import('./sections/RiskAlertCard'), { ssr: false })
const InsightsSummary = dynamic(() => import('./sections/InsightsSummaryCard'), { ssr: false })
const CostVsForecastCard = dynamic(() => import('./sections/CostVsForecastCard'), { ssr: false })
const CostAllocation = dynamic(() => import('./sections/CostAllocation'), { ssr: false })
const TopServiceIncreases = dynamic(() => import('./sections/TopServiceIncreases'), { ssr: false })

const DashboardPage = () => {
  return (
    <PageErrorBoundary>
      <div style={{ padding: '24px' }}>
        <Suspense fallback={null}>
          <ViewGate mode="director">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <HealthScoreCard />
                <SavingsCard />
                <RiskAlertsCard />
                <TotalSpendCard from="2026-01-01" to="2026-03-01" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <InsightsSummary />
                <CostVsForecastCard />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <CostAllocation />
                <TopServiceIncreases />
              </div>
            </div>
          </ViewGate>

          <ViewGate mode="engineer">
            <div>
              <p style={{ color: 'var(--colour-text-secondary)' }}>Engineer view coming soon</p>
            </div>
          </ViewGate>
        </Suspense>
      </div>
    </PageErrorBoundary>
  )
}

export default DashboardPage
