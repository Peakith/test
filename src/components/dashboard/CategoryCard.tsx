import Link from 'next/link'
import type { Category } from '@/types'

interface CategoryCardProps {
  category: Category
  count: number
  outOfStock: number
  lowStock: number
}

const categoryIcons: Record<Category, string> = {
  'Schroeven':              '🔩',
  'Bouten':                 '⚙️',
  'Moeren':                 '🔧',
  'Ringen':                 '⭕',
  'Pluggen':                '🔌',
  'Ankers':                 '⚓',
  'Kitten & Lijmen':        '🧴',
  'Gereedschap & Accessoires': '🛠️',
}

export function CategoryCard({ category, count, outOfStock, lowStock }: CategoryCardProps) {
  const hasIssues = outOfStock > 0 || lowStock > 0

  return (
    <Link
      href={`/producten?categorie=${encodeURIComponent(category)}`}
      className="bg-white border border-klijn-border rounded-lg p-4 hover:border-klijn-blue hover:shadow-sm transition-all group"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{categoryIcons[category]}</span>
          <div>
            <p className="font-semibold text-klijn-text text-sm group-hover:text-klijn-blue transition-colors">{category}</p>
            <p className="text-klijn-muted text-xs">{count} artikel{count !== 1 ? 'en' : ''}</p>
          </div>
        </div>
        {hasIssues && (
          <div className="flex flex-col items-end gap-1">
            {outOfStock > 0 && (
              <span className="text-[10px] font-medium bg-red-50 text-red-700 border border-red-200 px-1.5 py-0.5 rounded-full">
                {outOfStock} niet op voorraad
              </span>
            )}
            {lowStock > 0 && (
              <span className="text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full">
                {lowStock} laag
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}
