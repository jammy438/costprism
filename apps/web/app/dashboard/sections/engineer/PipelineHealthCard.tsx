'use client'

import MetricCard from '@/app/components/dashboard/metricCard'
import { usePipelineHealth } from '@/lib/hooks/usePipelineHealth'

const PipelineHealthCard = () => {
  const { data, isLoading, isError } = usePipelineHealth()

  const rate = data?.successRate ?? null
  const jobs = data?.jobs ?? 0

  const glow = rate === null
    ? 'none'
    : rate >= 95
    ? 'green'
    : rate >= 80
    ? 'none'
    : 'red'

  const value = jobs === 0
    ? 'No syncs yet'
    : rate !== null
    ? `${rate}%`
    : '—'

  const trend = jobs === 0
    ? '—'
    : `${jobs} jobs tracked`

  return (
    <MetricCard
      label="Pipeline Health"
      value={value}
      trend={trend}
      trendDirection={rate !== null && rate >= 80 ? 'up' : 'down'}
      upIsBad={false}
      glow={glow}
      isLoading={isLoading}
      isError={isError}
    />
  )
}

export default PipelineHealthCard