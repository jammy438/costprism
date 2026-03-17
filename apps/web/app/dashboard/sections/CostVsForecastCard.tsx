'use client'

import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useSpendOverTime } from '@/lib/hooks/useSpendOverTime'
import { useForecast } from '@/lib/hooks/useForecast'
import { ForecastResponse } from '@/lib/mockData'
import ChartErrorBoundary from '@/app/components/dashboard/chartErrorBoundary'
import SkeletonChart from '@/app/components/dashboard/skeletons/skeletonChart'

const FROM = '2026-01-01'
const TO = '2026-03-01'

const CostVsForecastChart = () => {
  const [granularity, setGranularity] = useState<'day' | 'week' | 'month'>('week')

  const { data: spendData, isLoading: spendLoading, isError: spendError } = useSpendOverTime(FROM, TO, granularity)
  const { data: forecastData, isLoading: forecastLoading, isError: forecastError } = useForecast(FROM, TO)

  const isLoading = spendLoading || forecastLoading
  const isError = spendError || forecastError

  const chartData = spendData?.map((item) => {
    const forecast = forecastData?.find((f: ForecastResponse) => f.date === item.date)
    return {
      date: item.date,
      actual: item.spend,
      forecast: forecast?.forecastedSpend ?? null,
    }
  }) ?? []

  return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
    }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{
          fontSize: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.8px',
          fontWeight: 600,
          color: 'var(--colour-text-label)',
        }}>
          Cost vs Forecast
        </div>

        {/* Granularity toggle */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {(['day', 'week', 'month'] as const).map((g) => (
            <button
              key={g}
              onClick={() => setGranularity(g)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid var(--colour-border)',
                backgroundColor: granularity === g ? 'var(--colour-blue)' : 'transparent',
                color: granularity === g ? '#fff' : 'var(--colour-text-muted)',
              }}
            >
              {g.charAt(0).toUpperCase() + g.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      {isLoading && <SkeletonChart height={300} />}

      {isError && (
        <div style={{ color: 'var(--colour-red)', fontSize: '13px', textAlign: 'center', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          Failed to load chart
        </div>
      )}

      {!isLoading && !isError && (
        <ChartErrorBoundary>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--colour-border)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'var(--colour-text-muted)' }} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--colour-text-muted)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--colour-bg-card)',
                  border: '1px solid var(--colour-border)',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#1b6ca8"
                strokeWidth={2}
                fill="#1b6ca8"
                fillOpacity={0.1}
                name="Actual"
              />
              <Area
                type="monotone"
                dataKey="forecast"
                stroke="#f97316"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="#f97316"
                fillOpacity={0.05}
                name="Forecast"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartErrorBoundary>
      )}

    </div>
  )
}

export default CostVsForecastChart