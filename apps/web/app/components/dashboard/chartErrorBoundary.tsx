import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
}

class ChartErrorBoundary extends Component<Props, State> {
  state = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  render() {
   if (this.state.hasError) {
      return this.props.fallback?? (
        <div style={{ color: 'var(--colour-text-muted)', fontSize: '12px', padding: '16px' }}>
      Chart unavailable
    </div>
      )
  }
   return this.props.children
}
}


export default ChartErrorBoundary