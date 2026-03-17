'use client'

import MetricCard from '@/app/components/dashboard/metricCard'
import { useAnomalies } from '@/lib/hooks/useAnomalies'

const RiskAlertsCard = () => {
  const { data, isLoading, isError } = useAnomalies(5)

  const count = data?.length ?? 0
  const glow = count > 0 ? 'red' : 'green'

  return (
    <MetricCard
      label="Risk Alerts"
      value={data ? `${count}` : '—'}
      trend={data?.[0]?.title ?? 'No active alerts'}
      trendDirection={count > 0 ? 'up' : 'down'}
      glow={glow}
      isLoading={isLoading}
      isError={isError}
      upIsBad
    />
  )
}

export default RiskAlertsCard