'use client'

import { mockTagCoverageSummaryResponse } from '@/lib/mockData'

const TagCoverageSummaryCard = () => {
  const data = mockTagCoverageSummaryResponse
  const colour = data.score >= 80
    ? 'var(--colour-green)'
    : data.score >= 60
    ? 'var(--colour-yellow)'
    : 'var(--colour-red)'

  return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{
        position: 'absolute',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        filter: 'blur(30px)',
        top: '-20px',
        right: '-20px',
        backgroundColor: colour,
        opacity: 0.3,
        pointerEvents: 'none',
      }} />

      <div style={{
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        fontWeight: 600,
        color: 'var(--colour-text-label)',
        marginBottom: '12px',
      }}>
        Tag Coverage
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '8px' }}>
        <div style={{ fontSize: '36px', fontWeight: 700, color: colour, lineHeight: 1 }}>
          {data.score}%
        </div>
        <div style={{ fontSize: '12px', color: data.trend > 0 ? 'var(--colour-green)' : 'var(--colour-red)', marginBottom: '4px', fontWeight: 500 }}>
          {data.trend > 0 ? '\u2191' : '\u2193'} {Math.abs(data.trend)}% this month
        </div>
      </div>

      <div style={{ height: '6px', borderRadius: '3px', background: 'var(--colour-border)', overflow: 'hidden', marginBottom: '12px' }}>
        <div style={{ height: '100%', width: `${data.score}%`, background: colour, borderRadius: '3px' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'var(--colour-text-muted)' }}>Untagged spend</span>
          <span style={{ color: 'var(--colour-text-secondary)', fontWeight: 500 }}>
            {'\u00a3'}{data.untaggedSpend.toLocaleString()}
          </span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
          <span style={{ color: 'var(--colour-text-muted)' }}>Top missing key</span>
          <span style={{
            fontSize: '11px',
            padding: '1px 6px',
            borderRadius: '4px',
            background: 'rgba(252,174,30,0.1)',
            color: 'var(--colour-yellow)',
            border: '1px solid rgba(252,174,30,0.3)',
            fontFamily: 'monospace',
          }}>
            {data.topMissingKey}
          </span>
        </div>
      </div>
    </div>
  )
}

export default TagCoverageSummaryCard