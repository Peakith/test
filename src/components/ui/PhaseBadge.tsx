import { Phase, PHASE_COLORS } from '@/types'

interface Props {
  phase: Phase
  size?: 'sm' | 'md'
}

export default function PhaseBadge({ phase, size = 'md' }: Props) {
  const colors = PHASE_COLORS[phase]
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium border ${colors.bg} ${colors.text} ${colors.border} ${sizeClass}`}
    >
      {phase}
    </span>
  )
}
