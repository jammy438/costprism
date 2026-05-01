'use client'

import { useState } from 'react'
import { useCreateShare } from '@/lib/hooks/useReports'

const BUILT_IN_TEMPLATES = [
  {
    id: 'monthly-spend',
    name: 'Monthly spend summary',
    description: 'Total spend, top services, spend by team, and budget vs actual for the selected month.',
    icon: '£',
    colour: 'var(--colour-blue)',
    isCustom: false,
  },
  {
    id: 'tag-coverage',
    name: 'Tag coverage report',
    description: 'Coverage score, variant warnings, required tag compliance, and untagged spend breakdown.',
    icon: '#',
    colour: 'var(--colour-green)',
    isCustom: false,
  },
  {
    id: 'budget-vs-actual',
    name: 'Budget vs actual',
    description: 'Each budget with progress bars, threshold alerts, and month-on-month trend.',
    icon: '◫',
    colour: 'var(--colour-yellow)',
    isCustom: false,
  },
  {
    id: 'anomaly-summary',
    name: 'Anomaly summary',
    description: 'All cost anomalies detected in the selected period with spend impact.',
    icon: '⚡',
    colour: 'var(--colour-red)',
    isCustom: false,
  },
]

const EXPIRY_OPTIONS = [
  { label: '7 days', value: 7 },
  { label: '30 days', value: 30 },
  { label: '90 days', value: 90 },
  { label: 'Never', value: undefined },
]

const METRICS_OPTIONS = [
  { id: 'total-spend', label: 'Total spend' },
  { id: 'spend-by-service', label: 'Spend by service' },
  { id: 'spend-by-team', label: 'Spend by team' },
  { id: 'spend-over-time', label: 'Spend over time chart' },
  { id: 'budget-status', label: 'Budget status' },
  { id: 'tag-coverage', label: 'Tag coverage score' },
  { id: 'anomalies', label: 'Anomaly list' },
  { id: 'savings', label: 'Savings opportunities' },
]

interface CustomTemplate {
  id: string
  name: string
  description: string
  metrics: string[]
  isCustom: true
  icon: string
  colour: string
}

