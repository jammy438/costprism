'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebarStore } from '../../../lib/stores/sidebar'

const navItems = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'Costs', href: '/dashboard/costs' },
  { label: 'Anomalies', href: '/dashboard/anomalies' },
  { label: 'Connectors', href: '/dashboard/connectors' },
]

const Sidebar = () => {
  const { collapsed, toggle } = useSidebarStore()
  const pathname = usePathname()

  return (
    <div
      style={{
        width: collapsed ? '56px' : '220px',
        transition: 'width 0.2s ease',
        backgroundColor: 'var(--colour-bg-sidebar)',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid var(--colour-border)',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
        {/* Logo area */}
        <div style={{
        height: '56px',
        padding: '0 16px',
        borderBottom: '1px solid var(--colour-border)',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        }}>
        {!collapsed && (
            <span style={{ color: 'var(--colour-text-primary)', fontWeight: 700, fontSize: '15px' }}>
            CostPrism
            </span>
        )}
        {collapsed && (
            <span style={{ color: 'var(--colour-blue)', fontWeight: 700, fontSize: '15px' }}>
            C
            </span>
        )}
        </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '8px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '8px 12px',
                borderRadius: '8px',
                marginBottom: '4px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                fontSize: '13px',
                color: isActive
                  ? 'var(--colour-blue)'
                  : 'var(--colour-text-secondary)',
                backgroundColor: isActive
                  ? 'rgba(48, 110, 255, 0.08)'
                  : 'transparent',
                borderLeft: isActive
                  ? '2px solid var(--colour-blue)'
                  : '2px solid transparent',
              }}
            >
              {!collapsed && item.label}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle button */}
      <button
        onClick={toggle}
        style={{
          margin: '8px',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid var(--colour-border)',
          backgroundColor: 'transparent',
          color: 'var(--colour-text-secondary)',
          cursor: 'pointer',
          fontSize: '12px',
        }}
      >
        {collapsed ? '→' : '← Collapse'}
      </button>
    </div>
  )
}

export default Sidebar