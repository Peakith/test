'use client'

import { Task, Phase, PHASES, PHASE_COLORS } from '@/types'
import TaskItem from './TaskItem'
import AddTaskForm from './AddTaskForm'

interface Props {
  tasks: Task[]
  onToggle: (taskId: string) => void
  onDelete: (taskId: string) => void
  onAdd: (title: string, phase: Phase) => void
}

export default function TaskList({ tasks, onToggle, onDelete, onAdd }: Props) {
  const phasesWithTasks = PHASES.filter((phase) => tasks.some((t) => t.phase === phase))

  return (
    <div className="space-y-6">
      {phasesWithTasks.map((phase) => {
        const phaseTasks = tasks
          .filter((t) => t.phase === phase)
          .sort((a, b) => a.order - b.order)
        const completedCount = phaseTasks.filter((t) => t.completed).length
        const colors = PHASE_COLORS[phase]

        return (
          <div key={phase} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className={`flex items-center justify-between px-4 py-3 ${colors.bg} border-b ${colors.border}`}>
              <div className="flex items-center gap-2">
                <span className={`font-semibold text-sm ${colors.text}`}>{phase}</span>
              </div>
              <span className="text-xs text-slate-500 font-medium">
                {completedCount}/{phaseTasks.length} afgerond
              </span>
            </div>
            <div className="px-1 py-1">
              {phaseTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
              ))}
            </div>
          </div>
        )
      })}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3">
        <AddTaskForm onAdd={onAdd} />
      </div>
    </div>
  )
}
