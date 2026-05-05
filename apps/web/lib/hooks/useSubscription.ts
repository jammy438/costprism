'use client'

import { useQuery } from '@tanstack/react-query'
import { useOrganization } from '@clerk/nextjs'

export interface SubscriptionResponse {
  status: 'ACTIVE' | 'TRIALING' | 'PAST_DUE' | 'CANCELED' | 'INCOMPLETE'
  tier: 'FREE' | 'STARTER' | 'GROWTH' | 'ENTERPRISE'
  trialEndsAt: string | null
  currentPeriodEnd: string | null
  daysRemaining: number | null
}

const mockSubscription: SubscriptionResponse = {
  status: 'TRIALING',
  tier: 'STARTER',
  trialEndsAt: new Date(Date.now() + 11 * 86400000).toISOString(),
  currentPeriodEnd: null,
  daysRemaining: 11,
}

export const useSubscription = () => {
  const { organization } = useOrganization()
  const orgId = organization?.id
  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

  return useQuery({
    queryKey: ['subscription', orgId],
    queryFn: isMock
      ? () => Promise.resolve(mockSubscription)
      : async (): Promise<SubscriptionResponse> => {
          const res = await fetch('/api/subscription')
          if (!res.ok) throw new Error('Failed to fetch subscription')
          return res.json()
        },
    staleTime: 5 * 60 * 1000,
  })
}