-- Brutaal Studio OS — MVP database schema
-- Run this in the Supabase SQL editor (or via `supabase db push`) for a fresh project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- clients
-- ---------------------------------------------------------------------------
create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  contact_name text,
  contact_email text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- projects
-- ---------------------------------------------------------------------------
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  title text not null,
  status text not null default 'Nieuwe lead' check (status in (
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
    'Afgerond'
  )),
  request_type text,
  raw_briefing text not null,
  goal text,
  audience text,
  channels text,
  deadline date,
  budget_indication text,
  assets_links text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_client_id_idx on projects(client_id);

-- ---------------------------------------------------------------------------
-- ai_outputs
-- ---------------------------------------------------------------------------
create table if not exists ai_outputs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  type text not null check (type in (
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
    'upsell_proposal'
  )),
  content_markdown text not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_outputs_project_id_idx on ai_outputs(project_id);
create index if not exists ai_outputs_project_type_idx on ai_outputs(project_id, type);

-- ---------------------------------------------------------------------------
-- selected_concepts
-- ---------------------------------------------------------------------------
create table if not exists selected_concepts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects(id) on delete cascade,
  concept_title text not null,
  concept_summary text,
  created_at timestamptz not null default now()
);

create index if not exists selected_concepts_project_id_idx on selected_concepts(project_id);

-- ---------------------------------------------------------------------------
-- agency_settings — single-row table with agency-wide tone of voice notes
-- ---------------------------------------------------------------------------
create table if not exists agency_settings (
  id boolean primary key default true constraint agency_settings_singleton check (id),
  agency_name text not null default 'Brutaal Studio',
  tone_of_voice text not null default '',
  updated_at timestamptz not null default now()
);

insert into agency_settings (id) values (true) on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- updated_at trigger for projects
-- ---------------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists projects_set_updated_at on projects;
create trigger projects_set_updated_at
  before update on projects
  for each row execute function set_updated_at();

drop trigger if exists agency_settings_set_updated_at on agency_settings;
create trigger agency_settings_set_updated_at
  before update on agency_settings
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security — MVP has a single admin role, so any authenticated
-- user (the agency owner logging in via Supabase Auth) gets full access.
-- ---------------------------------------------------------------------------
alter table clients enable row level security;
alter table projects enable row level security;
alter table ai_outputs enable row level security;
alter table selected_concepts enable row level security;
alter table agency_settings enable row level security;

create policy "authenticated full access" on clients
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on projects
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on ai_outputs
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on selected_concepts
  for all to authenticated using (true) with check (true);

create policy "authenticated full access" on agency_settings
  for all to authenticated using (true) with check (true);
