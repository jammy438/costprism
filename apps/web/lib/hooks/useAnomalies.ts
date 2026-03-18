'use client'

import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'
import { mockAnomaliesResponse, AnomaliesResponse } from '../mockData'

export const useAnomalies = (limit: number) => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['anomalies', orgId, limit],
    queryFn: isMock
      ? () => Promise.resolve(mockAnomaliesResponse)
      : () => fetchAnomalies(orgId!, limit)
  })
}

async function fetchAnomalies(orgId: string, limit: number): Promise<AnomaliesResponse[]> {
  const response = await fetch(`/api/anomalies?orgId=${orgId}&limit=${limit}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}