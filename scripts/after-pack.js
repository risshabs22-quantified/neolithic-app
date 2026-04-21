const fs = require('fs')
const path = require('path')

exports.default = async function afterPack(context) {
  const appOutDir = context.appOutDir
  const src = path.join(__dirname, '..', 'node_modules', '.prisma')
  const dst = path.join(appOutDir, 'resources', 'app', 'node_modules', '.prisma')

  if (!fs.existsSync(src)) {
    throw new Error('node_modules/.prisma not found — run prisma generate first')
  }

  copyRecursive(src, dst)
}

function copyRecursive(src, dst) {
  if (!fs.existsSync(dst)) fs.mkdirSync(dst, { recursive: true })
  for (const entry of fs.readdirSync(src)) {
    const srcPath = path.join(src, entry)
    const dstPath = path.join(dst, entry)
    const stat = fs.statSync(srcPath)
    if (stat.isDirectory()) {
      copyRecursive(srcPath, dstPath)
    } else {
      fs.copyFileSync(srcPath, dstPath)
    }
  }
}
