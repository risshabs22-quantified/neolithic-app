import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { Checkbox } from '../components/ui/checkbox'
import { useTaskStore } from '../store/taskStore'
import { useAuthStore } from '../store/authStore'
import { isToday, format, isPast } from 'date-fns'
import type { Task, Priority } from '../../shared/types'

function priorityVariant(p: Priority): 'low' | 'medium' | 'high' {
  return p
}

export function Dashboard() {
  const { user } = useAuthStore()
  const { tasks, fetchTasks, toggleTask } = useTaskStore()

  useEffect(() => {
    fetchTasks()
  }, [])

  const todayTasks = tasks.filter(
    (t) => t.dueDate && isToday(new Date(t.dueDate))
  )
  const overdueTasks = tasks.filter(
    (t) => !t.completed && t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate))
  )
  const completedCount = tasks.filter((t) => t.completed).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Good {getGreeting()}, {user?.name ?? user?.email?.split('@')[0]}
        </h1>
        <p className="text-muted-foreground">Here's what's on your plate today.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Tasks" value={tasks.length} />
        <StatCard label="Completed" value={completedCount} />
        <StatCard label="Overdue" value={overdueTasks.length} className={overdueTasks.length > 0 ? 'border-red-300' : ''} />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Today's Tasks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks due today.</p>
            ) : (
              todayTasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={toggleTask} />
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base text-red-600">Overdue</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {overdueTasks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No overdue tasks.</p>
            ) : (
              overdueTasks.map((task) => (
                <TaskRow key={task.id} task={task} onToggle={toggleTask} />
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ label, value, className = '' }: { label: string; value: number; className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="pt-6">
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  )
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: (id: string, c: boolean) => void }) {
  return (
    <div className="flex items-center gap-3">
      <Checkbox
        checked={task.completed}
        onCheckedChange={(checked) => onToggle(task.id, !!checked)}
      />
      <span className={`flex-1 text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
        {task.title}
      </span>
      <Badge variant={priorityVariant(task.priority)}>{task.priority}</Badge>
      {task.dueDate && (
        <span className="text-xs text-muted-foreground">
          {format(new Date(task.dueDate), 'MMM d')}
        </span>
      )}
    </div>
  )
}

function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'morning'
  if (h < 17) return 'afternoon'
  return 'evening'
}
