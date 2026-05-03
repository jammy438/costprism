'use client'

import { useState } from 'react'
import ReportConfigPanel from './ReportConfigPanel'

const BUILT_IN_TEMPLATES = [
  {
    id: 'monthly-spend',
    name: 'Monthly spend summary',
    description: 'Total spend, top services, spend by team, and budget vs actual.',
    icon: '£',
    colour: 'var(--colour-blue)',
    isCustom: false,
  },
  {
    id: 'tag-coverage',
    name: 'Tag coverage report',
    description: 'Coverage score, variant warnings, required tag compliance, and untagged spend.',
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

type AnyTemplate = typeof BUILT_IN_TEMPLATES[0] | CustomTemplate

const CreateTemplateForm = ({ onSave, onCancel }: { onSave: (t: CustomTemplate) => void; onCancel: () => void }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([])

  const toggleMetric = (id: string) => {
    setSelectedMetrics((prev) => prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id])
  }

  const handleSave = () => {
    if (!name.trim() || selectedMetrics.length === 0) return
    onSave({
      id: `custom-${Date.now()}`,
      name: name.trim(),
      description: description || `Custom report with: ${selectedMetrics.map((m) => METRICS_OPTIONS.find((o) => o.id === m)?.label).join(', ')}`,
      metrics: selectedMetrics,
      isCustom: true,
      icon: '★',
      colour: 'var(--colour-blue)',
    })
  }

  const inputStyle = {
    width: '100%',
    padding: '9px 12px',
    background: 'var(--colour-bg-page)',
    border: '1px solid var(--colour-border)',
    borderRadius: '8px',
    color: 'var(--colour-text-primary)',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box' as const,
  }

  return (
    <div style={{
      background: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-blue)',
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colour-text-primary)', margin: 0 }}>
          New custom template
        </h3>
        <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'var(--colour-text-muted)', cursor: 'pointer', fontSize: '18px' }}>×</button>
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--colour-text-secondary)', marginBottom: '6px' }}>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Weekly engineering review" style={inputStyle} />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--colour-text-secondary)', marginBottom: '6px' }}>Description (optional)</label>
        <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this report for?" style={inputStyle} />
      </div>

      <div>
        <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--colour-text-secondary)', marginBottom: '8px' }}>Include metrics</label>
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

const TemplateCard = ({ template, onSelect, onDelete }: {
  template: AnyTemplate
  onSelect: (t: AnyTemplate) => void
  onDelete?: () => void
}) => {
  return (
    <div
      onClick={() => onSelect(template)}
      style={{
        background: 'var(--colour-bg-card)',
        border: '1px solid var(--colour-border)',
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        transition: 'border-color 0.15s ease',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = template.colour)}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--colour-border)')}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '14px' }}>
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

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '12px', color: 'var(--colour-blue)' }}>
          Configure & preview →
        </span>
        {template.isCustom && onDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDelete() }}
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
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

const ReportTemplates = () => {
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<AnyTemplate | null>(null)

  const handleSaveCustom = (template: CustomTemplate) => {
    setCustomTemplates((prev) => [...prev, template])
    setShowCreateForm(false)
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selectedTemplate ? '1fr 380px' : '1fr', gap: '20px', alignItems: 'start' }}>
      {/* Template gallery */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', color: 'var(--colour-text-secondary)', margin: 0 }}>
            Click a template to configure and preview.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            style={{
              padding: '7px 14px',
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
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
              onSelect={setSelectedTemplate}
              onDelete={() => setCustomTemplates((prev) => prev.filter((t) => t.id !== template.id))}
            />
          ))}
          {BUILT_IN_TEMPLATES.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onSelect={setSelectedTemplate}
            />
          ))}
        </div>
      </div>

      {/* Config panel */}
      {selectedTemplate && (
        <div style={{ position: 'sticky', top: '80px' }}>
          <ReportConfigPanel
            template={selectedTemplate}
            onClose={() => setSelectedTemplate(null)}
          />
        </div>
      )}
    </div>
  )
}

export default ReportTemplates