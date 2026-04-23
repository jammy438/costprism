'use client'

import { useConnectorsList, useTriggerSync, Connector } from '@/lib/hooks/useConnectorsList'

const TYPE_LABELS: Record<Connector['type'], string> = {
  AWS_CUR: 'AWS',
  GCP_BILLING: 'GCP',
  AZURE_COST: 'Azure',
  DATADOG: 'Datadog',
  STRIPE: 'Stripe',
  CUSTOM: 'Custom',
}

const TYPE_COLOURS: Record<Connector['type'], string> = {
  AWS_CUR: '#FF9900',
  GCP_BILLING: '#4285F4',
  AZURE_COST: '#0078D4',
  DATADOG: '#632CA6',
  STRIPE: '#635BFF',
  CUSTOM: '#6b7280',
}

const SyncStatusBadge = ({ status }: { status: Connector['syncStatus'] }) => {
  const config = {
    IDLE: { label: 'Idle', colour: 'var(--colour-text-muted)', bg: 'var(--colour-bg-card-hover)' },
    QUEUED: { label: 'Queued', colour: 'var(--colour-yellow)', bg: 'rgba(252,174,30,0.1)' },
    RUNNING: { label: 'Syncing...', colour: 'var(--colour-blue)', bg: 'rgba(48,110,255,0.1)' },
    COMPLETE: { label: 'Complete', colour: 'var(--colour-green)', bg: 'rgba(76,187,23,0.1)' },
    ERROR: { label: 'Error', colour: 'var(--colour-red)', bg: 'rgba(247,49,18,0.1)' },
  }[status]

  return (
    <span style={{
      fontSize: '11px',
      padding: '3px 8px',
      borderRadius: '20px',
      background: config.bg,
      color: config.colour,
      fontWeight: 500,
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
    }}>
      {status === 'RUNNING' && (
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: config.colour,
          display: 'inline-block',
          animation: 'pulse 1.5s infinite',
        }} />
      )}
      {config.label}
    </span>
  )
}

const ConnectorCard = ({ connector }: { connector: Connector }) => {
  const triggerSync = useTriggerSync()
  const colour = TYPE_COLOURS[connector.type]
  const isSyncing = connector.syncStatus === 'RUNNING' || connector.syncStatus === 'QUEUED'

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Never'
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div style={{
      background: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: `${colour}22`,
            border: `1px solid ${colour}44`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 700,
            color: colour,
          }}>
            {TYPE_LABELS[connector.type]}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
              {connector.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', marginTop: '2px' }}>
              {TYPE_LABELS[connector.type]} · {connector.type.replace('_', ' ')}
            </div>
          </div>
        </div>
        <SyncStatusBadge status={connector.syncStatus} />
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '12px',
        padding: '12px',
        background: 'var(--colour-bg-page)',
        borderRadius: '8px',
      }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--colour-text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Last synced
          </div>
          <div style={{ fontSize: '12px', color: 'var(--colour-text-secondary)', marginTop: '3px' }}>
            {formatDate(connector.lastSyncedAt)}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--colour-text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            Rows synced
          </div>
          <div style={{ fontSize: '12px', color: 'var(--colour-text-secondary)', marginTop: '3px' }}>
            {connector.lastSyncRowCount !== null ? connector.lastSyncRowCount.toLocaleString() : '—'}
          </div>
        </div>
      </div>

      {/* Error message */}
      {connector.syncStatus === 'ERROR' && connector.lastErrorMessage && (
        <div style={{
          padding: '10px 12px',
          background: 'rgba(247,49,18,0.08)',
          border: '1px solid rgba(247,49,18,0.2)',
          borderRadius: '8px',
          fontSize: '12px',
          color: 'var(--colour-red)',
        }}>
          {connector.lastErrorMessage}
        </div>
      )}

      {/* Actions */}
      <button
        onClick={() => triggerSync.mutate(connector.id)}
        disabled={isSyncing || triggerSync.isPending}
        style={{
          width: '100%',
          padding: '9px',
          background: isSyncing ? 'var(--colour-bg-card-hover)' : 'var(--colour-bg-page)',
          border: '1px solid var(--colour-border)',
          borderRadius: '8px',
          color: isSyncing ? 'var(--colour-text-muted)' : 'var(--colour-text-secondary)',
          fontSize: '12px',
          fontWeight: 500,
          cursor: isSyncing ? 'not-allowed' : 'pointer',
        }}
      >
        {isSyncing ? 'Syncing...' : 'Sync now'}
      </button>
    </div>
  )
}

const ConnectorsList = () => {
  const { data: connectors, isLoading, isError } = useConnectorsList()

  if (isLoading) return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px',
    }}>
      {[1, 2].map((i) => (
        <div key={i} style={{
          height: '220px',
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
      Failed to load connectors.
    </div>
  )

  if (!connectors || connectors.length === 0) return (
    <div style={{
      padding: '48px 24px',
      background: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '12px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '32px', marginBottom: '12px' }}>☁️</div>
      <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--colour-text-primary)', margin: '0 0 8px' }}>
        No connectors yet
      </h3>
      <p style={{ fontSize: '13px', color: 'var(--colour-text-secondary)', margin: '0 0 20px' }}>
        Connect a cloud account to start ingesting cost data.
      </p>
      <a
        href="/onboarding"
        style={{
          display: 'inline-block',
          padding: '10px 20px',
          background: 'var(--colour-blue)',
          borderRadius: '8px',
          color: '#fff',
          fontSize: '13px',
          fontWeight: 600,
          textDecoration: 'none',
        }}
      >
        Connect data source
      </a>
    </div>
  )

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '16px',
    }}>
      {connectors.map((connector) => (
        <ConnectorCard key={connector.id} connector={connector} />
      ))}
    </div>
  )
}

export default ConnectorsList