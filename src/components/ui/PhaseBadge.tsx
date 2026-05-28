import { Phase, PHASE_COLORS } from '@/types'

interface Props {
  phase: Phase
  size?: 'sm' | 'md'
}

export default function PhaseBadge({ phase, size = 'md' }: Props) {
  const c = PHASE_COLORS[phase]
  const sizeClass = size === 'sm'
    ? 'text-[10px] px-2 py-0.5 tracking-[0.12em]'
    : 'text-[11px] px-2.5 py-1 tracking-[0.14em]'

  return (
    <span
      className={`inline-flex items-center gap-1.5 uppercase font-bold border ${c.bg} ${c.text} ${c.border} ${sizeClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.dot}`} />
      {phase}
    </span>
  )
}
