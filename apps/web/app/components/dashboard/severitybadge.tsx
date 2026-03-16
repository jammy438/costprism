'use client';

interface SeverityBadgeProps {
  value: number | string;
  direction: 'up' | 'down';
  variant: 'cost' | 'percent' | 'count';
}

const getColours = (direction: 'up' | 'down', variant: 'cost' | 'percent' | 'count') => {
  // Blue = neutral, informational — no positive/negative connotation
  if (variant === 'count') {
    return {
      background: 'var(--colour-neutral-subtle)',
      color: 'var(--colour-neutral)',
    };
  }

  // Red = spend going up (bad), green = spend going down (good)
  if (direction === 'up') {
    return {
      background: 'var(--colour-glow-up)',
      color: 'var(--colour-spend-up)',
    };
  }

  return {
    background: 'var(--colour-glow-down)',
    color: 'var(--colour-spend-down)',
  };
};

const ArrowUp = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M5 8V2M5 2L2 5M5 2L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowDown = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
    <path d="M5 2V8M5 8L2 5M5 8L8 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const formatValue = (value: number | string, variant: 'cost' | 'percent' | 'count') => {
  if (typeof value === 'string') return value;
  if (variant === 'percent') return `${value.toFixed(1)}%`;
  if (variant === 'cost') return `£${value.toLocaleString()}`;
  return value.toLocaleString();
};

const SeverityBadge = ({ value, direction, variant }: SeverityBadgeProps) => {
  const { background, color } = getColours(direction, variant);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        padding: '2px 7px',
        borderRadius: 'var(--radius-full)',
        background,
        color,
        fontSize: '11px',
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        letterSpacing: '0.01em',
      }}
    >
      {direction === 'up' ? <ArrowUp /> : <ArrowDown />}
      {formatValue(value, variant)}
    </span>
  );
};

export default SeverityBadge;