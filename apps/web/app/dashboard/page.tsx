'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import PageErrorBoundary from '@/app/components/dashboard/pageErrorBoundary'
import ViewGate from '@/app/components/dashboard/viewGate'
import DrillDownWrapper from '@/app/components/dashboard/drillDownWrapper'
import { useDateRange } from '@/lib/context/DateRangeContext'
import { useSpendByService } from '@/lib/hooks/useSpendByService'
import { useSpendByTeam } from '@/lib/hooks/useSpendByTeam'
import { useAnomalies } from '@/lib/hooks/useAnomalies'
import { useSpendOverTime } from '@/lib/hooks/useSpendOverTime'
import { useTotalSpend } from '@/lib/hooks/useTotalSpend'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

// Director components
const HealthScoreCard = dynamic(() => import('./sections/HealthScoreCard'), { ssr: false })
const TotalSpendCard = dynamic(() => import('./sections/TotalSpendCard'), { ssr: false })
const SavingsCard = dynamic(() => import('./sections/SavingsCard'), { ssr: false })
const RiskAlertsCard = dynamic(() => import('./sections/RiskAlertCard'), { ssr: false })
const InsightsSummary = dynamic(() => import('./sections/InsightsSummaryCard'), { ssr: false })
const CostVsForecastCard = dynamic(() => import('./sections/CostVsForecastCard'), { ssr: false })
const CostAllocation = dynamic(() => import('./sections/CostAllocation'), { ssr: false })
const TopServiceIncreases = dynamic(() => import('./sections/TopServiceIncreases'), { ssr: false })
const BudgetStatusCard = dynamic(() => import('./sections/director/BudgetStatusCard'), { ssr: false })
const MonthlyTrendCard = dynamic(() => import('./sections/director/MonthlyTrendCard'), { ssr: false })
const TopCostDriversCard = dynamic(() => import('./sections/director/TopCostDriversCard'), { ssr: false })
const TagCoverageSummaryCard = dynamic(() => import('./sections/director/TagCoverageSummaryCard'), { ssr: false })

// Engineer components
const TotalSpendEngineerCard = dynamic(() => import('./sections/engineer/CloudCostCard'), { ssr: false })
const AnomaliesCard = dynamic(() => import('./sections/engineer/AnomaliesCard'), { ssr: false })
const PipelineHealthCard = dynamic(() => import('./sections/engineer/PipelineHealthCard'), { ssr: false })
const InsightsFeed = dynamic(() => import('./sections/engineer/InsightsFeed'), { ssr: false })
const TopClusters = dynamic(() => import('./sections/engineer/TopClusters'), { ssr: false })
const CostAttribution = dynamic(() => import('./sections/engineer/CostAttribution'), { ssr: false })
const CloudCostBreakdown = dynamic(() => import('./sections/engineer/CloudCostBreakdown'), { ssr: false })
const PipelineFlow = dynamic(() => import('./sections/engineer/PipelineFlow'), { ssr: false })

// Expanded drill-down components
const HealthScoreExpandedView = dynamic(() => import('./sections/HealthScoreExpanded'), { ssr: false })
const SavingsExpandedView = dynamic(() => import('./sections/SavingsExpanded'), { ssr: false })
const PipelineHealthExpandedView = dynamic(() => import('./sections/engineer/PipelineHealthExpanded'), { ssr: false })

const sectionLabel = {
  fontSize: '11px',
  fontWeight: 600,
  color: 'var(--colour-text-secondary)',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.8px',
  margin: '0 0 14px',
}

const PendingDataState = ({ message }: { message: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '200px',
    gap: '12px',
    textAlign: 'center' as const,
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      borderRadius: '10px',
      background: 'var(--colour-bg-page)',
      border: '1px solid var(--colour-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
    }}>
      {'\u23f3'}
    </div>
    <div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-secondary)', marginBottom: '4px' }}>
        Awaiting data
      </div>
      <div style={{ fontSize: '12px', color: 'var(--colour-text-muted)', maxWidth: '280px' }}>
        {message}
      </div>
    </div>
  </div>
)

