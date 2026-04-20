import { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { useBrowserSurfaceStore } from '../store/browserSurfaceStore'
import { Globe, AlertTriangle, X, Monitor } from 'lucide-react'

export function BrowserTabs() {
  const { rows, hints, threshold, setRows, addHint, dismissHint, setThreshold } = useBrowserSurfaceStore()
  const [thresholdInput, setThresholdInput] = useState(String(threshold))

  useEffect(() => {
    window.api.browserSurface.getThreshold().then((t) => {
      setThresholdInput(String(t))
    })
    window.api.browserSurface.onUpdate((updated) => setRows(updated))
    window.api.browserSurface.onHint((hint) => addHint(hint))
  }, [])

  const handleSaveThreshold = () => {
    const days = parseInt(thresholdInput, 10)
    if (!isNaN(days) && days > 0) setThreshold(days)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Browser windows</h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Neolithic is a Windows desktop app only: it can see top-level browser windows (title and which app is
          foreground). It cannot read individual Chrome or Edge tab URLs without a separate browser extension, so
          that design is not used here.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Label htmlFor="threshold" className="text-sm">
          Stale title hint after
        </Label>
        <Input
          id="threshold"
          type="number"
          min={1}
          value={thresholdInput}
          onChange={(e) => setThresholdInput(e.target.value)}
          className="w-20"
        />
        <span className="text-sm text-muted-foreground">days (same window title unchanged)</span>
        <Button size="sm" variant="outline" onClick={handleSaveThreshold}>
          Save
        </Button>
      </div>

      {hints.length > 0 && (
        <Card className="border-yellow-300 bg-yellow-50">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              Stale window titles ({hints.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {hints.map((h) => (
              <div
                key={h.hwnd}
                className="flex items-center gap-3 rounded-md bg-white px-3 py-2 shadow-sm"
              >
                <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium">{h.title || '(no title)'}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {h.processName} — title unchanged for about {h.daysStale} days
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="text-muted-foreground" onClick={() => dismissHint(h.hwnd)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Monitor className="h-4 w-4" />
            Top-level browser windows
            <Badge variant="secondary" className="ml-1">
              {rows.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No supported browser windows detected, or window enumeration is unavailable on this system. On Windows,
              install runs with optional native support for listing windows (see Window Manager page).
            </p>
          ) : (
            <div className="space-y-1">
              {rows.map((r) => (
                <div
                  key={r.hwnd}
                  className="flex items-center gap-3 rounded px-2 py-1.5 hover:bg-muted"
                >
                  <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm">{r.title || '(no title)'}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {r.processName}
                      {r.isForeground ? ' · foreground' : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
