import { ipcMain } from 'electron'
import { getPrisma } from '../db/client'
import { getCurrentUserId } from '../services/authService'
import {
  createTaskSchema,
  idSchema,
  parseIpc,
  updateTaskBodySchema,
} from '../validation/ipc-schemas'

export function registerTasksIPC(): void {
  ipcMain.handle('tasks:list', async () => {
    const userId = getCurrentUserId()
    if (!userId) return []
    return getPrisma().task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })
  })

  ipcMain.handle('tasks:create', async (_, data: unknown) => {
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    const parsed = parseIpc(createTaskSchema, data)
    return getPrisma().task.create({
      data: {
        title: parsed.title,
        priority: parsed.priority,
        dueDate: parsed.dueDate ? new Date(parsed.dueDate) : null,
        userId,
      },
    })
  })

  ipcMain.handle('tasks:update', async (_, id: unknown, data: unknown) => {
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    const taskId = parseIpc(idSchema, id)
    const body = parseIpc(updateTaskBodySchema, data)

    const existing = await getPrisma().task.findFirst({
      where: { id: taskId, userId },
    })
    if (!existing) throw new Error('Task not found')

    return getPrisma().task.update({
      where: { id: taskId },
      data: {
        ...(body.title !== undefined && { title: body.title }),
        ...(body.priority !== undefined && { priority: body.priority }),
        ...(body.completed !== undefined && { completed: body.completed }),
        ...(body.dueDate !== undefined && { dueDate: body.dueDate ? new Date(body.dueDate) : null }),
      },
    })
  })

  ipcMain.handle('tasks:delete', async (_, id: unknown) => {
    const userId = getCurrentUserId()
    if (!userId) throw new Error('Not authenticated')
    const taskId = parseIpc(idSchema, id)

    const deleted = await getPrisma().task.deleteMany({
      where: { id: taskId, userId },
    })
    if (deleted.count === 0) throw new Error('Task not found')
  })
}
