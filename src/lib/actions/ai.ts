'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { generateMarkdown } from '@/lib/anthropic'
import {
  buildSystemPrompt,
  buildBriefingAnalysisPrompt,
  buildConceptOptionsPrompt,
  buildProposalPackagesPrompt,
  buildProposalTextPrompt,
  buildPreproductionPrompt,
  buildSalesOutputPrompt,
  type SalesOutputType,
} from '@/lib/prompts'
import type { Project } from '@/lib/types'

async function getContext(projectId: string) {
  const supabase = await createClient()

  const [{ data: project, error: projectError }, { data: settings }] = await Promise.all([
    supabase.from('projects').select('*, clients(*)').eq('id', projectId).single(),
    supabase.from('agency_settings').select('*').eq('id', true).single(),
  ])

  if (projectError || !project) throw new Error('Project niet gevonden.')

  return { supabase, project: project as Project, toneOfVoice: settings?.tone_of_voice ?? null }
}

async function getLatestOutput(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  type: string
) {
  const { data } = await supabase
    .from('ai_outputs')
    .select('content_markdown')
    .eq('project_id', projectId)
    .eq('type', type)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  return data?.content_markdown ?? null
}

async function saveOutput(
  supabase: Awaited<ReturnType<typeof createClient>>,
  projectId: string,
  type: string,
  content: string
) {
  const { error } = await supabase
    .from('ai_outputs')
    .insert({ project_id: projectId, type, content_markdown: content })
  if (error) throw new Error(error.message)
}

export async function analyzeBriefing(projectId: string) {
  const { supabase, project, toneOfVoice } = await getContext(projectId)

  const content = await generateMarkdown(
    buildSystemPrompt(toneOfVoice),
    buildBriefingAnalysisPrompt(project)
  )

  await saveOutput(supabase, projectId, 'briefing_analysis', content)
  await supabase.from('projects').update({ status: 'Analyse gemaakt' }).eq('id', projectId)

  revalidatePath(`/projects/${projectId}`)
}

export async function generateConcepts(projectId: string) {
  const { supabase, project, toneOfVoice } = await getContext(projectId)
  const analysis = await getLatestOutput(supabase, projectId, 'briefing_analysis')

  const content = await generateMarkdown(
    buildSystemPrompt(toneOfVoice),
    buildConceptOptionsPrompt(project, analysis)
  )

  await saveOutput(supabase, projectId, 'concept_options', content)
  await supabase.from('projects').update({ status: 'Concepten gemaakt' }).eq('id', projectId)

  revalidatePath(`/projects/${projectId}`)
}

export async function generatePackages(projectId: string) {
  const { supabase, project, toneOfVoice } = await getContext(projectId)
  const concepts = await getLatestOutput(supabase, projectId, 'concept_options')

  const content = await generateMarkdown(
    buildSystemPrompt(toneOfVoice),
    buildProposalPackagesPrompt(project, concepts)
  )

  await saveOutput(supabase, projectId, 'proposal_packages', content)
  revalidatePath(`/projects/${projectId}`)
}

export async function generateProposalText(projectId: string) {
  const { supabase, project, toneOfVoice } = await getContext(projectId)
  const packages = await getLatestOutput(supabase, projectId, 'proposal_packages')
  if (!packages) throw new Error('Genereer eerst de pakketten voordat je offerte-tekst maakt.')

  const content = await generateMarkdown(
    buildSystemPrompt(toneOfVoice),
    buildProposalTextPrompt(project, packages)
  )

  await saveOutput(supabase, projectId, 'proposal_text', content)
  revalidatePath(`/projects/${projectId}`)
}

export async function saveSelectedConcept(
  projectId: string,
  conceptTitle: string,
  conceptSummary: string
) {
  const supabase = await createClient()
  const { error } = await supabase.from('selected_concepts').insert({
    project_id: projectId,
    concept_title: conceptTitle,
    concept_summary: conceptSummary,
  })
  if (error) throw new Error(error.message)
  revalidatePath(`/projects/${projectId}`)
}

export async function generatePreproduction(
  projectId: string,
  concept: { title: string; summary: string }
) {
  const { supabase, project, toneOfVoice } = await getContext(projectId)

  const content = await generateMarkdown(
    buildSystemPrompt(toneOfVoice),
    buildPreproductionPrompt(project, concept)
  )

  await saveOutput(supabase, projectId, 'preproduction_pack', content)
  await supabase.from('projects').update({ status: 'Pre-productie' }).eq('id', projectId)

  revalidatePath(`/projects/${projectId}`)
}

export async function generateSalesOutput(
  projectId: string,
  type: SalesOutputType,
  context?: string
) {
  const { supabase, project, toneOfVoice } = await getContext(projectId)

  const content = await generateMarkdown(
    buildSystemPrompt(toneOfVoice),
    buildSalesOutputPrompt(project, type, context)
  )

  await saveOutput(supabase, projectId, type, content)
  revalidatePath(`/projects/${projectId}`)
}
