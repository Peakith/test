'use client'

import Link from 'next/link'
import { createProject } from '@/lib/actions/projects'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import type { Client } from '@/lib/types'

const REQUEST_TYPES = [
  'Bedrijfsvideo',
  'Social content',
  'Aftermovie',
  'Employer branding',
  'Campagnevideo',
  'Overig',
]

export function NewBriefingForm({
  clients,
  defaultClientId,
}: {
  clients: Client[]
  defaultClientId?: string
}) {
  if (clients.length === 0) {
    return (
      <p className="text-sm text-muted">
        Er zijn nog geen klanten.{' '}
        <Link href="/clients" className="font-medium text-brand hover:underline">
          Maak eerst een klant aan
        </Link>
        .
      </p>
    )
  }

  return (
    <form action={createProject} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="client_id">Klant *</Label>
          <select
            id="client_id"
            name="client_id"
            required
            defaultValue={defaultClientId ?? ''}
            className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            <option value="" disabled>
              Kies een klant
            </option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="request_type">Type aanvraag</Label>
          <select
            id="request_type"
            name="request_type"
            className="flex h-9 w-full rounded-md border border-border bg-surface px-3 py-1 text-sm text-ink shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40"
          >
            {REQUEST_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="title">Projectnaam (optioneel)</Label>
        <Input id="title" name="title" placeholder="Wordt anders afgeleid van de briefing" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="raw_briefing">Ruwe klantvraag *</Label>
        <Textarea
          id="raw_briefing"
          name="raw_briefing"
          required
          rows={4}
          placeholder='Bijv. "Wij willen een bedrijfsvideo" of "We zoeken een aftermovie"'
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="goal">Doel van de video</Label>
          <Textarea id="goal" name="goal" rows={2} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="audience">Doelgroep</Label>
          <Textarea id="audience" name="audience" rows={2} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="channels">Gewenste kanalen</Label>
          <Input id="channels" name="channels" placeholder="LinkedIn, Instagram, website..." />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="deadline">Deadline</Label>
          <Input id="deadline" name="deadline" type="date" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="budget_indication">Budgetindicatie</Label>
          <Input id="budget_indication" name="budget_indication" placeholder="Bijv. 5.000 - 10.000" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="assets_links">Bestaande assets / links</Label>
        <Textarea id="assets_links" name="assets_links" rows={2} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Extra notities</Label>
        <Textarea id="notes" name="notes" rows={2} />
      </div>

      <div>
        <Button type="submit" variant="brand">
          Briefing opslaan
        </Button>
      </div>
    </form>
  )
}
