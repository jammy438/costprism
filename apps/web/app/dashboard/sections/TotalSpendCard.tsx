'use client'

import MetricCard from '@/app/components/dashboard/metricCard'
import { useTotalSpend } from '@/lib/hooks/useTotalSpend'

const TotalSpendCard = ({ from, to }: { from: string, to: string }) => {
  const { data, isLoading, isError } = useTotalSpend(from, to)

  const trendDirection = data
    ? data.currentSpend >= data.previousSpend ? 'up' : 'down'
    : 'up'

  const percentageChange = data
    ? Math.abs(((data.currentSpend - data.previousSpend) / data.previousSpend) * 100).toFixed(1)
    : null

  const glow = trendDirection === 'up' ? 'red' : 'green'

  return (
    <MetricCard
      label="Total Cloud Spend"
      value={data ? `£${data.currentSpend.toLocaleString()}` : '—'}
      trend={percentageChange ? `${trendDirection === 'up' ? '+' : '-'}${percentageChange}% vs last period` : '—'}
      trendDirection={trendDirection}
      glow={glow}
      isLoading={isLoading}
      isError={isError}
      upIsBad
    />
  )
}

export default TotalSpendCard