import { execSync } from 'child_process'
import { BrowserWindow } from 'electron'
import Store from 'electron-store'
import { getWindows, isWindowManagerAvailable } from './windowManager'
import { DEFAULT_TAB_THRESHOLD_DAYS } from '../../shared/constants'
import type { BrowserSurfaceWindow, StaleBrowserSurfaceHint } from '../../shared/types'

const BROWSER_EXES = new Set([
  'chrome.exe',
  'msedge.exe',
  'firefox.exe',
  'brave.exe',
  'opera.exe',
  'vivaldi.exe',
])

const store = new Store<{ tabThresholdDays: number }>({
  encryptionKey: process.env.STORE_ENCRYPTION_KEY,
  name: 'browser-surface',
})

/** hwnd -> stable title since timestamp */
const stableTitleSince = new Map<number, { title: string; since: number }>()
const warnedStale = new Set<number>()

let intervalId: ReturnType<typeof setInterval> | null = null

function getForegroundHwnd(): number | null {
  if (process.platform !== 'win32') return null
  try {
    const ps = [
      'Add-Type @"',
      'using System;',
      'using System.Runtime.InteropServices;',
      'public class NeolithicFg {',
      '  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();',
      '}',
      '"@',
      '[int][NeolithicFg]::GetForegroundWindow()',
    ].join('\n')
    const b64 = Buffer.from(ps, 'utf16le').toString('base64')
    const out = execSync(`powershell -NoProfile -NonInteractive -EncodedCommand ${b64}`, {
      encoding: 'utf-8',
      timeout: 8000,
      windowsHide: true,
    })
    const n = parseInt(String(out).trim(), 10)
    return Number.isFinite(n) && n > 0 ? n : null
  } catch {
    return null
  }
}

function isBrowserProcess(processName: string): boolean {
  return BROWSER_EXES.has(processName.toLowerCase())
}

export function getSurfaceThreshold(): number {
  return store.get('tabThresholdDays', DEFAULT_TAB_THRESHOLD_DAYS)
}

export function setSurfaceThreshold(days: number): void {
  store.set('tabThresholdDays', days)
}

function tick(getMainWin: () => BrowserWindow | null): void {
  const win = getMainWin()
  if (!win || win.isDestroyed()) return

  if (!isWindowManagerAvailable()) {
    win.webContents.send('browser-surface:update', [])
    return
  }

  const fg = getForegroundHwnd()
  const now = Date.now()
  const thresholdMs = getSurfaceThreshold() * 24 * 60 * 60 * 1000

  const rows: BrowserSurfaceWindow[] = []
  const seenHwnds = new Set<number>()

  for (const w of getWindows()) {
    if (!isBrowserProcess(w.processName)) continue
    seenHwnds.add(w.hwnd)
    const isForeground = fg !== null && w.hwnd === fg
    rows.push({
      hwnd: w.hwnd,
      title: w.title,
      processName: w.processName,
      isForeground,
    })

    const prev = stableTitleSince.get(w.hwnd)
    if (!prev || prev.title !== w.title) {
      stableTitleSince.set(w.hwnd, { title: w.title, since: now })
      warnedStale.delete(w.hwnd)
    }

    const stable = stableTitleSince.get(w.hwnd)
    if (
      stable &&
      stable.title === w.title &&
      now - stable.since >= thresholdMs &&
      !warnedStale.has(w.hwnd)
    ) {
      warnedStale.add(w.hwnd)
      const hint: StaleBrowserSurfaceHint = {
        hwnd: w.hwnd,
        title: w.title,
        processName: w.processName,
        daysStale: getSurfaceThreshold(),
      }
      win.webContents.send('browser-surface:hint', hint)
    }
  }

  for (const hwnd of [...stableTitleSince.keys()]) {
    if (!seenHwnds.has(hwnd)) {
      stableTitleSince.delete(hwnd)
      warnedStale.delete(hwnd)
    }
  }

  win.webContents.send('browser-surface:update', rows)
}

export function startBrowserSurfaceMonitor(getMainWin: () => BrowserWindow | null): void {
  if (intervalId) return
  tick(getMainWin)
  intervalId = setInterval(() => tick(getMainWin), 8000)
}

export function stopBrowserSurfaceMonitor(): void {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  stableTitleSince.clear()
  warnedStale.clear()
}
