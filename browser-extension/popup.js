'use strict'

const statusEl = document.getElementById('status')
const tabCountEl = document.getElementById('tab-count')
const syncBtn = document.getElementById('sync-btn')

async function updateUI() {
  // Check connection status via background service worker
  try {
    const tabs = await chrome.tabs.query({})
    tabCountEl.textContent = `${tabs.length} tab(s) being monitored`

    // Try pinging the discovery endpoint to show connection status
    const res = await fetch('http://127.0.0.1:57432/ws-connection').catch(() => null)
    if (res && res.ok) {
      statusEl.textContent = 'Connected to Neolithic'
      statusEl.className = 'status status--connected'
    } else {
      statusEl.textContent = 'Neolithic app not running'
      statusEl.className = 'status status--disconnected'
    }
  } catch {
    statusEl.textContent = 'Error'
    statusEl.className = 'status status--disconnected'
  }
}

syncBtn.addEventListener('click', () => {
  // Signal background to sync
  chrome.runtime.sendMessage({ type: 'sync' }).catch(() => {})
  statusEl.textContent = 'Syncing…'
  statusEl.className = 'status status--connecting'
  setTimeout(updateUI, 1500)
})

updateUI()
