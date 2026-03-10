'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebarStore } from '@/lib/stores/sidebar'

const navItems = [
  { label: 'Overview',   href: '/dashboard',            icon: '◉' },
  { label: 'Costs',      href: '/dashboard/costs',       icon: '£' },
  { label: 'Budgets',    href: '/dashboard/budgets',     icon: '◫' },
  { label: 'Tags',       href: '/dashboard/tags',        icon: '#' },
  { label: 'Connectors', href: '/dashboard/connectors',  icon: '⬡' },
  { label: 'Reports',    href: '/dashboard/reports',     icon: '≡' },
  { label: 'Settings',   href: '/dashboard/settings',    icon: '⚙' },
]

const Sidebar = () => {
  const { collapsed, toggle } = useSidebarStore()
  const pathname = usePathname()

  return (
    <div style={{
      width: collapsed ? '56px' : '220px',
      transition: 'width 0.2s ease',
      backgroundColor: 'var(--colour-bg-sidebar)',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid var(--colour-border)',
      overflow: 'hidden',
      flexShrink: 0,
    }}>

      {/* Logo area */}
      <div style={{
        height: '56px',
        padding: '0 16px',
        borderBottom: '1px solid var(--colour-border)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        whiteSpace: 'nowrap',
      }}>
        {/* Blue C circle */}
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          backgroundColor: 'var(--colour-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '13px',
          flexShrink: 0,
        }}>
          C
        </div>
        {!collapsed && (
          <span style={{
            color: 'var(--colour-text-primary)',
            fontWeight: 700,
            fontSize: '15px',
          }}>
            CostPrism
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
                gap: '10px',
                padding: '8px 10px',
                borderRadius: '8px',
                marginBottom: '2px',
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
              {/* Icon */}
              <span style={{
                fontSize: '14px',
                flexShrink: 0,
                width: '18px',
                textAlign: 'center',
              }}>
                {item.icon}
              </span>
              {/* Label */}
              {!collapsed && (
                <span>{item.label}</span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={toggle}
        style={{
          margin: '8px',
          padding: '8px',
          borderRadius: '8px',
          border: '1px solid var(--colour-border)',
          backgroundColor: 'transparent',
          color: 'var(--colour-text-muted)',
          cursor: 'pointer',
          fontSize: '11px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        {collapsed ? '→' : '← Collapse'}
      </button>
    </div>
  )
}

export default Sidebar