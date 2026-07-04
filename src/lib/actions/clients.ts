'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createClientRecord(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  if (!name) throw new Error('Klantnaam is verplicht.')

  const industry = String(formData.get('industry') ?? '').trim() || null
  const contact_name = String(formData.get('contact_name') ?? '').trim() || null
  const contact_email = String(formData.get('contact_email') ?? '').trim() || null

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('clients')
    .insert({ name, industry, contact_name, contact_email })
    .select('id')
    .single()

  if (error) throw new Error(error.message)

  revalidatePath('/clients')
  redirect(`/projects/new?client_id=${data.id}`)
}
