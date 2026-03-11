import MetricCard from '../components/dashboard/metricCard'
 // this is a mock dashboard page to show how the metric cards look 
export default function DashboardPage() {
  return (
    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
      <MetricCard label="Total Spend" value="£410k" trend="+12% vs last period" trendDirection="up" glow="red" upIsBad />
      <MetricCard label="Est. Monthly Savings" value="£45k" trend="Identified" trendDirection="up" glow="green" />
      <MetricCard label="Risk Alerts" value="5" trend="+1 today" trendDirection="up" glow="red" upIsBad />
      <MetricCard label="FinOps Health Score" value="81" secondaryValue="/ 100" trend="Improving" trendDirection="up" glow="green" />
    </div>
  )
}