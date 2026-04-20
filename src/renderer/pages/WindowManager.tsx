import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Monitor, AlertTriangle, LayoutGrid, ChevronLeft, ChevronRight, Maximize2, X, RefreshCw } from 'lucide-react'
import type { WindowInfo } from '../../shared/types'

export function WindowManager() {
  const [available, setAvailable] = useState<boolean | null>(null)
  const [windows, setWindows] = useState<WindowInfo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    window.api.windows.isAvailable().then(setAvailable)
  }, [])

  const refresh = async () => {
    setIsLoading(true)
    const wins = await window.api.windows.list()
    setWindows(wins)
    setIsLoading(false)
  }

  useEffect(() => {
    if (available) refresh()
  }, [available])

  const chaotic = windows.filter((w) => w.isChaotic)
  const normal = windows.filter((w) => !w.isChaotic)

  if (available === null) return <p className="text-muted-foreground">Checking…</p>

  if (!available) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <Monitor className="h-16 w-16 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Window Manager</h1>
        <p className="max-w-md text-muted-foreground">
          The window manager is only available on Windows. This feature lets you detect and organize
          chaotic window layouts on your desktop.
        </p>
        <Badge variant="outline">Windows only</Badge>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Window Chaos</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            size="sm"
            onClick={async () => {
              await window.api.windows.organizeAll()
              refresh()
            }}
            disabled={windows.length === 0}
          >
            <LayoutGrid className="mr-2 h-4 w-4" />
            Auto-Organize All
          </Button>
        </div>
      </div>

      {chaotic.length > 0 && (
        <Card className="border-orange-300">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-orange-700">
              <AlertTriangle className="h-4 w-4" />
              Window Chaos Detected ({chaotic.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {chaotic.map((win) => (
              <WindowRow
                key={win.hwnd}
                win={win}
                onSnap={(d) => window.api.windows.snap(win.hwnd, d).then(refresh)}
                onMaximize={() => window.api.windows.maximize(win.hwnd).then(refresh)}
                onClose={() => window.api.windows.close(win.hwnd).then(refresh)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {normal.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">All Windows ({normal.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {normal.map((win) => (
              <WindowRow
                key={win.hwnd}
                win={win}
                onSnap={(d) => window.api.windows.snap(win.hwnd, d).then(refresh)}
                onMaximize={() => window.api.windows.maximize(win.hwnd).then(refresh)}
                onClose={() => window.api.windows.close(win.hwnd).then(refresh)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {windows.length === 0 && !isLoading && (
        <p className="text-muted-foreground">No windows detected. Click Refresh to scan.</p>
      )}
    </div>
  )
}

interface WindowRowProps {
  win: WindowInfo
  onSnap: (direction: 'left' | 'right') => void
  onMaximize: () => void
  onClose: () => void
}

function WindowRow({ win, onSnap, onMaximize, onClose }: WindowRowProps) {
  return (
    <div className="flex items-start gap-3 rounded-md border bg-background px-3 py-2">
      <Monitor className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{win.title || '(Untitled)'}</p>
        <p className="text-xs text-muted-foreground">
          {win.processName} — {win.width}×{win.height} at ({win.x}, {win.y})
        </p>
        {win.chaosReasons.map((r) => (
          <Badge key={r} variant="outline" className="mr-1 mt-1 text-xs text-orange-700 border-orange-300">
            {r}
          </Badge>
        ))}
      </div>
      <div className="flex gap-1 shrink-0">
        <Button variant="outline" size="icon" className="h-7 w-7" title="Snap Left" onClick={() => onSnap('left')}>
          <ChevronLeft className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7" title="Snap Right" onClick={() => onSnap('right')}>
          <ChevronRight className="h-3 w-3" />
        </Button>
        <Button variant="outline" size="icon" className="h-7 w-7" title="Maximize" onClick={onMaximize}>
          <Maximize2 className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          title="Close"
          onClick={onClose}
        >
          <X className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
