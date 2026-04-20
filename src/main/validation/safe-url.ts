/** Only http/https may be opened externally or persisted for later openExternal. */
export function assertSafeExternalUrl(url: string): void {
  let parsed: URL
  try {
    parsed = new URL(url)
  } catch {
    throw new Error('Invalid URL')
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('Only http and https URLs are allowed')
  }
}

export function isSafeExternalUrl(url: string): boolean {
  try {
    assertSafeExternalUrl(url)
    return true
  } catch {
    return false
  }
}
