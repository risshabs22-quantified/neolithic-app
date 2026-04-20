import React, { useEffect, useState } from 'react'
import { AuthPage } from './pages/AuthPage'
import { Dashboard } from './pages/Dashboard'
import { Tasks } from './pages/Tasks'
import { TabGroups } from './pages/TabGroups'
import { BrowserTabs } from './pages/BrowserTabs'
import { WindowManager } from './pages/WindowManager'
import { Layout } from './components/Layout'
import { useAuthStore } from './store/authStore'
import { Toaster } from 'sonner'
import type { Page } from './components/Sidebar'

export default function App() {
  const { user, isLoading, setUser, setLoading } = useAuthStore()
  const [currentPage, setCurrentPage] = useState<Page>('dashboard')

  useEffect(() => {
    window.api.auth.getSession().then((session) => {
      if (session) setUser(session.user)
      setLoading(false)
    })
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!user) return <AuthPage />

  const pageMap: Record<Page, React.ReactNode> = {
    dashboard: <Dashboard />,
    tasks: <Tasks />,
    'tab-groups': <TabGroups />,
    'browser-tabs': <BrowserTabs />,
    windows: <WindowManager />,
  }

  return (
    <>
      <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
        {pageMap[currentPage]}
      </Layout>
      <Toaster position="bottom-right" />
    </>
  )
}
