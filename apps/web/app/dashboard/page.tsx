 // this is a mock dashboard page to show how the metric cards look
import ViewGate from '../../app/components/dashboard/viewGate'
import MetricCard from '../../app/components/dashboard/metricCard'
 
export default function DashboardPage() {
  return (
    <div style={{ padding: '24px' }}>
      <ViewGate mode="director">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          <MetricCard label="Total Spend" value="£410k" trend="+12% vs last period" trendDirection="up" glow="red" upIsBad />
          <MetricCard label="Est. Monthly Savings" value="£45k" trend="Identified" trendDirection="up" glow="green" />
          <MetricCard label="Risk Alerts" value="5" trend="+1 today" trendDirection="up" glow="red" upIsBad />
          <MetricCard label="FinOps Health Score" value="81" secondaryValue="/ 100" trend="Improving" trendDirection="up" glow="green" />
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