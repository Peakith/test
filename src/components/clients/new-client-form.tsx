'use client'

import { createClientRecord } from '@/lib/actions/clients'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function NewClientForm() {
  return (
    <form action={createClientRecord} className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Klantnaam *</Label>
        <Input id="name" name="name" required placeholder="Bedrijfsnaam" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="industry">Branche</Label>
        <Input id="industry" name="industry" placeholder="Bijv. tech, retail, bouw" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact_name">Contactpersoon</Label>
        <Input id="contact_name" name="contact_name" placeholder="Naam" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="contact_email">E-mail contactpersoon</Label>
        <Input id="contact_email" name="contact_email" type="email" placeholder="naam@bedrijf.nl" />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" variant="brand">
          Klant toevoegen
        </Button>
      </div>
    </form>
  )
}
