# Neolithic (neolithic-app) — agent handoff

Use this file so you do not re-discover layout or repeat mistakes (for example, assuming `setup-prompt.txt` is empty when the read tool glitches).

## Product scope (Windows desktop only)

- **Canonical prompt:** `windows-one-download-prompt.txt` — one Windows installer; **no** Chrome extension, **no** WebSocket tab sync from a browser add-on.
- **Browser awareness:** `src/main/services/browserSurfaceMonitor.ts` — top-level browser windows via `windows-window-manager` + optional foreground HWND (PowerShell). Not per-tab URLs.
- **`browser-extension/`** folder may remain in the repo as legacy reference; the **shipped app does not require it**.

## Source of truth (read these)

1. `windows-one-download-prompt.txt` — consumer scope for single-package Windows app.
2. `setup-prompt.txt` — original spec (parts superseded by no-extension decision).
3. `claude-code-prompt.txt` — older build brief; prefer `windows-one-download-prompt.txt` for distribution scope.

## Commands (Windows / PowerShell)

```powershell
npm install
Copy-Item .env.example .env   # optional; app runs without .env using bootstrap defaults
npm run db:migrate            # developers only, when changing Prisma schema
npm run typecheck
npm run dev
npm run release:win           # NSIS installer under release/
```

## Repo map (where things live)

| Area | Path |
|------|------|
| Electron main, CSP, window | `src/main/index.ts` |
| IPC handlers | `src/main/ipc/*.ts` |
| Prisma client + migrate on start | `src/main/db/` |
| Better Auth + encrypted store | `src/main/services/authService.ts` |
| Browser window surface (no extension) | `src/main/services/browserSurfaceMonitor.ts` |
| Windows window APIs | `src/main/services/windowManager.ts` |
| Preload / contextBridge API | `src/preload/index.ts` |
| React app, pages, Zustand | `src/renderer/` |
| Shared types + constants | `src/shared/types.ts`, `src/shared/constants.ts` |
| Schema | `prisma/schema.prisma` |

## Security reminders (do not regress)

- IPC only through `window.api` from preload (`contextIsolation: true`, `sandbox: true`).
- **IPC inputs:** validate with Zod in main (`src/main/validation/ipc-schemas.ts`); use `parseIpc`.
- **openExternal / stored tab URLs:** only `http:` and `https:` (`src/main/validation/safe-url.ts`).
- **Prisma writes:** scope tasks and tab groups by `getCurrentUserId()` where applicable.
- Do not log sensitive window content to disk; UI may show titles the user already sees on their desktop.

## Build note

`electron-vite` needs **`vite`** as a direct devDependency. If `npm run build` errors with `Cannot find package 'vite'`, run `npm install` after pulling.

## Definition of done

- `npm run typecheck` passes.
- `npm run dev` works **without** any browser extension.
- `npm run release:win` produces an installer (unsigned builds may trigger SmartScreen).
