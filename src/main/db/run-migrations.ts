import { spawnSync } from 'child_process'
import { join, dirname } from 'path'
import { existsSync } from 'fs'
import { app } from 'electron'

/**
 * Applies bundled Prisma migrations (SQLite). Must run before first PrismaClient use.
 */
export function runPrismaMigrateDeploy(): void {
  const schemaPath = app.isPackaged
    ? join(process.resourcesPath, 'prisma', 'schema.prisma')
    : join(process.cwd(), 'prisma', 'schema.prisma')

  if (!existsSync(schemaPath)) {
    throw new Error(`Prisma schema missing: ${schemaPath}`)
  }

  const prismaCli = app.isPackaged
    ? join(dirname(app.getAppPath()), 'app.asar.unpacked', 'node_modules', 'prisma', 'build', 'index.js')
    : join(process.cwd(), 'node_modules', 'prisma', 'build', 'index.js')

  if (!existsSync(prismaCli)) {
    throw new Error(`Prisma CLI missing: ${prismaCli}`)
  }

  const result = spawnSync(process.execPath, [prismaCli, 'migrate', 'deploy', '--schema', schemaPath], {
    encoding: 'utf-8',
    env: { ...process.env },
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  if (result.status !== 0) {
    const err = (result.stderr || result.stdout || '').trim()
    throw new Error(`Prisma migrate deploy failed: ${err}`)
  }
}
