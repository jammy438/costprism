'use client'

import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'
import { mockSavingsResponse, SavingsResponse } from '../mockData'

export const useSavingsOpportunities = () => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['savings', orgId],
    queryFn: isMock
      ? () => Promise.resolve(mockSavingsResponse)
      : () => fetchSavings(orgId!)
  })
}

async function fetchSavings(orgId: string): Promise<SavingsResponse> {
  const response = await fetch(`/api/metrics/savings-opportunities?orgId=${orgId}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}