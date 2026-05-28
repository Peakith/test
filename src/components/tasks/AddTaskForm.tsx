'use client'

import { useState } from 'react'
import { Phase, PHASES } from '@/types'
import { Plus } from 'lucide-react'

interface Props {
  onAdd: (title: string, phase: Phase) => void
}

export default function AddTaskForm({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [phase, setPhase] = useState<Phase>('Intake')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim(), phase)
    setTitle('')
    setPhase('Intake')
    setOpen(false)
  }

  if (!open) {
    return (
      <button
        onClick={() => { setPhase('Intake'); setOpen(true) }}
        className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
      >
        <Plus className="h-4 w-4" />
        Taak toevoegen
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
      <div className="flex flex-col gap-2">
        <input
          autoFocus
          type="text"
          placeholder="Taaknaam..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
        <select
          value={phase}
          onChange={(e) => setPhase(e.target.value as Phase)}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {PHASES.filter((p) => p !== 'Afgerond').map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-blue-600 text-white text-sm font-medium rounded-lg px-3 py-2 hover:bg-blue-700 transition-colors"
          >
            Toevoegen
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 bg-white text-slate-600 text-sm font-medium rounded-lg px-3 py-2 border border-slate-200 hover:bg-slate-100 transition-colors"
          >
            Annuleren
          </button>
        </div>
      </div>
    </form>
  )
}
