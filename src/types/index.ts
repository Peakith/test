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

export const PHASE_COLORS: Record<Phase, { bg: string; text: string; border: string }> = {
  Intake: { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-300' },
  'Pre-productie': { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
  Productie: { bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-300' },
  'Post-productie': { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' },
  Feedback: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  Oplevering: { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300' },
  Afgerond: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
}

export const STATUS_COLORS: Record<Status, { bg: string; text: string }> = {
  active: { bg: 'bg-blue-50', text: 'text-blue-600' },
  'on-hold': { bg: 'bg-yellow-50', text: 'text-yellow-600' },
  completed: { bg: 'bg-green-50', text: 'text-green-600' },
  overdue: { bg: 'bg-red-50', text: 'text-red-600' },
}

export const STATUS_LABELS: Record<Status, string> = {
  active: 'Actief',
  'on-hold': 'On hold',
  completed: 'Afgerond',
  overdue: 'Verlopen',
}
