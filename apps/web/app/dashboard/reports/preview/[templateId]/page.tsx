'use client'

import dynamic from 'next/dynamic'
import { useParams, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const MonthlySpendPreview = dynamic(() => import('../../components/preview/MonthlySpendPreview'), { ssr: false })
const TagCoveragePreview = dynamic(() => import('../../components/preview/TagCoveragePreview'), { ssr: false })
const BudgetVsActualPreview = dynamic(() => import('../../components/preview/BudgetVsActualPreview'), { ssr: false })
const AnomalySummaryPreview = dynamic(() => import('../../components/preview/AnomalySummaryPreview'), { ssr: false })

const TEMPLATE_LABELS: Record<string, string> = {
  'monthly-spend': 'Monthly Spend Summary',
  'tag-coverage': 'Tag Coverage Report',
  'budget-vs-actual': 'Budget vs Actual',
  'anomaly-summary': 'Anomaly Summary',
}

const PreviewContent = () => {
  const params = useParams()
  const searchParams = useSearchParams()
  const templateId: string = (Array.isArray(params.templateId) ? params.templateId[0] : params.templateId) ?? ''
  const from: string = searchParams?.get('from') ?? `${new Date().getFullYear()}-01-01`
  const to: string = searchParams?.get('to') ?? new Date().toISOString().split('T')[0] ?? ''
  const team: string = searchParams?.get('team') ?? ''

  const handlePrint = () => window.print()

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
  }

  const handleCSV = async () => {
    const res = await fetch(`/api/costs/export?from=${from}&to=${to}${team ? `&team=${team}` : ''}`)
    if (!res.ok) return
    const blob = await res.blob()
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `costprism-${templateId}-${from}-${to}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderPreview = () => {
    const props = { from, to, team }
    switch (templateId) {
      case 'monthly-spend': return <MonthlySpendPreview {...props} />
      case 'tag-coverage': return <TagCoveragePreview {...props} />
      case 'budget-vs-actual': return <BudgetVsActualPreview {...props} />
      case 'anomaly-summary': return <AnomalySummaryPreview {...props} />
      default: return <div style={{ color: 'var(--colour-text-muted)' }}>Unknown template</div>
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117' }}>
      {/* Preview toolbar — hidden on print */}
      <div className="no-print" style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'var(--colour-bg-card)',
        borderBottom: '1px solid var(--colour-border)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href="/dashboard/reports"
            style={{ fontSize: '12px', color: 'var(--colour-text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            ← Reports
          </a>
          <span style={{ color: 'var(--colour-border)' }}>|</span>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--colour-text-primary)' }}>
            {TEMPLATE_LABELS[templateId] ?? templateId}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--colour-text-muted)' }}>
            {from} → {to}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleCSV}
            style={{ padding: '7px 14px', background: 'var(--colour-bg-page)', border: '1px solid var(--colour-border)', borderRadius: '8px', color: 'var(--colour-text-secondary)', fontSize: '12px', cursor: 'pointer' }}
          >
            📊 CSV
          </button>
          <button
            onClick={handleCopyLink}
            style={{ padding: '7px 14px', background: 'var(--colour-bg-page)', border: '1px solid var(--colour-border)', borderRadius: '8px', color: 'var(--colour-text-secondary)', fontSize: '12px', cursor: 'pointer' }}
          >
            🔗 Copy link
          </button>
          <button
            onClick={handlePrint}
            style={{ padding: '7px 14px', background: 'var(--colour-blue)', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            🖨 Print / PDF
          </button>
        </div>
      </div>

      {/* Report content */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>
        {renderPreview()}
      </div>
    </div>
  )
}

const PreviewPage = () => {
  return (
    <Suspense fallback={<div style={{ padding: '40px', color: 'var(--colour-text-muted)' }}>Loading...</div>}>
      <PreviewContent />
    </Suspense>
  )
}

export default PreviewPage
