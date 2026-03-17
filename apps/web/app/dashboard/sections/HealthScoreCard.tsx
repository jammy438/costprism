'use client'

import MetricCard from '@/app/components/dashboard/metricCard'

const getGlow = (score: number): 'green' | 'red' => {
  return score >= 50 ? 'green' : 'red'
}

const HealthScoreCard = () => {
  const score = 81 // placeholder — Oli to define formula in Phase 2

  return (
    <MetricCard
      label="FinOps Health Score"
      value={`${score}`}
      secondaryValue="/ 100"
      trend="Improving"
      trendDirection="up"
      glow={getGlow(score)}
    />
  )
}

export default HealthScoreCard