'use client'

import { useState } from 'react'
import { mockCostRows, CostRowResponse } from '@/lib/mockData'

const PROVIDERS = ['All', 'AWS', 'GCP', 'Azure']
const CHARGE_TYPES = ['All', 'Usage', 'Purchase', 'Fee', 'Credit']
const PAGE_SIZE = 10

const chargeTypeBadgeColour: Record<string, string> = {
  Usage: 'rgba(99, 179, 237, 0.15)',
  Purchase: 'rgba(154, 117, 234, 0.15)',
  Fee: 'rgba(246, 173, 85, 0.15)',
  Credit: 'rgba(76, 187, 23, 0.15)',
}

const chargeTypeTextColour: Record<string, string> = {
  Usage: '#63b3ed',
  Purchase: '#9a75ea',
  Fee: '#f6ad55',
  Credit: 'var(--colour-green)',
}

const CostsTable = () => {
  const [provider, setProvider] = useState('All')
  const [chargeType, setChargeType] = useState('All')
  const [page, setPage] = useState(0)

  const isMock = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true'
  const allRows: CostRowResponse[] = isMock ? mockCostRows : []

  const filtered = allRows.filter(r =>
    (provider === 'All' || r.providerName === provider) &&
    (chargeType === 'All' || r.chargeType === chargeType)
  )

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const rows = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const filterButton = (label: string, active: boolean, onClick: () => void) => (
    <button
      key={label}
      onClick={onClick}
      style={{
        padding: '4px 12px',
        borderRadius: '6px',
        border: '1px solid var(--colour-border)',
        backgroundColor: active ? 'var(--colour-blue, #63b3ed)' : 'transparent',
        color: active ? '#000' : 'var(--colour-text-secondary)',
        fontSize: '12px',
        cursor: 'pointer',
        fontWeight: active ? 600 : 400,
      }}
    >
      {label}
    </button>
  )

  return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
    }}>

      {/* Header + filters */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          fontWeight: 600,
          color: 'var(--colour-text-label)',
        }}>
          Cost Rows — {filtered.length} results
        </div>

        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            {PROVIDERS.map(p => filterButton(p, provider === p, () => { setProvider(p); setPage(0) }))}
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {CHARGE_TYPES.map(c => filterButton(c, chargeType === c, () => { setChargeType(c); setPage(0) }))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Service', 'Resource', 'Provider', 'Region', 'Charge Type', 'Effective Cost', 'Billed Cost', 'Period'].map(h => (
                <th key={h} style={{
                  textAlign: 'left',
                  fontSize: '11px',
                  color: 'var(--colour-text-muted)',
                  fontWeight: 500,
                  paddingBottom: '10px',
                  paddingRight: '16px',
                  borderBottom: '1px solid var(--colour-border)',
                  whiteSpace: 'nowrap',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id} style={{
                borderBottom: i < rows.length - 1 ? '1px solid var(--colour-border)' : 'none',
              }}>
                <td style={{ padding: '12px 16px 12px 0', fontSize: '13px', color: 'var(--colour-text-primary)', whiteSpace: 'nowrap' }}>
                  {row.serviceName}
                </td>
                <td style={{ padding: '12px 16px 12px 0', fontSize: '12px', color: 'var(--colour-text-muted)', whiteSpace: 'nowrap' }}>
                  {row.resourceName}
                </td>
                <td style={{ padding: '12px 16px 12px 0', fontSize: '12px', color: 'var(--colour-text-secondary)' }}>
                  {row.providerName}
                </td>
                <td style={{ padding: '12px 16px 12px 0', fontSize: '12px', color: 'var(--colour-text-secondary)' }}>
                  {row.regionName}
                </td>
                <td style={{ padding: '12px 16px 12px 0' }}>
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    backgroundColor: chargeTypeBadgeColour[row.chargeType] ?? 'transparent',
                    color: chargeTypeTextColour[row.chargeType] ?? 'var(--colour-text-muted)',
                    fontWeight: 500,
                  }}>
                    {row.chargeType}
                  </span>
                </td>
                <td style={{
                  padding: '12px 16px 12px 0',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: row.effectiveCost < 0 ? 'var(--colour-green)' : 'var(--colour-text-primary)',
                  whiteSpace: 'nowrap',
                }}>
                  {row.effectiveCost < 0 ? '-' : ''}£{Math.abs(row.effectiveCost).toLocaleString()}
                </td>
                <td style={{ padding: '12px 16px 12px 0', fontSize: '13px', color: 'var(--colour-text-secondary)', whiteSpace: 'nowrap' }}>
                  £{row.billedCost.toLocaleString()}
                </td>
                <td style={{ padding: '12px 16px 12px 0', fontSize: '12px', color: 'var(--colour-text-muted)', whiteSpace: 'nowrap' }}>
                  {row.billingPeriodStart}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} style={{ padding: '24px 0', fontSize: '13px', color: 'var(--colour-text-muted)', textAlign: 'center' }}>
                  No results match the selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: '8px',
          marginTop: '16px',
          fontSize: '12px',
          color: 'var(--colour-text-muted)',
        }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid var(--colour-border)',
              backgroundColor: 'transparent',
              color: page === 0 ? 'var(--colour-text-muted)' : 'var(--colour-text-secondary)',
              cursor: page === 0 ? 'default' : 'pointer',
              fontSize: '12px',
            }}
          >← Prev</button>
          <span>Page {page + 1} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid var(--colour-border)',
              backgroundColor: 'transparent',
              color: page === totalPages - 1 ? 'var(--colour-text-muted)' : 'var(--colour-text-secondary)',
              cursor: page === totalPages - 1 ? 'default' : 'pointer',
              fontSize: '12px',
            }}
          >Next →</button>
        </div>
      )}
    </div>
  )
}

export default CostsTable