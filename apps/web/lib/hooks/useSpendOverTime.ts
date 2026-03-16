import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'
import { mockSpendOverTimeResponse, SpendOverTimeResponse } from '../mockData'

export const useSpendOverTime = (from: string, to: string, granularity: 'day' | 'week' | 'month') => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['spendOverTime', orgId, from, to, granularity],
    queryFn: isMock
      ? () => Promise.resolve(mockSpendOverTimeResponse)
      : () => fetchSpendOverTime(orgId!, from, to, granularity)
  })
}

async function fetchSpendOverTime(orgId: string, from: string, to: string, granularity: 'day' | 'week' | 'month'): Promise<SpendOverTimeResponse[]> {
  const response = await fetch(`/api/charts/spend-over-time?orgId=${orgId}&from=${from}&to=${to}&granularity=${granularity}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}