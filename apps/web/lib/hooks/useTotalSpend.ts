'use client'

import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'
import { mockTotalSpendResponse, TotalSpendResponse} from '../mockData'

export const useTotalSpend = (from: string, to: string) => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['totalSpend', orgId, from, to],
    queryFn: isMock
      ? () => Promise.resolve(mockTotalSpendResponse)
      : () => fetchTotalSpend(orgId!, from, to)
  })
}

async function fetchTotalSpend(orgId: string, from: string, to: string): Promise<TotalSpendResponse> {
  const response = await fetch(`/api/metrics/total-spend?orgId=${orgId}&from=${from}&to=${to}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}