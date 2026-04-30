'use client'

import { useState } from 'react'
import { useBudgets } from '@/lib/hooks/useBudgets'

// Reuse invitation types from existing hook
interface Member {
  id: string
  clerkUserId: string
  role: 'ADMIN' | 'MEMBER' | 'VIEWER'
  createdAt: string
}

interface Invitation {
  id: string
  email: string
  role: 'ADMIN' | 'MEMBER' | 'VIEWER'
  status: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'REVOKED'
  expiresAt: string
  createdAt: string
}

const ROLE_COLOURS = {
  ADMIN: { bg: 'rgba(48,110,255,0.1)', color: 'var(--colour-blue)', border: 'rgba(48,110,255,0.3)' },
  MEMBER: { bg: 'rgba(76,187,23,0.1)', color: 'var(--colour-green)', border: 'rgba(76,187,23,0.3)' },
  VIEWER: { bg: 'var(--colour-bg-card-hover)', color: 'var(--colour-text-muted)', border: 'var(--colour-border)' },
}

const RoleBadge = ({ role }: { role: 'ADMIN' | 'MEMBER' | 'VIEWER' }) => {
  const c = ROLE_COLOURS[role]
  return (
    <span style={{
      fontSize: '11px',
      padding: '2px 8px',
      borderRadius: '20px',
      background: c.bg,
      color: c.color,
      border: `1px solid ${c.border}`,
      fontWeight: 500,
    }}>
      {role.charAt(0) + role.slice(1).toLowerCase()}
    </span>
  )
}

const TeamSettings = () => {
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'ADMIN' | 'MEMBER' | 'VIEWER'>('MEMBER')
  const [inviting, setInviting] = useState(false)
  const [inviteError, setInviteError] = useState('')
  const [inviteSuccess, setInviteSuccess] = useState('')
  const [invitations, setInvitations] = useState<Invitation[]>([])
  const [invitationsLoaded, setInvitationsLoaded] = useState(false)

  const loadInvitations = async () => {
    if (invitationsLoaded) return
    try {
      const res = await fetch('/api/invitations')
      const data = await res.json()
      setInvitations(data.invitations?.filter((i: Invitation) => i.status === 'PENDING') ?? [])
      setInvitationsLoaded(true)
    } catch {}
  }

  useState(() => {
    loadInvitations()
  })

  const handleInvite = async () => {
    if (!inviteEmail.includes('@')) return
    setInviting(true)
    setInviteError('')
    setInviteSuccess('')
    try {
      const res = await fetch('/api/invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invites: [{ email: inviteEmail, role: inviteRole }] }),
      })
      if (!res.ok) throw new Error('Failed to send invitation')
      setInviteSuccess(`Invitation sent to ${inviteEmail}`)
      setInviteEmail('')
      setInvitationsLoaded(false)
      loadInvitations()
    } catch {
      setInviteError('Failed to send invitation. Please try again.')
    } finally {
      setInviting(false)
    }
  }

  const handleRevoke = async (id: string) => {
    try {
      await fetch(`/api/invitations?id=${id}`, { method: 'DELETE' })
      setInvitations((prev) => prev.filter((i) => i.id !== id))
    } catch {}
  }

  return (
    <div style={{ maxWidth: '600px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Invite new member */}
      <div style={{
        background: 'var(--colour-bg-card)',
        border: '1px solid var(--colour-border)',
        borderRadius: '12px',
        padding: '24px',
      }}>
        <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colour-text-primary)', margin: '0 0 16px' }}>
          Invite teammate
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            style={{
              flex: 1,
              padding: '10px 14px',
              background: 'var(--colour-bg-page)',
              border: '1px solid var(--colour-border)',
              borderRadius: '8px',
              color: 'var(--colour-text-primary)',
              fontSize: '13px',
              outline: 'none',
            }}
          />
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as any)}
            style={{
              padding: '10px 12px',
              background: 'var(--colour-bg-page)',
              border: '1px solid var(--colour-border)',
              borderRadius: '8px',
              color: 'var(--colour-text-primary)',
              fontSize: '13px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="ADMIN">Admin</option>
            <option value="MEMBER">Member</option>
            <option value="VIEWER">Viewer</option>
          </select>
          <button
            onClick={handleInvite}
            disabled={!inviteEmail.includes('@') || inviting}
            style={{
              padding: '10px 20px',
              background: inviteEmail.includes('@') && !inviting ? 'var(--colour-blue)' : 'var(--colour-border)',
              border: 'none',
              borderRadius: '8px',
              color: inviteEmail.includes('@') && !inviting ? '#fff' : 'var(--colour-text-muted)',
              fontSize: '13px',
              fontWeight: 600,
              cursor: inviteEmail.includes('@') && !inviting ? 'pointer' : 'not-allowed',
              whiteSpace: 'nowrap' as const,
            }}
          >
            {inviting ? 'Sending...' : 'Send invite'}
          </button>
        </div>
        {inviteError && <p style={{ color: 'var(--colour-red)', fontSize: '12px', margin: '8px 0 0' }}>{inviteError}</p>}
        {inviteSuccess && <p style={{ color: 'var(--colour-green)', fontSize: '12px', margin: '8px 0 0' }}>{inviteSuccess}</p>}
      </div>

      {/* Pending invitations */}
      {invitations.length > 0 && (
        <div style={{
          background: 'var(--colour-bg-card)',
          border: '1px solid var(--colour-border)',
          borderRadius: '12px',
          padding: '24px',
        }}>
          <h2 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colour-text-primary)', margin: '0 0 16px' }}>
            Pending invitations
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {invitations.map((inv) => (
              <div key={inv.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: 'var(--colour-bg-page)',
                borderRadius: '8px',
                border: '1px solid var(--colour-border)',
              }}>
                <div>
                  <div style={{ fontSize: '13px', color: 'var(--colour-text-primary)' }}>{inv.email}</div>
                  <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', marginTop: '2px' }}>
                    Expires {new Date(inv.expiresAt).toLocaleDateString('en-GB')}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <RoleBadge role={inv.role} />
                  <button
                    onClick={() => handleRevoke(inv.id)}
                    style={{
                      padding: '4px 10px',
                      background: 'rgba(247,49,18,0.08)',
                      border: '1px solid rgba(247,49,18,0.2)',
                      borderRadius: '6px',
                      color: 'var(--colour-red)',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default TeamSettings