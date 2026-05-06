'use client'

import EmptyState from '@/app/components/dashboard/emptyState'
import SeverityBadge from '@/app/components/dashboard/severitybadge'
import { useRouter } from 'next/navigation'
import { useSpendByService } from '@/lib/hooks/useSpendByService'

const FROM = '2026-01-01'
const TO = '2026-03-01'

const TopServiceIncreases = () => {
  const { data, isLoading, isError } = useSpendByService(FROM, TO, 5)
  const router = useRouter()

  const maxCost = data ? Math.max(...data.map(s => s.cost)) : 1

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
        paddingRight: '72px',
        paddingTop: '14px',
      }}>
        Top Service Increases
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
          title="No service data yet"
          description="Connect a cloud provider to see top service increases"
          ctaLabel="Connect provider"
          ctaHref="/dashboard/connectors"
        />
      )}

      {data && data.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.map((service) => (
            <div
              key={service.service}
              onClick={() => router.push(`/dashboard/costs?service=${service.service}`)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', color: 'var(--colour-text-primary)', fontWeight: 500 }}>
                  {service.service}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--colour-text-secondary)' }}>
                    £{service.cost.toLocaleString()}
                  </span>
                  <SeverityBadge
                    value={service.cost}
                    direction="up"
                    variant="cost"
                  />
                </div>
              </div>

              <div style={{
                height: '4px',
                borderRadius: '2px',
                backgroundColor: 'var(--colour-border)',
                overflow: 'hidden',
              }}>
                <div style={{
                  height: '100%',
                  borderRadius: '2px',
                  backgroundColor: 'var(--colour-red)',
                  width: `${(service.cost / maxCost) * 100}%`,
                }} />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default TopServiceIncreases