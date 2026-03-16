'use client';

import { Skeleton } from '@/components/ui/skeleton';

const SkeletonCard = () => {
  return (
    <div
      style={{
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid var(--cp-border)',
        background: 'var(--cp-surface)',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        minHeight: '130px',
      }}
    >
      {/* Label row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Skeleton style={{ height: '12px', width: '96px', borderRadius: '6px' }} />
        <Skeleton style={{ height: '20px', width: '20px', borderRadius: '6px' }} />
      </div>

      {/* Value */}
      <Skeleton style={{ height: '28px', width: '120px', borderRadius: '6px' }} />

      {/* Trend badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <Skeleton style={{ height: '20px', width: '52px', borderRadius: '999px' }} />
        <Skeleton style={{ height: '12px', width: '80px', borderRadius: '6px' }} />
      </div>
    </div>
  );
};

export default SkeletonCard;