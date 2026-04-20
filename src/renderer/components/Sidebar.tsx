import React from 'react'
import { cn } from '../lib/utils'
import {
  LayoutDashboard,
  CheckSquare,
  Bookmark,
  Chrome,
  MonitorSpeaker,
  LogOut,
} from 'lucide-react'
import { Button } from './ui/button'
import { useAuthStore } from '../store/authStore'

export type Page = 'dashboard' | 'tasks' | 'tab-groups' | 'browser-tabs' | 'windows'

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
}

const navItems: { id: Page; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'tab-groups', label: 'Tab Groups', icon: Bookmark },
  { id: 'browser-tabs', label: 'Browser windows', icon: Chrome },
  { id: 'windows', label: 'Windows', icon: MonitorSpeaker },
]

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { user, setUser } = useAuthStore()

  const handleSignOut = async () => {
    await window.api.auth.signout()
    setUser(null)
  }

  return (
    <div className="flex h-full w-56 flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <span className="font-bold text-lg">Neolithic</span>
      </div>

      <nav className="flex-1 space-y-1 p-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={cn(
              'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
              currentPage === id
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </nav>

      <div className="border-t p-3 space-y-2">
        <p className="truncate px-1 text-xs text-muted-foreground">{user?.email}</p>
        <Button variant="ghost" size="sm" className="w-full justify-start gap-2" onClick={handleSignOut}>
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </div>
    </div>
  )
}
