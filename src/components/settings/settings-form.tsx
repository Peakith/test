'use client'

import { updateAgencySettings } from '@/lib/actions/settings'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export function SettingsForm({
  agencyName,
  toneOfVoice,
}: {
  agencyName: string
  toneOfVoice: string
}) {
  return (
    <form action={updateAgencySettings} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="agency_name">Bureaunaam</Label>
        <Input id="agency_name" name="agency_name" defaultValue={agencyName} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="tone_of_voice">Tone of voice</Label>
        <Textarea
          id="tone_of_voice"
          name="tone_of_voice"
          rows={6}
          defaultValue={toneOfVoice}
          placeholder="Beschrijf hoe Brutaal Studio schrijft: scherp, professioneel, menselijk, direct, niet corporate-saai, niet overdreven Amerikaans..."
        />
        <p className="text-xs text-muted">
          Deze tekst wordt meegegeven aan Claude bij elke AI-generatie, zodat alle output in de
          juiste stijl wordt geschreven.
        </p>
      </div>
      <div>
        <Button type="submit" variant="brand">
          Opslaan
        </Button>
      </div>
    </form>
  )
}
