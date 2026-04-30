'use client'

import { useNormalisedTags } from '@/lib/hooks/useTags'

const TagNormalisation = () => {
  const { data, isLoading, isError } = useNormalisedTags()

  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[1, 2].map((i) => (
        <div key={i} style={{
          height: '120px',
          background: 'var(--colour-bg-card)',
          border: '1px solid var(--colour-border)',
          borderRadius: '10px',
          opacity: 0.5,
        }} />
      ))}
    </div>
  )

  if (isError || !data) return (
    <div style={{
      padding: '24px',
      background: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '12px',
      color: 'var(--colour-red)',
      fontSize: '13px',
    }}>
      Failed to load normalisation data.
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{
        padding: '14px 16px',
        background: 'rgba(48,110,255,0.06)',
        border: '1px solid rgba(48,110,255,0.2)',
        borderRadius: '10px',
        fontSize: '12px',
        color: 'var(--colour-text-secondary)',
      }}>
        Tag normalisation groups variant tag keys under a canonical name. For example, <code style={{ color: 'var(--colour-blue)' }}>env</code>, <code style={{ color: 'var(--colour-blue)' }}>Env</code>, and <code style={{ color: 'var(--colour-blue)' }}>ENV</code> are all treated as <code style={{ color: 'var(--colour-blue)' }}>environment</code>.
      </div>

      {data.normalised_keys.length === 0 && (
        <div style={{
          padding: '48px 24px',
          background: 'var(--colour-bg-card)',
          border: '1px solid var(--colour-border)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>#</div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colour-text-primary)', margin: '0 0 8px' }}>
            No normalisation rules yet
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--colour-text-secondary)', margin: 0 }}>
            Normalisation rules will appear here once your first sync completes.
          </p>
        </div>
      )}

      {data.normalised_keys.map((key) => (
        <div
          key={key.canonical_key}
          style={{
            background: 'var(--colour-bg-card)',
            border: '1px solid var(--colour-border)',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
                {key.canonical_key}
              </div>
              <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', marginTop: '2px' }}>
                {key.resources_normalised.toLocaleString()} resources normalised · {'\u00a3'}{key.spend_covered.toLocaleString()} spend covered
              </div>
            </div>
            <span style={{
              fontSize: '11px',
              padding: '3px 10px',
              borderRadius: '20px',
              background: 'rgba(76,187,23,0.1)',
              color: 'var(--colour-green)',
              border: '1px solid rgba(76,187,23,0.3)',
            }}>
              Active
            </span>
          </div>

          {/* Canonical values and their variants */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(key.canonical_values).map(([canonical, variants]) => (
              <div key={canonical} style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px',
                padding: '10px 12px',
                background: 'var(--colour-bg-page)',
                borderRadius: '8px',
              }}>
                {/* Canonical value */}
                <div style={{
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: 'rgba(48,110,255,0.1)',
                  color: 'var(--colour-blue)',
                  border: '1px solid rgba(48,110,255,0.3)',
                  fontSize: '12px',
                  fontWeight: 600,
                  flexShrink: 0,
                  whiteSpace: 'nowrap' as const,
                }}>
                  {canonical}
                </div>

                <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', paddingTop: '3px' }}>
                  {'\u2190'}
                </div>

                {/* Variants */}
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' as const }}>
                  {variants.map((v) => (
                    <span key={v} style={{
                      fontSize: '11px',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      background: 'var(--colour-bg-card)',
                      color: 'var(--colour-text-secondary)',
                      border: '1px solid var(--colour-border)',
                    }}>
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TagNormalisation