'use client'

import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'
import { mockSpendByTeamResponse, SpendByTeamResponse } from '../mockData'

export const useSpendByTeam = () => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['spendByTeam', orgId],
    queryFn: isMock
      ? () => Promise.resolve(mockSpendByTeamResponse)
      : () => fetchSpendByTeam(orgId!)
  })
}

async function fetchSpendByTeam(orgId: string): Promise<SpendByTeamResponse[]> {
  const response = await fetch(`/api/charts/spend-by-team?orgId=${orgId}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}