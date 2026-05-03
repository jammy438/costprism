'use client'

import { useEffect, useRef, useState } from 'react'
import { SkeletonBlock } from '@/app/dashboard/skeleton'

interface MetricCardProps {
  label: string
  value: string
  trend: string
  trendDirection: 'up' | 'down'
  glow: 'red' | 'green' | 'amber' | 'none'
  secondaryValue?: string
  upIsBad?: boolean
  isLoading?: boolean
  isError?: boolean
  hideTrendArrow?: boolean
}

// Extracts numeric part and animates it, preserves prefix/suffix like £ or %
const useCountUp = (value: string, duration = 800) => {
  const [display, setDisplay] = useState(value)
  const prevValue = useRef(value)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    if (value === prevValue.current) return

    const match = value.match(/^([^0-9]*)([0-9,]+\.?[0-9]*)([^0-9]*)$/)
    const prevMatch = prevValue.current.match(/^([^0-9]*)([0-9,]+\.?[0-9]*)([^0-9]*)$/)

    if (!match || !prevMatch) {
      setDisplay(value)
      prevValue.current = value
      return
    }

    const prefix = match[1] ?? ''
    const suffix = match[3] ?? ''
    const target = parseFloat(match[2]?.replace(/,/g, '') ?? '0')
    const start = parseFloat(prevMatch[2]?.replace(/,/g, '') ?? '0')

    if (isNaN(target) || isNaN(start)) {
      setDisplay(value)
      prevValue.current = value
      return
    }

    const startTime = performance.now()

    const animate = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease out cubic
      const current = start + (target - start) * eased
      setDisplay(`${prefix}${current.toLocaleString('en-GB', { maximumFractionDigits: 0 })}${suffix}`)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate)
      } else {
        setDisplay(value)
        prevValue.current = value
      }
    }

    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(animate)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [value, duration])

  return display
}

const MetricCard = ({
  label,
  value,
  trend,
  trendDirection,
  glow,
  secondaryValue,
  upIsBad,
  isLoading,
  isError,
  hideTrendArrow,
}: MetricCardProps) => {
  const [hovered, setHovered] = useState(false)
  const animatedValue = useCountUp(isLoading || isError ? '0' : value)

  const glowColour = glow === 'green'
    ? 'rgba(76, 187, 23, 0.5)'
    : glow === 'red'
    ? 'rgba(251, 59, 30, 0.5)'
    : 'transparent'

  const trendColour = upIsBad
    ? trendDirection === 'up' ? 'var(--colour-red)' : 'var(--colour-green)'
    : trendDirection === 'up' ? 'var(--colour-green)' : 'var(--colour-red)'

  const baseStyle = {
    backgroundColor: 'var(--colour-bg-card)',
    border: '1px solid var(--colour-border)',
    borderRadius: '14px',
    padding: '24px',
    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
    transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: hovered ? '0 8px 24px rgba(0,0,0,0.25)' : 'none',
    cursor: 'default',
  }

  if (isLoading) {
    return (
      <div style={{ ...baseStyle, minHeight: '120px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <SkeletonBlock width="50%" height="10px" />
        <SkeletonBlock width="65%" height="32px" />
        <SkeletonBlock width="40%" height="10px" />
      </div>
    )
  }

  if (isError) {
    return (
      <div style={{
        ...baseStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--colour-red)',
        fontSize: '13px',
        minHeight: '120px',
      }}>
        Failed to load
      </div>
    )
  }

  return (
    <div
      style={{ ...baseStyle, position: 'relative', overflow: 'hidden' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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
          transition: 'opacity 0.3s ease',
          opacity: hovered ? 0.8 : 1,
        }} />
      )}

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

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '8px' }}>
        <div style={{
          fontSize: '32px',
          fontWeight: 700,
          color: 'var(--colour-text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {animatedValue}
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

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        color: trendColour,
        fontSize: '12px',
        fontWeight: 500,
      }}>
        {!hideTrendArrow && (
          <span style={{ fontSize: '14px' }}>
            {trendDirection === 'up' ? '\u2191' : '\u2193'}
          </span>
        )}
        <span>{trend}</span>
      </div>
    </div>
  )
}

export default MetricCard