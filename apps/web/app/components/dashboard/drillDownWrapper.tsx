'use client'

import { useState, useCallback } from 'react'
import { Maximize2, Table2, RefreshCw, X } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'

interface DrillDownWrapperProps {
  children: React.ReactNode
  title: string
  queryKeys?: string[]
  tableData?: { headers: string[]; rows: (string | number)[][] }
}

const DrillDownWrapper = ({ children, title, queryKeys = [], tableData }: DrillDownWrapperProps) => {
  const [hovered, setHovered] = useState(false)
  const [mode, setMode] = useState<'card' | 'expanded' | 'table'>('card')
  const [refreshing, setRefreshing] = useState(false)
  const queryClient = useQueryClient()

  const handleRefresh = useCallback(async () => {
    setRefreshing(true)
    await Promise.all(queryKeys.map((key) => queryClient.invalidateQueries({ queryKey: [key] })))
    setTimeout(() => setRefreshing(false), 800)
  }, [queryKeys, queryClient])

  const handleExpand = () => setMode('expanded')
  const handleTable = () => setMode('table')
  const handleClose = () => setMode('card')

  // Expanded / table overlay
  if (mode === 'expanded' || mode === 'table') {
    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '32px',
      }}>
        <div style={{
          background: 'var(--colour-bg-card)',
          border: '1px solid var(--colour-border)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Modal header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--colour-border)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
                {title}
              </span>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button
                  onClick={() => setMode('expanded')}
                  style={{
                    padding: '4px 10px',
                    background: mode === 'expanded' ? 'rgba(48,110,255,0.1)' : 'var(--colour-bg-page)',
                    border: `1px solid ${mode === 'expanded' ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
                    borderRadius: '6px',
                    color: mode === 'expanded' ? 'var(--colour-blue)' : 'var(--colour-text-muted)',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Maximize2 size={11} /> Chart
                </button>
                {tableData && (
                  <button
                    onClick={() => setMode('table')}
                    style={{
                      padding: '4px 10px',
                      background: mode === 'table' ? 'rgba(48,110,255,0.1)' : 'var(--colour-bg-page)',
                      border: `1px solid ${mode === 'table' ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
                      borderRadius: '6px',
                      color: mode === 'table' ? 'var(--colour-blue)' : 'var(--colour-text-muted)',
                      fontSize: '11px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <Table2 size={11} /> Table
                  </button>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={handleRefresh}
                style={{
                  padding: '6px',
                  background: 'var(--colour-bg-page)',
                  border: '1px solid var(--colour-border)',
                  borderRadius: '6px',
                  color: 'var(--colour-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <RefreshCw size={13} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
              </button>
              <button
                onClick={handleClose}
                style={{
                  padding: '6px',
                  background: 'var(--colour-bg-page)',
                  border: '1px solid var(--colour-border)',
                  borderRadius: '6px',
                  color: 'var(--colour-text-muted)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Modal content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
            {mode === 'expanded' && (
              <div style={{ minHeight: '300px' }}>
                {children}
              </div>
            )}

            {mode === 'table' && tableData && (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr>
                    {tableData.headers.map((h) => (
                      <th key={h} style={{
                        textAlign: 'left',
                        fontSize: '11px',
                        color: 'var(--colour-text-muted)',
                        fontWeight: 500,
                        padding: '8px 12px',
                        borderBottom: '1px solid var(--colour-border)',
                        background: 'var(--colour-bg-page)',
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.rows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--colour-border)' }}>
                      {row.map((cell, j) => (
                        <td key={j} style={{ padding: '10px 12px', color: 'var(--colour-text-primary)' }}>
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Normal card with hover actions
  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}

      {/* Action icons — appear on hover */}
      {hovered && (
        <div style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          gap: '4px',
          zIndex: 10,
        }}>
          <button
            onClick={handleExpand}
            title="Expand"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: 'var(--colour-bg-card)',
              border: '1px solid var(--colour-border)',
              color: 'var(--colour-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <Maximize2 size={12} />
          </button>
          {tableData && (
            <button
              onClick={handleTable}
              title="Table view"
              style={{
                width: '26px',
                height: '26px',
                borderRadius: '6px',
                background: 'var(--colour-bg-card)',
                border: '1px solid var(--colour-border)',
                color: 'var(--colour-text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              }}
            >
              <Table2 size={12} />
            </button>
          )}
          <button
            onClick={handleRefresh}
            title="Refresh"
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '6px',
              background: 'var(--colour-bg-card)',
              border: '1px solid var(--colour-border)',
              color: 'var(--colour-text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <RefreshCw size={12} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
          </button>
        </div>
      )}
    </div>
  )
}

export default DrillDownWrapper