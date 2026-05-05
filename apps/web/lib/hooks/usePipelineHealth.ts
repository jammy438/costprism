'use client'

import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'

export interface SyncJob {
  job_id: string
  started_at: string | null
  completed_at: string | null
  status: 'complete' | 'error' | 'running' | 'queued'
  row_count: number | null
  error_message: string | null
  duration_seconds: number | null
}

export interface ConnectorHealth {
  connector_id: string
  connector_name: string
  status: 'healthy' | 'degraded' | 'error'
  last_sync_at: string | null
  last_sync_row_count: number | null
  last_error: string | null
  success_rate_7d: number
  job_history: SyncJob[]
}

export interface PipelineHealthResponse {
  successRate: number
  jobs: number
  connectors: ConnectorHealth[]
}

const mockPipelineHealthData: PipelineHealthResponse = {
  successRate: 98.5,
  jobs: 14,
  connectors: [
    {
      connector_id: 'conn_001',
      connector_name: 'Production AWS',
      status: 'healthy',
      last_sync_at: '2026-03-15T06:00:00',
      last_sync_row_count: 42310,
      last_error: null,
      success_rate_7d: 98.5,
      job_history: [
        { job_id: 'job_014', started_at: '2026-03-15T06:00:00', completed_at: '2026-03-15T06:04:32', status: 'complete', row_count: 42310, error_message: null, duration_seconds: 272 },
        { job_id: 'job_013', started_at: '2026-03-14T06:00:00', completed_at: '2026-03-14T06:05:11', status: 'complete', row_count: 41890, error_message: null, duration_seconds: 311 },
        { job_id: 'job_012', started_at: '2026-03-13T06:00:00', completed_at: '2026-03-13T06:03:45', status: 'complete', row_count: 40210, error_message: null, duration_seconds: 225 },
        { job_id: 'job_011', started_at: '2026-03-12T06:00:00', completed_at: '2026-03-12T06:08:22', status: 'error', row_count: null, error_message: 'BigQuery quota exceeded. Retried successfully on next run.', duration_seconds: 502 },
        { job_id: 'job_010', started_at: '2026-03-11T06:00:00', completed_at: '2026-03-11T06:04:10', status: 'complete', row_count: 39540, error_message: null, duration_seconds: 250 },
      ],
    },
  ],
}

export const usePipelineHealth = () => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['pipelineHealth', orgId],
    queryFn: isMock
      ? () => Promise.resolve(mockPipelineHealthData)
      : async (): Promise<PipelineHealthResponse> => {
          const res = await fetch(`/api/connectors/health?orgId=${orgId}`)
          if (!res.ok) throw new Error('Network response was not ok')
          return res.json()
        },
  })
}