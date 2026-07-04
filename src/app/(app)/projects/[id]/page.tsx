import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { StatusSelector } from '@/components/projects/status-selector'
import { ProjectDetail } from '@/components/projects/project-detail'
import type { AiOutput, AiOutputType, Project } from '@/lib/types'

export const dynamic = 'force-dynamic'

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: project }, { data: outputRows }, { data: selectedConcepts }] = await Promise.all([
    supabase.from('projects').select('*, clients(*)').eq('id', id).single(),
    supabase
      .from('ai_outputs')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false }),
    supabase
      .from('selected_concepts')
      .select('*')
      .eq('project_id', id)
      .order('created_at', { ascending: false }),
  ])

  if (!project) notFound()

  const outputs: Partial<Record<AiOutputType, AiOutput>> = {}
  for (const row of outputRows ?? []) {
    if (!outputs[row.type as AiOutputType]) {
      outputs[row.type as AiOutputType] = row as AiOutput
    }
  }

  const typedProject = project as Project

  return (
    <div className="flex flex-col gap-6">
      <Link
        href="/dashboard"
        className="flex items-center gap-1.5 text-sm text-muted hover:text-ink"
      >
        <ArrowLeft className="size-4" /> Terug naar dashboard
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">{typedProject.title}</h1>
          <p className="mt-1 text-sm text-muted">
            {typedProject.clients?.name ?? 'Onbekende klant'}
          </p>
        </div>
        <StatusSelector projectId={typedProject.id} status={typedProject.status} />
      </div>

      <ProjectDetail
        project={typedProject}
        outputs={outputs}
        selectedConcepts={selectedConcepts ?? []}
      />
    </div>
  )
}
