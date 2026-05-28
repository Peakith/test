import { Status, STATUS_COLORS, STATUS_LABELS } from '@/types'

interface Props { status: Status }

export default function StatusBadge({ status }: Props) {
  const c = STATUS_COLORS[status]
  return (
    <span
      className={`inline-flex items-center uppercase text-[10px] font-bold tracking-[0.14em] px-2 py-0.5 border border-white/10 ${c.bg} ${c.text}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
