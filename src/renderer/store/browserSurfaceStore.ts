import { create } from 'zustand'
import type { BrowserSurfaceWindow, StaleBrowserSurfaceHint } from '../../shared/types'

interface BrowserSurfaceState {
  rows: BrowserSurfaceWindow[]
  hints: StaleBrowserSurfaceHint[]
  threshold: number
  setRows: (rows: BrowserSurfaceWindow[]) => void
  addHint: (hint: StaleBrowserSurfaceHint) => void
  dismissHint: (hwnd: number) => void
  setThreshold: (days: number) => void
}

export const useBrowserSurfaceStore = create<BrowserSurfaceState>((set) => ({
  rows: [],
  hints: [],
  threshold: 7,

  setRows: (rows) => set({ rows }),

  addHint: (hint) =>
    set((s) => ({
      hints: s.hints.some((h) => h.hwnd === hint.hwnd) ? s.hints : [...s.hints, hint],
    })),

  dismissHint: (hwnd) => set((s) => ({ hints: s.hints.filter((h) => h.hwnd !== hwnd) })),

  setThreshold: async (days) => {
    await window.api.browserSurface.setThreshold(days)
    set({ threshold: days })
  },
}))
