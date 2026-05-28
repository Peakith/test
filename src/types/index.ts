export type Phase =
  | 'Intake'
  | 'Pre-productie'
  | 'Productie'
  | 'Post-productie'
  | 'Feedback'
  | 'Oplevering'
  | 'Afgerond'

export type Status = 'active' | 'on-hold' | 'completed' | 'overdue'

export interface Task {
  id: string
  title: string
  phase: Phase
  completed: boolean
  order: number
}

export interface Project {
  id: string
  name: string
  client: string
  currentPhase: Phase
  status: Status
  deadline: string
  tasks: Task[]
}

export const PHASES: Phase[] = [
  'Intake',
  'Pre-productie',
  'Productie',
  'Post-productie',
  'Feedback',
  'Oplevering',
  'Afgerond',
]

/* Studio Brutaal phase palette — all dark, yellow as accent */
export const PHASE_COLORS: Record<Phase, { bg: string; text: string; border: string; dot: string }> = {
  Intake:          { bg: 'bg-white/8',  text: 'text-white/70',       border: 'border-white/20',    dot: 'bg-white/40' },
  'Pre-productie': { bg: 'bg-white/8',  text: 'text-brutaal-yellow', border: 'border-brutaal-yellow/40', dot: 'bg-brutaal-yellow' },
  Productie:       { bg: 'bg-brutaal-yellow/15', text: 'text-brutaal-yellow', border: 'border-brutaal-yellow/50', dot: 'bg-brutaal-yellow' },
  'Post-productie':{ bg: 'bg-white/8',  text: 'text-white/80',       border: 'border-white/25',    dot: 'bg-white/60' },
  Feedback:        { bg: 'bg-white/8',  text: 'text-white/80',       border: 'border-white/25',    dot: 'bg-white/60' },
  Oplevering:      { bg: 'bg-brutaal-yellow/20', text: 'text-brutaal-yellow', border: 'border-brutaal-yellow/60', dot: 'bg-brutaal-yellow' },
  Afgerond:        { bg: 'bg-brutaal-yellow/10', text: 'text-brutaal-yellow', border: 'border-brutaal-yellow/30', dot: 'bg-brutaal-yellow' },
}

export const STATUS_COLORS: Record<Status, { bg: string; text: string }> = {
  active:     { bg: 'bg-white/8',  text: 'text-white/60' },
  'on-hold':  { bg: 'bg-white/5',  text: 'text-white/40' },
  completed:  { bg: 'bg-brutaal-yellow/10', text: 'text-brutaal-yellow' },
  overdue:    { bg: 'bg-red-900/30', text: 'text-red-400' },
}

export const STATUS_LABELS: Record<Status, string> = {
  active:    'Actief',
  'on-hold': 'On hold',
  completed: 'Afgerond',
  overdue:   'Verlopen',
}
