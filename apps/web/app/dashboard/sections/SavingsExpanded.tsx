'use client'

import { useSavingsOpportunities } from '@/lib/hooks/useSavingsOpportunities'

const CATEGORY_LABELS: Record<string, string> = {
  rightsizing: 'Right-sizing',
  unused: 'Unused resources',
  reserved: 'Reserved instances',
  scheduling: 'Scheduling',
}

const CATEGORY_COLOURS: Record<string, string> = {
  rightsizing: 'var(--colour-blue)',
  unused: 'var(--colour-yellow)',
  reserved: 'var(--colour-green)',
  scheduling: 'var(--colour-orange)',
}

const ConfidenceBadge = ({ confidence }: { confidence: number }) => {
  const pct = Math.round(confidence * 100)
  const colour = pct >= 90 ? 'var(--colour-green)' : pct >= 70 ? 'var(--colour-yellow)' : 'var(--colour-orange)'
  return (
    <span style={{
      fontSize: '10px',
      padding: '2px 6px',
      borderRadius: '4px',
      background: `${colour}18`,
      color: colour,
      border: `1px solid ${colour}33`,
      fontWeight: 500,
    }}>
      {pct}% confidence
    </span>
  )
}

const SavingsExpanded = () => {
  const { data, isLoading } = useSavingsOpportunities()

  if (isLoading) return <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px' }}>Loading...</div>

  const opportunities = (data as any)?.opportunities ?? []
  const total = (data as any)?.savings ?? 0

  if (opportunities.length === 0) return (
    <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px', textAlign: 'center' as const, padding: '40px' }}>
      No savings opportunities identified yet.
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Total savings */}
      <div style={{
        padding: '16px 20px',
        background: 'rgba(76,187,23,0.08)',
        border: '1px solid rgba(76,187,23,0.25)',
        borderRadius: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: '13px', color: 'var(--colour-text-secondary)' }}>
          Total estimated monthly saving
        </div>
        <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--colour-green)' }}>
          {'\u00a3'}{total.toLocaleString()}
        </div>
      </div>

      {/* Opportunities */}
      <div>
        <h3 style={{ fontSize: '11px', fontWeight: 600, color: 'var(--colour-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.8px', margin: '0 0 14px' }}>
          Recommendations ({opportunities.length})
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {opportunities.map((opp: any) => {
            const catColour = CATEGORY_COLOURS[opp.category] ?? 'var(--colour-text-muted)'
            return (
              <div key={opp.id} style={{
                padding: '16px',
                background: 'var(--colour-bg-page)',
                borderRadius: '10px',
                border: '1px solid var(--colour-border)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '10px',
                        padding: '2px 8px',
                        borderRadius: '20px',
                        background: `${catColour}18`,
                        color: catColour,
                        border: `1px solid ${catColour}33`,
                        fontWeight: 500,
                      }}>
                        {CATEGORY_LABELS[opp.category] ?? opp.category}
                      </span>
                      {opp.confidence !== undefined && <ConfidenceBadge confidence={opp.confidence} />}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>{opp.title}</div>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colour-green)', flexShrink: 0, marginLeft: '16px' }}>
                    {'\u00a3'}{(opp.estimated_monthly_saving ?? 0).toLocaleString()}<span style={{ fontSize: '11px', fontWeight: 400, color: 'var(--colour-text-muted)' }}>/mo</span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: 'var(--colour-text-secondary)', marginBottom: opp.affected_resources?.length ? '8px' : 0 }}>
                  {opp.description}
                </div>
                {opp.affected_resources?.length > 0 && (
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' as const }}>
                    {opp.affected_resources.slice(0, 5).map((r: string) => (
                      <span key={r} style={{
                        fontSize: '10px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'var(--colour-bg-card)',
                        color: 'var(--colour-text-muted)',
                        border: '1px solid var(--colour-border)',
                        fontFamily: 'monospace',
                      }}>
                        {r}
                      </span>
                    ))}
                    {opp.affected_resources.length > 5 && (
                      <span style={{ fontSize: '10px', color: 'var(--colour-text-muted)', padding: '2px 4px' }}>
                        +{opp.affected_resources.length - 5} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default SavingsExpanded