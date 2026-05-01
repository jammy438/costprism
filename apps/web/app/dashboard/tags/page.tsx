'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'

const TagCoverage = dynamic(() => import('./components/TagCoverage'), { ssr: false })
const TagNormalisation = dynamic(() => import('./components/TagNormalisation'), { ssr: false })

const TABS = ['Coverage', 'Normalisation'] as const
type Tab = typeof TABS[number]

const TagsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('Coverage')

  return (
    <div style={{ padding: '24px 24px 48px 24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 700,
          color: 'var(--colour-text-primary)',
          letterSpacing: '-0.4px',
          margin: 0,
        }}>
          Tags
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--colour-text-secondary)',
          margin: '4px 0 0 0',
        }}>
          Monitor tag coverage and normalise inconsistent tag variants across your cloud estate.
        </p>
      </div>

      {/* Tab nav */}
      <div style={{
        display: 'flex',
        gap: '4px',
        borderBottom: '1px solid var(--colour-border)',
        marginBottom: '28px',
      }}>
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '8px 16px',
              fontSize: '13px',
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? 'var(--colour-text-primary)' : 'var(--colour-text-muted)',
              borderBottom: activeTab === tab ? '2px solid var(--colour-blue)' : '2px solid transparent',
              marginBottom: '-1px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'Coverage' && <TagCoverage />}
      {activeTab === 'Normalisation' && <TagNormalisation />}
    </div>
  )
}

export default TagsPage