const ShareModal = ({ template, onClose }: { template: { id: string; name: string }; onClose: () => void }) => {
  const createShare = useCreateShare()
  const [expiresInDays, setExpiresInDays] = useState<number | undefined>(30)
  const [password, setPassword] = useState('')
  const [generatedUrl, setGeneratedUrl] = useState('')
  const [copied, setCopied] = useState(false)

  const handleGenerateLink = async () => {
    const result = await createShare.mutateAsync({
      reportType: template.id,
      expiresInDays,
      password: password || undefined,
    })
    setGeneratedUrl(result.url)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '24px',
    }}>
      <div style={{
        background: 'var(--colour-bg-card)',
        border: '1px solid var(--colour-border)',
        borderRadius: '16px',
        padding: '32px',
        width: '100%',
        maxWidth: '460px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--colour-text-primary)', margin: 0 }}>
            Share — {template.name}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--colour-text-muted)', cursor: 'pointer', fontSize: '20px' }}>
            ×
          </button>
        </div>

        {!generatedUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--colour-text-secondary)', marginBottom: '8px' }}>
                Link expires
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {EXPIRY_OPTIONS.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={() => setExpiresInDays(opt.value)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      background: expiresInDays === opt.value ? 'var(--colour-blue)' : 'var(--colour-bg-page)',
                      border: `1px solid ${expiresInDays === opt.value ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
                      borderRadius: '8px',
                      color: expiresInDays === opt.value ? '#fff' : 'var(--colour-text-secondary)',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--colour-text-secondary)', marginBottom: '6px' }}>
                Password protection (optional)
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Leave blank for no password"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  background: 'var(--colour-bg-page)',
                  border: '1px solid var(--colour-border)',
                  borderRadius: '8px',
                  color: 'var(--colour-text-primary)',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box' as const,
                }}
              />
            </div>

            <button
              onClick={handleGenerateLink}
              disabled={createShare.isPending}
              style={{
                padding: '11px',
                background: 'var(--colour-blue)',
                border: 'none',
                borderRadius: '8px',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {createShare.isPending ? 'Generating...' : 'Generate link'}
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{
              padding: '12px 14px',
              background: 'rgba(76,187,23,0.08)',
              border: '1px solid rgba(76,187,23,0.3)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--colour-green)',
            }}>
              ✓ Link generated successfully
            </div>
            <div style={{ display: 'flex', gap: '8px', padding: '10px 14px', background: 'var(--colour-bg-page)', border: '1px solid var(--colour-border)', borderRadius: '8px', alignItems: 'center' }}>
              <span style={{ flex: 1, fontSize: '12px', color: 'var(--colour-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>
                {generatedUrl}
              </span>
              <button
                onClick={handleCopy}
                style={{
                  padding: '4px 12px',
                  background: copied ? 'var(--colour-green)' : 'var(--colour-blue)',
                  border: 'none',
                  borderRadius: '6px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <p style={{ fontSize: '11px', color: 'var(--colour-text-muted)', margin: 0 }}>
              Anyone with this link can view the report.
              {expiresInDays ? ` Expires in ${expiresInDays} days.` : ' Never expires.'}
              {password ? ' Password protected.' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const TemplateCard = ({ template, onDelete }: {
  template: (typeof BUILT_IN_TEMPLATES[0]) | CustomTemplate
  onDelete?: () => void
}) => {
  const [showShareModal, setShowShareModal] = useState(false)

  const handlePrint = () => window.print()

  const handleCSVExport = async () => {
    const res = await fetch(`/api/costs/export?reportType=${template.id}`)
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `costprism-${template.id}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <div style={{
        background: 'var(--colour-bg-card)',
        border: '1px solid var(--colour-border)',
        borderRadius: '12px',
        padding: '20px',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '16px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: `${template.colour}18`,
            border: `1px solid ${template.colour}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            fontWeight: 700,
            color: template.colour,
            flexShrink: 0,
          }}>
            {template.icon}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
                {template.name}
              </span>
              {template.isCustom && (
                <span style={{
                  fontSize: '10px',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  background: 'rgba(48,110,255,0.1)',
                  color: 'var(--colour-blue)',
                  border: '1px solid rgba(48,110,255,0.3)',
                }}>
                  Custom
                </span>
              )}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--colour-text-secondary)', marginTop: '4px', lineHeight: 1.5 }}>
              {template.description}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setShowShareModal(true)}
            style={{ flex: 1, padding: '8px', background: 'var(--colour-bg-page)', border: '1px solid var(--colour-border)', borderRadius: '8px', color: 'var(--colour-text-secondary)', fontSize: '12px', cursor: 'pointer' }}
          >
            🔗 Share
          </button>
          <button
            onClick={handlePrint}
            style={{ flex: 1, padding: '8px', background: 'var(--colour-bg-page)', border: '1px solid var(--colour-border)', borderRadius: '8px', color: 'var(--colour-text-secondary)', fontSize: '12px', cursor: 'pointer' }}
          >
            📄 PDF
          </button>
          <button
            onClick={handleCSVExport}
            style={{ flex: 1, padding: '8px', background: 'var(--colour-bg-page)', border: '1px solid var(--colour-border)', borderRadius: '8px', color: 'var(--colour-text-secondary)', fontSize: '12px', cursor: 'pointer' }}
          >
            📊 CSV
          </button>
          {template.isCustom && onDelete && (
            <button
              onClick={onDelete}
              style={{ padding: '8px 12px', background: 'rgba(247,49,18,0.08)', border: '1px solid rgba(247,49,18,0.2)', borderRadius: '8px', color: 'var(--colour-red)', fontSize: '12px', cursor: 'pointer' }}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {showShareModal && (
        <ShareModal template={template} onClose={() => setShowShareModal(false)} />
      )}
    </>
  )
}

const CreateTemplateForm = ({ onSave, onCancel }: { onSave: (t: CustomTemplate) => void; onCancel: () => void }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])

  const toggleMetric = (id: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    )
  }

  const handleSave = () => {
    if (!name.trim() || selectedMetrics.length === 0) return
    onSave({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description || `Custom report including: ${selectedMetrics.join(', ')}`,
      metrics: selectedMetrics,
      isCustom: true,
      icon: '★',
      colour: 'var(--colour-blue)',
    })
  }

  return (
    <div style={{
      background: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-blue)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
    }}>
      <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colour-text-primary)', margin: 0 }}>
        New custom template
      </h3>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--colour-text-secondary)', marginBottom: '6px' }}>
          Template name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Weekly engineering review"
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'var(--colour-bg-page)',
            border: '1px solid var(--colour-border)',
            borderRadius: '8px',
            color: 'var(--colour-text-primary)',
            fontSize: '13px',
            outline: 'none',
            boxSizing: 'border-box' as const,
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--colour-text-secondary)', marginBottom: '6px' }}>
          Description (optional)
        </label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this report for?"
          style={{
            width: '100%',
            padding: '10px 14px',
            background: 'var(--colour-bg-page)',
            border: '1px solid var(--colour-border)',
            borderRadius: '8px',
            color: 'var(--colour-text-primary)',
            fontSize: '13px',
            outline: 'none',
            boxSizing: 'border-box' as const,
          }}
        />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--colour-text-secondary)', marginBottom: '8px' }}>
          Include metrics
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          {METRICS_OPTIONS.map((metric) => (
            <button
              key={metric.id}
              onClick={() => toggleMetric(metric.id)}
              style={{
                padding: '8px 12px',
                background: selectedMetrics.includes(metric.id) ? 'rgba(48,110,255,0.1)' : 'var(--colour-bg-page)',
                border: `1px solid ${selectedMetrics.includes(metric.id) ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
                borderRadius: '8px',
                color: selectedMetrics.includes(metric.id) ? 'var(--colour-blue)' : 'var(--colour-text-secondary)',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'left' as const,
              }}
            >
              {selectedMetrics.includes(metric.id) ? '✓ ' : ''}{metric.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={onCancel}
          style={{ flex: 1, padding: '10px', background: 'var(--colour-bg-page)', border: '1px solid var(--colour-border)', borderRadius: '8px', color: 'var(--colour-text-secondary)', fontSize: '13px', cursor: 'pointer' }}
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={!name.trim() || selectedMetrics.length === 0}
          style={{
            flex: 2,
            padding: '10px',
            background: name.trim() && selectedMetrics.length > 0 ? 'var(--colour-blue)' : 'var(--colour-border)',
            border: 'none',
            borderRadius: '8px',
            color: name.trim() && selectedMetrics.length > 0 ? '#fff' : 'var(--colour-text-muted)',
            fontSize: '13px',
            fontWeight: 600,
            cursor: name.trim() && selectedMetrics.length > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Save template
        </button>
      </div>
    </div>
  )
}

const ReportTemplates = () => {
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)

  const handleSaveCustom = (template: CustomTemplate) => {
    setCustomTemplates((prev) => [...prev, template])
    setShowCreateForm(false)
  }

  const handleDeleteCustom = (id: string) => {
    setCustomTemplates((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <p style={{ fontSize: '13px', color: 'var(--colour-text-secondary)', margin: 0 }}>
          Select a template to share, export as PDF, or download as CSV.
        </p>
        <button
          onClick={() => setShowCreateForm(true)}
          style={{
            padding: '8px 16px',
            background: 'var(--colour-blue)',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            whiteSpace: 'nowrap' as const,
          }}
        >
          + Custom template
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {showCreateForm && (
          <CreateTemplateForm
            onSave={handleSaveCustom}
            onCancel={() => setShowCreateForm(false)}
          />
        )}
        {customTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            onDelete={() => handleDeleteCustom(template.id)}
          />
        ))}
        {BUILT_IN_TEMPLATES.map((template) => (
          <TemplateCard key={template.id} template={template} />
        ))}
      </div>
    </div>
  )
}

export default ReportTemplates