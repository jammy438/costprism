'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'

const TABS = [
  { label: 'General', href: '/dashboard/settings/general' },
  { label: 'Team', href: '/dashboard/settings/team' },
]

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  return (
    <div style={{ padding: '24px 24px 48px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--colour-text-primary)',
          letterSpacing: '-0.4px',
          margin: 0,
        }}>
          Settings
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--colour-text-secondary)',
          margin: '4px 0 0 0',
        }}>
          Manage your organisation settings and team.
        </p>
      </div>

      {/* Tab nav */}
      <div style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid var(--colour-border)',
        marginBottom: '28px',
      }}>
        {TABS.map((tab) => {
          const isActive = pathname === tab.href
          return (
            <Link
              key={tab.href}
              href={tab.href}
              style={{
                padding: '8px 16px',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? 'var(--colour-text-primary)' : 'var(--colour-text-muted)',
                borderBottom: isActive ? '2px solid var(--colour-blue)' : '2px solid transparent',
                marginBottom: '-1px',
                textDecoration: 'none',
                transition: 'color 0.15s ease',
              }}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {children}
    </div>
  )
}

export default SettingsLayout