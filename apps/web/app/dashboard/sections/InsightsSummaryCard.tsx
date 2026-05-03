'use client'

import { useAnomalies } from '@/lib/hooks/useAnomalies'
import InsightRow from '@/app/components/dashboard/insightCard'
import EmptyState from '@/app/components/dashboard/emptyState'
import SkeletonRow from '@/app/components/dashboard/skeletons/skeletonRow'

const InsightsSummary = () => {
  const { data, isLoading, isError } = useAnomalies(5)

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
        Insights Summary
      </div>

      {isLoading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
        </div>
      )}

      {isError && (
        <div style={{ color: 'var(--colour-red)', fontSize: '13px' }}>
          Failed to load insights
        </div>
      )}

      {data && data.length === 0 && (
        <EmptyState
          icon={<span>✓</span>}
          title="Everything looks healthy"
          description="No active insights right now"
        />
      )}

      {data && data.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {data.map((insight: any) => (
            <InsightRow
              key={insight.id}
              title={insight.title}
              description={insight.description}
              severity={insight.severity}
              badge={insight.severity}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default InsightsSummary