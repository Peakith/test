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
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-slate-50 group transition-colors">
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="h-4 w-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
      />
      <span
        className={`flex-1 text-sm transition-colors ${
          task.completed ? 'line-through text-slate-400' : 'text-slate-700'
        }`}
      >
        {task.title}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-50 text-slate-400 hover:text-red-500"
        aria-label="Taak verwijderen"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  )
}
