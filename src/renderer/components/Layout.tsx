import React from 'react'
import { Sidebar, type Page } from './Sidebar'

interface LayoutProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  children: React.ReactNode
}

export function Layout({ currentPage, onNavigate, children }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <main className="flex-1 overflow-auto bg-background p-6">{children}</main>
    </div>
  )
}
