'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { GenerateButton } from '@/components/projects/generate-button'
import { OutputCard, EmptyState } from '@/components/projects/output-card'
import { Markdown } from '@/components/markdown'
import {
  analyzeBriefing,
  generateConcepts,
  generatePackages,
  generateProposalText,
  generatePreproduction,
  generateSalesOutput,
  saveSelectedConcept,
} from '@/lib/actions/ai'
import type { AiOutput, AiOutputType, Project, SelectedConcept } from '@/lib/types'
import type { SalesOutputType } from '@/lib/prompts'
import { formatDate } from '@/lib/utils'

type OutputMap = Partial<Record<AiOutputType, AiOutput>>

const SALES_OUTPUTS: { type: SalesOutputType; label: string }[] = [
  { type: 'followup_intake_email', label: 'Follow-up mail na intake' },
  { type: 'followup_proposal_email', label: 'Follow-up mail na offerte' },
  { type: 'linkedin_post', label: 'LinkedIn-post over dit project' },
  { type: 'case_study', label: 'Case study tekst' },
  { type: 'retainer_proposal', label: 'Retainer voorstel' },
  { type: 'upsell_proposal', label: 'Upsell voorstel' },
]

export function ProjectDetail({
  project,
  outputs,
  selectedConcepts,
}: {
  project: Project
  outputs: OutputMap
  selectedConcepts: SelectedConcept[]
}) {
  return (
    <Tabs defaultValue="briefing">
      <TabsList>
        <TabsTrigger value="briefing">Briefing</TabsTrigger>
        <TabsTrigger value="analyse">AI Analyse</TabsTrigger>
        <TabsTrigger value="concepten">Concepten</TabsTrigger>
        <TabsTrigger value="pakketten">Pakketten</TabsTrigger>
        <TabsTrigger value="offerte">Offerte</TabsTrigger>
        <TabsTrigger value="preproductie">Pre-productie</TabsTrigger>
        <TabsTrigger value="sales">Sales Output</TabsTrigger>
      </TabsList>

      <TabsContent value="briefing">
        <BriefingTab project={project} />
      </TabsContent>

      <TabsContent value="analyse">
        <AnalyseTab projectId={project.id} output={outputs.briefing_analysis} />
      </TabsContent>

      <TabsContent value="concepten">
        <ConceptenTab
          projectId={project.id}
          output={outputs.concept_options}
          hasAnalysis={!!outputs.briefing_analysis}
          selectedConcepts={selectedConcepts}
        />
      </TabsContent>

      <TabsContent value="pakketten">
        <PakkettenTab
          projectId={project.id}
          output={outputs.proposal_packages}
          hasConcepts={!!outputs.concept_options}
        />
      </TabsContent>

      <TabsContent value="offerte">
        <OfferteTab
          projectId={project.id}
          output={outputs.proposal_text}
          hasPackages={!!outputs.proposal_packages}
        />
      </TabsContent>

      <TabsContent value="preproductie">
        <PreproductieTab
          projectId={project.id}
          output={outputs.preproduction_pack}
          selectedConcepts={selectedConcepts}
        />
      </TabsContent>

      <TabsContent value="sales">
        <SalesTab projectId={project.id} outputs={outputs} />
      </TabsContent>
    </Tabs>
  )
}

