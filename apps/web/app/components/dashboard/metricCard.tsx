'use client' 

interface MetricCardProps {
  label: string
  value: string
  trend: string
  trendDirection: 'up' | 'down'
  glow: 'red' | 'green' | 'none'
  secondaryValue?: string
  upIsBad?: boolean
}

const MetricCard = ({ label, value, trend, trendDirection, glow, secondaryValue, upIsBad }: MetricCardProps) => {
  const glowColour = glow === 'green'
    ? 'rgba(76, 187, 23, 0.5)'
    : glow === 'red'
    ? 'rgba(251, 59, 30, 0.5)'
    : 'transparent'

  const trendColour = upIsBad
    ? trendDirection === 'up' ? 'var(--colour-red)' : 'var(--colour-green)'
    : trendDirection === 'up' ? 'var(--colour-green)' : 'var(--colour-red)'

  return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Corner glow */}
      {glow !== 'none' && (
        <div style={{
          position: 'absolute',
          width: '110px',
          height: '110px',
          borderRadius: '50%',
          filter: 'blur(35px)',
          top: '-25px',
          right: '-25px',
          backgroundColor: glowColour,
          pointerEvents: 'none',
        }} />
      )}

      {/* Label */}
      <div style={{
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        fontWeight: 600,
        color: 'var(--colour-text-label)',
        marginBottom: '8px',
      }}>
        {label}
      </div>

      {/* Value row */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
        <div style={{
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--colour-text-primary)',
        }}>
          {value}
        </div>
        {secondaryValue && (
          <div style={{
            fontSize: '16px',
            fontWeight: 400,
            color: 'var(--colour-text-secondary)',
          }}>
            {secondaryValue}
          </div>
        )}
      </div>

      {/* Trend */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        color: trendColour,
        fontSize: '12px',
        fontWeight: 500,
      }}>
        <span>{trendDirection === 'up' ? '↑' : '↓'}</span>
        <span>{trend}</span>
      </div>

    </div>
  )
}

export default MetricCard