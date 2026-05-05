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
}

const mockHealthScoreResponse: HealthScoreResponse = {
  total_score: 81,
  components: [
    {
      name: 'Tag coverage',
      score: 73,
      weight: 0.3,
      description: '73% of spend has required tags applied. Target: >80%.',
      status: 'amber',
    },
    {
      name: 'Budget adherence',
      score: 95,
      weight: 0.25,
      description: 'All budgets are within threshold and no guardrails were breached.',
      status: 'good',
    },
    {
      name: 'Anomaly rate',
      score: 82,
      weight: 0.25,
      description: 'Anomaly volume is low and the majority are non-critical.',
      status: 'good',
    },
    {
      name: 'Forecast accuracy',
      score: 78,
      weight: 0.2,
      description: 'Actual spend is within 12% of forecasted spend.',
      status: 'amber',
    },
  ],
}

export const useHealthScore = (from: string, to: string) => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['healthScore', orgId, from, to],
    queryFn: isMock
      ? () => Promise.resolve(mockHealthScoreResponse)
      : async () => {
          if (!orgId) {
            throw new Error('Organization ID is required')
          }

          const response = await fetch(`/api/metrics/health-score?from=${from}&to=${to}`)
          if (!response.ok) {
            throw new Error('Failed to fetch health score')
          }
          return response.json() as Promise<HealthScoreResponse>
        },
  })
}
