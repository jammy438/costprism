'use client'

import { useState } from 'react'
import { useDiscoveredTags, DiscoveredTagKey } from '@/lib/hooks/useTags'

type CoverageMode = 'spend' | 'resource'

const REQUIRED_KEYS = ['environment', 'team', 'application', 'cost-centre']

const getCoverageColour = (pct: number) => {
  if (pct >= 80) return 'var(--colour-green)'
  if (pct >= 60) return 'var(--colour-yellow)'
  return 'var(--colour-red)'
}

const CoverageScore = ({ score, mode }: { score: number; mode: CoverageMode }) => {
  const colour = getCoverageColour(score)
  const label = mode === 'spend' ? 'spend coverage' : 'resource coverage'

  return (
    <div style={{
      background: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '12px',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '24px',
    }}>
      {/* Score circle */}
      <div style={{
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: `conic-gradient(${colour} ${score * 3.6}deg, var(--colour-border) 0deg)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        position: 'relative' as const,
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'var(--colour-bg-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '16px',
          fontWeight: 700,
          color: colour,
        }}>
          {score}%
        </div>
      </div>

      <div>
        <div style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
          Tag {label}
        </div>
        <div style={{ fontSize: '12px', color: 'var(--colour-text-secondary)', marginTop: '4px' }}>
          {score >= 80 ? '✓ Good coverage' : score >= 60 ? '⚠ Needs attention' : '✗ Critical — significant spend untagged'}
        </div>
        <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', marginTop: '4px' }}>
          Thresholds: &gt;80% good · 60–80% amber · &lt;60% critical
        </div>
      </div>
    </div>
  )
}

const VariantAlert = ({ tagKey, variants }: { tagKey: string; variants: string[] }) => {
  if (variants.length <= 1) return null

  return (
    <div style={{
      padding: '10px 14px',
      background: 'rgba(252,174,30,0.08)',
      border: '1px solid rgba(252,174,30,0.25)',
      borderRadius: '8px',
      fontSize: '12px',
      color: 'var(--colour-yellow)',
      marginTop: '8px',
    }}>
      <span style={{ fontWeight: 600 }}>{variants.length} variants detected for `{tagKey}`:</span>{' '}
      <span style={{ color: 'var(--colour-text-secondary)' }}>{variants.join(', ')}</span>
      <span style={{ marginLeft: '8px', color: 'var(--colour-text-muted)' }}>
        — fix these to improve coverage
      </span>
    </div>
  )
}

const TagKeyCard = ({ tag, totalSpend }: { tag: DiscoveredTagKey; totalSpend: number }) => {
  const spendPct = totalSpend > 0 ? Math.round((tag.spend_covered / totalSpend) * 100) : 0
  const colour = getCoverageColour(spendPct)
  const isRequired = REQUIRED_KEYS.includes(tag.key)

  return (
    <div style={{
      background: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '10px',
      padding: '16px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
            {tag.key}
          </span>
          {isRequired && (
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(48,110,255,0.1)',
              color: 'var(--colour-blue)',
              border: '1px solid rgba(48,110,255,0.3)',
            }}>
              Required
            </span>
          )}
          {tag.variants_found.length > 1 && (
            <span style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(252,174,30,0.1)',
              color: 'var(--colour-yellow)',
              border: '1px solid rgba(252,174,30,0.3)',
            }}>
              {tag.variants_found.length} variants
            </span>
          )}
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, color: colour }}>
          {spendPct}%
        </span>
      </div>

      {/* Progress bar */}
      <div style={{
        height: '4px',
        borderRadius: '2px',
        background: 'var(--colour-border)',
        overflow: 'hidden',
        marginBottom: '8px',
      }}>
        <div style={{
          height: '100%',
          width: `${spendPct}%`,
          background: colour,
          borderRadius: '2px',
          transition: 'width 0.3s ease',
        }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--colour-text-muted)' }}>
        <span>{tag.resources_tagged.toLocaleString()} resources tagged</span>
        <span>{'\u00a3'}{tag.spend_covered.toLocaleString()} spend covered</span>
      </div>

      {/* Top values */}
      {tag.top_values.length > 0 && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' as const, marginTop: '8px' }}>
          {tag.top_values.map((v) => (
            <span key={v} style={{
              fontSize: '10px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'var(--colour-bg-page)',
              color: 'var(--colour-text-muted)',
              border: '1px solid var(--colour-border)',
            }}>
              {v}
            </span>
          ))}
        </div>
      )}

      <VariantAlert tagKey={tag.key} variants={tag.variants_found} />
    </div>
  )
}

const TagCoverage = () => {
  const { data, isLoading, isError } = useDiscoveredTags()
  const [coverageMode, setCoverageMode] = useState<CoverageMode>('spend')

  if (isLoading) return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          height: '100px',
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
      Failed to load tag coverage data.
    </div>
  )

  // Calculate spend coverage score
  const taggedSpend = data.discovered_keys.reduce((sum, k) => sum + k.spend_covered, 0)
  const spendCoverageScore = data.total_spend > 0
    ? Math.round((taggedSpend / data.total_spend) * 100)
    : 0

  // Resource coverage — placeholder until George adds resource counts
  const resourceCoverageScore = Math.round(spendCoverageScore * 0.85) // approximation

  const score = coverageMode === 'spend' ? spendCoverageScore : resourceCoverageScore

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Coverage mode toggle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ fontSize: '12px', color: 'var(--colour-text-muted)' }}>View by:</span>
        {(['spend', 'resource'] as CoverageMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setCoverageMode(mode)}
            style={{
              padding: '5px 14px',
              background: coverageMode === mode ? 'var(--colour-blue)' : 'var(--colour-bg-card)',
              border: `1px solid ${coverageMode === mode ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
              borderRadius: '20px',
              color: coverageMode === mode ? '#fff' : 'var(--colour-text-secondary)',
              fontSize: '12px',
              fontWeight: coverageMode === mode ? 600 : 400,
              cursor: 'pointer',
            }}
          >
            {mode === 'spend' ? 'Spend coverage' : 'Resource coverage'}
          </button>
        ))}
      </div>

      {/* Score card */}
      <CoverageScore score={score} mode={coverageMode} />

      {/* Untagged spend callout */}
      {data.untagged_spend > 0 && (
        <div style={{
          padding: '14px 16px',
          background: 'rgba(247,49,18,0.06)',
          border: '1px solid rgba(247,49,18,0.2)',
          borderRadius: '10px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-red)' }}>
              Untagged spend
            </div>
            <div style={{ fontSize: '12px', color: 'var(--colour-text-secondary)', marginTop: '2px' }}>
              This spend cannot be allocated to any team or service
            </div>
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colour-red)' }}>
            {'\u00a3'}{data.untagged_spend.toLocaleString()}
          </div>
        </div>
      )}

      {/* Tag key breakdown */}
      <div>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-secondary)', margin: '0 0 12px', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          Tag key breakdown
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data.discovered_keys.map((tag) => (
            <TagKeyCard key={tag.key} tag={tag} totalSpend={data.total_spend} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default TagCoverage