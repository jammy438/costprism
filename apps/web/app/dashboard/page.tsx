'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PageErrorBoundary from '@/app/components/dashboard/pageErrorBoundary'
import ViewGate from '@/app/components/dashboard/viewGate'
import DrillDownWrapper from '@/app/components/dashboard/drillDownWrapper'
import { useSpendByService } from '@/lib/hooks/useSpendByService'
import { useSpendByTeam } from '@/lib/hooks/useSpendByTeam'
import { useAnomalies } from '@/lib/hooks/useAnomalies'
import { useSpendOverTime } from '@/lib/hooks/useSpendOverTime'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Director components
const HealthScoreCard = dynamic(() => import('./sections/HealthScoreCard'), { ssr: false })
const TotalSpendCard = dynamic(() => import('./sections/TotalSpendCard'), { ssr: false })
const SavingsCard = dynamic(() => import('./sections/SavingsCard'), { ssr: false })
const RiskAlertsCard = dynamic(() => import('./sections/RiskAlertCard'), { ssr: false })
const InsightsSummary = dynamic(() => import('./sections/InsightsSummaryCard'), { ssr: false })
const CostVsForecastCard = dynamic(() => import('./sections/CostVsForecastCard'), { ssr: false })
const CostAllocation = dynamic(() => import('./sections/CostAllocation'), { ssr: false })
const TopServiceIncreases = dynamic(() => import('./sections/TopServiceIncreases'), { ssr: false })

// Expanded components
const HealthScoreExpanded = dynamic(() => import('./sections/HealthScoreExpanded'), { ssr: false })
const SavingsExpanded = dynamic(() => import('./sections/SavingsExpanded'), { ssr: false })
const PipelineHealthExpanded = dynamic(() => import('./sections/engineer/PipelineHealthExpanded'), { ssr: false })

// Engineer components
const TotalSpendEngineerCard = dynamic(() => import('./sections/engineer/CloudCostCard'), { ssr: false })
const AnomaliesCard = dynamic(() => import('./sections/engineer/AnomaliesCard'), { ssr: false })
const PipelineHealthCard = dynamic(() => import('./sections/engineer/PipelineHealthCard'), { ssr: false })
const InsightsFeed = dynamic(() => import('./sections/engineer/InsightsFeed'), { ssr: false })
const TopClusters = dynamic(() => import('./sections/engineer/TopClusters'), { ssr: false })
const CostAttribution = dynamic(() => import('./sections/engineer/CostAttribution'), { ssr: false })
const CloudCostBreakdown = dynamic(() => import('./sections/engineer/CloudCostBreakdown'), { ssr: false })
const PipelineFlow = dynamic(() => import('./sections/engineer/PipelineFlow'), { ssr: false })

const FROM = '2026-01-01'
const TO = '2026-03-01'

