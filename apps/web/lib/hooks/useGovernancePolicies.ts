'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface GovernancePolicy {
  id: string
  name: string
  description?: string
  type: 'BUDGET_GUARDRAIL' | 'TAGGING_REQUIRED' | 'DRIFT_DETECTION' | 'SPEND_ANOMALY'
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  config: Record<string, unknown>
  enabled: boolean
  createdAt: string
  updatedAt: string
}

export interface CreatePolicyInput {
  name: string
  description?: string
  type: GovernancePolicy['type']
  severity: GovernancePolicy['severity']
  config: Record<string, unknown>
  enabled?: boolean
}

export const useGovernancePolicies = () => {
  return useQuery({
    queryKey: ['governance-policies'],
    queryFn: async (): Promise<GovernancePolicy[]> => {
      const res = await fetch('/api/governance/policies')
      if (!res.ok) throw new Error('Failed to fetch policies')
      const data = await res.json()
      return data.policies
    },
  })
}

export const useCreatePolicy = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreatePolicyInput): Promise<GovernancePolicy> => {
      const res = await fetch('/api/governance/policies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Failed to create policy')
      const data = await res.json()
      return data.policy
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['governance-policies'] }),
  })
}

export const useUpdatePolicy = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreatePolicyInput> & { id: string }): Promise<GovernancePolicy> => {
      const res = await fetch(`/api/governance/policies/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Failed to update policy')
      const data = await res.json()
      return data.policy
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['governance-policies'] }),
  })
}

export const useDeletePolicy = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const res = await fetch(`/api/governance/policies/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete policy')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['governance-policies'] }),
  })
}