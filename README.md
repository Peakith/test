# Brutaal Studio OS

Interne AI-assistent voor sales, strategie en pre-productie van videoprojecten. Zet een ruwe
klantvraag om in analyse, creatieve concepten, pakketvoorstellen, offerte-tekst en een
pre-productieplan.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Supabase (database + auth) · Claude API
(`@anthropic-ai/sdk`).

## Setup

1. Installeer dependencies:

   ```bash
   npm install
   ```

2. Maak een Supabase-project aan op [supabase.com](https://supabase.com) en voer
   `supabase/schema.sql` uit in de SQL editor. Dit maakt de tabellen (`clients`, `projects`,
   `ai_outputs`, `selected_concepts`, `agency_settings`), row-level security policies en een
   admin-rij aan.

3. Maak in Supabase Authentication een gebruiker aan voor jezelf (Admin / agency owner) — de MVP
   heeft één rol.

4. Kopieer `.env.example` naar `.env.local` en vul in:

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_ANON_KEY=
   ANTHROPIC_API_KEY=
   ```

5. Start de dev server:

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) — je wordt doorgestuurd naar `/login`.

## Structuur

- `/dashboard` — overzicht van leads, briefings en projecten
- `/clients` — klanten beheren
- `/projects/new` — nieuwe briefing invoeren
- `/projects/[id]` — projectdetail met tabs: Briefing, AI Analyse, Concepten, Pakketten, Offerte,
  Pre-productie, Sales Output
- `/settings` — API-status en agency tone of voice

Alle AI-generatie loopt via server actions in `src/lib/actions/ai.ts`, met prompts in
`src/lib/prompts.ts` en de Claude-client in `src/lib/anthropic.ts`.