// Expanded content components
const SpendByServiceExpanded = () => {
  const { data } = useSpendByService(FROM, TO)
  const rows = Array.isArray(data) ? data : []
  return (
    <div>
      <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 16px' }}>
        Spend by service
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Service', 'Cost', '% of total'].map((h) => (
              <th key={h} style={{ textAlign: 'left', fontSize: '11px', color: 'var(--colour-text-muted)', fontWeight: 500, padding: '8px 0', borderBottom: '1px solid var(--colour-border)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((s: any, i: number) => (
            <tr key={s.service} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--colour-border)' : 'none' }}>
              <td style={{ padding: '10px 0', fontSize: '13px', color: 'var(--colour-text-primary)' }}>{s.service}</td>
              <td style={{ padding: '10px 0', fontSize: '13px', color: 'var(--colour-text-secondary)' }}>{'\u00a3'}{(s.cost ?? 0).toLocaleString()}</td>
              <td style={{ padding: '10px 0', fontSize: '13px', color: 'var(--colour-text-muted)' }}>{(s.percentage ?? 0).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const SpendByTeamExpanded = () => {
  const { data } = useSpendByTeam(FROM, TO)
  const rows = Array.isArray(data) ? data : []
  const total = rows.reduce((sum: number, t: any) => sum + (t.cost ?? 0), 0)
  return (
    <div>
      <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 16px' }}>
        Spend by team
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {rows.map((t: any) => {
          const pct = total > 0 ? ((t.cost ?? 0) / total) * 100 : 0
          return (
            <div key={t.team}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                <span style={{ color: 'var(--colour-text-primary)' }}>{t.team}</span>
                <span style={{ color: 'var(--colour-text-secondary)' }}>{'\u00a3'}{(t.cost ?? 0).toLocaleString()} <span style={{ color: 'var(--colour-text-muted)', fontSize: '11px' }}>({pct.toFixed(1)}%)</span></span>
              </div>
              <div style={{ height: '6px', borderRadius: '3px', background: 'var(--colour-border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'var(--colour-blue)', borderRadius: '3px' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const AnomaliesExpanded = () => {
  const { data } = useAnomalies(20)
  const rows = Array.isArray(data) ? data : []
  const SEVERITY_COLOURS: Record<string, string> = {
    critical: 'var(--colour-red)',
    warning: 'var(--colour-yellow)',
    info: 'var(--colour-blue)',
  }
  return (
    <div>
      <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 16px' }}>
        All anomalies
      </h3>
      {rows.length === 0 && <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px' }}>No anomalies detected.</div>}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rows.map((a: any) => (
          <div key={a.id} style={{ padding: '14px 16px', background: 'var(--colour-bg-page)', borderRadius: '10px', border: '1px solid var(--colour-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{
                fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
                background: `${SEVERITY_COLOURS[a.severity] ?? 'var(--colour-text-muted)'}18`,
                color: SEVERITY_COLOURS[a.severity] ?? 'var(--colour-text-muted)',
                border: `1px solid ${SEVERITY_COLOURS[a.severity] ?? 'var(--colour-text-muted)'}33`,
                fontWeight: 500, textTransform: 'uppercase' as const,
              }}>
                {a.severity}
              </span>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>{a.title}</span>
            </div>
            <div style={{ fontSize: '12px', color: 'var(--colour-text-secondary)' }}>{a.description}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

const SpendOverTimeExpanded = () => {
  const { data } = useSpendOverTime(FROM, TO)
  const rows = Array.isArray(data) ? data : []
  return (
    <div>
      <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '0 0 16px' }}>
        Spend over time
      </h3>
      <div style={{ height: '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={rows}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--colour-border)" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--colour-text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--colour-text-muted)' }} />
            <Tooltip contentStyle={{ background: 'var(--colour-bg-card)', border: '1px solid var(--colour-border)', borderRadius: '8px', fontSize: '12px' }} />
            <Line type="monotone" dataKey="spend" stroke="var(--colour-blue)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

const DashboardPage = () => {
  return (
    <PageErrorBoundary>
      <div style={{ padding: '24px 24px 48px 24px', boxSizing: 'border-box' }}>
        <Suspense fallback={null}>

          <ViewGate mode="director">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <DrillDownWrapper title="FinOps Health Score" queryKeys={['healthScore']} expandedContent={<HealthScoreExpanded />}>
                  <HealthScoreCard />
                </DrillDownWrapper>
                <DrillDownWrapper title="Savings Opportunities" queryKeys={['savingsOpportunities']} expandedContent={<SavingsExpanded />}>
                  <SavingsCard />
                </DrillDownWrapper>
                <DrillDownWrapper
                  title="Risk Alerts"
                  queryKeys={['anomalies']}
                  expandedContent={<AnomaliesExpanded />}
                >
                  <RiskAlertsCard />
                </DrillDownWrapper>
                <DrillDownWrapper
                  title="Total Cloud Spend"
                  queryKeys={['totalSpend']}
                  expandedContent={<SpendOverTimeExpanded />}
                >
                  <TotalSpendCard from={FROM} to={TO} />
                </DrillDownWrapper>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <DrillDownWrapper title="Insights Summary" queryKeys={['anomalies']}>
                  <InsightsSummary />
                </DrillDownWrapper>
                <DrillDownWrapper title="Cost vs Forecast" queryKeys={['spendOverTime', 'forecast']} expandedContent={<SpendOverTimeExpanded />}>
                  <CostVsForecastCard />
                </DrillDownWrapper>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <DrillDownWrapper title="Cost Allocation" queryKeys={['spendByProvider']}>
                  <CostAllocation />
                </DrillDownWrapper>
                <DrillDownWrapper title="Top Service Increases" queryKeys={['spendByService']} expandedContent={<SpendByServiceExpanded />}>
                  <TopServiceIncreases />
                </DrillDownWrapper>
              </div>
            </div>
          </ViewGate>

          <ViewGate mode="engineer">
            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 220px', gap: '16px', alignItems: 'stretch' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                <InsightsFeed />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <DrillDownWrapper title="Total Spend" queryKeys={['totalSpend']} expandedContent={<SpendOverTimeExpanded />}>
                    <TotalSpendEngineerCard from={FROM} to={TO} />
                  </DrillDownWrapper>
                  <DrillDownWrapper title="Savings" queryKeys={['savingsOpportunities']} expandedContent={<SavingsExpanded />}>
                    <SavingsCard />
                  </DrillDownWrapper>
                  <DrillDownWrapper title="Anomalies" queryKeys={['anomalies']} expandedContent={<AnomaliesExpanded />}>
                    <AnomaliesCard />
                  </DrillDownWrapper>
                  <DrillDownWrapper title="Pipeline Health" queryKeys={['pipelineHealth']} expandedContent={<PipelineHealthExpanded />}>
                    <PipelineHealthCard />
                  </DrillDownWrapper>
                </div>
                <DrillDownWrapper title="Cloud Cost Breakdown" queryKeys={['spendByService']} expandedContent={<SpendByServiceExpanded />}>
                  <CloudCostBreakdown />
                </DrillDownWrapper>
                <DrillDownWrapper title="Pipeline Flow" queryKeys={['spendByProvider', 'spendByTeam']}>
                  <PipelineFlow />
                </DrillDownWrapper>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                <DrillDownWrapper title="Top Clusters" queryKeys={['spendByService']} expandedContent={<SpendByServiceExpanded />}>
                  <TopClusters />
                </DrillDownWrapper>
                <DrillDownWrapper title="Cost Attribution" queryKeys={['spendByTeam']} expandedContent={<SpendByTeamExpanded />}>
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