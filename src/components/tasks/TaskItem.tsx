'use client'

import { Task } from '@/types'
import { Trash2 } from 'lucide-react'

interface Props {
  task: Task
  onToggle: (taskId: string) => void
  onDelete: (taskId: string) => void
}

export default function TaskItem({ task, onToggle, onDelete }: Props) {
  return (
    <div className="flex items-center gap-3 py-2.5 px-3 hover:bg-white/3 group transition-colors">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="brutaal-checkbox"
      />
      <span
        className={`flex-1 text-sm font-medium transition-colors ${
          task.completed
            ? 'line-through text-white/25'
            : 'text-white/80'
        }`}
      >
        {task.title}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-red-900/30 text-white/20 hover:text-red-400"
        aria-label="Taak verwijderen"
      >
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  )
}
