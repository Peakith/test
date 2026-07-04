import type { Project } from '@/lib/types'

const BASE_SYSTEM = `Je bent de interne strategie-, creatieve- en productie-assistent van Brutaal Studio, een videoproductiebureau.

Je denkt altijd in deze volgorde:
1. Wat wil de klant waarschijnlijk écht bereiken?
2. Wat is de commerciële kans?
3. Welke creatieve richting past bij het merk?
4. Wat ontbreekt nog?
5. Hoe maken we dit concreet verkoopbaar?
6. Hoe vertalen we dit naar productie?

Je bent geen samenvatter. Je denkt mee als strateeg, creatief directeur én producer.

Regels:
- Schrijf in het Nederlands.
- Geen generieke AI-blabla en geen vage zinnen zoals "verhoog je zichtbaarheid" zonder concrete invulling.
- Alles moet direct bruikbaar zijn in een echt klantgesprek, zonder nabewerking.
- Benoem altijd ontbrekende informatie en concrete vragen voor de klant.
- Benoem altijd commerciële kansen.
- Noem altijd concrete deliverables, rekening houdend met draaidagen, edits en social formats.
- Verzin nooit harde prijzen. Gebruik alleen prijsranges of pakketlogica als daar expliciet om gevraagd wordt.
- Output moet gestructureerd Markdown zijn met duidelijke koppen (##, ###) en bullets. Geen inleidende of afsluitende zinnen buiten de gevraagde structuur.`

export function buildSystemPrompt(toneOfVoice?: string | null) {
  if (!toneOfVoice || !toneOfVoice.trim()) return BASE_SYSTEM
  return `${BASE_SYSTEM}\n\nHuisstijl / tone of voice van dit bureau, houd hier rekening mee in alle output:\n${toneOfVoice.trim()}`
}

function briefingBlock(project: Project) {
  return `## Briefinggegevens
- Klant: ${project.clients?.name ?? 'onbekend'}
- Branche: ${project.clients?.industry ?? 'onbekend'}
- Type aanvraag: ${project.request_type ?? 'onbekend'}
- Ruwe klantvraag: ${project.raw_briefing}
- Doel van de video: ${project.goal ?? 'niet opgegeven'}
- Doelgroep: ${project.audience ?? 'niet opgegeven'}
- Gewenste kanalen: ${project.channels ?? 'niet opgegeven'}
- Deadline: ${project.deadline ?? 'niet opgegeven'}
- Budgetindicatie: ${project.budget_indication ?? 'niet opgegeven'}
- Bestaande assets/links: ${project.assets_links ?? 'geen'}
- Extra notities: ${project.notes ?? 'geen'}`
}

export function buildBriefingAnalysisPrompt(project: Project) {
  return `Analyseer onderstaande briefing grondig.

${briefingBlock(project)}

Genereer een Markdown-document met exact deze secties:
## Samenvatting
Korte, scherpe samenvatting van de aanvraag (max. 4 zinnen).

## Vermoedelijke zakelijke doelstelling
Wat wil dit bedrijf écht bereiken met deze video, los van de letterlijke vraag?

## Doelgroepanalyse
Wie moet dit zien, wat is hun huidige perceptie, en wat moet er veranderen?

## Kernboodschap
De ene boodschap die na het zien van de video moet blijven hangen.

## Ontbrekende informatie
Concrete lijst met wat we nog niet weten en nodig hebben om dit goed te doen.

## Slimme vragen voor de klant
5-8 scherpe, concrete vragen om in het volgende klantgesprek te stellen.

## Risico's en onduidelijkheden
Wat kan er misgaan in verwachtingen, scope of interpretatie.

## Aanbevolen aanpak
Concreet strategisch advies voor hoe Brutaal Studio dit project moet aanvliegen.`
}

