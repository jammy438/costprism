'use client'

import { useQuery } from '@tanstack/react-query'
import { mockSpendOverTimeResponse, SpendOverTimeResponse } from '../mockData'

export const useSpendOverTime = (from: string, to: string, granularity?: 'day' | 'week' | 'month') => {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['spendOverTime', from, to, granularity],
    queryFn: isMock
      ? () => Promise.resolve(mockSpendOverTimeResponse)
      : () => fetchSpendOverTime(from, to),
  })
}

async function fetchSpendOverTime(from: string, to: string): Promise<SpendOverTimeResponse[]> {
  const response = await fetch(`/api/metrics/spend-over-time?from=${from}&to=${to}`)
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}