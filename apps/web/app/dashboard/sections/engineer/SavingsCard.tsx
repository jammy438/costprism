'use client'

import MetricCard from '@/app/components/dashboard/metricCard'
import { useSavingsOpportunities } from '@/lib/hooks/useSavingsOpportunities'

const SavingsCardEng = () => {
  const { data, isLoading, isError } = useSavingsOpportunities()

  return (
    <MetricCard
      label="Potential Savings"
      value={data ? `£${data.savings.toLocaleString()}/month` : '—'}
      trend="identified savings"
      trendDirection="down"
      glow="none"
      isLoading={isLoading}
      isError={isError}
      hideTrendArrow
    />
  )
}

export default SavingsCardEng