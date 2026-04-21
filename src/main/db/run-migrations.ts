import { readFileSync, readdirSync, existsSync } from 'fs'
import { join } from 'path'
import { app } from 'electron'
import { getPrisma } from './client'

export async function runPrismaMigrateDeploy(): Promise<void> {
  const prisma = getPrisma()

  const migrationsDir = app.isPackaged
    ? join(process.resourcesPath, 'prisma', 'migrations')
    : join(process.cwd(), 'prisma', 'migrations')

  if (!existsSync(migrationsDir)) return

  // Ensure migration tracking table exists
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "_prisma_migrations" (
      id TEXT NOT NULL PRIMARY KEY,
      migration_name TEXT NOT NULL,
      finished_at TEXT
    )
  `)

  const folders = readdirSync(migrationsDir)
    .filter((d) => !d.endsWith('.toml'))
    .sort()

  for (const folder of folders) {
    const sqlFile = join(migrationsDir, folder, 'migration.sql')
    if (!existsSync(sqlFile)) continue

    // Skip already-applied migrations
    const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(
      `SELECT id FROM "_prisma_migrations" WHERE migration_name = ? AND finished_at IS NOT NULL`,
      folder
    )
    if (rows.length > 0) continue

    const sql = readFileSync(sqlFile, 'utf-8')
    const statements = sql
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)

    for (const stmt of statements) {
      await prisma.$executeRawUnsafe(stmt)
    }

    await prisma.$executeRawUnsafe(
      `INSERT OR REPLACE INTO "_prisma_migrations" (id, migration_name, finished_at) VALUES (?, ?, datetime('now'))`,
      folder,
      folder
    )
  }
}
