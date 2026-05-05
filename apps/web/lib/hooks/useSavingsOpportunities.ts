'use client'

import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'

export interface SavingsOpportunity {
  id: string
  title: string
  description: string
  estimated_monthly_saving: number
  category: 'rightsizing' | 'unused' | 'reserved' | 'scheduling'
  currency: string
  affected_resources: string[]
  confidence: number
}

export interface SavingsResponse {
  savings: number
  opportunities: SavingsOpportunity[]
}

const mockSavingsData: SavingsResponse = {
  savings: 2305,
  opportunities: [
    {
      id: 'sav_001',
      title: 'Right-size underutilised EC2 instances',
      description: '3 EC2 instances running at <10% CPU for 7+ days. Downsize from m5.xlarge to m5.large to save.',
      estimated_monthly_saving: 420,
      category: 'rightsizing',
      currency: 'GBP',
      affected_resources: ['i-0abc123def456', 'i-0def456abc123', 'i-0ghi789jkl012'],
      confidence: 0.92,
    },
    {
      id: 'sav_002',
      title: 'Purchase Reserved Instances for stable workloads',
      description: 'Your EC2 usage pattern qualifies for 1-year reserved pricing. Based on 90-day usage history.',
      estimated_monthly_saving: 1800,
      category: 'reserved',
      currency: 'GBP',
      affected_resources: ['i-0prod001', 'i-0prod002', 'i-0prod003', 'i-0prod004'],
      confidence: 0.85,
    },
    {
      id: 'sav_003',
      title: 'Delete unused EBS volumes',
      description: '4 unattached EBS volumes detected. No reads/writes for 30+ days.',
      estimated_monthly_saving: 85,
      category: 'unused',
      currency: 'GBP',
      affected_resources: ['vol-0aaa111bbb', 'vol-0ccc222ddd', 'vol-0eee333fff', 'vol-0ggg444hhh'],
      confidence: 0.99,
    },
  ],
}

export const useSavingsOpportunities = () => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['savings', orgId],
    queryFn: isMock
      ? () => Promise.resolve(mockSavingsData)
      : async (): Promise<SavingsResponse> => {
          const res = await fetch(`/api/metrics/savings-opportunities?orgId=${orgId}`)
          if (!res.ok) throw new Error('Network response was not ok')
          return res.json()
        },
  })
}