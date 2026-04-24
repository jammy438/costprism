'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface Connector {
  id: string
  name: string
  type: 'AWS_CUR' | 'GCP_BILLING' | 'AZURE_COST' | 'DATADOG' | 'STRIPE' | 'CUSTOM'
  status: 'ACTIVE' | 'INACTIVE' | 'ERROR'
  syncStatus: 'IDLE' | 'QUEUED' | 'RUNNING' | 'COMPLETE' | 'ERROR'
  lastSyncedAt: string | null
  lastSyncRowCount: number | null
  lastErrorMessage: string | null
  syncStartedAt: string | null
  syncCompletedAt: string | null
  createdAt: string
  updatedAt: string
}

export const useConnectorsList = () => {
  return useQuery({
    queryKey: ['connectors'],
    queryFn: async (): Promise<Connector[]> => {
      const res = await fetch('/api/connectors')
      if (!res.ok) throw new Error('Failed to fetch connectors')
      const data = await res.json()
      return data.connectors
    },
    refetchInterval: 10000, // poll every 10s to catch sync status updates
  })
}

export const useTriggerSync = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (connectorId: string): Promise<{ jobId: string; status: string }> => {
      const res = await fetch(`/api/connectors/${connectorId}/sync`, {
        method: 'POST',
      })
      if (!res.ok) throw new Error('Failed to trigger sync')
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connectors'] })
    },
  })
}