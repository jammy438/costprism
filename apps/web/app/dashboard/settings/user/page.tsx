'use client'
import dynamic from 'next/dynamic'
const UserSettings = dynamic(() => import('./components/UserSettings'), { ssr: false })
const UserPage = () => <UserSettings />
export default UserPage