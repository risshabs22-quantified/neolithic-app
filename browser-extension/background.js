'use strict'

const DISCOVERY_URL = 'http://127.0.0.1:57432/ws-connection'
const RECONNECT_DELAY_MS = 5000
const SYNC_INTERVAL_MS = 30000

let ws = null
let wsToken = null
let wsPort = null
let isConnected = false

// Fetch connection details from Electron discovery endpoint
async function fetchConnectionDetails() {
  try {
    const res = await fetch(DISCOVERY_URL)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

async function connect() {
  if (isConnected) return

  const details = await fetchConnectionDetails()
  if (!details) {
    setTimeout(connect, RECONNECT_DELAY_MS)
    return
  }

  wsToken = details.token
  wsPort = details.port

  try {
    ws = new WebSocket(`ws://127.0.0.1:${wsPort}`)

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'auth', token: wsToken }))
      isConnected = true
      syncTabs()
    }

    ws.onclose = () => {
      isConnected = false
      ws = null
      setTimeout(connect, RECONNECT_DELAY_MS)
    }

    ws.onerror = () => {
      isConnected = false
      ws = null
      setTimeout(connect, RECONNECT_DELAY_MS)
    }
  } catch {
    setTimeout(connect, RECONNECT_DELAY_MS)
  }
}

async function getAllTabsWithLastUsed() {
  const tabs = await chrome.tabs.query({})
  const stored = await chrome.storage.local.get(null)

  return tabs.map((tab) => ({
    id: tab.id,
    url: tab.url ?? '',
    title: tab.title ?? '',
    favIconUrl: tab.favIconUrl ?? '',
    lastUsed: stored[`tab_${tab.id}`] ?? null,
  }))
}

async function syncTabs() {
  if (!isConnected || !ws) return
  try {
    const tabs = await getAllTabsWithLastUsed()
    ws.send(JSON.stringify({ type: 'tabs:update', tabs }))
  } catch { /* ignore */ }
}

function recordTabUsed(tabId) {
  const key = `tab_${tabId}`
  chrome.storage.local.set({ [key]: Date.now() })
}

// Track tab activation
chrome.tabs.onActivated.addListener(({ tabId }) => {
  recordTabUsed(tabId)
  syncTabs()
})

// Track tab updates (navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === 'complete') {
    recordTabUsed(tabId)
    syncTabs()
  }
})

// Clean up storage when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  chrome.storage.local.remove(`tab_${tabId}`)
  syncTabs()
})

// Periodic sync
setInterval(syncTabs, SYNC_INTERVAL_MS)

// Start connection
connect()
