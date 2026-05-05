'use client'

import { mockMonthlyTrendResponse } from '@/lib/mockData'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

const MonthlyTrendCard = () => {
  const data = mockMonthlyTrendResponse

  const latestMonth = data.length > 0 ? data[data.length - 1] : null
  if (!latestMonth) return null

  const maxSpend = Math.max(...data.map((d) => d.spend))
  const prevMonth = data.length > 1 ? data[data.length - 2] : null
  const momChange = prevMonth
    ? ((latestMonth.spend - prevMonth.spend) / prevMonth.spend) * 100
    : 0

  return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '20px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          fontWeight: 600,
          color: 'var(--colour-text-label)',
        }}>
          Month-on-Month Spend
        </div>
        <div style={{ textAlign: 'right' as const }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: momChange > 0 ? 'var(--colour-red)' : 'var(--colour-green)' }}>
            {momChange > 0 ? '\u2191' : '\u2193'} {Math.abs(momChange).toFixed(1)}%
          </div>
          <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)' }}>vs last month</div>
        </div>
      </div>

      <div style={{ height: '160px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--colour-border)" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--colour-text-muted)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: 'var(--colour-text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `\u00a3${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={{ background: 'var(--colour-bg-card)', border: '1px solid var(--colour-border)', borderRadius: '8px', fontSize: '12px' }}
              formatter={(value) => value !== undefined ? [`\u00a3${value.toLocaleString()}`, 'Spend'] : ['', 'Spend']}
            />
            <ReferenceLine y={latestMonth.budgetLimit} stroke="var(--colour-yellow)" strokeDasharray="4 4" label={{ value: 'Budget', fill: 'var(--colour-yellow)', fontSize: 10 }} />
            <Bar dataKey="spend" fill="var(--colour-blue)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '12px' }}>
        {data.map((d) => (
          <div key={d.month} style={{ textAlign: 'center' as const }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
              {'\u00a3'}{(d.spend / 1000).toFixed(1)}k
            </div>
            <div style={{ fontSize: '10px', color: 'var(--colour-text-muted)' }}>{d.month}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MonthlyTrendCard