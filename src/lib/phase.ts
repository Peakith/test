import { Phase, PHASES, Task } from '@/types'

/**
 * Computes the current phase based on which tasks are completed.
 * Skips phases with zero tasks. Returns 'Afgerond' only when ALL tasks done.
 */
export function computePhase(tasks: Task[]): Phase {
  if (tasks.length === 0) return 'Intake'

  const allDone = tasks.every((t) => t.completed)
  if (allDone) return 'Afgerond'

  // Walk phases in order (excluding 'Afgerond'); find first phase that still has incomplete tasks
  const orderedPhases = PHASES.filter((p) => p !== 'Afgerond') as Phase[]

  for (const phase of orderedPhases) {
    const phaseTasks = tasks.filter((t) => t.phase === phase)
    if (phaseTasks.length === 0) continue // skip phases with no tasks
    const allPhaseTasksDone = phaseTasks.every((t) => t.completed)
    if (!allPhaseTasksDone) return phase
  }

  return 'Afgerond'
}

export function computeProgress(tasks: Task[]): number {
  if (tasks.length === 0) return 0
  const done = tasks.filter((t) => t.completed).length
  return Math.round((done / tasks.length) * 100)
}
