// Browser extension WebSocket bridge is removed in the one-installer build.
// See browserActivityService.ts for the Path A replacement.

import type { BrowserWindow } from 'electron'

export async function startWsServer(_getMainWin: () => BrowserWindow | null): Promise<void> {}
export function stopWsServer(): void {}
