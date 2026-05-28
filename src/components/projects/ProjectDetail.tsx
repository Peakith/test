'use client'

import { useProjects } from '@/context/ProjectContext'
import { computeProgress } from '@/lib/phase'
import PhaseBadge from '@/components/ui/PhaseBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import ProgressBar from '@/components/ui/ProgressBar'
import TaskList from '@/components/tasks/TaskList'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Phase } from '@/types'

interface Props { projectId: string }

export default function ProjectDetail({ projectId }: Props) {
  const { projects, toggleTask, deleteTask, addTask } = useProjects()
  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    return (
      <div className="text-center py-24 border border-white/8">
        <p className="text-2xl font-black uppercase tracking-[0.08em] text-white/20">Project niet gevonden</p>
        <Link href="/projects" className="text-[11px] uppercase tracking-[0.14em] text-brutaal-yellow mt-4 inline-block hover:underline">
          ← Terug naar overzicht
        </Link>
      </div>
    )
  }

  const progress = computeProgress(project.tasks)
  const open = project.tasks.filter((t) => !t.completed).length
  const done = project.tasks.filter((t) => t.completed).length
  const deadline = new Date(project.deadline).toLocaleDateString('nl-NL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
  const isOverdue = new Date(project.deadline) < new Date() && project.status !== 'completed'

  return (
    <div className="space-y-8">
      {/* ─── Back ─── */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/40 hover:text-brutaal-yellow transition-colors"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Alle projecten
      </Link>

      {/* ─── Hero header ─── */}
      <div className="border border-white/10 bg-brutaal-surface p-6 sm:p-8 relative overflow-hidden">
        {/* Subtle yellow glow top-right */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-brutaal-yellow/8 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/30 mb-2">
              {project.client}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-[0.03em] text-white leading-tight">
              {project.name}
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
            <PhaseBadge phase={project.currentPhase} />
            <StatusBadge status={project.status} />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="border border-white/10 p-3">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30 mb-1">Voortgang</p>
            <p className="text-3xl font-black text-brutaal-yellow leading-none">{progress}%</p>
          </div>
          <div className="border border-white/10 p-3">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30 mb-1">Afgerond</p>
            <p className="text-3xl font-black text-white leading-none">{done}</p>
          </div>
          <div className="border border-white/10 p-3">
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30 mb-1">Open taken</p>
            <p className="text-3xl font-black text-white/60 leading-none">{open}</p>
          </div>
          <div className={`border p-3 ${isOverdue ? 'border-red-500/30 bg-red-900/10' : 'border-white/10'}`}>
            <p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/30 mb-1">Deadline</p>
            <p className={`text-sm font-black uppercase leading-tight ${isOverdue ? 'text-red-400' : 'text-white/70'}`}>
              {deadline}
            </p>
          </div>
        </div>

        <ProgressBar progress={progress} />
      </div>

      {/* ─── Tasks ─── */}
      <div>
        <h2 className="text-[10px] font-black uppercase tracking-[0.22em] text-white/35 mb-5">
          Taken per fase
        </h2>
        <TaskList
          tasks={project.tasks}
          onToggle={(taskId) => toggleTask(project.id, taskId)}
          onDelete={(taskId) => deleteTask(project.id, taskId)}
          onAdd={(title, phase: Phase) => addTask(project.id, title, phase)}
        />
      </div>
    </div>
  )
}
