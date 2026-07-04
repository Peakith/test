import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NewClientForm } from '@/components/clients/new-client-form'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ClientsPage() {
  const supabase = await createClient()

  const [{ data: clients }, { data: projects }] = await Promise.all([
    supabase.from('clients').select('*').order('created_at', { ascending: false }),
    supabase.from('projects').select('id, client_id'),
  ])

  const projectCounts = new Map<string, number>()
  for (const p of projects ?? []) {
    projectCounts.set(p.client_id, (projectCounts.get(p.client_id) ?? 0) + 1)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-ink">Klanten</h1>
        <p className="mt-1 text-sm text-muted">Overzicht van alle klanten van Brutaal Studio.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Nieuwe klant</CardTitle>
        </CardHeader>
        <CardContent>
          <NewClientForm />
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(clients ?? []).map((client) => (
          <Card key={client.id}>
            <CardHeader>
              <CardTitle>{client.name}</CardTitle>
              <p className="text-xs text-muted">{client.industry ?? 'Branche onbekend'}</p>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm text-muted">
              {client.contact_name && <p>{client.contact_name}</p>}
              {client.contact_email && <p>{client.contact_email}</p>}
              <p className="text-xs">
                {projectCounts.get(client.id) ?? 0} project(en) · sinds{' '}
                {formatDate(client.created_at)}
              </p>
              <Link
                href={`/projects/new?client_id=${client.id}`}
                className="mt-1 text-sm font-medium text-brand hover:underline"
              >
                Nieuwe briefing voor deze klant →
              </Link>
            </CardContent>
          </Card>
        ))}
        {(clients ?? []).length === 0 && (
          <p className="text-sm text-muted">Nog geen klanten toegevoegd.</p>
        )}
      </div>
    </div>
  )
}
