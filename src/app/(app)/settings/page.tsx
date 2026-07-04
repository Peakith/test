import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { SettingsForm } from '@/components/settings/settings-form'

export const dynamic = 'force-dynamic'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: settings } = await supabase.from('agency_settings').select('*').eq('id', true).single()

  const hasAnthropicKey = !!process.env.ANTHROPIC_API_KEY
  const hasSupabaseConfig = !!process.env.NEXT_PUBLIC_SUPABASE_URL

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-xl font-bold text-ink">Instellingen</h1>
        <p className="mt-1 text-sm text-muted">API-status en huisstijl voor AI-generatie.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API-status</CardTitle>
          <CardDescription>Vereist voor AI-generatie en dataopslag.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink">Anthropic (Claude) API</span>
            <Badge variant={hasAnthropicKey ? 'brand' : 'outline'}>
              {hasAnthropicKey ? 'Verbonden' : 'Niet geconfigureerd'}
            </Badge>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-ink">Supabase</span>
            <Badge variant={hasSupabaseConfig ? 'brand' : 'outline'}>
              {hasSupabaseConfig ? 'Verbonden' : 'Niet geconfigureerd'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Agency tone of voice</CardTitle>
          <CardDescription>
            Wordt meegegeven bij elke AI-generatie zodat output altijd in de stijl van Brutaal
            Studio is.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm
            agencyName={settings?.agency_name ?? 'Brutaal Studio'}
            toneOfVoice={settings?.tone_of_voice ?? ''}
          />
        </CardContent>
      </Card>
    </div>
  )
}
