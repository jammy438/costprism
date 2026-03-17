'use client'

import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'
import { mockSpendByServiceResponse, SpendByServiceResponse } from '../mockData'

export const useSpendByService = (from: string, to: string, limit: number) => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['spendByService', orgId, from, to, limit],
    queryFn: isMock
      ? () => Promise.resolve(mockSpendByServiceResponse)
      : () => fetchSpendByService(orgId!, from, to, limit)
  })
}

async function fetchSpendByService(orgId: string, from: string, to: string, limit: number): Promise<SpendByServiceResponse[]> {
  const response = await fetch(`/api/charts/spend-by-service?orgId=${orgId}&from=${from}&to=${to}&limit=${limit}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}