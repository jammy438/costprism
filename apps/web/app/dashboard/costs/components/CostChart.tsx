'use client'

import { useSpendOverTime } from '@/lib/hooks/useSpendOverTime'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'

const CostsChart = () => {
  const { data, isLoading, isError } = useSpendOverTime()

  if (isLoading) return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
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
      height: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--colour-red)',
      fontSize: '13px',
    }}>Failed to load chart</div>
  )

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
        Spend Over Time
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <defs>
            <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#63b3ed" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#63b3ed" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--colour-border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: 'var(--colour-text-muted)' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'var(--colour-text-muted)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `£${v.toLocaleString()}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--colour-bg-card)',
              border: '1px solid var(--colour-border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--colour-text-primary)',
            }}
          />
          <Area
            type="monotone"
            dataKey="spend"
            stroke="#63b3ed"
            strokeWidth={2}
            fill="url(#spendGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CostsChart