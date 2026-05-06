'use client'

import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'

export interface HealthScoreComponent {
  name: string
  score: number
  weight: number
  description: string
  status: 'good' | 'amber' | 'critical'
}

export interface HealthScoreResponse {
  total_score: number
  components: HealthScoreComponent[]
  currency: string
}

const mockHealthScore: HealthScoreResponse = {
  total_score: 81,
  components: [
    { name: 'Tag coverage', score: 73, weight: 0.3, description: '73% of spend has required tags applied. Target: >80%.', status: 'amber' },
    { name: 'Budget adherence', score: 95, weight: 0.25, description: 'All budgets within threshold. No guardrails breached.', status: 'good' },
    { name: 'Anomaly rate', score: 82, weight: 0.25, description: '2 anomalies detected this period. 1 critical, 1 warning.', status: 'good' },
    { name: 'Forecast accuracy', score: 78, weight: 0.2, description: 'Actual spend within 12% of forecast. Target: <10% variance.', status: 'amber' },
  ],
  currency: 'GBP',
}

export const useHealthScore = (from: string, to: string) => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
  return useQuery({
    queryKey: ['healthScore', from, to, orgId],
    queryFn: isMock
      ? () => Promise.resolve(mockHealthScore)
      : async (): Promise<HealthScoreResponse> => {
          const res = await fetch(`/api/metrics/health-score?from=${from}&to=${to}`)
          if (!res.ok) throw new Error('Failed to fetch health score')
          return res.json()
        },
  })
}