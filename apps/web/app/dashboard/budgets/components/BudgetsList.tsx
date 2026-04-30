'use client'

import { useState } from 'react'
import { useBudgets, useDeleteBudget, Budget } from '@/lib/hooks/useBudgets'
import BudgetForm from './BudgetForm'

const periodLabel = { MONTHLY: 'Monthly', QUARTERLY: 'Quarterly', ANNUAL: 'Annual' }
const scopeLabel = { ORG: 'Organisation', TEAM: 'Team', SERVICE: 'Service', ACCOUNT: 'Account', ENVIRONMENT: 'Environment' }

const BudgetProgressBar = ({ spent, amount }: { spent: number; amount: number }) => {
  const pct = Math.min(100, (spent / amount) * 100)
  const colour = pct >= 100 ? 'var(--colour-red)' : pct >= 90 ? 'var(--colour-orange)' : pct >= 70 ? 'var(--colour-yellow)' : 'var(--colour-green)'

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        height: '4px',
        borderRadius: '2px',
        background: 'var(--colour-border)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: colour,
          borderRadius: '2px',
          transition: 'width 0.3s ease',
        }} />
      </div>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '4px',
        fontSize: '11px',
        color: 'var(--colour-text-muted)',
      }}>
        <span style={{ color: colour }}>{pct.toFixed(0)}% used</span>
        <span>{'\u00a3'}{amount.toLocaleString()} limit</span>
      </div>
    </div>
  )
}

const BudgetsList = () => {
  const { data: budgets, isLoading, isError } = useBudgets()
  const deleteBudget = useDeleteBudget()
  const [showForm, setShowForm] = useState(false)
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      await deleteBudget.mutateAsync(id)
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '16px',
    }}>
      {[1, 2, 3].map((i) => (
        <div key={i} style={{
          height: '160px',
          background: 'var(--colour-bg-card)',
          border: '1px solid var(--colour-border)',
          borderRadius: '12px',
          opacity: 0.5,
        }} />
      ))}
    </div>
  )

  if (isError) return (
    <div style={{
      padding: '24px',
      background: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '12px',
      color: 'var(--colour-red)',
      fontSize: '13px',
    }}>
      Failed to load budgets.
    </div>
  )

  return (
    <div>
      {/* Create button */}
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => { setEditingBudget(null); setShowForm(true) }}
          style={{
            padding: '10px 20px',
            background: 'var(--colour-blue)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          + New budget
        </button>
      </div>

      {/* Form modal */}
      {showForm && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
        }}>
          <div style={{
            background: 'var(--colour-bg-card)',
            border: '1px solid var(--colour-border)',
            borderRadius: '16px',
            padding: '32px',
            width: '100%',
            maxWidth: '480px',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px',
            }}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--colour-text-primary)', margin: 0 }}>
                {editingBudget ? 'Edit budget' : 'New budget'}
              </h2>
              <button
                onClick={() => setShowForm(false)}
                style={{ background: 'none', border: 'none', color: 'var(--colour-text-muted)', cursor: 'pointer', fontSize: '20px' }}
              >
                {'\u00d7'}
              </button>
            </div>
            <BudgetForm
              existing={editingBudget}
              onSuccess={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Empty state */}
      {budgets && budgets.length === 0 && (
        <div style={{
          padding: '48px 24px',
          background: 'var(--colour-bg-card)',
          border: '1px solid var(--colour-border)',
          borderRadius: '12px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '32px', marginBottom: '12px' }}>{'£'}</div>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colour-text-primary)', margin: '0 0 8px' }}>
            No budgets yet
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--colour-text-secondary)', margin: '0 0 20px' }}>
            Set a spend limit to get alerted before you overshoot.
          </p>
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '10px 20px',
              background: 'var(--colour-blue)',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Create your first budget
          </button>
        </div>
      )}

      {/* Budget cards */}
      {budgets && budgets.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px',
        }}>
          {budgets.map((budget) => (
            <div
              key={budget.id}
              style={{
                background: 'var(--colour-bg-card)',
                border: '1px solid var(--colour-border)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
                    {budget.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', marginTop: '2px' }}>
                    {scopeLabel[budget.scopeType]}{budget.scopeValue ? ` · ${budget.scopeValue}` : ''} · {periodLabel[budget.period]}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => { setEditingBudget(budget); setShowForm(true) }}
                    style={{
                      padding: '4px 10px',
                      background: 'var(--colour-bg-card-hover)',
                      border: '1px solid var(--colour-border)',
                      borderRadius: '6px',
                      color: 'var(--colour-text-secondary)',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(budget.id)}
                    disabled={deletingId === budget.id}
                    style={{
                      padding: '4px 10px',
                      background: 'rgba(247,49,18,0.1)',
                      border: '1px solid rgba(247,49,18,0.3)',
                      borderRadius: '6px',
                      color: 'var(--colour-red)',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {deletingId === budget.id ? '...' : 'Delete'}
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div style={{ fontSize: '22px', fontWeight: 700, color: 'var(--colour-text-primary)', marginBottom: '12px' }}>
                {budget.currency === 'GBP' ? '\u00a3' : budget.currency}{Number(budget.amount).toLocaleString()}
              </div>

              {/* Progress bar — spent is 0 until George's data flows */}
              <BudgetProgressBar spent={0} amount={Number(budget.amount)} />

              {/* Alert thresholds */}
              <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                {budget.alertThreshold70 && (
                  <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(252,174,30,0.1)', border: '1px solid rgba(252,174,30,0.3)', borderRadius: '4px', color: 'var(--colour-yellow)' }}>
                    Alert at 70%
                  </span>
                )}
                {budget.alertThreshold90 && (
                  <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(255,132,0,0.1)', border: '1px solid rgba(255,132,0,0.3)', borderRadius: '4px', color: 'var(--colour-orange)' }}>
                    Alert at 90%
                  </span>
                )}
                {budget.alertThreshold100 && (
                  <span style={{ fontSize: '10px', padding: '2px 6px', background: 'rgba(247,49,18,0.1)', border: '1px solid rgba(247,49,18,0.3)', borderRadius: '4px', color: 'var(--colour-red)' }}>
                    Alert at 100%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default BudgetsList