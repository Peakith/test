'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PROJECT_STATUSES, type ProjectStatus } from '@/lib/types'

export async function createProject(formData: FormData) {
  const client_id = String(formData.get('client_id') ?? '')
  const raw_briefing = String(formData.get('raw_briefing') ?? '').trim()
  if (!client_id) throw new Error('Selecteer een klant.')
  if (!raw_briefing) throw new Error('De ruwe klantvraag is verplicht.')

  const request_type = String(formData.get('request_type') ?? '').trim() || null
  const goal = String(formData.get('goal') ?? '').trim() || null
  const audience = String(formData.get('audience') ?? '').trim() || null
  const channels = String(formData.get('channels') ?? '').trim() || null
  const deadlineRaw = String(formData.get('deadline') ?? '').trim()
  const deadline = deadlineRaw || null
  const budget_indication = String(formData.get('budget_indication') ?? '').trim() || null
  const assets_links = String(formData.get('assets_links') ?? '').trim() || null
  const notes = String(formData.get('notes') ?? '').trim() || null

  const title =
    String(formData.get('title') ?? '').trim() || raw_briefing.slice(0, 80)

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('projects')
    .insert({
      client_id,
      title,
      request_type,
      raw_briefing,
      goal,
      audience,
      channels,
      deadline,
      budget_indication,
      assets_links,
      notes,
      status: 'Briefing ontvangen',
    })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/dashboard')
  redirect(`/projects/${data.id}`)
}

export async function updateProjectStatus(projectId: string, status: ProjectStatus) {
  if (!PROJECT_STATUSES.includes(status)) throw new Error('Ongeldige status.')

  const supabase = await createClient()
  const { error } = await supabase.from('projects').update({ status }).eq('id', projectId)
  if (error) throw new Error(error.message)

  revalidatePath(`/projects/${projectId}`)
  revalidatePath('/dashboard')
}
