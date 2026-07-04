'use client'

import { useTransition } from 'react'
import { updateProjectStatus } from '@/lib/actions/projects'
import { PROJECT_STATUSES, type ProjectStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

export function StatusSelector({
  projectId,
  status,
}: {
  projectId: string
  status: ProjectStatus
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <select
      value={status}
      disabled={isPending}
      onChange={(e) =>
        startTransition(() => updateProjectStatus(projectId, e.target.value as ProjectStatus))
      }
      className={cn(
        'h-9 rounded-md border border-border bg-surface px-3 text-sm font-medium text-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40',
        isPending && 'opacity-60'
      )}
    >
      {PROJECT_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  )
}
