'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Template {
  id: string
  name: string
  description: string
  icon: string
  colour: string
}

interface ReportConfigPanelProps {
  template: Template
  onClose: () => void
}

const now = new Date()
const today = now.toISOString().split('T')[0]
const firstOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
const lastOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0).toISOString().split('T')[0]
const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000).toISOString().split('T')[0]
const ninetyDaysAgo = new Date(now.getTime() - 90 * 86400000).toISOString().split('T')[0]

const QUICK_RANGES = [
  { label: 'This month', from: firstOfMonth, to: today },
  { label: 'Last month', from: firstOfLastMonth, to: lastOfLastMonth },
  { label: 'Last 30 days', from: thirtyDaysAgo, to: today },
  { label: 'Last 90 days', from: ninetyDaysAgo, to: today },
  { label: 'YTD', from: `${now.getFullYear()}-01-01`, to: today },
]

const TEAMS = ['backend', 'frontend', 'data', 'platform', 'devops', 'ml', 'security']
const SERVICES = ['Amazon EC2', 'Amazon S3', 'Amazon RDS', 'AWS Lambda', 'Amazon EKS', 'Amazon ElastiCache', 'Amazon CloudFront']
const ENVIRONMENTS = ['production', 'staging', 'development', 'sandbox']
const REGIONS = ['eu-west-1', 'eu-west-2', 'us-east-1', 'us-west-2', 'ap-southeast-1']

const GROUP_BY_OPTIONS = [
  { value: 'service', label: 'Service' },
  { value: 'team', label: 'Team' },
  { value: 'environment', label: 'Environment' },
  { value: 'region', label: 'Region' },
  { value: 'day', label: 'Day' },
  { value: 'week', label: 'Week' },
  { value: 'month', label: 'Month' },
]

const METRIC_OPTIONS = [
  { value: 'net_amortised_cost', label: 'Net amortised cost' },
  { value: 'amortised_cost', label: 'Amortised cost' },
  { value: 'billed_cost', label: 'Billed cost' },
]

const COMPARE_OPTIONS = [
  { value: '', label: 'No comparison' },
  { value: 'previous_period', label: 'Previous period' },
  { value: 'same_period_last_year', label: 'Same period last year' },
]

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

const labelStyle = {
  display: 'block' as const,
  fontSize: '12px',
  fontWeight: 500 as const,
  color: 'var(--colour-text-secondary)',
  marginBottom: '6px',
}

const SectionHeader = ({ title, open, onToggle }: { title: string; open: boolean; onToggle: () => void }) => (
  <button
    onClick={onToggle}
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'none',
      border: 'none',
      padding: '8px 0',
      cursor: 'pointer',
      borderTop: '1px solid var(--colour-border)',
    }}
  >
    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--colour-text-secondary)', textTransform: 'uppercase' as const, letterSpacing: '0.6px' }}>
      {title}
    </span>
    <span style={{ fontSize: '12px', color: 'var(--colour-text-muted)' }}>{open ? '▾' : '▸'}</span>
  </button>
)

