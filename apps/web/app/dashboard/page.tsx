 // this is a mock dashboard page to show how the metric cards look
import ViewGate from '../../app/components/dashboard/viewGate'
import MetricCard from '../../app/components/dashboard/metricCard'
import InsightRow from '../components/dashboard/insightCard'

export default function DashboardPage() {
  return (
    <div style={{ padding: '24px' }}>

      <ViewGate mode="director">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Metric cards row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            <MetricCard label="Total Spend" value="£410k" trend="+12% vs last period" trendDirection="up" glow="red" upIsBad />
            <MetricCard label="Est. Monthly Savings" value="£45k" trend="Identified" trendDirection="up" glow="green" />
            <MetricCard label="Risk Alerts" value="5" trend="+1 today" trendDirection="up" glow="red" upIsBad />
            <MetricCard label="FinOps Health Score" value="81" secondaryValue="/ 100" trend="Improving" trendDirection="up" glow="green" />
          </div>

          {/* Second row — insights + chart */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            
            {/* Insights */}
            <div style={{
              backgroundColor: 'var(--colour-bg-card)',
              border: '1px solid var(--colour-border)',
              borderRadius: '14px',
              padding: '24px',
            }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.8px', fontWeight: 600, color: 'var(--colour-text-label)', marginBottom: '16px' }}>
                Insights Summary
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <InsightRow severity="critical" title="Compute Surge Detected" description="Sudden increase in EC2 compute costs" badge="+32%" />
                <InsightRow severity="warning" title="Pipeline Delay in ETL Job" description="Latency up 55% — further investigation needed" badge="+55%" />
                <InsightRow severity="good" title="Spot Instance Coverage Improved" description="Reserved utilisation now at 75%" badge="+15%" />
                <InsightRow severity="critical" title="Data Quality Degradation" description="Freshness dropped due to schema drift" badge="+95%" />
              </div>
            </div>

            {/* Cost vs Forecast placeholder */}
            <div style={{
              backgroundColor: 'var(--colour-bg-card)',
              border: '1px solid var(--colour-border)',
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--colour-text-muted)',
              fontSize: '13px',
            }}>
              Cost vs Forecast chart — coming in Phase 5
            </div>

          </div>
        </div>
      </ViewGate>

      <ViewGate mode="engineer">
        <div>
          <p style={{ color: 'white' }}>Engineer view coming soon</p>
        </div>
      </ViewGate>

    </div>
  )
}