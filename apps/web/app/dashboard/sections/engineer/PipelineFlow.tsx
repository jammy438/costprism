'use client'

import { useState } from 'react'
import { Sankey, Tooltip, ResponsiveContainer, Layer, Rectangle } from 'recharts'
import { useSpendByProvider } from '@/lib/hooks/useSpendByProvider'
import { useSpendByTeam } from '@/lib/hooks/useSpendByTeam'

const PipelineFlow = () => {
  const { data: providers, isLoading: pLoading } = useSpendByProvider()
  const { data: teams, isLoading: tLoading } = useSpendByTeam('2026-01-01', '2026-03-01')
  const [activeNode, setActiveNode] = useState<number | null>(null)

  if (pLoading || tLoading) return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
      color: 'var(--colour-text-muted)',
      fontSize: '13px',
      minHeight: '200px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>Loading...</div>
  )

  const providerNodes = (providers ?? []).map(p => ({ name: p.provider }))
  const teamNodes = (teams ?? []).map(t => ({ name: t.team }))
  const nodes = [...providerNodes, ...teamNodes]

  // Each provider links to each team — value split evenly
  const links = (providers ?? []).flatMap((p, pIdx) =>
    (teams ?? []).map((t, tIdx) => ({
      source: pIdx,
      target: providerNodes.length + tIdx,
      value: Math.max(1, Math.round(p.cost / (teams?.length ?? 1))),
    }))
  )

  const data = { nodes, links }

  const CustomNode = (props: any) => {
    const { x, y, width, height, index, payload } = props
    const isActive = activeNode === index
    const isProvider = index < providerNodes.length

    return (
      <Layer key={`node-${index}`}>
        <Rectangle
          x={x}
          y={y}
          width={width}
          height={height}
          fill={isActive
            ? 'rgba(99, 179, 237, 0.9)'
            : isProvider
            ? 'rgba(99, 179, 237, 0.5)'
            : 'rgba(154, 117, 234, 0.5)'}
          fillOpacity={1}
          radius={4}
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveNode(activeNode === index ? null : index)}
        />
        <text
          x={isProvider ? x - 6 : x + width + 6}
          y={y + height / 2}
          textAnchor={isProvider ? 'end' : 'start'}
          fill="var(--colour-text-secondary)"
          fontSize={11}
          dominantBaseline="middle"
        >
          {payload.name}
        </text>
      </Layer>
    )
  }

  const CustomLink = (props: any) => {
    const { sourceX, sourceY, sourceControlX, targetX, targetY, targetControlX, linkWidth, index, payload } = props
    const isHighlighted = activeNode !== null &&
      (payload.source === activeNode || payload.target === activeNode)

    return (
      <path
        d={`
          M${sourceX},${sourceY}
          C${sourceControlX},${sourceY} ${targetControlX},${targetY} ${targetX},${targetY}
        `}
        fill="none"
        stroke={isHighlighted ? 'rgba(99, 179, 237, 0.6)' : 'rgba(99, 179, 237, 0.15)'}
        strokeWidth={linkWidth}
        style={{ transition: 'stroke 0.2s ease' }}
      />
    )
  }

  return (
    <div style={{
      backgroundColor: 'var(--colour-bg-card)',
      border: '1px solid var(--colour-border)',
      borderRadius: '14px',
      padding: '24px',
    }}>
      <div style={{
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        fontWeight: 600,
        color: 'var(--colour-text-label)',
        marginBottom: '16px',
      }}>
        Pipeline Flow
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <Sankey
          data={data}
          nodePadding={24}
          nodeWidth={12}
          margin={{ top: 10, bottom: 10, left: 80, right: 80 }}
          node={<CustomNode />}
          link={<CustomLink />}
        >
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--colour-bg-card)',
              border: '1px solid var(--colour-border)',
              borderRadius: '8px',
              fontSize: '12px',
              color: 'var(--colour-text-primary)',
            }}
          />
        </Sankey>
      </ResponsiveContainer>
    </div>
  )
}

export default PipelineFlow