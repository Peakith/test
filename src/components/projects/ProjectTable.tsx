'use client'

import { useRouter } from 'next/navigation'
import { Project } from '@/types'
import { computeProgress } from '@/lib/phase'
import PhaseBadge from '@/components/ui/PhaseBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import ProgressBar from '@/components/ui/ProgressBar'

interface Props {
  projects: Project[]
}

export default function ProjectTable({ projects }: Props) {
  const router = useRouter()

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50">
            <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Project</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide hidden md:table-cell">Klant</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide">Fase</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Status</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide hidden lg:table-cell">Deadline</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide w-40 hidden xl:table-cell">Voortgang</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 text-xs uppercase tracking-wide hidden sm:table-cell">Taken</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project, idx) => {
            const progress = computeProgress(project.tasks)
            const open = project.tasks.filter((t) => !t.completed).length
            const done = project.tasks.filter((t) => t.completed).length
            const deadline = new Date(project.deadline).toLocaleDateString('nl-NL', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
            const isOverdue = new Date(project.deadline) < new Date() && project.status !== 'completed'

            return (
              <tr
                key={project.id}
                onDoubleClick={() => router.push(`/projects/${project.id}`)}
                onClick={() => router.push(`/projects/${project.id}`)}
                className={`border-b border-slate-50 hover:bg-blue-50/40 cursor-pointer transition-colors ${idx % 2 === 0 ? '' : 'bg-slate-50/30'}`}
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-slate-800 hover:text-blue-700 line-clamp-1">
                    {project.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-500 hidden md:table-cell">{project.client}</td>
                <td className="px-4 py-3">
                  <PhaseBadge phase={project.currentPhase} size="sm" />
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <StatusBadge status={project.status} />
                </td>
                <td className={`px-4 py-3 hidden lg:table-cell text-xs ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-500'}`}>
                  {deadline}
                </td>
                <td className="px-4 py-3 hidden xl:table-cell w-40">
                  <ProgressBar progress={progress} height="sm" />
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <span className="text-xs text-slate-500">
                    <span className="text-green-600 font-medium">{done}</span>
                    <span className="text-slate-300 mx-1">/</span>
                    <span>{done + open}</span>
                  </span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
