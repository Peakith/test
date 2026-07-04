import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NewBriefingForm } from '@/components/projects/new-briefing-form'

export const dynamic = 'force-dynamic'

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ client_id?: string }>
}) {
  const { client_id } = await searchParams
  const supabase = await createClient()
  const { data: clients } = await supabase.from('clients').select('*').order('name')

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-ink">Nieuwe briefing</h1>
        <p className="mt-1 text-sm text-muted">
          Leg de ruwe klantvraag vast. Je kunt hierna direct een AI-analyse maken.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Briefing</CardTitle>
        </CardHeader>
        <CardContent>
          <NewBriefingForm clients={clients ?? []} defaultClientId={client_id} />
        </CardContent>
      </Card>
    </div>
  )
}