const MultiSelect = ({ options, selected, onChange }: {
  options: string[]
  selected: string[]
  onChange: (v: string[]) => void
}) => {
  const toggle = (v: string) => {
    onChange(selected.includes(v) ? selected.filter((s) => s !== v) : [...selected, v])
  }
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: '6px' }}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          style={{
            padding: '4px 10px',
            background: selected.includes(opt) ? 'rgba(48,110,255,0.1)' : 'var(--colour-bg-page)',
            border: `1px solid ${selected.includes(opt) ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
            borderRadius: '20px',
            color: selected.includes(opt) ? 'var(--colour-blue)' : 'var(--colour-text-secondary)',
            fontSize: '11px',
            fontWeight: selected.includes(opt) ? 600 : 400,
            cursor: 'pointer',
          }}
        >
          {selected.includes(opt) ? '✓ ' : ''}{opt}
        </button>
      ))}
    </div>
  )
}

const ReportConfigPanel = ({ template, onClose }: ReportConfigPanelProps) => {
  const router = useRouter()

  const [from, setFrom] = useState<string>(firstOfMonth)
  const [to, setTo] = useState<string>(today)
  const [metric, setMetric] = useState<string>('net_amortised_cost')
  const [groupBy, setGroupBy] = useState<string>('service')
  const [compareTo, setCompareTo] = useState<string>('')
  const [teams, setTeams] = useState<string[]>([])
  const [services, setServices] = useState<string[]>([])
  const [environments, setEnvironments] = useState<string[]>([])
  const [regions, setRegions] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [showGrouping, setShowGrouping] = useState(false)
  const [showComparison, setShowComparison] = useState(false)

  const activeFilterCount = teams.length + services.length + environments.length + regions.length

  const handlePreview = () => {
    const params = new URLSearchParams()
    params.set('from', from)
    params.set('to', to)
    params.set('metric', metric)
    params.set('groupBy', groupBy)
    if (compareTo) params.set('compareTo', compareTo)
    if (teams.length) params.set('teams', teams.join(','))
    if (services.length) params.set('services', services.join(','))
    if (environments.length) params.set('environments', environments.join(','))
    if (regions.length) params.set('regions', regions.join(','))
    router.push(`/dashboard/reports/preview/${template.id}?${params.toString()}`)
  }

  return (
    <div style={{
      background: 'var(--colour-bg-card)',
      border: `1px solid ${template.colour}44`,
      borderRadius: '12px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxHeight: 'calc(100vh - 200px)',
      overflowY: 'auto' as const,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `${template.colour}18`,
            border: `1px solid ${template.colour}33`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 700,
            color: template.colour,
          }}>
            {template.icon}
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
            {template.name}
          </span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--colour-text-muted)', cursor: 'pointer', fontSize: '18px' }}>×</button>
      </div>

      {/* Date range */}
      <div>
        <label style={labelStyle}>Date range</label>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' as const, marginBottom: '8px' }}>
          {QUICK_RANGES.map((range) => (
            <button
              key={range.label}
              onClick={() => { setFrom(range.from ?? ''); setTo(range.to ?? '') }}
              style={{
                padding: '4px 10px',
                background: from === range.from && to === range.to ? 'var(--colour-blue)' : 'var(--colour-bg-page)',
                border: `1px solid ${from === range.from && to === range.to ? 'var(--colour-blue)' : 'var(--colour-border)'}`,
                borderRadius: '20px',
                color: from === range.from && to === range.to ? '#fff' : 'var(--colour-text-secondary)',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              {range.label}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
          <div>
            <label style={{ ...labelStyle, fontSize: '11px' }}>From</label>
            <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} style={inputStyle} />
          </div>
          <div>
            <label style={{ ...labelStyle, fontSize: '11px' }}>To</label>
            <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Grouping */}
      <div>
        <SectionHeader title="Grouping" open={showGrouping} onToggle={() => setShowGrouping(!showGrouping)} />
        {showGrouping && (
          <div style={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div>
              <label style={labelStyle}>Group by</label>
              <select value={groupBy} onChange={(e) => setGroupBy(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {GROUP_BY_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Metric</label>
              <select value={metric} onChange={(e) => setMetric(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                {METRIC_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div>
        <SectionHeader
          title={`Filters${activeFilterCount > 0 ? ` (${activeFilterCount} active)` : ''}`}
          open={showFilters}
          onToggle={() => setShowFilters(!showFilters)}
        />
        {showFilters && (
          <div style={{ paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={labelStyle}>Team</label>
              <MultiSelect options={TEAMS} selected={teams} onChange={setTeams} />
            </div>
            <div>
              <label style={labelStyle}>Environment</label>
              <MultiSelect options={ENVIRONMENTS} selected={environments} onChange={setEnvironments} />
            </div>
            <div>
              <label style={labelStyle}>Service</label>
              <MultiSelect options={SERVICES} selected={services} onChange={setServices} />
            </div>
            <div>
              <label style={labelStyle}>Region</label>
              <MultiSelect options={REGIONS} selected={regions} onChange={setRegions} />
            </div>
          </div>
        )}
      </div>

      {/* Comparison */}
      <div>
        <SectionHeader title="Comparison" open={showComparison} onToggle={() => setShowComparison(!showComparison)} />
        {showComparison && (
          <div style={{ paddingTop: '10px' }}>
            <label style={labelStyle}>Compare to</label>
            <select value={compareTo} onChange={(e) => setCompareTo(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
              {COMPARE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
        )}
      </div>

      <button
        onClick={handlePreview}
        style={{ marginTop: '4px', padding: '11px', background: 'var(--colour-blue)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
      >
        Preview report →
      </button>
    </div>
  )
}

export default ReportConfigPanel