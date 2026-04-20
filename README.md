# Neolithic

A lightweight Windows desktop app to organize your tasks, manage browser tab groups, and monitor open browser windows—all in one place, all locally.

## For Everyone

### What is Neolithic?

Neolithic is a Windows desktop application that helps you:

- **Manage tasks** — Create, organize, and track your to-do items with priorities and due dates.
- **Save & reopen browser tab groups** — Manually save collections of URLs and open them all at once.
- **Monitor browser windows** — See which Chrome and Edge windows you have open and get alerted when you've forgotten about one.
- **Organize windows** — Windows are detected and can be snapped, maximized, and auto-arranged on your screen.

**No cloud sync. No browser extension required. Everything stays on your computer.**

### Download & Install

1. **Download the installer:**  
   [Neolithic-1.0.0-Windows-Setup.exe](https://github.com/yourusername/neolithic/releases/latest) (108 MB)

2. **Run the installer** and follow the on-screen steps.

3. **Open Neolithic** — It will create and manage a local SQLite database automatically.

4. **Sign up** — Create an account or sign in. Your data is encrypted and stored locally.

### Features

- **Dashboard** — Quick overview of today's tasks and what's overdue.
- **Tasks** — Add, filter, and complete tasks with priority levels and due dates.
- **Tab Groups** — Manually save collections of web links and open them all with one click.
- **Browser Activity** — Monitor which Chrome, Edge, Firefox, Brave windows are open. Get hints when a window hasn't changed in 7+ days.
- **Windows Manager** — See all your open applications, snap them left/right, maximize, organize in a grid.

### System Requirements

- **Windows 10 or later** (64-bit)
- **No additional software required** — Everything is bundled in the installer.

### First Launch

When you first open Neolithic:
- It will create a local SQLite database in `%APPDATA%/Neolithic/`
- It will generate encryption keys for secure local storage
- You'll be prompted to sign up with an email and password

All your data is encrypted at rest. Uninstalling the app will preserve your database folder if you wish to reinstall later.

### Getting Help

- **Not connecting to browser?** → The app monitors Windows-level windows. You need Chrome, Edge, Firefox, Brave, Opera, or Vivaldi open. If you close all browser windows, the count will drop to zero.
- **Can't log in?** → Make sure your email and password match your signup. Check that Neolithic has internet access (one-time only for auth; all other data is local).
- **Data deleted by accident?** → Your database is at `%APPDATA%/Neolithic/neolithic.db`. If you deleted it, reinstalling the app will create a fresh one.

---

## For Developers

### Building from Source

**Prerequisites:**
- Node.js 18+
- npm 9+
- Windows (building the NSIS installer only works on Windows)

**Setup:**

```powershell
npm install
Copy-Item .env.example .env
npm run typecheck
npm run dev
```

The app will open in development mode. Hot reload is enabled for the renderer (React).

**Database (optional for development):**

The app uses a local SQLite database (`prisma/dev.db`) that is created automatically on first run. To reset it:

```powershell
Remove-Item prisma/dev.db
```

### Building the Installer

```powershell
npm run release:win
```

This produces an NSIS installer at `release/Neolithic-1.0.0-Windows-Setup.exe`.

### Project Structure

```
src/
  main/              # Electron main process
    index.ts         # App entry point
    ipc/             # IPC handlers (tasks, auth, windows, browser surface)
    services/        # Auth, browser surface monitor, window manager
    db/              # Prisma client & migrations
    validation/      # IPC input validation
  preload/           # Context bridge API
  renderer/          # React app
    pages/           # Dashboard, Tasks, Tab Groups, etc.
    store/           # Zustand state management
  shared/            # Types, constants
prisma/              # Database schema & migrations
```

### Key Technologies

- **Electron 33** — Desktop application framework
- **React 18** — UI framework
- **Prisma** — Database ORM
- **SQLite** — Local database
- **Better Auth** — Authentication
- **electron-store** — Encrypted local storage
- **windows-window-manager** — Windows API integration
- **Zod** — Input validation
- **Tailwind CSS** — Styling

### Architecture

**One installer, no external services:**
- All data is stored locally in SQLite
- Authentication keys are generated and stored locally
- Browser window monitoring uses Windows APIs only (no Chrome extension)
- The app can run completely offline after the first login

**Security:**
- Context isolation enabled (`contextIsolation: true`)
- Sandbox enabled for renderer
- All IPC inputs are validated with Zod
- Tokens and encryption keys are stored in encrypted local storage
- No telemetry or remote logging

### IPC API

See `src/shared/types.ts` for the full `ElectronAPI` interface exposed to the renderer.

### License

MIT

---

**Made with ❤️ on Windows**
