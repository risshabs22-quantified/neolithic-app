import { contextBridge, ipcRenderer } from 'electron'
import type {
  ElectronAPI,
  CreateTaskData,
  BrowserSurfaceWindow,
  StaleBrowserSurfaceHint,
} from '../shared/types'

const api: ElectronAPI = {
  auth: {
    signup: (email, password) => ipcRenderer.invoke('auth:signup', { email, password }),
    signin: (email, password) => ipcRenderer.invoke('auth:signin', { email, password }),
    signout: () => ipcRenderer.invoke('auth:signout'),
    getSession: () => ipcRenderer.invoke('auth:getSession'),
  },
  tasks: {
    list: () => ipcRenderer.invoke('tasks:list'),
    create: (data: CreateTaskData) => ipcRenderer.invoke('tasks:create', data),
    update: (id, data) => ipcRenderer.invoke('tasks:update', id, data),
    delete: (id) => ipcRenderer.invoke('tasks:delete', id),
  },
  tabGroups: {
    list: () => ipcRenderer.invoke('tabGroups:list'),
    create: (name) => ipcRenderer.invoke('tabGroups:create', name),
    delete: (id) => ipcRenderer.invoke('tabGroups:delete', id),
    addTab: (groupId, url, title) => ipcRenderer.invoke('tabGroups:addTab', groupId, url, title),
    removeTab: (tabId) => ipcRenderer.invoke('tabGroups:removeTab', tabId),
    openAll: (groupId) => ipcRenderer.invoke('tabGroups:openAll', groupId),
  },
  windows: {
    list: () => ipcRenderer.invoke('windows:list'),
    snap: (hwnd, direction) => ipcRenderer.invoke('windows:snap', hwnd, direction),
    maximize: (hwnd) => ipcRenderer.invoke('windows:maximize', hwnd),
    close: (hwnd) => ipcRenderer.invoke('windows:close', hwnd),
    organizeAll: () => ipcRenderer.invoke('windows:organizeAll'),
    isAvailable: () => ipcRenderer.invoke('windows:isAvailable'),
  },
  browserSurface: {
    onUpdate: (callback) => {
      ipcRenderer.on('browser-surface:update', (_, rows: BrowserSurfaceWindow[]) => callback(rows))
    },
    onHint: (callback) => {
      ipcRenderer.on('browser-surface:hint', (_, hint: StaleBrowserSurfaceHint) => callback(hint))
    },
    getThreshold: () => ipcRenderer.invoke('browser-surface:getThreshold'),
    setThreshold: (days) => ipcRenderer.invoke('browser-surface:setThreshold', days),
  },
}

contextBridge.exposeInMainWorld('api', api)
