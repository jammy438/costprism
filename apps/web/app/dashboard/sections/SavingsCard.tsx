'use client'

import MetricCard from '@/app/components/dashboard/metricCard'
import { useSavingsOpportunities } from '@/lib/hooks/useSavingsOpportunities'

const SavingsCard = () => {
  const { data, isLoading, isError } = useSavingsOpportunities()

  const savings = (data as any)?.savings ?? 0
  const count = (data as any)?.opportunities?.length ?? 0

  return (
    <MetricCard
      label="Savings Opportunities"
      value={data ? `\u00a3${savings.toLocaleString()}` : '\u2014'}
      trend={data ? `${count} recommendation${count !== 1 ? 's' : ''} identified` : '\u2014'}
      trendDirection="down"
      glow="green"
      isLoading={isLoading}
      isError={isError}
    />
  )
}

export default SavingsCard