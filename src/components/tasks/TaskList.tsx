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
    <div className="space-y-4">
      {phasesWithTasks.map((phase) => {
        const phaseTasks = tasks.filter((t) => t.phase === phase).sort((a, b) => a.order - b.order)
        const completedCount = phaseTasks.filter((t) => t.completed).length
        const allDone = completedCount === phaseTasks.length
        const c = PHASE_COLORS[phase]

        return (
          <div key={phase} className={`border overflow-hidden ${allDone ? 'border-brutaal-yellow/25' : 'border-white/10'}`}>
            {/* Phase header */}
            <div className={`flex items-center justify-between px-4 py-2.5 border-b ${allDone ? 'bg-brutaal-yellow/8 border-brutaal-yellow/20' : 'bg-white/3 border-white/8'}`}>
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.16em] ${allDone ? 'text-brutaal-yellow' : c.text}`}>
                  {phase}
                </span>
                {allDone && (
                  <span className="text-[9px] font-black uppercase tracking-[0.12em] text-brutaal-yellow/70 ml-1">
                    ✓ Afgerond
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-[0.1em] text-white/30">
                {completedCount}/{phaseTasks.length}
              </span>
            </div>

            {/* Tasks */}
            <div className="divide-y divide-white/5">
              {phaseTasks.map((task) => (
                <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
              ))}
            </div>
          </div>
        )
      })}

      {/* Add task */}
      <div className="border border-white/8 p-3">
        <AddTaskForm onAdd={onAdd} />
      </div>
    </div>
  )
}
