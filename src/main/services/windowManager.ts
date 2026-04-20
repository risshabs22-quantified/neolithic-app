import { screen } from 'electron'
import type { WindowInfo } from '../../shared/types'
import { WINDOW_MIN_WIDTH, WINDOW_MIN_HEIGHT, CHAOS_SAME_APP_COUNT } from '../../shared/constants'

let wm: {
  getWindows: () => Array<{
    id: number
    title: string
    path?: string
    processId?: number
    getBounds: () => { x: number; y: number; width: number; height: number }
    setBounds: (b: { x: number; y: number; width: number; height: number }) => void
    kill: () => void
  }>
} | null = null

let available = false

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  wm = require('windows-window-manager')
  available = process.platform === 'win32'
} catch {
  available = false
}

export function isWindowManagerAvailable(): boolean {
  return available
}

function getAppName(windowPath?: string): string {
  if (!windowPath) return 'unknown'
  const parts = windowPath.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1]?.toLowerCase() ?? 'unknown'
}

function isChaotic(
  bounds: { x: number; y: number; width: number; height: number },
  screenBounds: { width: number; height: number }
): string[] {
  const reasons: string[] = []
  if (bounds.width < WINDOW_MIN_WIDTH || bounds.height < WINDOW_MIN_HEIGHT) {
    reasons.push(`Too small (${bounds.width}×${bounds.height})`)
  }
  if (
    bounds.x < 0 ||
    bounds.y < 0 ||
    bounds.x + bounds.width > screenBounds.width ||
    bounds.y + bounds.height > screenBounds.height
  ) {
    reasons.push('Partially off-screen')
  }
  return reasons
}

export function getWindows(): WindowInfo[] {
  if (!available || !wm) return []

  const { width: sw, height: sh } = screen.getPrimaryDisplay().workAreaSize
  const raw = wm.getWindows()
  const appCounts = new Map<string, number>()

  for (const w of raw) {
    const name = getAppName(w.path)
    appCounts.set(name, (appCounts.get(name) ?? 0) + 1)
  }

  return raw.map((w) => {
    const bounds = w.getBounds()
    const processName = getAppName(w.path)
    const reasons = isChaotic(bounds, { width: sw, height: sh })
    if ((appCounts.get(processName) ?? 0) >= CHAOS_SAME_APP_COUNT) {
      reasons.push(`${appCounts.get(processName)} windows of same app`)
    }
    return {
      hwnd: w.id,
      title: w.title,
      processName,
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      isChaotic: reasons.length > 0,
      chaosReasons: reasons,
    }
  })
}

export function snapWindow(hwnd: number, direction: 'left' | 'right'): void {
  if (!available || !wm) return
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const win = wm.getWindows().find((w) => w.id === hwnd)
  if (!win) return
  if (direction === 'left') {
    win.setBounds({ x: 0, y: 0, width: Math.floor(width / 2), height })
  } else {
    win.setBounds({ x: Math.floor(width / 2), y: 0, width: Math.floor(width / 2), height })
  }
}

export function maximizeWindow(hwnd: number): void {
  if (!available || !wm) return
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const win = wm.getWindows().find((w) => w.id === hwnd)
  win?.setBounds({ x: 0, y: 0, width, height })
}

export function closeWindow(hwnd: number): void {
  if (!available || !wm) return
  const win = wm.getWindows().find((w) => w.id === hwnd)
  win?.kill()
}

export function organizeAllWindows(): void {
  if (!available || !wm) return
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const windows = wm.getWindows()
  const count = windows.length
  if (count === 0) return

  const cols = Math.ceil(Math.sqrt(count))
  const rows = Math.ceil(count / cols)
  const cellW = Math.floor(width / cols)
  const cellH = Math.floor(height / rows)

  windows.forEach((win, i) => {
    const col = i % cols
    const row = Math.floor(i / cols)
    win.setBounds({ x: col * cellW, y: row * cellH, width: cellW, height: cellH })
  })
}
