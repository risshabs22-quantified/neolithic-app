/**
 * Must be imported before any module that reads DATABASE_URL or encrypted stores at load time.
 */
import { config } from 'dotenv'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { pathToFileURL } from 'url'
import { randomBytes } from 'crypto'
import { app } from 'electron'

config()

const SECRETS_FILE = 'neolithic-secrets.json'

function randomSecret(bytes: number): string {
  return randomBytes(bytes).toString('hex')
}

function ensureMachineSecrets(): void {
  const userData = app.getPath('userData')
  if (!existsSync(userData)) mkdirSync(userData, { recursive: true })

  const secretsPath = join(userData, SECRETS_FILE)
  let stored: Partial<Record<'BETTER_AUTH_SECRET' | 'STORE_ENCRYPTION_KEY', string>> = {}

  if (existsSync(secretsPath)) {
    try {
      stored = JSON.parse(readFileSync(secretsPath, 'utf-8')) as typeof stored
    } catch {
      stored = {}
    }
  }

  let dirty = false
  const ensure = (
    key: 'BETTER_AUTH_SECRET' | 'STORE_ENCRYPTION_KEY',
    gen: () => string
  ): void => {
    if (process.env[key]?.trim()) return
    if (!stored[key]) {
      stored[key] = gen()
      dirty = true
    }
    process.env[key] = stored[key]
  }

  ensure('BETTER_AUTH_SECRET', () => randomSecret(32))
  ensure('STORE_ENCRYPTION_KEY', () => randomSecret(16))

  if (dirty) {
    writeFileSync(secretsPath, JSON.stringify(stored, null, 2), 'utf-8')
  }
}

function ensureDatabaseUrl(): void {
  if (process.env.DATABASE_URL?.trim()) return

  const userData = app.getPath('userData')
  if (!existsSync(userData)) mkdirSync(userData, { recursive: true })

  const dbPath = join(userData, 'neolithic.db')
  process.env.DATABASE_URL = pathToFileURL(dbPath).href
}

ensureMachineSecrets()
ensureDatabaseUrl()
