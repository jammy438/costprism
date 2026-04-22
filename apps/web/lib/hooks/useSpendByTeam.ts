'use client'

import { useQuery } from '@tanstack/react-query'
import { mockSpendByTeamResponse, SpendByTeamResponse } from '../mockData'

export const useSpendByTeam = (from: string, to: string) => {
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['spendByTeam', from, to],
    queryFn: isMock
      ? () => Promise.resolve(mockSpendByTeamResponse)
      : () => fetchSpendByTeam(from, to),
  })
}

async function fetchSpendByTeam(from: string, to: string): Promise<SpendByTeamResponse[]> {
  const response = await fetch(`/api/metrics/by-team?from=${from}&to=${to}`)
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}