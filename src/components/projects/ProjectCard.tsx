'use client'

import { useRouter } from 'next/navigation'
import { Project } from '@/types'
import { computeProgress } from '@/lib/phase'
import PhaseBadge from '@/components/ui/PhaseBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import ProgressBar from '@/components/ui/ProgressBar'

interface Props { project: Project }

export default function ProjectCard({ project }: Props) {
  const router = useRouter()
  const progress = computeProgress(project.tasks)
  const open = project.tasks.filter((t) => !t.completed).length
  const done = project.tasks.filter((t) => t.completed).length

  const deadlineDate = new Date(project.deadline)
  const isOverdue = deadlineDate < new Date() && project.status !== 'completed'
  const formatted = deadlineDate.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' })

  const navigate = () => router.push(`/projects/${project.id}`)

  return (
    <div
      onDoubleClick={navigate}
      className="group relative border border-white/10 bg-brutaal-surface p-5 flex flex-col gap-4
        hover:border-brutaal-yellow/60 hover:bg-brutaal-surface2 transition-all duration-150 cursor-pointer"
      title="Dubbelklik om te openen"
    >
      {/* Yellow left accent on hover */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-brutaal-yellow scale-y-0 group-hover:scale-y-100 transition-transform duration-150 origin-bottom" />

      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-black uppercase tracking-[0.05em] text-white leading-tight line-clamp-2 group-hover:text-brutaal-yellow transition-colors">
            {project.name}
          </h3>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/40 mt-1.5">
            {project.client}
          </p>
        </div>
        <StatusBadge status={project.status} />
      </div>

      {/* Phase */}
      <PhaseBadge phase={project.currentPhase} size="sm" />

      {/* Progress */}
      <ProgressBar progress={progress} />

      {/* Meta row */}
      <div className="flex items-center justify-between pt-1 border-t border-white/8">
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.1em]">
          <span className="text-brutaal-yellow">{done} ✓</span>
          <span className="text-white/35">{open} open</span>
        </div>
        <span className={`text-[10px] font-bold uppercase tracking-[0.08em] ${isOverdue ? 'text-red-400' : 'text-white/35'}`}>
          {formatted}
        </span>
      </div>

      {/* View button */}
      <button
        onClick={(e) => { e.stopPropagation(); navigate() }}
        onDoubleClick={(e) => e.stopPropagation()}
        className="w-full text-center text-[10px] font-black uppercase tracking-[0.18em] py-2
          border border-white/10 text-white/40
          hover:border-brutaal-yellow hover:text-brutaal-yellow hover:bg-brutaal-yellow/5
          transition-all duration-100"
      >
        Bekijken →
      </button>
    </div>
  )
}
