import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'
import { mockSpendByProviderResponse, SpendByProviderResponse } from '../mockData'

export const useSpendByProvider = () => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['spendByProvider', orgId],
    queryFn: isMock
      ? () => Promise.resolve(mockSpendByProviderResponse)
      : () => fetchSpendByProvider(orgId!)
  })
}

async function fetchSpendByProvider(orgId: string): Promise<SpendByProviderResponse[]> {
  const response = await fetch(`/api/charts/spend-by-provider?orgId=${orgId}`)
  if (!response.ok) {
    throw new Error('Network response was not ok')
  }
  return response.json()
}