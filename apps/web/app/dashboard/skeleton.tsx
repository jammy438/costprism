'use client'

import React from 'react'

interface SkeletonBlockProps {
  width?: string
  height?: string
  borderRadius?: string
  style?: React.CSSProperties
}

export const SkeletonBlock = ({ width = '100%', height = '16px', borderRadius = '6px', style }: SkeletonBlockProps) => (
  <div style={{
    width,
    height,
    borderRadius,
    background: 'linear-gradient(90deg, var(--colour-bg-card-hover) 25%, rgba(255,255,255,0.04) 50%, var(--colour-bg-card-hover) 75%)',
    backgroundSize: '200% 100%',
    animation: 'skeleton-pulse 1.5s ease-in-out infinite',
    ...style,
  }} />
)

export const SkeletonCard = ({ height = '120px' }: { height?: string }) => (
  <div style={{
    height,
    background: 'var(--colour-bg-card)',
    border: '1px solid var(--colour-border)',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    overflow: 'hidden',
  }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <SkeletonBlock width="40%" height="12px" />
      <SkeletonBlock width="60px" height="12px" />
    </div>
    <SkeletonBlock width="60%" height="28px" />
    <SkeletonBlock width="80%" height="10px" />
  </div>
)

export const SkeletonRow = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 20px',
    background: 'var(--colour-bg-card)',
    border: '1px solid var(--colour-border)',
    borderRadius: '10px',
    gap: '12px',
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
      <SkeletonBlock width="36px" height="36px" borderRadius="8px" />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <SkeletonBlock width="50%" height="13px" />
        <SkeletonBlock width="30%" height="10px" />
      </div>
    </div>
    <SkeletonBlock width="80px" height="28px" borderRadius="20px" />
  </div>
)

export const SkeletonTable = ({ rows = 5 }: { rows?: number }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
    {/* Header */}
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', padding: '10px 0', borderBottom: '1px solid var(--colour-border)', marginBottom: '4px' }}>
      {[45, 20, 20, 15].map((w, i) => (
        <SkeletonBlock key={i} width={`${w}%`} height="10px" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '16px', padding: '12px 0', borderBottom: '1px solid var(--colour-border)' }}>
        {[70, 40, 40, 30].map((w, j) => (
          <SkeletonBlock key={j} width={`${w}%`} height="12px" />
        ))}
      </div>
    ))}
  </div>
)
