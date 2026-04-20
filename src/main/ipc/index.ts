import { registerAuthIPC } from './auth'
import { registerTasksIPC } from './tasks'
import { registerTabGroupsIPC } from './tabGroups'
import { registerWindowsIPC } from './windows'
import { registerBrowserSurfaceIPC } from './browserSurface'

export function registerAllIPC(): void {
  registerAuthIPC()
  registerTasksIPC()
  registerTabGroupsIPC()
  registerWindowsIPC()
  registerBrowserSurfaceIPC()
}
