'use client'

import { usePipelineHealth } from '@/lib/hooks/usePipelineHealth'

const STATUS_COLOURS: Record<string, string> = {
  healthy: 'var(--colour-green)',
  degraded: 'var(--colour-yellow)',
  error: 'var(--colour-red)',
}

const JOB_STATUS_COLOURS: Record<string, string> = {
  complete: 'var(--colour-green)',
  error: 'var(--colour-red)',
  running: 'var(--colour-blue)',
  queued: 'var(--colour-yellow)',
}

const formatDuration = (seconds: number | null) => {
  if (!seconds) return '\u2014'
  if (seconds < 60) return `${seconds.toFixed(0)}s`
  return `${(seconds / 60).toFixed(1)}m`
}

const PipelineHealthExpanded = () => {
  const { data, isLoading } = usePipelineHealth()

  if (isLoading) return <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px' }}>Loading...</div>

  const connectors = (data as any)?.connectors ?? []

  if (connectors.length === 0) return (
    <div style={{ color: 'var(--colour-text-muted)', fontSize: '13px', textAlign: 'center' as const, padding: '40px' }}>
      No connectors configured.
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Overall stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
        {[
          { label: 'Overall success rate', value: `${(data as any)?.successRate ?? 0}%` },
          { label: 'Total jobs (7d)', value: `${(data as any)?.jobs ?? 0}` },
          { label: 'Active connectors', value: `${connectors.length}` },
        ].map((s) => (
          <div key={s.label} style={{ padding: '14px 16px', background: 'var(--colour-bg-page)', borderRadius: '10px', border: '1px solid var(--colour-border)' }}>
            <div style={{ fontSize: '11px', color: 'var(--colour-text-muted)', textTransform: 'uppercase' as const, letterSpacing: '0.6px', marginBottom: '6px' }}>{s.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: 'var(--colour-text-primary)' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Per connector */}
      {connectors.map((connector: any) => (
        <div key={connector.connector_id}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>{connector.connector_name}</span>
            <span style={{
              fontSize: '10px', padding: '2px 8px', borderRadius: '20px',
              background: `${STATUS_COLOURS[connector.status] ?? 'var(--colour-text-muted)'}18`,
              color: STATUS_COLOURS[connector.status] ?? 'var(--colour-text-muted)',
              border: `1px solid ${STATUS_COLOURS[connector.status] ?? 'var(--colour-text-muted)'}33`,
              fontWeight: 500,
            }}>
              {connector.status}
            </span>
            <span style={{ fontSize: '12px', color: 'var(--colour-text-muted)', marginLeft: 'auto' }}>
              {connector.success_rate_7d}% success rate (7d)
            </span>
          </div>

          {/* Job history table */}
          {connector.job_history?.length > 0 && (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr>
                  {['Job ID', 'Started', 'Status', 'Rows', 'Duration'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', fontSize: '11px', color: 'var(--colour-text-muted)', fontWeight: 500, padding: '8px 0', borderBottom: '1px solid var(--colour-border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {connector.job_history.map((job: any, i: number) => {
                  const statusColour = JOB_STATUS_COLOURS[job.status] ?? 'var(--colour-text-muted)'
                  return (
                    <tr key={job.job_id} style={{ borderBottom: i < connector.job_history.length - 1 ? '1px solid var(--colour-border)' : 'none' }}>
                      <td style={{ padding: '10px 0', color: 'var(--colour-text-muted)', fontFamily: 'monospace', fontSize: '11px' }}>{job.job_id}</td>
                      <td style={{ padding: '10px 0', color: 'var(--colour-text-secondary)' }}>
                        {job.started_at ? new Date(job.started_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '\u2014'}
                      </td>
                      <td style={{ padding: '10px 0' }}>
                        <span style={{ color: statusColour, fontWeight: 500 }}>{job.status}</span>
                        {job.error_message && (
                          <div style={{ fontSize: '10px', color: 'var(--colour-red)', marginTop: '2px', maxWidth: '200px' }}>
                            {job.error_message}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '10px 0', color: 'var(--colour-text-secondary)' }}>
                        {job.row_count !== null ? job.row_count.toLocaleString() : '\u2014'}
                      </td>
                      <td style={{ padding: '10px 0', color: 'var(--colour-text-secondary)' }}>
                        {formatDuration(job.duration_seconds)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  )
}

export default PipelineHealthExpanded