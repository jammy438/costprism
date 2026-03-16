'use client';

import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonChartProps {
  height?: number;
}

const SkeletonChart = ({ height = 280 }: SkeletonChartProps) => {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--cp-border)',
        background: 'var(--cp-surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      {/* Chart header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Skeleton style={{ height: '14px', width: '140px', borderRadius: '6px' }} />
          <Skeleton style={{ height: '11px', width: '200px', borderRadius: '6px' }} />
        </div>
        <Skeleton style={{ height: '28px', width: '80px', borderRadius: '8px' }} />
      </div>

      {/* Chart area */}
      <div style={{ position: 'relative', height: `${height}px`, width: '100%' }}>
        <Skeleton
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '8px',
          }}
        />
        {/* Simulate y-axis ticks */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 24,
            left: 0,
            width: '40px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            paddingBlock: '8px',
            zIndex: 1,
          }}
        >
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} style={{ height: '10px', width: '32px', borderRadius: '4px' }} />
          ))}
        </div>
        {/* Simulate x-axis ticks */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 48,
            right: 0,
            height: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} style={{ height: '10px', width: '32px', borderRadius: '4px' }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonChart;