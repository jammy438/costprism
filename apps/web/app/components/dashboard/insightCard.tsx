'use client' 

interface InsightRowProps {
  severity: 'warning' | 'critical' | 'good' | 'info'
  title: string
  description: string
  badge?: string
}

const InsightRow = ({ severity, title, description, badge }: InsightRowProps) => {
  const severityColours = {
    warning: 'var(--colour-yellow)',
    critical: 'var(--colour-red)',
    good: 'var(--colour-green)',
    info: 'var(--colour-blue)',
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px',
      borderRadius: '8px',
      backgroundColor: 'var(--colour-bg-card)',
      border: `1px solid ${severityColours[severity]}`,
    }}>

      {/* Severity dot */}
      <div style={{
        width: '10px',
        height: '10px',
        borderRadius: '50%',
        backgroundColor: severityColours[severity],
        flexShrink: 0,
      }} />

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--colour-text-primary)',
        }}>
          {title}
        </div>
        <div style={{
          fontSize: '12px',
          color: 'var(--colour-text-secondary)',
        }}>
          {description}
        </div>
      </div>

            {badge && (
        <div style={{
            padding: '4px 8px',
            borderRadius: '6px',
            backgroundColor: `${severityColours[severity]}22`,
            color: severityColours[severity],
            fontSize: '12px',
            fontWeight: 600,
            flexShrink: 0,
        }}>
            {badge}
        </div>
        )}

    </div>
  )
}

export default InsightRow