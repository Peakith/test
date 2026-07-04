export const PROJECT_STATUSES = [
  'Nieuwe lead',
  'Briefing ontvangen',
  'Analyse gemaakt',
  'Concepten gemaakt',
  'Offerte verstuurd',
  'Akkoord',
  'Pre-productie',
  'Draaidag',
  'Edit',
  'Opgeleverd',
  'Case study maken',
  'Afgerond',
] as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[number]

export const AI_OUTPUT_TYPES = [
  'briefing_analysis',
  'concept_options',
  'proposal_packages',
  'proposal_text',
  'preproduction_pack',
  'followup_intake_email',
  'followup_proposal_email',
  'linkedin_post',
  'case_study',
  'retainer_proposal',
  'upsell_proposal',
] as const

export type AiOutputType = (typeof AI_OUTPUT_TYPES)[number]

export interface Client {
  id: string
  name: string
  industry: string | null
  contact_name: string | null
  contact_email: string | null
  created_at: string
}

export interface Project {
  id: string
  client_id: string
  title: string
  status: ProjectStatus
  request_type: string | null
  raw_briefing: string
  goal: string | null
  audience: string | null
  channels: string | null
  deadline: string | null
  budget_indication: string | null
  assets_links: string | null
  notes: string | null
  created_at: string
  updated_at: string
  clients?: Client
}

export interface AiOutput {
  id: string
  project_id: string
  type: AiOutputType
  content_markdown: string
  created_at: string
}

export interface SelectedConcept {
  id: string
  project_id: string
  concept_title: string
  concept_summary: string | null
  created_at: string
}

export interface AgencySettings {
  id: true
  agency_name: string
  tone_of_voice: string
  updated_at: string
}

export interface Database {
  public: {
    Tables: {
      clients: { Row: Client; Insert: Partial<Client>; Update: Partial<Client> }
      projects: { Row: Project; Insert: Partial<Project>; Update: Partial<Project> }
      ai_outputs: { Row: AiOutput; Insert: Partial<AiOutput>; Update: Partial<AiOutput> }
      selected_concepts: {
        Row: SelectedConcept
        Insert: Partial<SelectedConcept>
        Update: Partial<SelectedConcept>
      }
      agency_settings: {
        Row: AgencySettings
        Insert: Partial<AgencySettings>
        Update: Partial<AgencySettings>
      }
    }
  }
}
