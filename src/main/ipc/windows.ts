import { ipcMain } from 'electron'
import {
  getWindows,
  snapWindow,
  maximizeWindow,
  closeWindow,
  organizeAllWindows,
  isWindowManagerAvailable,
} from '../services/windowManager'
import { hwndSchema, parseIpc, snapDirectionSchema } from '../validation/ipc-schemas'

export function registerWindowsIPC(): void {
  ipcMain.handle('windows:isAvailable', () => isWindowManagerAvailable())

  ipcMain.handle('windows:list', () => {
    if (!isWindowManagerAvailable()) return []
    return getWindows()
  })

  ipcMain.handle('windows:snap', (_, hwnd: unknown, direction: unknown) => {
    const h = parseIpc(hwndSchema, hwnd)
    const d = parseIpc(snapDirectionSchema, direction)
    snapWindow(h, d)
  })

  ipcMain.handle('windows:maximize', (_, hwnd: unknown) => {
    const h = parseIpc(hwndSchema, hwnd)
    maximizeWindow(h)
  })

  ipcMain.handle('windows:close', (_, hwnd: unknown) => {
    const h = parseIpc(hwndSchema, hwnd)
    closeWindow(h)
  })

  ipcMain.handle('windows:organizeAll', () => {
    organizeAllWindows()
  })
}
