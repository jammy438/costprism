'use client'

import { UserButton } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { useDateRange, DATE_RANGE_PRESETS, DateRange } from '@/lib/context/DateRangeContext'
import { useSubscription } from '@/lib/hooks/useSubscription'

const TopBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentView = searchParams.get('view') || 'director'
  const { dateRange, setDateRange } = useDateRange()
  const { data: subscription } = useSubscription()
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [customFrom, setCustomFrom] = useState(dateRange.from)
  const [customTo, setCustomTo] = useState(dateRange.to)
  const pickerRef = useRef<HTMLDivElement>(null)

  const toggleView = (view: string) => {
    router.push(`/dashboard?view=${view}`)
  }

  const title = currentView === 'director'
    ? "Director's Dashboard"
    : 'FinOps / Engineer Dashboard'

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowDatePicker(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const handlePreset = (preset: DateRange) => {
    setDateRange(preset)
    setCustomFrom(preset.from)
    setCustomTo(preset.to)
    setShowDatePicker(false)
  }

  const handleCustomApply = () => {
    if (!customFrom || !customTo || customFrom > customTo) return
    setDateRange({ label: 'Custom', from: customFrom, to: customTo })
    setShowDatePicker(false)
  }

  const inputStyle = {
    flex: 1 as const,
    padding: '6px 8px',
    background: 'var(--colour-bg-page)',
    border: '1px solid var(--colour-border)',
    borderRadius: '6px',
    color: 'var(--colour-text-primary)',
    fontSize: '12px',
    outline: 'none',
  }

  return (
    <div style={{
      height: '56px',
      backgroundColor: 'var(--colour-bg-sidebar)',
      borderBottom: '1px solid var(--colour-border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      flexShrink: 0,
      gap: '16px',
    }}>

      {/* Left — title + period */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <span style={{ color: 'var(--colour-text-primary)', fontWeight: 600, fontSize: '15px', whiteSpace: 'nowrap' }}>
          {title}
        </span>
        <span style={{
          fontSize: '12px',
          color: 'var(--colour-text-muted)',
          background: 'var(--colour-bg-page)',
          border: '1px solid var(--colour-border)',
          borderRadius: '6px',
          padding: '3px 8px',
          whiteSpace: 'nowrap',
        }}>
          {dateRange.from} {'\u2192'} {dateRange.to}
        </span>
      </div>

      {/* Right — controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Date range picker */}
        <div ref={pickerRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: `1px solid ${showDatePicker ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
              backgroundColor: showDatePicker ? 'rgba(48,110,255,0.1)' : 'transparent',
              color: showDatePicker ? 'var(--colour-blue)' : 'var(--colour-text-secondary)',
              cursor: 'pointer',
              fontSize: '12px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s ease',
            }}
          >
            <Calendar size={13} />
            {dateRange.label}
            <ChevronDown size={12} style={{ transform: showDatePicker ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
          </button>

          {showDatePicker && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: 'var(--colour-bg-card)',
              border: '1px solid var(--colour-border)',
              borderRadius: '10px',
              padding: '8px',
              zIndex: 100,
              minWidth: '220px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            }}>
              {/* Presets */}
              {DATE_RANGE_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => handlePreset(preset)}
                  style={{
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: dateRange.label === preset.label ? 'rgba(48,110,255,0.1)' : 'transparent',
                    color: dateRange.label === preset.label ? 'var(--colour-blue)' : 'var(--colour-text-secondary)',
                    fontSize: '13px',
                    cursor: 'pointer',
                    fontWeight: dateRange.label === preset.label ? 600 : 400,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  {preset.label}
                  {dateRange.label === preset.label && (
                    <span style={{ fontSize: '11px' }}>{'\u2713'}</span>
                  )}
                </button>
              ))}

              {/* Divider */}
              <div style={{ height: '1px', background: 'var(--colour-border)', margin: '8px 0' }} />

              {/* Custom range */}
              <div style={{ padding: '0 4px 4px' }}>
                <div style={{
                  fontSize: '11px',
                  color: 'var(--colour-text-muted)',
                  fontWeight: 600,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.6px',
                  marginBottom: '8px',
                  paddingLeft: '8px',
                }}>
                  Custom range
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '6px', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--colour-text-muted)', width: '28px', flexShrink: 0 }}>From</span>
                    <input
                      type="date"
                      value={customFrom}
                      onChange={(e) => setCustomFrom(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '11px', color: 'var(--colour-text-muted)', width: '28px', flexShrink: 0 }}>To</span>
                    <input
                      type="date"
                      value={customTo}
                      onChange={(e) => setCustomTo(e.target.value)}
                      style={inputStyle}
                    />
                  </div>
                </div>
                <button
                  onClick={handleCustomApply}
                  disabled={!customFrom || !customTo || customFrom > customTo}
                  style={{
                    width: '100%',
                    padding: '7px',
                    background: customFrom && customTo && customFrom <= customTo
                      ? 'var(--colour-blue)' : 'var(--colour-border)',
                    border: 'none',
                    borderRadius: '6px',
                    color: customFrom && customTo && customFrom <= customTo
                      ? '#fff' : 'var(--colour-text-muted)',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: customFrom && customTo && customFrom <= customTo ? 'pointer' : 'not-allowed',
                  }}
                >
                  Apply custom range
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Region */}
        <div style={{
          padding: '5px 12px',
          borderRadius: '6px',
          border: '1px solid var(--colour-border)',
          color: 'var(--colour-text-muted)',
          fontSize: '12px',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}>
          <span style={{ fontSize: '10px', color: 'var(--colour-green)' }}>{'\u25cf'}</span>
          AWS eu-west-1
        </div>

        {/* View toggle */}
        <div style={{ display: 'flex', border: '1px solid var(--colour-border)', borderRadius: '6px', overflow: 'hidden' }}>
          {['director', 'engineer'].map((view) => (
            <button
              key={view}
              onClick={() => toggleView(view)}
              style={{
                padding: '5px 14px',
                border: 'none',
                backgroundColor: currentView === view ? 'var(--colour-blue)' : 'transparent',
                color: currentView === view ? '#fff' : 'var(--colour-text-secondary)',
                cursor: 'pointer',
                fontSize: '12px',
                transition: 'background-color 0.15s ease',
              }}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>

        {/* Trial badge — only shown when on trial */}
        {subscription?.status === 'TRIALING' && subscription.daysRemaining !== null && (
          <div style={{
            padding: '5px 12px',
            borderRadius: '6px',
            border: '1px solid rgba(252,174,30,0.3)',
            background: 'rgba(252,174,30,0.06)',
            color: 'var(--colour-yellow)',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            fontWeight: 500,
          }}>
            Trial {'\u00b7'} {subscription.daysRemaining} day{subscription.daysRemaining !== 1 ? 's' : ''}
          </div>
        )}

        <UserButton afterSignOutUrl='/sign-in' />
      </div>
    </div>
  )
}

export default TopBar