export function buildConceptOptionsPrompt(project: Project, analysis?: string | null) {
  return `Bedenk drie duidelijk verschillende creatieve richtingen voor onderstaand project.

${briefingBlock(project)}

${analysis ? `## Eerdere analyse\n${analysis}\n` : ''}

Genereer een Markdown-document met exact deze structuur, voor elk van de drie concepten:

## Concept 1: Veilig / Professioneel
Voor klanten die duidelijkheid en betrouwbaarheid willen.

## Concept 2: Commercieel / Salesgericht
Voor conversie, leads, recruitment of verkoop.

## Concept 3: Opvallend / Brutaal
Voor merken die durven en willen opvallen.

Beschrijf bij elk concept exact deze subkopjes:
- **Conceptnaam**
- **Centrale gedachte**
- **Hook**
- **Visuele stijl**
- **Voorbeeldscènes** (bullet list, minimaal 3)
- **Mogelijke intro**
- **Tone of voice**
- **Geschikte platformen**
- **Draaidag-inschatting**
- **Edit-inschatting**
- **Voordelen**
- **Nadelen**
- **Wanneer dit concept wel/niet past**`
}

export function buildProposalPackagesPrompt(project: Project, concepts?: string | null) {
  return `Stel op basis van onderstaand project drie pakketten samen: Starter, Growth en Campaign.

${briefingBlock(project)}

${concepts ? `## Gekozen of gegenereerde concepten\n${concepts}\n` : ''}

Pakketrichtlijnen:
### Starter
Compacte draaidag, korte edit, basis social cutdowns.

### Growth
Uitgebreidere draaidag, hoofdvideo, meerdere social edits, fotografie of extra snippets optioneel.

### Campaign
Volledige campagne-aanpak, meerdere draaidagen, meerdere formats, social campagnepakket, eventueel retainer-voorstel.

Genereer een Markdown-document met voor elk pakket (Starter, Growth, Campaign) exact deze subkopjes:
- **Pakketnaam**
- **Omschrijving**
- **Deliverables** (bullet list)
- **Aanpak**
- **Planning**
- **Waarom dit pakket past**
- **Upsell mogelijkheden**
- **Indicatieve prijsrange** (als tekst/logica, geen harde prijzen)`
}

export function buildProposalTextPrompt(project: Project, packages: string) {
  return `Schrijf een professionele, commerciële en heldere offerte-tekst op basis van onderstaande informatie. Geen wollige marketingtaal, geen overdreven bijvoeglijke naamwoorden. Scherp, direct en klantgericht.

${briefingBlock(project)}

## Pakketten
${packages}

Structuur van de offerte-tekst in Markdown:
## Aanleiding
## Onze aanpak
## Pakketten
## Planning op hoofdlijnen
## Vervolgstappen`
}

export function buildPreproductionPrompt(
  project: Project,
  concept: { title: string; summary: string | null }
) {
  return `Maak een compleet pre-productiepakket voor onderstaand project en gekozen concept.

${briefingBlock(project)}

## Gekozen concept
**${concept.title}**
${concept.summary ?? ''}

Genereer een Markdown-document met exact deze secties:
## Projectdoel
## Kernboodschap
## Script-opzet
## Interviewvragen
## Shotlist
## Draaidagindeling
## Call sheet (basis)
## Locatiechecklist
## Benodigdheden
## Risico's
## Klantvragen
## Voice-over richting
## Social deliverables
## Editor briefing

Wees concreet: noem tijdsblokken, aantallen shots, en praktische details waar mogelijk.`
}

export type SalesOutputType =
  | 'followup_intake_email'
  | 'followup_proposal_email'
  | 'linkedin_post'
  | 'case_study'
  | 'retainer_proposal'
  | 'upsell_proposal'

const SALES_TONE = `Toon: scherp, professioneel, menselijk, direct. Niet corporate-saai, niet overdreven Amerikaans. Geen wollige marketingtaal.`

export function buildSalesOutputPrompt(
  project: Project,
  type: SalesOutputType,
  context?: string | null
) {
  const briefing = briefingBlock(project)
  const contextBlock = context ? `## Aanvullende context\n${context}\n` : ''

  const instructions: Record<SalesOutputType, string> = {
    followup_intake_email: `Schrijf een follow-up e-mail na de intake/kennismaking. Bedank voor het gesprek, vat kort samen wat je hebt begrepen, en geef aan wat de volgende stap is.`,
    followup_proposal_email: `Schrijf een follow-up e-mail na het versturen van de offerte. Vraag naar status, bied aan om vragen te beantwoorden, en creëer lichte urgentie zonder opdringerig te zijn.`,
    linkedin_post: `Schrijf een LinkedIn-post over dit project (te posten na oplevering of tijdens productie). Pak de lezer bij de eerste zin, maak het concreet, en sluit af met een duidelijke call-to-action of vraag.`,
    case_study: `Schrijf een case study tekst over dit project: uitdaging, aanpak, resultaat. Gebruik concrete details uit de briefing, geen generieke succesverhalen.`,
    retainer_proposal: `Schrijf een retainer-voorstel gebaseerd op dit project: waarom doorlopende samenwerking zinvol is, wat het behelst, en hoe dit georganiseerd kan worden. Geen harde prijzen, wel pakketlogica.`,
    upsell_proposal: `Schrijf een upsell-voorstel: welke aanvullende diensten of content logisch zijn na dit project, en waarom dit nu het juiste moment is.`,
  }

  return `${instructions[type]}

${SALES_TONE}

${briefing}

${contextBlock}
Output in Markdown, klaar om te kopiëren en te versturen.`
}
