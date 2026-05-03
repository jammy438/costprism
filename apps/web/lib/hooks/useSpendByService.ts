'use client'

import { useQuery } from '@tanstack/react-query'
import { mockSpendByServiceResponse, SpendByServiceResponse } from '../mockData'

export const useSpendByService = (from: string, to: string, limit?: number) => {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['spendByService', from, to, limit],
    queryFn: isMock
      ? () => Promise.resolve(mockSpendByServiceResponse.slice(0, limit))
      : () => fetchSpendByService(from, to, limit),
  })
}

async function fetchSpendByService(from: string, to: string, limit?: number): Promise<SpendByServiceResponse[]> {
  const response = await fetch(`/api/metrics/by-service?from=${from}&to=${to}`)
  if (!response.ok) throw new Error('Network response was not ok')
  const data = await response.json()
  return limit != null ? data.slice(0, limit) : data
}