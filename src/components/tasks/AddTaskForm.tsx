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
        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em]
          text-white/35 hover:text-brutaal-yellow transition-colors mt-1 px-3 py-2
          border border-transparent hover:border-brutaal-yellow/30"
      >
        <Plus className="h-3.5 w-3.5" />
        Taak toevoegen
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-2 p-4 border border-brutaal-yellow/30 bg-brutaal-yellow/5">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-brutaal-yellow mb-3">
        Nieuwe taak
      </p>
      <div className="flex flex-col gap-2">
        <input
          autoFocus
          type="text"
          placeholder="Taaknaam..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full bg-brutaal-black border border-white/15 px-3 py-2 text-sm text-white
            placeholder:text-white/25 focus:outline-none focus:border-brutaal-yellow/60 transition-colors"
        />
        <select
          value={phase}
          onChange={(e) => setPhase(e.target.value as Phase)}
          className="w-full bg-brutaal-black border border-white/15 px-3 py-2 text-[11px] font-bold
            uppercase tracking-[0.1em] text-white/70 focus:outline-none focus:border-brutaal-yellow/60
            transition-colors cursor-pointer"
        >
          {PHASES.filter((p) => p !== 'Afgerond').map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
        <div className="flex gap-2 mt-1">
          <button
            type="submit"
            className="flex-1 bg-brutaal-yellow text-brutaal-black text-[10px] font-black uppercase
              tracking-[0.14em] px-3 py-2 hover:bg-white transition-colors"
          >
            Toevoegen
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex-1 border border-white/15 text-white/40 text-[10px] font-black uppercase
              tracking-[0.14em] px-3 py-2 hover:border-white/35 hover:text-white/60 transition-colors"
          >
            Annuleren
          </button>
        </div>
      </div>
    </form>
  )
}
