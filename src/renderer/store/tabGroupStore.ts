import { create } from 'zustand'
import type { TabGroup } from '../../shared/types'

interface TabGroupState {
  tabGroups: TabGroup[]
  isLoading: boolean
  fetchTabGroups: () => Promise<void>
  createTabGroup: (name: string) => Promise<void>
  deleteTabGroup: (id: string) => Promise<void>
  addTab: (groupId: string, url: string, title: string) => Promise<void>
  removeTab: (groupId: string, tabId: string) => Promise<void>
  openAll: (groupId: string) => Promise<void>
}

export const useTabGroupStore = create<TabGroupState>((set) => ({
  tabGroups: [],
  isLoading: false,

  fetchTabGroups: async () => {
    set({ isLoading: true })
    const tabGroups = await window.api.tabGroups.list()
    set({ tabGroups, isLoading: false })
  },

  createTabGroup: async (name) => {
    const group = await window.api.tabGroups.create(name)
    set((s) => ({ tabGroups: [group, ...s.tabGroups] }))
  },

  deleteTabGroup: async (id) => {
    await window.api.tabGroups.delete(id)
    set((s) => ({ tabGroups: s.tabGroups.filter((g) => g.id !== id) }))
  },

  addTab: async (groupId, url, title) => {
    const tab = await window.api.tabGroups.addTab(groupId, url, title)
    set((s) => ({
      tabGroups: s.tabGroups.map((g) =>
        g.id === groupId ? { ...g, tabs: [...g.tabs, tab] } : g
      ),
    }))
  },

  removeTab: async (groupId, tabId) => {
    await window.api.tabGroups.removeTab(tabId)
    set((s) => ({
      tabGroups: s.tabGroups.map((g) =>
        g.id === groupId ? { ...g, tabs: g.tabs.filter((t) => t.id !== tabId) } : g
      ),
    }))
  },

  openAll: async (groupId) => {
    await window.api.tabGroups.openAll(groupId)
  },
}))
