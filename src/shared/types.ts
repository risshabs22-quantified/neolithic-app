export type Priority = 'low' | 'medium' | 'high'

export interface User {
  id: string
  email: string
  name: string | null
  createdAt: Date
}

export interface Task {
  id: string
  title: string
  completed: boolean
  priority: Priority
  dueDate: Date | null
  userId: string
  createdAt: Date
}

export interface TabGroup {
  id: string
  name: string
  userId: string
  createdAt: Date
  tabs: Tab[]
}

export interface Tab {
  id: string
  url: string
  title: string
  tabGroupId: string
  lastUsed: Date | null
}

/** Top-level browser window visible to the OS (no per-tab URLs without an extension). */
export interface BrowserSurfaceWindow {
  hwnd: number
  title: string
  processName: string
  isForeground: boolean
}

/** Heuristic: same window title unchanged for threshold days (not per-tab last-used). */
export interface StaleBrowserSurfaceHint {
  hwnd: number
  title: string
  processName: string
  daysStale: number
}

export interface WindowInfo {
  hwnd: number
  title: string
  processName: string
  x: number
  y: number
  width: number
  height: number
  isChaotic: boolean
  chaosReasons: string[]
}

export interface AuthResult {
  success: boolean
  user?: User
  error?: string
}

export interface SessionResult {
  user: User
  sessionId: string
}

export interface CreateTaskData {
  title: string
  priority: Priority
  dueDate?: string | null
}

export interface ElectronAPI {
  auth: {
    signup: (email: string, password: string) => Promise<AuthResult>
    signin: (email: string, password: string) => Promise<AuthResult>
    signout: () => Promise<void>
    getSession: () => Promise<SessionResult | null>
  }
  tasks: {
    list: () => Promise<Task[]>
    create: (data: CreateTaskData) => Promise<Task>
    update: (id: string, data: Partial<CreateTaskData> & { completed?: boolean }) => Promise<Task>
    delete: (id: string) => Promise<void>
  }
  tabGroups: {
    list: () => Promise<TabGroup[]>
    create: (name: string) => Promise<TabGroup>
    delete: (id: string) => Promise<void>
    addTab: (groupId: string, url: string, title: string) => Promise<Tab>
    removeTab: (tabId: string) => Promise<void>
    openAll: (groupId: string) => Promise<void>
  }
  windows: {
    list: () => Promise<WindowInfo[]>
    snap: (hwnd: number, direction: 'left' | 'right') => Promise<void>
    maximize: (hwnd: number) => Promise<void>
    close: (hwnd: number) => Promise<void>
    organizeAll: () => Promise<void>
    isAvailable: () => Promise<boolean>
  }
  browserSurface: {
    onUpdate: (callback: (rows: BrowserSurfaceWindow[]) => void) => void
    onHint: (callback: (hint: StaleBrowserSurfaceHint) => void) => void
    getThreshold: () => Promise<number>
    setThreshold: (days: number) => Promise<void>
  }
}

declare global {
  interface Window {
    api: ElectronAPI
  }
}
