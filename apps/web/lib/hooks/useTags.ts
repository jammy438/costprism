'use client'

import { useQuery } from '@tanstack/react-query'

export interface DiscoveredTagKey {
  key: string
  resources_tagged: number
  spend_covered: number
  variants_found: string[]
  top_values: string[]
}

export interface DiscoveredTagsResponse {
  discovered_keys: DiscoveredTagKey[]
  untagged_spend: number
  total_spend: number
  currency: string
}

export interface NormalisedKey {
  canonical_key: string
  canonical_values: Record<string, string[]>
  resources_normalised: number
  spend_covered: number
}

export interface NormalisedTagsResponse {
  normalised_keys: NormalisedKey[]
  currency: string
}

export const useDiscoveredTags = () => {
  return useQuery({
    queryKey: ['tags-discovered'],
    queryFn: async (): Promise<DiscoveredTagsResponse> => {
      const res = await fetch('/api/tags/discovered')
      if (!res.ok) throw new Error('Failed to fetch discovered tags')
      return res.json()
    },
  })
}

export const useNormalisedTags = () => {
  return useQuery({
    queryKey: ['tags-normalised'],
    queryFn: async (): Promise<NormalisedTagsResponse> => {
      const res = await fetch('/api/tags/normalised')
      if (!res.ok) throw new Error('Failed to fetch normalised tags')
      return res.json()
    },
  })
}