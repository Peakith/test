'use client'

import { useRouter } from 'next/navigation'
import { Project } from '@/types'
import { computeProgress } from '@/lib/phase'
import PhaseBadge from '@/components/ui/PhaseBadge'
import StatusBadge from '@/components/ui/StatusBadge'
import ProgressBar from '@/components/ui/ProgressBar'

interface Props { projects: Project[] }

export default function ProjectTable({ projects }: Props) {
  const router = useRouter()

  return (
    <div className="border border-white/10 overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/3">
            {['Project', 'Klant', 'Fase', 'Status', 'Deadline', 'Voortgang', 'Taken'].map((h, i) => (
              <th
                key={h}
                className={`text-left px-4 py-3 text-[10px] font-black uppercase tracking-[0.16em] text-white/35
                  ${i > 1 ? 'hidden md:table-cell' : ''}
                  ${i > 4 ? 'hidden lg:table-cell' : ''}
                  ${i === 5 ? 'w-36' : ''}
                `}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => {
            const progress = computeProgress(project.tasks)
            const open = project.tasks.filter((t) => !t.completed).length
            const done = project.tasks.filter((t) => t.completed).length
            const deadline = new Date(project.deadline).toLocaleDateString('nl-NL', {
              day: 'numeric', month: 'short', year: 'numeric',
            })
            const isOverdue = new Date(project.deadline) < new Date() && project.status !== 'completed'

            return (
              <tr
                key={project.id}
                onDoubleClick={() => router.push(`/projects/${project.id}`)}
                onClick={() => router.push(`/projects/${project.id}`)}
                className="border-b border-white/6 hover:bg-brutaal-yellow/5 hover:border-brutaal-yellow/20 cursor-pointer transition-colors group"
              >
                <td className="px-4 py-3">
                  <span className="font-black uppercase tracking-[0.04em] text-white text-sm group-hover:text-brutaal-yellow transition-colors line-clamp-1">
                    {project.name}
                  </span>
                </td>
                <td className="px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/40 hidden md:table-cell">
                  {project.client}
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <PhaseBadge phase={project.currentPhase} size="sm" />
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <StatusBadge status={project.status} />
                </td>
                <td className={`px-4 py-3 hidden md:table-cell text-[11px] font-bold uppercase tracking-[0.08em] ${isOverdue ? 'text-red-400' : 'text-white/40'}`}>
                  {deadline}
                </td>
                <td className="px-4 py-3 hidden lg:table-cell w-36">
                  <ProgressBar progress={progress} height="sm" />
                </td>
                <td className="px-4 py-3 hidden lg:table-cell">
                  <span className="text-[11px] font-bold text-brutaal-yellow tabular-nums">{done}</span>
                  <span className="text-[11px] text-white/30 mx-1">/</span>
                  <span className="text-[11px] text-white/40 tabular-nums">{done + open}</span>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
