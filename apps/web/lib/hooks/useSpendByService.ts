'use client'

import { useQuery } from '@tanstack/react-query'
import { mockSpendByServiceResponse, SpendByServiceResponse } from '../mockData'

export const useSpendByService = (from: string, to: string) => {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['spendByService', from, to],
    queryFn: isMock
      ? () => Promise.resolve(mockSpendByServiceResponse)
      : () => fetchSpendByService(from, to),
  })
}

async function fetchSpendByService(from: string, to: string): Promise<SpendByServiceResponse[]> {
  const response = await fetch(`/api/metrics/by-service?from=${from}&to=${to}`)
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}