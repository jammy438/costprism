'use client'

import { useState } from 'react'
import MetricCard from '@/app/components/dashboard/metricCard'
import { useTotalSpend } from '@/lib/hooks/useTotalSpend'
import { useQueryClient } from '@tanstack/react-query'
import { mockSpendByServiceResponse } from '@/lib/mockData'

const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'

const TotalSpendEngineerCard = ({ from, to }: { from: string; to: string }) => {
  const { data, isLoading, isError } = useTotalSpend(from, to)
  const queryClient = useQueryClient()
  const [hovered, setHovered] = useState(false)
  const [services, setServices] = useState<{ service: string; cost: number }[]>([])

  const handleMouseEnter = async () => {
    setHovered(true)

    const cached = queryClient.getQueryData<typeof mockSpendByServiceResponse>(['spendByService'])
    if (cached) {
      setServices(cached.slice(0, 3))
      return
    }

    if (isMock) {
      setServices(mockSpendByServiceResponse.slice(0, 3))
      return
    }

    try {
      const res = await fetch(`/api/charts/spend-by-service?from=${from}&to=${to}&limit=3`)
      const json = await res.json()
      setServices(json.slice(0, 3))
    } catch {
    }
  }

  const spend = data?.currentSpend
  const prev = data?.previousSpend
  const delta = spend && prev ? ((spend - prev) / prev) * 100 : null

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setHovered(false)}
    >
      <MetricCard
        label="Total Spend"
        value={spend ? `£${spend.toLocaleString()}` : '—'}
        trend={delta !== null ? `${delta > 0 ? '+' : ''}${delta.toFixed(1)}% vs last period` : '—'}
        trendDirection={delta !== null && delta > 0 ? 'up' : 'down'}
        upIsBad
        glow={delta !== null && delta > 0 ? 'red' : 'green'}
        isLoading={isLoading}
        isError={isError}
      />

      {hovered && services.length > 0 && (
        <div style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: 'var(--colour-bg-card)',
          border: '1px solid var(--colour-border)',
          borderRadius: '10px',
          padding: '12px 16px',
          zIndex: 50,
          minWidth: '200px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}>
          <div style={{
            fontSize: '10px',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            fontWeight: 600,
            color: 'var(--colour-text-label)',
            marginBottom: '8px',
          }}>
            Top Services
          </div>
          {services.map((s) => (
            <div key={s.service} style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '24px',
              fontSize: '12px',
              color: 'var(--colour-text-primary)',
              padding: '3px 0',
            }}>
              <span>{s.service}</span>
              <span style={{ color: 'var(--colour-text-secondary)' }}>
                £{s.cost.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TotalSpendEngineerCard