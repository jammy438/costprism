'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebarStore } from '@/lib/stores/sidebar'
import {
  LayoutDashboard,
  DollarSign,
  Wallet,
  Tag,
  Shield,
  Plug,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { label: 'Overview',   href: '/dashboard',           Icon: LayoutDashboard },
  { label: 'Costs',      href: '/dashboard/costs',      Icon: DollarSign },
  { label: 'Budgets',    href: '/dashboard/budgets',    Icon: Wallet },
  { label: 'Tags',       href: '/dashboard/tags',       Icon: Tag },
  { label: 'Governance', href: '/dashboard/governance', Icon: Shield },
  { label: 'Connectors', href: '/dashboard/connectors', Icon: Plug },
  { label: 'Reports',    href: '/dashboard/reports',    Icon: BarChart3 },
  { label: 'Settings',   href: '/dashboard/settings',   Icon: Settings },
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
        <div style={{
          width: '28px',
          height: '28px',
          borderRadius: '8px',
          backgroundColor: 'var(--colour-blue)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          fontWeight: 700,
          fontSize: '13px',
          flexShrink: 0,
          letterSpacing: '-0.5px',
        }}>
          CP
        </div>
        {!collapsed && (
          <span style={{
            color: 'var(--colour-text-primary)',
            fontWeight: 700,
            fontSize: '15px',
            letterSpacing: '-0.3px',
          }}>
            CostPrism
          </span>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: '8px' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          return (
            <div key={item.href} style={{ position: 'relative' }} title={collapsed ? item.label : undefined}>
              <Link
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
                  color: isActive ? 'var(--colour-blue)' : 'var(--colour-text-secondary)',
                  backgroundColor: isActive ? 'rgba(48, 110, 255, 0.08)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--colour-blue)' : '2px solid transparent',
                  transition: 'background-color 0.15s ease, color 0.15s ease',
                }}
              >
                <item.Icon
                  size={16}
                  style={{ flexShrink: 0 }}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
                {!collapsed && (
                  <span>{item.label}</span>
                )}
              </Link>
            </div>
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
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          gap: '6px',
        }}
      >
        {collapsed
          ? <ChevronRight size={14} />
          : <><ChevronLeft size={14} /><span>Collapse</span></>
        }
      </button>
    </div>
  )
}

export default Sidebar