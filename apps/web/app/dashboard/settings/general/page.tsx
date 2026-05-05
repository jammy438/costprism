'use client'
import PageErrorBoundary from '@/app/components/dashboard/pageErrorBoundary'

import dynamic from 'next/dynamic'

const GeneralSettings = dynamic(() => import('./components/GeneralSettings'), { ssr: false })

const GeneralPage = () => <GeneralSettings />

export default GeneralPage
