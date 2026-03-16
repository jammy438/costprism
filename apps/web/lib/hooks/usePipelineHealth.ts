import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'
import { mockPipelineHealthResponse, PipelineHealthResponse } from '../mockData'

export const usePipelineHealth = () => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['pipelineHealth', orgId],
    queryFn: isMock
      ? () => Promise.resolve(mockPipelineHealthResponse)
      : () => fetchPipelineHealth(orgId!)
  })
}

async function fetchPipelineHealth(orgId: string): Promise<PipelineHealthResponse> {
  const response = await fetch(`/api/connectors/health?orgId=${orgId}`)
  if (!response.ok) throw new Error('Network response was not ok')
  return response.json()
}