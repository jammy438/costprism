'use client'

import MetricCard from '@/app/components/dashboard/metricCard'
import { useAnomalies } from '@/lib/hooks/useAnomalies'

const AnomaliesCardEng = () => {
  const { data, isLoading, isError } = useAnomalies(5)

  const count = data?.length ?? 0
  const criticalCount = data?.filter(a => a.severity === 'critical').length ?? 0

  return (
    <MetricCard
      label="Cost Anomalies"
      value={`${count}`}
      trend={criticalCount > 0 ? `${criticalCount} critical` : 'none critical'}
      trendDirection={criticalCount > 0 ? 'up' : 'down'}
      upIsBad
      glow={criticalCount > 0 ? 'red' : 'none'}
      isLoading={isLoading}
      isError={isError}
    />
  )
}

export default AnomaliesCardEng