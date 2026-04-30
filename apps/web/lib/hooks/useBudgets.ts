'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'

export interface Budget {
  id: string
  name: string
  scopeType: 'ORG' | 'TEAM' | 'SERVICE' | 'ACCOUNT' | 'ENVIRONMENT'
  scopeValue?: string
  amount: number
  currency: string
  period: 'MONTHLY' | 'QUARTERLY' | 'ANNUAL'
  alertThreshold70: boolean
  alertThreshold90: boolean
  alertThreshold100: boolean
  alertChannels: ('EMAIL' | 'SLACK')[]
  createdAt: string
  updatedAt: string
}

export interface CreateBudgetInput {
  name: string
  scopeType: Budget['scopeType']
  scopeValue?: string
  amount: number
  currency?: string
  period?: Budget['period']
  alertThreshold70?: boolean
  alertThreshold90?: boolean
  alertThreshold100?: boolean
  alertChannels?: Budget['alertChannels']
}

export const useBudgets = () => {
  return useQuery({
    queryKey: ['budgets'],
    queryFn: async (): Promise<Budget[]> => {
      const res = await fetch('/api/budgets')
      if (!res.ok) throw new Error('Failed to fetch budgets')
      const data = await res.json()
      return data.budgets
    },
  })
}

export const useCreateBudget = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateBudgetInput): Promise<Budget> => {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Failed to create budget')
      const data = await res.json()
      return data.budget
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export const useUpdateBudget = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...input }: Partial<CreateBudgetInput> & { id: string }): Promise<Budget> => {
      const res = await fetch(`/api/budgets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Failed to update budget')
      const data = await res.json()
      return data.budget
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}

export const useDeleteBudget = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const res = await fetch(`/api/budgets/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete budget')
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
  })
}