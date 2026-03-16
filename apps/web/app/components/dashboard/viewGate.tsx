'use client'

import { useSearchParams } from 'next/navigation'
import { ReactNode } from 'react'

interface ViewGateProps {
  mode: 'director' | 'engineer'
  children: ReactNode
}

const ViewGate = ({ mode, children }: ViewGateProps) => {
  const searchParams = useSearchParams()
  const currentView = searchParams.get('view') || 'director'

  if (currentView === mode) {
    return children
  }
  return null
} 

export default ViewGate