const TotalSpendExpanded = ({ from, to }: { from: string; to: string }) => {
  const { data: totalSpend } = useTotalSpend(from, to)
  const { data: overTime } = useSpendOverTime(from, to)
  const { data: byService } = useSpendByService(from, to)
  const timeRows = Array.isArray(overTime) ? overTime : []
  const serviceRows = Array.isArray(byService) ? byService : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { label: 'Current period', value: totalSpend ? `\u00a3${totalSpend.currentSpend.toLocaleString()}` : '\u2014' },
          { label: 'Previous period', value: totalSpend ? `\u00a3${totalSpend.previousSpend.toLocaleString()}` : '\u2014' },
          { label: 'Change', value: totalSpend ? `${((totalSpend.currentSpend - totalSpend.previousSpend) / totalSpend.previousSpend * 100).toFixed(1)}%` : '\u2014' },
        ].map((s) => (
          <div key={s.label} style={{ padding: '14px 16px', background: 'var(--colour-bg-page)', borderRadius: '10px', border: '1px solid var(--colour-border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.6px', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--colour-text-primary)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {timeRows.length > 0 && (
        <div>
          <h3 style={sectionLabel}>Spend over time</h3>
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeRows}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--colour-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--colour-text-muted)' }} />
                <YAxis tick={{ fontSize: 10, fill: 'var(--colour-text-muted)' }} />
                <Tooltip contentStyle={{ background: 'var(--colour-bg-card)', border: '1px solid var(--colour-border)', borderRadius: '8px', fontSize: '12px' }} />
                <Line type="monotone" dataKey="spend" stroke="var(--colour-blue)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {serviceRows.length > 0 && (
        <div>
          <h3 style={sectionLabel}>Top services</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Service', 'Cost', '% of total'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '11px', color: 'var(--colour-text-muted)', fontWeight: 500, padding: '8px 0', borderBottom: '1px solid var(--colour-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {serviceRows.map((s: any, i: number) => (
                <tr key={s.service} style={{ borderBottom: i < serviceRows.length - 1 ? '1px solid var(--colour-border)' : 'none' }}>
                  <td style={{ padding: '10px 0', fontSize: '13px', color: 'var(--colour-text-primary)' }}>{s.service}</td>
                  <td style={{ padding: '10px 0', fontSize: '13px', color: 'var(--colour-text-secondary)' }}>{'\u00a3'}{(s.cost ?? 0).toLocaleString()}</td>
                  <td style={{ padding: '10px 0', fontSize: '13px', color: 'var(--colour-text-muted)' }}>{(s.percentage ?? 0).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
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
  if (rows.length === 0) return <PendingDataState message="No anomalies detected in this period. Anomaly detection runs daily against your cost data." />
  return (
    <div>
      <h3 style={sectionLabel}>All anomalies ({rows.length})</h3>
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

const SpendByServiceExpanded = ({ from, to }: { from: string; to: string }) => {
  const { data } = useSpendByService(from, to)
  const rows = Array.isArray(data) ? data : []
  if (rows.length === 0) return <PendingDataState message="Service breakdown data will appear once your first sync completes." />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={sectionLabel}>Spend by service</h3>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows.slice(0, 8)} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--colour-border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--colour-text-muted)' }} />
              <YAxis type="category" dataKey="service" tick={{ fontSize: 10, fill: 'var(--colour-text-muted)' }} width={100} />
              <Tooltip contentStyle={{ background: 'var(--colour-bg-card)', border: '1px solid var(--colour-border)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="cost" fill="var(--colour-blue)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <h3 style={sectionLabel}>Full breakdown</h3>
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
    </div>
  )
}

const SpendByTeamExpanded = ({ from, to }: { from: string; to: string }) => {
  const { data } = useSpendByTeam(from, to)
  const rows = Array.isArray(data) ? data : []
  const total = rows.reduce((sum: number, t: any) => sum + (t.cost ?? 0), 0)
  if (rows.length === 0) return <PendingDataState message="Team attribution requires resources to be tagged with the 'team' key. Check your tag coverage." />
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h3 style={sectionLabel}>Spend by team</h3>
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={rows} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--colour-border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: 'var(--colour-text-muted)' }} />
              <YAxis type="category" dataKey="team" tick={{ fontSize: 10, fill: 'var(--colour-text-muted)' }} width={80} />
              <Tooltip contentStyle={{ background: 'var(--colour-bg-card)', border: '1px solid var(--colour-border)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="cost" fill="var(--colour-blue)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div>
        <h3 style={sectionLabel}>Full breakdown</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {rows.map((t: any) => {
            const pct = total > 0 ? ((t.cost ?? 0) / total) * 100 : 0
            return (
              <div key={t.team}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                  <span style={{ color: 'var(--colour-text-primary)' }}>{t.team}</span>
                  <span style={{ color: 'var(--colour-text-secondary)' }}>
                    {'\u00a3'}{(t.cost ?? 0).toLocaleString()}
                    <span style={{ color: 'var(--colour-text-muted)', fontSize: '11px', marginLeft: '6px' }}>({pct.toFixed(1)}%)</span>
                  </span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'var(--colour-border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: 'var(--colour-blue)', borderRadius: '3px' }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const DashboardPage = () => {
  const { dateRange } = useDateRange()
  const { from, to } = dateRange

  return (
    <PageErrorBoundary>
      <div style={{ padding: '24px 24px 48px 24px', boxSizing: 'border-box' }}>
        <Suspense fallback={null}>

          <ViewGate mode="director">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

              {/* Row 1 — 4 key metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
                <DrillDownWrapper title="FinOps Health Score" queryKeys={['healthScore']} expandedContent={<HealthScoreExpandedView />}>
                  <HealthScoreCard />
                </DrillDownWrapper>
                <DrillDownWrapper title="Total Cloud Spend" queryKeys={['totalSpend']} expandedContent={<TotalSpendExpanded from={from} to={to} />}>
                  <TotalSpendCard from={from} to={to} />
                </DrillDownWrapper>
                <DrillDownWrapper title="Savings Opportunities" queryKeys={['savings']} expandedContent={<SavingsExpandedView />}>
                  <SavingsCard />
                </DrillDownWrapper>
                <DrillDownWrapper title="Risk Alerts" queryKeys={['anomalies']} expandedContent={<AnomaliesExpanded />}>
                  <RiskAlertsCard />
                </DrillDownWrapper>
              </div>

              {/* Row 2 — Budget status + Monthly trend */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <DrillDownWrapper title="Budget Status" queryKeys={['budgets']}>
                  <BudgetStatusCard />
                </DrillDownWrapper>
                <DrillDownWrapper title="Month-on-Month Spend" queryKeys={['spendOverTime']}>
                  <MonthlyTrendCard />
                </DrillDownWrapper>
              </div>

              {/* Row 3 — Top cost drivers + Tag coverage + Insights */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <DrillDownWrapper title="Top Cost Drivers" queryKeys={['spendByTeam', 'spendByService']}>
                  <TopCostDriversCard />
                </DrillDownWrapper>
                <DrillDownWrapper title="Tag Coverage" queryKeys={['tags']}>
                  <TagCoverageSummaryCard />
                </DrillDownWrapper>
                <DrillDownWrapper title="Insights Summary" queryKeys={['anomalies']} expandedContent={<AnomaliesExpanded />}>
                  <InsightsSummary />
                </DrillDownWrapper>
              </div>

              {/* Row 4 — Cost allocation + Top service increases */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <DrillDownWrapper title="Cost Allocation" queryKeys={['spendByProvider']} expandedContent={<SpendByTeamExpanded from={from} to={to} />}>
                  <CostAllocation />
                </DrillDownWrapper>
                <DrillDownWrapper title="Top Service Increases" queryKeys={['spendByService']} expandedContent={<SpendByServiceExpanded from={from} to={to} />}>
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
                  <DrillDownWrapper title="Total Spend" queryKeys={['totalSpend']} expandedContent={<TotalSpendExpanded from={from} to={to} />}>
                    <TotalSpendEngineerCard from={from} to={to} />
                  </DrillDownWrapper>
                  <DrillDownWrapper title="Savings" queryKeys={['savings']} expandedContent={<SavingsExpandedView />}>
                    <SavingsCard />
                  </DrillDownWrapper>
                  <DrillDownWrapper title="Anomalies" queryKeys={['anomalies']} expandedContent={<AnomaliesExpanded />}>
                    <AnomaliesCard />
                  </DrillDownWrapper>
                  <DrillDownWrapper title="Pipeline Health" queryKeys={['pipelineHealth']} expandedContent={<PipelineHealthExpandedView />}>
                    <PipelineHealthCard />
                  </DrillDownWrapper>
                </div>
                <DrillDownWrapper title="Cloud Cost Breakdown" queryKeys={['spendByService']} expandedContent={<SpendByServiceExpanded from={from} to={to} />}>
                  <CloudCostBreakdown />
                </DrillDownWrapper>
                <DrillDownWrapper title="Pipeline Flow" queryKeys={['spendByProvider', 'spendByTeam']} expandedContent={<SpendByTeamExpanded from={from} to={to} />}>
                  <PipelineFlow />
                </DrillDownWrapper>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                <DrillDownWrapper title="Top Clusters" queryKeys={['spendByService']} expandedContent={<SpendByServiceExpanded from={from} to={to} />}>
                  <TopClusters />
                </DrillDownWrapper>
                <DrillDownWrapper title="Cost Attribution" queryKeys={['spendByTeam']} expandedContent={<SpendByTeamExpanded from={from} to={to} />}>
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