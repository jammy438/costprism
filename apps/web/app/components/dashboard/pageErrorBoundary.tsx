import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

class PageErrorBoundary extends Component<Props, State> {
  state = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          color: 'var(--colour-text-secondary)',
          fontSize: '14px',
          gap: '8px',
        }}>
          <div style={{ fontSize: '24px' }}>⚠</div>
          <div>Something went wrong loading this section.</div>
          <div style={{ fontSize: '12px', color: 'var(--colour-text-muted)' }}>
            Try refreshing the page
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default PageErrorBoundary
