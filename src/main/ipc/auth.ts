import { ipcMain } from 'electron'
import { signUp, signIn, signOut, getSession } from '../services/authService'
import { authCredentialsSchema, parseIpc } from '../validation/ipc-schemas'

export function registerAuthIPC(): void {
  ipcMain.handle('auth:signup', async (_, payload: unknown) => {
    const { email, password } = parseIpc(authCredentialsSchema, payload)
    return signUp(email, password)
  })

  ipcMain.handle('auth:signin', async (_, payload: unknown) => {
    const { email, password } = parseIpc(authCredentialsSchema, payload)
    return signIn(email, password)
  })

  ipcMain.handle('auth:signout', async () => {
    await signOut()
  })

  ipcMain.handle('auth:getSession', async () => {
    return getSession()
  })
}
