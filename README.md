# Neolithic

Windows-first desktop app: **tasks**, **saved tab groups (URLs you add)**, **browser window awareness** (top-level windows only, no Chrome extension), and **window management** on Windows. Built with Electron, React, TypeScript, **SQLite** + Prisma, and Better Auth.

## For everyone (Windows install)

1. Download **`Neolithic-*-Windows-Setup.exe`** from your release page (build it with `npm run release:win`; output is under `release/`).
2. Run the installer and open **Neolithic**.
3. No PostgreSQL, no manual `.env` required: the app uses **SQLite** under your profile and can create **machine secrets** on first run (see `src/main/env/bootstrap.ts`).

**Browser windows page:** shows **top-level** Chrome, Edge, Firefox, etc. windows the OS exposes. It does **not** read each tab’s URL (that would require a browser extension). See `windows-one-download-prompt.txt` for scope.

## For developers

### Prerequisites

- Node.js 20+

### Setup

```bash
npm install
# Optional: copy .env.example to .env and set DATABASE_URL for a fixed dev DB path
npm run db:migrate   # when you change prisma/schema.prisma
npm run dev
```

### Environment variables (optional)

| Variable | Description |
|---|---|
| `DATABASE_URL` | Optional; defaults to SQLite in app userData |
| `BETTER_AUTH_SECRET` | Optional; auto-generated if unset |
| `STORE_ENCRYPTION_KEY` | Optional; auto-generated if unset |

### Legacy `browser-extension/` folder

Not required for the shipped Windows app. Kept only as reference; the live app uses `browserSurfaceMonitor` instead of a WebSocket extension.

### Window Manager (Windows only)

Uses `windows-window-manager` when available. On non-Windows platforms the UI degrades gracefully.

### Scripts

| Script | Description |
|---|---|
| `npm run dev` | Development |
| `npm run build` | Compile with electron-vite |
| `npm run release:win` | Windows NSIS installer → `release/` |
| `npm run db:migrate` | Prisma migrate (dev) |
| `npm run db:studio` | Prisma Studio |
| `npm run typecheck` | Typecheck |

### Agent handoff

See **`CLAUDE.md`** and **`windows-one-download-prompt.txt`**.
