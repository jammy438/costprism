'use client'

import dynamic from 'next/dynamic'

const GeneralSettings = dynamic(() => import('./components/GeneralSettings'), { ssr: false })

const GeneralPage = () => <GeneralSettings />

export default GeneralPage