function BriefingTab({ project }: { project: Project }) {
  const rows: [string, string | null][] = [
    ['Branche', project.clients?.industry ?? null],
    ['Contactpersoon', project.clients?.contact_name ?? null],
    ['Type aanvraag', project.request_type],
    ['Doel van de video', project.goal],
    ['Doelgroep', project.audience],
    ['Gewenste kanalen', project.channels],
    ['Deadline', project.deadline],
    ['Budgetindicatie', project.budget_indication],
    ['Bestaande assets / links', project.assets_links],
    ['Extra notities', project.notes],
  ]

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 pt-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Ruwe klantvraag
          </p>
          <p className="mt-1 whitespace-pre-wrap text-sm text-ink">{project.raw_briefing}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map(([label, value]) => (
            <div key={label}>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
              <p className="mt-0.5 whitespace-pre-wrap text-sm text-ink">{value || '—'}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function AnalyseTab({ projectId, output }: { projectId: string; output?: AiOutput }) {
  return (
    <div className="flex flex-col gap-4">
      <GenerateButton
        action={() => analyzeBriefing(projectId)}
        label={output ? 'Analyse opnieuw genereren' : 'Analyseer briefing'}
        loadingLabel="Claude analyseert de briefing…"
      />
      {output ? (
        <OutputCard content={output.content_markdown} createdAt={output.created_at} />
      ) : (
        <EmptyState text="Nog geen analyse gegenereerd." />
      )}
    </div>
  )
}

function ConceptenTab({
  projectId,
  output,
  hasAnalysis,
  selectedConcepts,
}: {
  projectId: string
  output?: AiOutput
  hasAnalysis: boolean
  selectedConcepts: SelectedConcept[]
}) {
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    if (!title.trim()) {
      setError('Vul een conceptnaam in.')
      return
    }
    setError(null)
    setSaving(true)
    try {
      await saveSelectedConcept(projectId, title.trim(), summary.trim())
      setTitle('')
      setSummary('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Er ging iets mis.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <GenerateButton
        action={() => generateConcepts(projectId)}
        label={output ? 'Concepten opnieuw genereren' : 'Genereer 3 creatieve richtingen'}
        loadingLabel="Claude bedenkt drie richtingen…"
      />
      {!hasAnalysis && !output && (
        <p className="text-xs text-muted">
          Tip: genereer eerst de AI Analyse voor scherpere concepten.
        </p>
      )}

      {output ? (
        <OutputCard content={output.content_markdown} createdAt={output.created_at} />
      ) : (
        <EmptyState text="Nog geen concepten gegenereerd." />
      )}

      <Card>
        <CardContent className="flex flex-col gap-3 pt-5">
          <p className="text-sm font-semibold text-ink">Concept vastleggen als gekozen richting</p>
          <p className="text-xs text-muted">
            Kopieer de conceptnaam en een korte samenvatting hierboven om vast te leggen welke
            richting is gekozen voor pre-productie.
          </p>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="concept-title">Conceptnaam</Label>
            <Input
              id="concept-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Bijv. Concept 3: Opvallend / Brutaal"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="concept-summary">Korte samenvatting</Label>
            <Textarea
              id="concept-summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              rows={2}
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div>
            <Button type="button" onClick={handleSave} disabled={saving} variant="outline">
              {saving ? 'Opslaan…' : 'Concept vastleggen'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {selectedConcepts.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">Gekozen concepten</p>
          <div className="flex flex-col gap-2">
            {selectedConcepts.map((c) => (
              <Card key={c.id}>
                <CardContent className="pt-4">
                  <p className="text-sm font-semibold text-ink">{c.concept_title}</p>
                  {c.concept_summary && (
                    <p className="mt-1 text-sm text-muted">{c.concept_summary}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function PakkettenTab({
  projectId,
  output,
  hasConcepts,
}: {
  projectId: string
  output?: AiOutput
  hasConcepts: boolean
}) {
  return (
    <div className="flex flex-col gap-4">
      <GenerateButton
        action={() => generatePackages(projectId)}
        label={output ? 'Pakketten opnieuw genereren' : 'Maak pakketten (Starter / Growth / Campaign)'}
        loadingLabel="Claude stelt de pakketten samen…"
      />
      {!hasConcepts && !output && (
        <p className="text-xs text-muted">
          Tip: genereer eerst concepten voor pakketten die daarop aansluiten.
        </p>
      )}
      {output ? (
        <OutputCard content={output.content_markdown} createdAt={output.created_at} />
      ) : (
        <EmptyState text="Nog geen pakketten gegenereerd." />
      )}
    </div>
  )
}

function OfferteTab({
  projectId,
  output,
  hasPackages,
}: {
  projectId: string
  output?: AiOutput
  hasPackages: boolean
}) {
  return (
    <div className="flex flex-col gap-4">
      <GenerateButton
        action={() => generateProposalText(projectId)}
        label={output ? 'Offerte-tekst opnieuw genereren' : 'Genereer offerte-tekst'}
        loadingLabel="Claude schrijft de offerte-tekst…"
      />
      {!hasPackages && (
        <p className="text-xs text-muted">Genereer eerst de pakketten op het tabblad Pakketten.</p>
      )}
      {output ? (
        <OutputCard content={output.content_markdown} createdAt={output.created_at} />
      ) : (
        <EmptyState text="Nog geen offerte-tekst gegenereerd." />
      )}
    </div>
  )
}

function PreproductieTab({
  projectId,
  output,
  selectedConcepts,
}: {
  projectId: string
  output?: AiOutput
  selectedConcepts: SelectedConcept[]
}) {
  const [activeConceptId, setActiveConceptId] = useState<string | null>(
    selectedConcepts[0]?.id ?? null
  )
  const activeConcept = selectedConcepts.find((c) => c.id === activeConceptId)

  return (
    <div className="flex flex-col gap-4">
      {selectedConcepts.length === 0 ? (
        <p className="text-sm text-muted">
          Leg eerst een gekozen concept vast op het tabblad Concepten.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {selectedConcepts.map((c) => (
            <Button
              key={c.id}
              type="button"
              size="sm"
              variant={c.id === activeConceptId ? 'brand' : 'outline'}
              onClick={() => setActiveConceptId(c.id)}
            >
              {c.concept_title}
            </Button>
          ))}
        </div>
      )}

      {activeConcept && (
        <GenerateButton
          action={() =>
            generatePreproduction(projectId, {
              title: activeConcept.concept_title,
              summary: activeConcept.concept_summary ?? '',
            })
          }
          label={output ? 'Pre-productiepakket opnieuw maken' : 'Maak pre-productiepakket'}
          loadingLabel="Claude maakt het pre-productiepakket…"
        />
      )}

      {output ? (
        <OutputCard content={output.content_markdown} createdAt={output.created_at} />
      ) : (
        <EmptyState text="Nog geen pre-productiepakket gegenereerd." />
      )}
    </div>
  )
}

function SalesTab({ projectId, outputs }: { projectId: string; outputs: OutputMap }) {
  const [context, setContext] = useState('')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="sales-context">Context / aanvullende info (optioneel)</Label>
        <Textarea
          id="sales-context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          rows={2}
          placeholder="Bijv. resultaat van het project, reactie van de klant, gespreksnotities..."
        />
      </div>

      {SALES_OUTPUTS.map(({ type, label }) => {
        const output = outputs[type]
        return (
          <div key={type} className="flex flex-col gap-3 border-t border-border pt-6 first:border-0 first:pt-0">
            <GenerateButton
              action={() => generateSalesOutput(projectId, type, context || undefined)}
              label={output ? `${label} opnieuw genereren` : `Genereer: ${label}`}
              variant="outline"
            />
            {output && (
              <Card>
                <CardContent className="pt-5">
                  <p className="mb-3 text-xs text-muted">
                    Gegenereerd op {formatDate(output.created_at)}
                  </p>
                  <Markdown content={output.content_markdown} />
                </CardContent>
              </Card>
            )}
          </div>
        )
      })}
    </div>
  )
}
