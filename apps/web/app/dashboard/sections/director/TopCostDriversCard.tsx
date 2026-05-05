'use client'

import { useState } from 'react'
import { mockSpendByTeamResponse, mockSpendByServiceResponse } from '@/lib/mockData'

const TopCostDriversCard = () => {
  const [view, setView] = useState<'team' | 'service'>('team')

  const teamData = mockSpendByTeamResponse.slice(0, 5)
  const serviceData = mockSpendByServiceResponse.slice(0, 5)
  const rows = view === 'team' ? teamData : serviceData
  const total = rows.reduce((sum, r) => sum + r.cost, 0)

  return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          fontWeight: 600,
          color: 'var(--colour-text-label)',
        }}>
          Top Cost Drivers
        </div>
        <div style={{ display: 'flex', border: '1px solid var(--colour-border)', borderRadius: '6px', overflow: 'hidden' }}>
          {(['team', 'service'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '4px 10px',
                border: 'none',
                background: view === v ? 'var(--colour-blue)' : 'transparent',
                color: view === v ? '#fff' : 'var(--colour-text-muted)',
                fontSize: '11px',
                cursor: 'pointer',
                transition: 'background-color 0.15s ease',
              }}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {rows.map((row, i) => {
          const name = 'team' in row ? row.team : row.service
          const pct = (row.cost / total) * 100
          const barColours = [
            'var(--colour-blue)',
            '#5b8fff',
            '#7aa5ff',
            '#99bcff',
            '#b8d3ff',
          ]
          return (
            <div key={name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    background: barColours[i],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '9px',
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                  }}>
                    {i + 1}
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--colour-text-primary)' }}>{name}</span>
                </div>
                <div style={{ textAlign: 'right' as const }}>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
                    {'\u00a3'}{row.cost.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--colour-text-muted)', marginLeft: '6px' }}>
                    {pct.toFixed(0)}%
                  </span>
                </div>
              </div>
              <div style={{ height: '4px', borderRadius: '2px', background: 'var(--colour-border)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: barColours[i], borderRadius: '2px' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default TopCostDriversCard