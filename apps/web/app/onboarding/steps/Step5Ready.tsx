'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Step5Props {
  connectorConnected: boolean
}

const Step5Ready = ({ connectorConnected }: Step5Props) => {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard')
    }, 4000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div style={{ textAlign: 'center', padding: '16px 0' }}>
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'rgba(34,197,94,0.12)',
        border: '2px solid rgba(34,197,94,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 24px',
        fontSize: '28px',
      }}>
        ✓
      </div>

      <h2 style={{
        fontSize: '22px',
        fontWeight: 700,
        color: 'var(--cp-text)',
        marginBottom: '10px',
        letterSpacing: '-0.4px',
      }}>
        You're all set!
      </h2>

      <p style={{
        fontSize: '14px',
        color: 'var(--cp-text-muted)',
        marginBottom: '32px',
        lineHeight: 1.6,
        maxWidth: '360px',
        margin: '0 auto 32px',
      }}>
        {connectorConnected
          ? 'Your first sync is running. Cost data will appear in your dashboard within a few minutes.'
          : 'Your account is ready. Connect a data source from the dashboard to start seeing your costs.'}
      </p>

      {connectorConnected && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px 20px',
          background: 'var(--cp-bg)',
          border: '1px solid var(--cp-border)',
          borderRadius: '8px',
          marginBottom: '24px',
          fontSize: '13px',
          color: 'var(--cp-text-muted)',
        }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: '#22c55e',
            display: 'inline-block',
            animation: 'pulse 1.5s infinite',
          }} />
          Syncing your AWS cost data...
        </div>
      )}

      <p style={{ fontSize: '12px', color: 'var(--cp-text-muted)', marginBottom: '20px' }}>
        Redirecting to dashboard in a moment...
      </p>

      <button
        onClick={() => router.push('/dashboard')}
        style={{
          padding: '12px 32px',
          background: 'var(--cp-accent)',
          border: 'none',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '14px',
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        Go to dashboard →
      </button>
    </div>
  )
}

export default Step5Ready