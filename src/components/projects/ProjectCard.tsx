'use client'

import { useRouter } from 'next/navigation'
import { Project } from '@/types'
import { computeProgress } from '@/lib/phase'
import PhaseBadge from '@/components/ui/PhaseBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import ProgressBar from '@/components/ui/ProgressBar'
import { CalendarDays, CheckSquare, Clock } from 'lucide-react'

interface Props {
  project: Project
}

export default function ProjectCard({ project }: Props) {
  const router = useRouter()
  const progress = computeProgress(project.tasks)
  const openTasks = project.tasks.filter((t) => !t.completed).length
  const doneTasks = project.tasks.filter((t) => t.completed).length

  const deadlineDate = new Date(project.deadline)
  const isOverdue = deadlineDate < new Date() && project.status !== 'completed'
  const formattedDeadline = deadlineDate.toLocaleDateString('nl-NL', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div
      onDoubleClick={() => router.push(`/projects/${project.id}`)}
      className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 cursor-pointer group p-5 flex flex-col gap-4"
      title="Dubbelklik om te openen"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="font-semibold text-slate-800 text-base leading-tight truncate group-hover:text-blue-700 transition-colors">
            {project.name}
          </h3>
          <p className="text-sm text-slate-500 mt-0.5 truncate">{project.client}</p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      <div className="flex flex-wrap gap-2">
        <PhaseBadge phase={project.currentPhase} size="sm" />
      </div>

      <div>
        <ProgressBar progress={progress} />
      </div>

      <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-50 pt-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <CheckSquare className="h-3.5 w-3.5 text-green-500" />
            {doneTasks} afgerond
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5 text-slate-400" />
            {openTasks} open
          </span>
        </div>
        <span className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
          <CalendarDays className="h-3.5 w-3.5" />
          {formattedDeadline}
        </span>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          router.push(`/projects/${project.id}`)
        }}
        onDoubleClick={(e) => e.stopPropagation()}
        className="w-full text-center text-xs text-blue-600 hover:text-blue-700 font-medium py-1.5 rounded-lg hover:bg-blue-50 transition-colors border border-blue-100"
      >
        Bekijken →
      </button>
    </div>
  )
}
