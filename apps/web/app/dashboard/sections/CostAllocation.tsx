'use client'

import { useSpendByProvider } from '@/lib/hooks/useSpendByProvider'
import EmptyState from '@/app/components/dashboard/emptyState'
import SeverityBadge from '@/app/components/dashboard/severitybadge'
import MiniSparkline from '@/app/components/dashboard/minisparkline'

const CostAllocation = () => {
  const { data, isLoading, isError } = useSpendByProvider()

  return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
    }}>

      <div style={{
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        fontWeight: 600,
        color: 'var(--colour-text-label)',
        marginBottom: '16px',
      }}>
        Cost Allocation
      </div>

      {isLoading && (
        <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px' }}>Loading...</div>
      )}

      {isError && (
        <div style={{ color: 'var(--colour-red)', fontSize: '13px' }}>Failed to load</div>
      )}

      {data && data.length === 0 && (
        <EmptyState
          icon={<span>☁</span>}
          title="No providers connected"
          description="Connect a cloud provider to see cost allocation"
          ctaLabel="Connect provider"
          ctaHref="/dashboard/connectors"
        />
      )}

      {data && data.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.map((provider) => (
            <div
              key={provider.provider}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
            >
              {/* Provider badge */}
              <div style={{
                padding: '4px 10px',
                borderRadius: '6px',
                backgroundColor: 'var(--colour-bg-card-hover)',
                color: 'var(--colour-text-primary)',
                fontSize: '12px',
                fontWeight: 600,
                minWidth: '48px',
                textAlign: 'center',
              }}>
                {provider.provider}
              </div>

              {/* Cost */}
              <span style={{ fontSize: '13px', color: 'var(--colour-text-secondary)', flex: 1 }}>
                £{provider.cost.toLocaleString()}
              </span>

              {/* Sparkline */}
              <MiniSparkline data={provider.sparklineData} colour="var(--colour-blue)" />

              {/* Badge */}
              <SeverityBadge
                value={provider.cost}
                direction="up"
                variant="cost"
              />
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default CostAllocation