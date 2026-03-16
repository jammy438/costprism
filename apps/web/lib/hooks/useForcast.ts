import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'
import { mockForecastResponse, ForecastResponse } from '../mockData'

export const useForecast = (from: string, to: string) => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['forecast', orgId, from, to],
    queryFn: isMock
      ? () => Promise.resolve(mockForecastResponse)
      : () => fetchForecast(orgId!, from, to)
  })
}

async function fetchForecast(orgId: string, from: string, to: string): Promise<ForecastResponse[]> {
  const response = await fetch(`/api/metrics/forecast?orgId=${orgId}&from=${from}&to=${to}`)
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}