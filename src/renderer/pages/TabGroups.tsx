import React, { useEffect, useState } from 'react'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog'
import { useTabGroupStore } from '../store/tabGroupStore'
import { Trash2, Plus, ExternalLink, Globe } from 'lucide-react'

export function TabGroups() {
  const { tabGroups, isLoading, fetchTabGroups, createTabGroup, deleteTabGroup, addTab, removeTab, openAll } =
    useTabGroupStore()
  const [createOpen, setCreateOpen] = useState(false)
  const [addTabOpen, setAddTabOpen] = useState<string | null>(null)
  const [groupName, setGroupName] = useState('')
  const [tabUrl, setTabUrl] = useState('')
  const [tabTitle, setTabTitle] = useState('')

  useEffect(() => {
    fetchTabGroups()
  }, [])

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupName.trim()) return
    await createTabGroup(groupName.trim())
    setGroupName('')
    setCreateOpen(false)
  }

  const handleAddTab = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addTabOpen || !tabUrl.trim()) return
    const url = tabUrl.startsWith('http') ? tabUrl : `https://${tabUrl}`
    await addTab(addTabOpen, url, tabTitle || url)
    setTabUrl('')
    setTabTitle('')
    setAddTabOpen(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tab Groups</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="mr-2 h-4 w-4" />
              New Group
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Tab Group</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateGroup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="group-name">Group Name</Label>
                <Input
                  id="group-name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  placeholder="e.g. Work, Research"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit">Create</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : tabGroups.length === 0 ? (
        <p className="text-muted-foreground">No tab groups yet. Create one to save URLs.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {tabGroups.map((group) => (
            <Card key={group.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{group.name}</CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openAll(group.id)}
                      disabled={group.tabs.length === 0}
                    >
                      <ExternalLink className="mr-1 h-3 w-3" />
                      Open All
                    </Button>
                    <Dialog
                      open={addTabOpen === group.id}
                      onOpenChange={(o) => setAddTabOpen(o ? group.id : null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add Tab to "{group.name}"</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleAddTab} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="tab-url">URL</Label>
                            <Input
                              id="tab-url"
                              value={tabUrl}
                              onChange={(e) => setTabUrl(e.target.value)}
                              placeholder="https://example.com"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="tab-title">Title (optional)</Label>
                            <Input
                              id="tab-title"
                              value={tabTitle}
                              onChange={(e) => setTabTitle(e.target.value)}
                              placeholder="Page title"
                            />
                          </div>
                          <DialogFooter>
                            <Button type="submit">Add Tab</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-destructive"
                      onClick={() => deleteTabGroup(group.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{group.tabs.length} tab(s)</p>
              </CardHeader>
              <CardContent className="space-y-1">
                {group.tabs.length === 0 ? (
                  <p className="text-xs text-muted-foreground">No tabs saved yet.</p>
                ) : (
                  group.tabs.map((tab) => (
                    <div key={tab.id} className="flex items-center gap-2 rounded px-2 py-1 hover:bg-muted">
                      <Globe className="h-3 w-3 shrink-0 text-muted-foreground" />
                      <span className="flex-1 truncate text-xs">{tab.title || tab.url}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-destructive"
                        onClick={() => removeTab(group.id, tab.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
