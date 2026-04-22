'use client'
import { useSpendByService } from '@/lib/hooks/useSpendByService'

const CloudCostBreakdown = () => {
  const { data, isLoading, isError } = useSpendByService('2026-01-01', '2026-03-01')

  if (isLoading) return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
      color: 'var(--colour-text-muted)',
      fontSize: '13px',
    }}>Loading...</div>
  )

  if (isError) return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
      color: 'var(--colour-red)',
      fontSize: '13px',
    }}>Failed to load</div>
  )

  const rows = Array.isArray(data) ? data : []

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
        Cloud Cost Breakdown
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {['Service', 'Cost', 'Performance'].map((h) => (
              <th key={h} style={{
                textAlign: 'left',
                fontSize: '11px',
                color: 'var(--colour-text-muted)',
                fontWeight: 500,
                paddingBottom: '10px',
                borderBottom: '1px solid var(--colour-border)',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((s: any, i: number) => (
            <tr key={s.service} style={{
              borderBottom: i < rows.length - 1 ? '1px solid var(--colour-border)' : 'none',
            }}>
              <td style={{
                padding: '10px 0',
                fontSize: '13px',
                color: 'var(--colour-text-primary)',
              }}>{s.service}</td>
              <td style={{
                padding: '10px 0',
                fontSize: '13px',
                color: 'var(--colour-text-secondary)',
              }}>{'\u00a3'}{(s.cost ?? 0).toLocaleString()}</td>
              <td style={{
                padding: '10px 0',
                fontSize: '13px',
                color: 'var(--colour-text-muted)',
              }}>{'\u2014'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default CloudCostBreakdown