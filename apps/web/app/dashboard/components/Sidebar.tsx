'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSidebarStore } from '@/lib/stores/sidebar'
import { useGovernancePolicies } from '@/lib/hooks/useGovernancePolicies'
import { useAnomalies } from '@/lib/hooks/useAnomalies'
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

const NAV_ITEMS = [
  { label: 'Overview',   href: '/dashboard',           Icon: LayoutDashboard },
  { label: 'Costs',      href: '/dashboard/costs',      Icon: DollarSign },
  { label: 'Budgets',    href: '/dashboard/budgets',    Icon: Wallet },
  { label: 'Tags',       href: '/dashboard/tags',       Icon: Tag },
  { label: 'Governance', href: '/dashboard/governance', Icon: Shield, alertKey: 'governance' },
  { label: 'Connectors', href: '/dashboard/connectors', Icon: Plug },
  { label: 'Reports',    href: '/dashboard/reports',    Icon: BarChart3 },
  { label: 'Settings',   href: '/dashboard/settings',   Icon: Settings },
]

const AlertDot = ({ count }: { count: number }) => {
  if (count === 0) return null
  return (
    <div style={{
      minWidth: '16px',
      height: '16px',
      borderRadius: '8px',
      background: 'var(--colour-red)',
      color: '#fff',
      fontSize: '9px',
      fontWeight: 700,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 4px',
      marginLeft: 'auto',
      flexShrink: 0,
    }}>
      {count > 9 ? '9+' : count}
    </div>
  )
}

const Sidebar = () => {
  const { collapsed, toggle } = useSidebarStore()
  const pathname = usePathname()
  const { data: policies } = useGovernancePolicies()
  const { data: anomalies } = useAnomalies(10)

  const governanceAlertCount = anomalies?.length ?? 0

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
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          const alertCount = item.alertKey === 'governance' ? governanceAlertCount : 0

          return (
            <div key={item.href} title={collapsed ? item.label : undefined}>
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
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <item.Icon
                    size={16}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                  {alertCount > 0 && collapsed && (
                    <div style={{
                      position: 'absolute',
                      top: '-4px',
                      right: '-4px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'var(--colour-red)',
                    }} />
                  )}
                </div>
                {!collapsed && (
                  <>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    <AlertDot count={alertCount} />
                  </>
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