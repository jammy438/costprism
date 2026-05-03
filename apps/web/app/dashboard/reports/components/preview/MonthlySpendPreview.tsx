'use client'

import { useTotalSpend } from '@/lib/hooks/useTotalSpend'
import { useSpendByService } from '@/lib/hooks/useSpendByService'
import { useSpendByTeam } from '@/lib/hooks/useSpendByTeam'
import { useSpendOverTime } from '@/lib/hooks/useSpendOverTime'
import { useBudgets } from '@/lib/hooks/useBudgets'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface Props {
  from: string
  to: string
  team?: string
}

const ReportSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ marginBottom: '40px' }}>
    <h2 style={{
      fontSize: '13px',
      fontWeight: 600,
      color: 'var(--colour-text-secondary)',
      textTransform: 'uppercase',
      letterSpacing: '0.8px',
      margin: '0 0 16px',
      paddingBottom: '8px',
      borderBottom: '1px solid var(--colour-border)',
    }}>
      {title}
    </h2>
    {children}
  </div>
)

const MonthlySpendPreview = ({ from, to }: Props) => {
  const { data: totalSpend } = useTotalSpend(from, to)
  const { data: byService } = useSpendByService(from, to)
  const { data: byTeam } = useSpendByTeam(from, to)
  const { data: overTime } = useSpendOverTime(from, to)
  const { data: budgets } = useBudgets()

  const rows = Array.isArray(byService) ? byService : []
  const teamRows = Array.isArray(byTeam) ? byTeam : []
  const timeData = Array.isArray(overTime) ? overTime : []

  return (
    <div style={{ color: 'var(--colour-text-primary)', fontFamily: 'monospace' }}>
      {/* Report header */}
      <div style={{ marginBottom: '40px', paddingBottom: '24px', borderBottom: '2px solid var(--colour-border)' }}>
        <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>
          CostPrism · Monthly Spend Summary
        </div>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 8px', letterSpacing: '-0.5px' }}>
          Cloud Cost Report
        </h1>
        <div style={{ fontSize: '13px', color: 'var(--colour-text-secondary)' }}>
          Period: {from} to {to}
        </div>
      </div>

      {/* Total spend */}
      <ReportSection title="Summary">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { label: 'Total spend', value: totalSpend ? `£${totalSpend.currentSpend.toLocaleString()}` : '—' },
            { label: 'Previous period', value: totalSpend ? `£${totalSpend.previousSpend.toLocaleString()}` : '—' },
            { label: 'Change', value: totalSpend ? `${((totalSpend.currentSpend - totalSpend.previousSpend) / totalSpend.previousSpend * 100).toFixed(1)}%` : '—' },
          ].map((stat) => (
            <div key={stat.label} style={{
              padding: '16px',
              background: 'var(--colour-bg-card)',
              border: '1px solid var(--colour-border)',
              borderRadius: '10px',
            }}>
              <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>{stat.label}</div>
              <div style={{ fontSize: '22px', fontWeight: 700 }}>{stat.value}</div>
            </div>
          ))}
        </div>
      </ReportSection>

      {/* Spend over time */}
      {timeData.length > 0 && (
        <ReportSection title="Spend over time">
          <div style={{ height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--colour-border)" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--colour-text-muted)' }} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--colour-text-muted)' }} />
                <Tooltip
                  contentStyle={{ background: 'var(--colour-bg-card)', border: '1px solid var(--colour-border)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="spend" stroke="var(--colour-blue)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ReportSection>
      )}

      {/* Top services */}
      {rows.length > 0 && (
        <ReportSection title="Top services">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Service', 'Cost', '% of total'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '11px', color: 'var(--colour-text-muted)', fontWeight: 500, paddingBottom: '8px', borderBottom: '1px solid var(--colour-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.slice(0, 10).map((s: any, i: number) => (
                <tr key={s.service} style={{ borderBottom: i < rows.length - 1 ? '1px solid var(--colour-border)' : 'none' }}>
                  <td style={{ padding: '10px 0', fontSize: '13px' }}>{s.service}</td>
                  <td style={{ padding: '10px 0', fontSize: '13px' }}>£{(s.cost ?? 0).toLocaleString()}</td>
                  <td style={{ padding: '10px 0', fontSize: '13px', color: 'var(--colour-text-muted)' }}>{(s.percentage ?? 0).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}

      {/* Spend by team */}
      {teamRows.length > 0 && (
        <ReportSection title="Spend by team">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Team', 'Cost', '% of total'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', fontSize: '11px', color: 'var(--colour-text-muted)', fontWeight: 500, paddingBottom: '8px', borderBottom: '1px solid var(--colour-border)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {teamRows.map((t: any, i: number) => (
                <tr key={t.team} style={{ borderBottom: i < teamRows.length - 1 ? '1px solid var(--colour-border)' : 'none' }}>
                  <td style={{ padding: '10px 0', fontSize: '13px' }}>{t.team}</td>
                  <td style={{ padding: '10px 0', fontSize: '13px' }}>£{(t.cost ?? 0).toLocaleString()}</td>
                  <td style={{ padding: '10px 0', fontSize: '13px', color: 'var(--colour-text-muted)' }}>{(t.percentage ?? 0).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </ReportSection>
      )}

      {/* Budget status */}
      {budgets && budgets.length > 0 && (
        <ReportSection title="Budget status">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {budgets.map((b) => {
              const pct = 0 // placeholder until George returns spend vs budget
              const colour = pct >= 100 ? 'var(--colour-red)' : pct >= 90 ? 'var(--colour-orange)' : 'var(--colour-green)'
              return (
                <div key={b.id} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ flex: 1, fontSize: '13px' }}>{b.name}</div>
                  <div style={{ fontSize: '13px', color: 'var(--colour-text-secondary)' }}>£{Number(b.amount).toLocaleString()} limit</div>
                  <div style={{ width: '120px', height: '4px', borderRadius: '2px', background: 'var(--colour-border)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: colour, borderRadius: '2px' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </ReportSection>
      )}

      {/* Footer */}
      <div style={{ marginTop: '40px', paddingTop: '16px', borderTop: '1px solid var(--colour-border)', fontSize: '11px', color: 'var(--colour-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
        <span>Generated by CostPrism</span>
        <span>{new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
      </div>
    </div>
  )
}

export default MonthlySpendPreview