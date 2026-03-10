'use client'

import { UserButton } from '@clerk/nextjs'
import { useRouter, useSearchParams } from 'next/navigation'

const TopBar = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentView = searchParams.get('view') || 'director'

  const toggleView = (view: string) => {
    router.push(`/dashboard?view=${view}`)
  }

  const title = currentView === 'director'
    ? "Director's Dashboard"
    : 'FinOps / Engineer Dashboard'

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

      {/* Left — title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
        <span style={{
          color: 'var(--colour-text-primary)',
          fontWeight: 600,
          fontSize: '15px',
          whiteSpace: 'nowrap',
        }}>
          {title}
        </span>
        <span style={{
          color: 'var(--colour-text-muted)',
          fontSize: '13px',
        }}>
          March 2026
        </span>
      </div>

      {/* Right — controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Date range */}
        <button style={{
          padding: '5px 12px',
          borderRadius: '6px',
          border: '1px solid var(--colour-border)',
          backgroundColor: 'transparent',
          color: 'var(--colour-text-secondary)',
          cursor: 'pointer',
          fontSize: '12px',
          whiteSpace: 'nowrap',
        }}>
          📅 Last 30 days
        </button>

        {/* Region */}
        <button style={{
          padding: '5px 12px',
          borderRadius: '6px',
          border: '1px solid var(--colour-border)',
          backgroundColor: 'transparent',
          color: 'var(--colour-text-secondary)',
          cursor: 'pointer',
          fontSize: '12px',
          whiteSpace: 'nowrap',
        }}>
          ▲ AWS eu-west-1
        </button>

        {/* View toggle */}
        <div style={{
          display: 'flex',
          border: '1px solid var(--colour-border)',
          borderRadius: '6px',
          overflow: 'hidden',
        }}>
          <button
            onClick={() => toggleView('director')}
            style={{
              padding: '5px 14px',
              border: 'none',
              backgroundColor: currentView === 'director'
                ? 'var(--colour-blue)'
                : 'transparent',
              color: 'var(--colour-text-primary)',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Director
          </button>
          <button
            onClick={() => toggleView('engineer')}
            style={{
              padding: '5px 14px',
              border: 'none',
              backgroundColor: currentView === 'engineer'
                ? 'var(--colour-blue)'
                : 'transparent',
              color: 'var(--colour-text-primary)',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Engineer
          </button>
        </div>

        {/* Trial badge */}
        <div style={{
          padding: '5px 12px',
          borderRadius: '6px',
          border: '1px solid var(--colour-border)',
          color: 'var(--colour-text-secondary)',
          fontSize: '12px',
          whiteSpace: 'nowrap',
        }}>
          Trial · 11 days
        </div>

        {/* User */}
        <UserButton afterSignOutUrl='/sign-in' />
      </div>
    </div>
  )
}

export default TopBar