'use client';

import { Skeleton } from '@/components/ui/skeleton';

const SkeletonRow = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 80px',
        alignItems: 'center',
        gap: '16px',
        padding: '12px 16px',
        borderBottom: '1px solid var(--cp-border)',
      }}
    >
      {/* Service/name cell */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Skeleton style={{ height: '28px', width: '28px', borderRadius: '8px', flexShrink: 0 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <Skeleton style={{ height: '12px', width: '120px', borderRadius: '4px' }} />
          <Skeleton style={{ height: '10px', width: '80px', borderRadius: '4px' }} />
        </div>
      </div>

      {/* Cost cell */}
      <Skeleton style={{ height: '12px', width: '72px', borderRadius: '4px' }} />

      {/* Change cell — pill shape */}
      <Skeleton style={{ height: '20px', width: '56px', borderRadius: '999px' }} />

      {/* Sparkline cell */}
      <Skeleton style={{ height: '24px', width: '72px', borderRadius: '4px' }} />
    </div>
  );
};

export default SkeletonRow;