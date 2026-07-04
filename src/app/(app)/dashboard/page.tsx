import Link from 'next/link'
import { Plus, Sparkles, Users, FileText, Lightbulb, FolderKanban } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: number
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 pt-5">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-muted text-ink">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-ink">{value}</p>
          <p className="text-xs text-muted">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const [{ data: clients }, { data: projects }] = await Promise.all([
    supabase.from('clients').select('id, name'),
    supabase
      .from('projects')
      .select('id, title, status, created_at, client_id')
      .order('created_at', { ascending: false }),
  ])

  const clientNames = new Map((clients ?? []).map((c) => [c.id, c.name]))
  const allProjects = projects ?? []
  const openBriefings = allProjects.filter((p) =>
    ['Nieuwe lead', 'Briefing ontvangen'].includes(p.status)
  ).length
  const conceptsInProgress = allProjects.filter((p) =>
    ['Analyse gemaakt', 'Concepten gemaakt'].includes(p.status)
  ).length
  const recentProjects = allProjects.slice(0, 6)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-muted">Overzicht van leads, briefings en projecten.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/projects/new">
              <Sparkles /> Nieuw salesconcept
            </Link>
          </Button>
          <Button asChild variant="brand">
            <Link href="/projects/new">
              <Plus /> Nieuwe briefing
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={Users} label="Aantal leads / klanten" value={clients?.length ?? 0} />
        <StatCard icon={FileText} label="Open briefings" value={openBriefings} />
        <StatCard icon={Lightbulb} label="Concepten in behandeling" value={conceptsInProgress} />
        <StatCard icon={FolderKanban} label="Totaal projecten" value={allProjects.length} />
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted">Recente projecten</h2>
        <div className="flex flex-col gap-2">
          {recentProjects.map((project) => (
            <Link key={project.id} href={`/projects/${project.id}`}>
              <Card className="transition-colors hover:border-brand/40">
                <CardContent className="flex items-center justify-between gap-4 pt-5">
                  <div>
                    <p className="text-sm font-semibold text-ink">{project.title}</p>
                    <p className="text-xs text-muted">
                      {clientNames.get(project.client_id) ?? 'Onbekende klant'} ·{' '}
                      {formatDate(project.created_at)}
                    </p>
                  </div>
                  <Badge variant="muted">{project.status}</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
          {recentProjects.length === 0 && (
            <p className="text-sm text-muted">Nog geen projecten. Maak je eerste briefing aan.</p>
          )}
        </div>
      </div>
    </div>
  )
}
