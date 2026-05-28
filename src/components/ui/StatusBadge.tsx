import { Status, STATUS_COLORS, STATUS_LABELS } from '@/types'

interface Props {
  status: Status
}

export default function StatusBadge({ status }: Props) {
  const colors = STATUS_COLORS[status]
  return (
    <span
      className={`inline-flex items-center rounded-full text-xs font-medium px-2.5 py-1 ${colors.bg} ${colors.text}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
