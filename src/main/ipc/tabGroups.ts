import { ipcMain, shell } from 'electron'
import { getPrisma } from '../db/client'
import { getCurrentUserId } from '../services/authService'
import {
  idSchema,
  parseIpc,
  tabGroupAddTabSchema,
  tabGroupNameSchema,
} from '../validation/ipc-schemas'
import { assertSafeExternalUrl } from '../validation/safe-url'

export function registerTabGroupsIPC(): void {
  ipcMain.handle('tabGroups:list', async () => {
    const userId = getCurrentUserId()
    if (!userId) return []
    return getPrisma().tabGroup.findMany({
      where: { userId },
      include: { tabs: true },
      orderBy: { createdAt: 'desc' },
    })
  })

  ipcMain.handle('tabGroups:create', async (_, name: unknown) => {
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    const parsedName = parseIpc(tabGroupNameSchema, name)
    return getPrisma().tabGroup.create({
      data: { name: parsedName, userId },
      include: { tabs: true },
    })
  })

  ipcMain.handle('tabGroups:delete', async (_, id: unknown) => {
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    const groupId = parseIpc(idSchema, id)

    const deleted = await getPrisma().tabGroup.deleteMany({
      where: { id: groupId, userId },
    })
    if (deleted.count === 0) throw new Error('Tab group not found')
  })

  ipcMain.handle('tabGroups:addTab', async (_, groupId: unknown, url: unknown, title: unknown) => {
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    const { groupId: gid, url: tabUrl, title: tabTitle } = parseIpc(tabGroupAddTabSchema, {
      groupId,
      url,
      title,
    })
    assertSafeExternalUrl(tabUrl)

    const group = await getPrisma().tabGroup.findFirst({
      where: { id: gid, userId },
    })
    if (!group) throw new Error('Tab group not found')

    return getPrisma().tab.create({
      data: { url: tabUrl, title: tabTitle, tabGroupId: gid, lastUsed: new Date() },
    })
  })

  ipcMain.handle('tabGroups:removeTab', async (_, tabId: unknown) => {
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    const tid = parseIpc(idSchema, tabId)

    const tab = await getPrisma().tab.findFirst({
      where: { id: tid },
      include: { tabGroup: true },
    })
    if (!tab || tab.tabGroup.userId !== userId) throw new Error('Tab not found')

    await getPrisma().tab.delete({ where: { id: tid } })
  })

  ipcMain.handle('tabGroups:openAll', async (_, groupId: unknown) => {
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    const gid = parseIpc(idSchema, groupId)

    const group = await getPrisma().tabGroup.findFirst({
      where: { id: gid, userId },
    })
    if (!group) throw new Error('Tab group not found')

    const tabs = await getPrisma().tab.findMany({ where: { tabGroupId: gid } })
    for (const tab of tabs) {
      assertSafeExternalUrl(tab.url)
      await shell.openExternal(tab.url)
    }
  })
}
