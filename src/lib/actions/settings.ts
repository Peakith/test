'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateAgencySettings(formData: FormData) {
  const agency_name = String(formData.get('agency_name') ?? '').trim() || 'Brutaal Studio'
  const tone_of_voice = String(formData.get('tone_of_voice') ?? '').trim()

  const supabase = await createClient()
  const { error } = await supabase
    .from('agency_settings')
    .update({ agency_name, tone_of_voice })
    .eq('id', true)

  if (error) throw new Error(error.message)

  revalidatePath('/settings')
}
