'use client';

import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const EmptyState = ({ icon, title, description, ctaLabel, ctaHref }: EmptyStateProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        padding: '48px 24px',
        width: '100%',
        height: '100%',
        minHeight: '240px',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '48px',
          height: '48px',
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
          fontSize: '15px',
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
          fontSize: '13px',
          color: 'var(--cp-text-muted)',
          lineHeight: 1.5,
          maxWidth: '280px',
        }}
      >
        {description}
      </p>

      {ctaLabel && ctaHref && (
        <a
          href={ctaHref}
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
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.88')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          {ctaLabel}
        </a>
      )}
    </div>
  );
};

export default EmptyState;