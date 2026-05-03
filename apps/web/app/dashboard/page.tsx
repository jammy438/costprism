'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PageErrorBoundary from '@/app/components/dashboard/pageErrorBoundary'
import ViewGate from '@/app/components/dashboard/viewGate'
import DrillDownWrapper from '@/app/components/dashboard/drillDownWrapper'

// Director components
const HealthScoreCard = dynamic(() => import('./sections/HealthScoreCard'), { ssr: false })
const TotalSpendCard = dynamic(() => import('./sections/TotalSpendCard'), { ssr: false })
const SavingsCard = dynamic(() => import('./sections/SavingsCard'), { ssr: false })
const RiskAlertsCard = dynamic(() => import('./sections/RiskAlertCard'), { ssr: false })
const InsightsSummary = dynamic(() => import('./sections/InsightsSummaryCard'), { ssr: false })
const CostVsForecastCard = dynamic(() => import('./sections/CostVsForecastCard'), { ssr: false })
const CostAllocation = dynamic(() => import('./sections/CostAllocation'), { ssr: false })
const TopServiceIncreases = dynamic(() => import('./sections/TopServiceIncreases'), { ssr: false })

// Engineer components
const TotalSpendEngineerCard = dynamic(() => import('./sections/engineer/CloudCostCard'), { ssr: false })
const SavingsEngineerCard = dynamic(() => import('./sections/engineer/SavingsCard'), { ssr: false })
const AnomaliesCard = dynamic(() => import('./sections/engineer/AnomaliesCard'), { ssr: false })
const PipelineHealthCard = dynamic(() => import('./sections/engineer/PipelineHealthCard'), { ssr: false })
const InsightsFeed = dynamic(() => import('./sections/engineer/InsightsFeed'), { ssr: false })
const TopClusters = dynamic(() => import('./sections/engineer/TopClusters'), { ssr: false })
const CostAttribution = dynamic(() => import('./sections/engineer/CostAttribution'), { ssr: false })
const CloudCostBreakdown = dynamic(() => import('./sections/engineer/CloudCostBreakdown'), { ssr: false })
const PipelineFlow = dynamic(() => import('./sections/engineer/PipelineFlow'), { ssr: false })

const DashboardPage = () => {
  return (
    <PageErrorBoundary>
      <div style={{ padding: '24px 24px 48px 24px', boxSizing: 'border-box' }}>
        <Suspense fallback={null}>

          <ViewGate mode="director">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <DrillDownWrapper title="FinOps Health Score" queryKeys={[]}>
                  <HealthScoreCard />
                </DrillDownWrapper>
                <DrillDownWrapper title="Savings Opportunities" queryKeys={['savingsOpportunities']}>
                  <SavingsCard />
                </DrillDownWrapper>
                <DrillDownWrapper title="Risk Alerts" queryKeys={['anomalies']}>
                  <RiskAlertsCard />
                </DrillDownWrapper>
                <DrillDownWrapper title="Total Cloud Spend" queryKeys={['totalSpend']}>
                  <TotalSpendCard from="2026-01-01" to="2026-03-01" />
                </DrillDownWrapper>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <DrillDownWrapper title="Insights Summary" queryKeys={['anomalies']}>
                  <InsightsSummary />
                </DrillDownWrapper>
                <DrillDownWrapper title="Cost vs Forecast" queryKeys={['spendOverTime', 'forecast']}>
                  <CostVsForecastCard />
                </DrillDownWrapper>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <DrillDownWrapper title="Cost Allocation" queryKeys={['spendByProvider']}>
                  <CostAllocation />
                </DrillDownWrapper>
                <DrillDownWrapper title="Top Service Increases" queryKeys={['spendByService']}>
                  <TopServiceIncreases />
                </DrillDownWrapper>
              </div>
            </div>
          </ViewGate>

          <ViewGate mode="engineer">
            <div style={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr 220px',
              gap: '16px',
              alignItems: 'stretch',
            }}>
              {/* Left panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                <InsightsFeed />
              </div>

              {/* Centre panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <DrillDownWrapper title="Total Spend" queryKeys={['totalSpend']}>
                    <TotalSpendEngineerCard from="2026-01-01" to="2026-03-01" />
                  </DrillDownWrapper>
                  <DrillDownWrapper title="Savings" queryKeys={['savingsOpportunities']}>
                    <SavingsCard />
                  </DrillDownWrapper>
                  <DrillDownWrapper title="Anomalies" queryKeys={['anomalies']}>
                    <AnomaliesCard />
                  </DrillDownWrapper>
                  <DrillDownWrapper title="Pipeline Health" queryKeys={['pipelineHealth']}>
                    <PipelineHealthCard />
                  </DrillDownWrapper>
                </div>
                <DrillDownWrapper title="Cloud Cost Breakdown" queryKeys={['spendByService']}>
                  <CloudCostBreakdown />
                </DrillDownWrapper>
                <DrillDownWrapper title="Pipeline Flow" queryKeys={['spendByProvider', 'spendByTeam']}>
                  <PipelineFlow />
                </DrillDownWrapper>
              </div>

              {/* Right panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                <DrillDownWrapper title="Top Clusters" queryKeys={['spendByService']}>
                  <TopClusters />
                </DrillDownWrapper>
                <DrillDownWrapper title="Cost Attribution" queryKeys={['spendByTeam']}>
                  <CostAttribution />
                </DrillDownWrapper>
              </div>
            </div>
          </ViewGate>

        </Suspense>
      </div>
    </PageErrorBoundary>
  )
}

export default DashboardPage