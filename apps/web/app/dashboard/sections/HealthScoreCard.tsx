'use client'

import MetricCard from '@/app/components/dashboard/metricCard'
import { useHealthScore } from '@/lib/hooks/useHealthScore'

const HealthScoreCard = () => {
  const { data, isLoading, isError } = useHealthScore('2026-01-01', '2026-03-01')

  const score = data?.total_score ?? 0
  const glow: 'green' | 'red' = score >= 70 ? 'green' : 'red'

  const trend = data
    ? score >= 80 ? 'Good' : score >= 60 ? 'Needs attention' : 'Critical'
    : '\u2014'

  return (
    <MetricCard
      label="FinOps Health Score"
      value={data ? `${score}` : '\u2014'}
      secondaryValue="/ 100"
      trend={trend}
      trendDirection={score >= 70 ? 'up' : 'down'}
      glow={glow}
      isLoading={isLoading}
      isError={isError}
    />
  )
}

export default HealthScoreCard