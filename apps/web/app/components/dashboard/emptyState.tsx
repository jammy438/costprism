'use client';

import React from 'react';

type EmptyStateSize = 'sm' | 'md' | 'lg';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  size?: EmptyStateSize;
  ctaLabel?: string;
  ctaHref?: string;
  onDismiss?: () => void;
}

const sizeConfig: Record<EmptyStateSize, {
  minHeight: string;
  padding: string;
  iconSize: string;
  titleSize: string;
  descSize: string;
}> = {
  sm: { minHeight: '120px', padding: '24px 16px', iconSize: '32px', titleSize: '13px', descSize: '12px' },
  md: { minHeight: '240px', padding: '48px 24px', iconSize: '48px', titleSize: '15px', descSize: '13px' },
  lg: { minHeight: '360px', padding: '64px 32px', iconSize: '56px', titleSize: '16px', descSize: '14px' },
};

const EmptyState = ({ icon, title, description, size = 'md', ctaLabel, ctaHref, onDismiss }: EmptyStateProps) => {
  const s = sizeConfig[size];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: s.padding,
        width: '100%',
        height: '100%',
        minHeight: s.minHeight,
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--cp-text-muted)',
            fontSize: '16px',
            lineHeight: 1,
            padding: '4px',
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: s.iconSize,
          height: s.iconSize,
          borderRadius: '12px',
          background: 'var(--cp-surface-raised)',
          color: 'var(--cp-text-muted)',
          marginBottom: '4px',
        }}
      >
        {icon}
      </div>

      <h3
        style={{
          margin: 0,
          fontSize: s.titleSize,
          fontWeight: 600,
          color: 'var(--cp-text-primary)',
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          fontSize: s.descSize,
          color: 'var(--cp-text-muted)',
          lineHeight: 1.5,
          maxWidth: '280px',
        }}
      >
        {description}
      </p>

      {ctaLabel && ctaHref && (
        <a href={ctaHref}
          style={{
            marginTop: '8px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            background: 'var(--cp-accent)',
            color: '#fff',
            fontSize: '13px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'opacity 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          {ctaLabel}
        </a>
      )}
    </div>
  );
};

export default EmptyState;