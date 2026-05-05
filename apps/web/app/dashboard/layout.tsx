import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import * as SidebarModule from "./components/Sidebar"
import * as TopBarModule from "./components/TopBar"
import { DateRangeProvider } from '@/lib/context/DateRangeContext'

const Sidebar = SidebarModule.default
const TopBar = TopBarModule.default

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) {
    redirect('/sign-in')
  }
  return (
    <DateRangeProvider>
      <div style={{
        display: 'flex',
        height: '100vh',
        backgroundColor: '#0d1117',
        color: '#ffffff',
        fontFamily: 'var(--font-sans)',
      }}>
        <Sidebar />
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <TopBar />
          <main style={{ flex: 1, overflow: 'auto' }}>
            {children}
          </main>
        </div>
      </div>
    </DateRangeProvider>
  )
}