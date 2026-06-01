import type { StockStatus } from '@/types'
import { STOCK_STATUS_CONFIG } from '@/types'

interface StockBadgeProps {
  status: StockStatus
  stock?: number
  size?: 'sm' | 'md'
}

export function StockBadge({ status, stock, size = 'md' }: StockBadgeProps) {
  const config = STOCK_STATUS_CONFIG[status]
  const textSize = size === 'sm' ? 'text-xs' : 'text-xs'
  const padding = size === 'sm' ? 'px-1.5 py-0.5' : 'px-2 py-1'

  return (
    <span className={`inline-flex items-center gap-1.5 border rounded-full font-medium ${textSize} ${padding} ${config.bg} ${config.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.dot}`} />
      {config.label}
      {stock !== undefined && status !== 'out-of-stock' && (
        <span className="font-normal opacity-70">({stock})</span>
      )}
    </span>
  )
}
