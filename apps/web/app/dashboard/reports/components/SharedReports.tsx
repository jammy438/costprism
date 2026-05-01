'use client'

import { useReportShares, useDeleteShare } from '@/lib/hooks/useReports'

const REPORT_TYPE_LABELS: Record<string, string> = {
  'monthly-spend': 'Monthly spend summary',
  'tag-coverage': 'Tag coverage report',
  'budget-vs-actual': 'Budget vs actual',
  'anomaly-summary': 'Anomaly summary',
}

const SharedReports = () => {
  const { data: shares, isLoading, isError } = useReportShares()
  const deleteShare = useDeleteShare()

  const formatExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return 'Never expires'
    const date = new Date(expiresAt)
    if (date < new Date()) return 'Expired'
    return `Expires ${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`
  }

  const getShareUrl = (token: string) => {
    return `${window.location.origin}/r/${token}`
  }

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(getShareUrl(token))
  }

  if (isLoading) return (
    <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px' }}>Loading...</div>
  )

  if (isError) return (
    <div style={{ color: 'var(--colour-red)', fontSize: '13px' }}>Failed to load shared reports.</div>
  )

  if (!shares || shares.length === 0) return (
    <div style={{
      padding: '48px 24px',
      background: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '12px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>🔗</div>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colour-text-primary)', margin: '0 0 8px' }}>
        No shared reports yet
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--colour-text-secondary)', margin: 0 }}>
        Generate a share link from the Templates tab to share reports with stakeholders.
      </p>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {shares.map((share) => {
        const isExpired = share.expiresAt && new Date(share.expiresAt) < new Date()
        return (
          <div
            key={share.id}
            style={{
              background: 'var(--colour-bg-card)',
              border: '1px solid var(--colour-border)',
              borderRadius: '10px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              opacity: isExpired ? 0.5 : 1,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
                {REPORT_TYPE_LABELS[share.reportType] ?? share.reportType}
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '11px', color: 'var(--colour-text-muted)' }}>
                <span>{formatExpiry(share.expiresAt)}</span>
                <span>{share.viewCount} view{share.viewCount !== 1 ? 's' : ''}</span>
                {share.passwordHash && <span>🔒 Password protected</span>}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              {!isExpired && (
                <button
                  onClick={() => handleCopy(share.token)}
                  style={{
                    padding: '6px 14px',
                    background: 'var(--colour-bg-page)',
                    border: '1px solid var(--colour-border)',
                    borderRadius: '6px',
                    color: 'var(--colour-text-secondary)',
                    fontSize: '12px',
                    cursor: 'pointer',
                  }}
                >
                  Copy link
                </button>
              )}
              <button
                onClick={() => deleteShare.mutate(share.id)}
                disabled={deleteShare.isPending}
                style={{
                  padding: '6px 14px',
                  background: 'rgba(247,49,18,0.08)',
                  border: '1px solid rgba(247,49,18,0.2)',
                  borderRadius: '6px',
                  color: 'var(--colour-red)',
                  fontSize: '12px',
                  cursor: 'pointer',
                }}
              >
                Revoke
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SharedReports