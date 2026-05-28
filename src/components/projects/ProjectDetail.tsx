'use client'

import { useProjects } from '@/context/ProjectContext'
import { computeProgress } from '@/lib/phase'
import PhaseBadge from '@/components/ui/PhaseBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import ProgressBar from '@/components/ui/ProgressBar'
import TaskList from '@/components/tasks/TaskList'
import { ArrowLeft, CalendarDays, CheckSquare, Clock, Users } from 'lucide-react'
import Link from 'next/link'
import { Phase } from '@/types'

interface Props {
  projectId: string
}

export default function ProjectDetail({ projectId }: Props) {
  const { projects, toggleTask, deleteTask, addTask } = useProjects()
  const project = projects.find((p) => p.id === projectId)

  if (!project) {
    return (
      <div className="text-center py-24">
        <p className="text-slate-500 text-lg">Project niet gevonden.</p>
        <Link href="/projects" className="text-blue-600 text-sm mt-2 inline-block hover:underline">
          Terug naar overzicht
        </Link>
      </div>
    )
  }

  const progress = computeProgress(project.tasks)
  const openTasks = project.tasks.filter((t) => !t.completed).length
  const doneTasks = project.tasks.filter((t) => t.completed).length
  const deadline = new Date(project.deadline).toLocaleDateString('nl-NL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
  const isOverdue = new Date(project.deadline) < new Date() && project.status !== 'completed'

  return (
    <div className="space-y-6">
      {/* Back nav */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Alle projecten
      </Link>

      {/* Project header card */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            <div className="flex items-center gap-2 mt-1 text-slate-500">
              <Users className="h-4 w-4" />
              <span className="text-sm">{project.client}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <PhaseBadge phase={project.currentPhase} />
            <StatusBadge status={project.status} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 rounded-xl p-3">
            <p className="text-xs text-slate-500 font-medium">Voortgang</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{progress}%</p>
          </div>
          <div className="bg-green-50 rounded-xl p-3">
            <p className="text-xs text-green-600 font-medium">Afgerond</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{doneTasks}</p>
          </div>
          <div className="bg-blue-50 rounded-xl p-3">
            <p className="text-xs text-blue-600 font-medium">Open taken</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{openTasks}</p>
          </div>
          <div className={`rounded-xl p-3 ${isOverdue ? 'bg-red-50' : 'bg-slate-50'}`}>
            <p className={`text-xs font-medium ${isOverdue ? 'text-red-500' : 'text-slate-500'}`}>Deadline</p>
            <p className={`text-sm font-bold mt-1 leading-tight ${isOverdue ? 'text-red-600' : 'text-slate-800'}`}>
              {deadline}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <ProgressBar progress={progress} />
        </div>
      </div>

      {/* Tasks */}
      <div>
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Taken per fase</h2>
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
