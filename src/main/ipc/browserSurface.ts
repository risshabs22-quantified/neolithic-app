import { ipcMain } from 'electron'
import { getSurfaceThreshold, setSurfaceThreshold } from '../services/browserSurfaceMonitor'
import { parseIpc, tabThresholdSchema } from '../validation/ipc-schemas'

export function registerBrowserSurfaceIPC(): void {
  ipcMain.handle('browser-surface:getThreshold', () => getSurfaceThreshold())

  ipcMain.handle('browser-surface:setThreshold', (_, days: unknown) => {
    const parsed = parseIpc(tabThresholdSchema, days)
    setSurfaceThreshold(parsed)
  })
}
