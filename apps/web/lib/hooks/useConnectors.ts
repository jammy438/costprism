'use client'

import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'
import { mockConnectorsResponse, ConnectorsResponse } from '../mockData'

export const useConnectors = () => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['connectors', orgId],
    queryFn: isMock
      ? () => Promise.resolve(mockConnectorsResponse)
      : () => fetchConnectors(orgId!)
  })
}

async function fetchConnectors(orgId: string): Promise<ConnectorsResponse[]> {
  const response = await fetch(`/api/connectors?orgId=${orgId}`)
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}