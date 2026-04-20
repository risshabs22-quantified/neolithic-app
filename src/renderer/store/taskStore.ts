import { create } from 'zustand'
import type { Task, CreateTaskData } from '../../shared/types'

interface TaskState {
  tasks: Task[]
  isLoading: boolean
  fetchTasks: () => Promise<void>
  createTask: (data: CreateTaskData) => Promise<void>
  toggleTask: (id: string, completed: boolean) => Promise<void>
  deleteTask: (id: string) => Promise<void>
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  isLoading: false,

  fetchTasks: async () => {
    set({ isLoading: true })
    const tasks = await window.api.tasks.list()
    set({ tasks, isLoading: false })
  },

  createTask: async (data) => {
    const task = await window.api.tasks.create(data)
    set((s) => ({ tasks: [task, ...s.tasks] }))
  },

  toggleTask: async (id, completed) => {
    const task = await window.api.tasks.update(id, { completed })
    set((s) => ({ tasks: s.tasks.map((t) => (t.id === id ? task : t)) }))
  },

  deleteTask: async (id) => {
    await window.api.tasks.delete(id)
    set((s) => ({ tasks: s.tasks.filter((t) => t.id !== id) }))
  },
}))
