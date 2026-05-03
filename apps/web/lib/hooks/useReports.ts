'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export interface ReportShare {
  id: string
  reportType: string
  token: string
  passwordHash: string | null
  expiresAt: string | null
  viewCount: number
  createdAt: string
}

export interface CreateShareInput {
  reportType: string
  expiresInDays?: number
  password?: string
}

export const useReportShares = () => {
  return useQuery({
    queryKey: ['report-shares'],
    queryFn: async (): Promise<ReportShare[]> => {
      const res = await fetch('/api/report-shares')
      if (!res.ok) throw new Error('Failed to fetch report shares')
      const data = await res.json()
      return data.shares
    },
  })
}

export const useCreateShare = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (input: CreateShareInput): Promise<{ share: ReportShare; url: string }> => {
      const res = await fetch('/api/report-shares', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      })
      if (!res.ok) throw new Error('Failed to create share')
      return res.json()
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['report-shares'] }),
  })
}

export const useDeleteShare = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string): Promise<void> => {
      const res = await fetch(`/api/report-shares/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete share')
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['report-shares'] }),
  })
}