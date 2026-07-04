'use client'

import { useActionState } from 'react'
import { Clapperboard } from 'lucide-react'
import { signIn } from '@/lib/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signIn, undefined)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-10 items-center justify-center rounded-md bg-ink text-brand">
            <Clapperboard className="size-5" />
          </div>
          <p className="text-base font-bold text-ink">Brutaal Studio OS</p>
          <p className="text-sm text-muted">Log in om verder te gaan</p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email">E-mailadres</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password">Wachtwoord</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </div>
            {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
            <Button type="submit" variant="brand" disabled={pending} className="mt-2">
              {pending ? 'Bezig met inloggen…' : 'Inloggen'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
