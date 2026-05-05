'use client'
import PageErrorBoundary from '@/app/components/dashboard/pageErrorBoundary'

import dynamic from 'next/dynamic'

const TeamSettings = dynamic(() => import('./components/TeamSettings'), { ssr: false })

const TeamPage = () => <TeamSettings />

export default TeamPage
