'use client'

import { CATEGORIES, type Category, type StockStatus } from '@/types'
import { products } from '@/data/products'
import { X } from 'lucide-react'

export interface Filters {
  categories: Category[]
  stockStatuses: StockStatus[]
  supplier: string
}

const ALL_SUPPLIERS = Array.from(new Set(products.map(p => p.supplier))).sort()

interface FilterPanelProps {
  filters: Filters
  onChange: (f: Filters) => void
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const toggleCategory = (cat: Category) => {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter(c => c !== cat)
      : [...filters.categories, cat]
    onChange({ ...filters, categories: next })
  }

  const toggleStatus = (status: StockStatus) => {
    const next = filters.stockStatuses.includes(status)
      ? filters.stockStatuses.filter(s => s !== status)
      : [...filters.stockStatuses, status]
    onChange({ ...filters, stockStatuses: next })
  }

  const hasActiveFilters =
    filters.categories.length > 0 || filters.stockStatuses.length > 0 || filters.supplier !== ''

  const reset = () => onChange({ categories: [], stockStatuses: [], supplier: '' })

  return (
    <aside className="bg-white border border-klijn-border rounded-lg p-4 space-y-5 text-sm">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-klijn-text">Filters</h2>
        {hasActiveFilters && (
          <button onClick={reset} className="flex items-center gap-1 text-xs text-klijn-muted hover:text-klijn-text">
            <X size={12} /> Wissen
          </button>
        )}
      </div>

      <FilterSection title="Categorie">
        {CATEGORIES.map(cat => (
          <label key={cat} className="flex items-center gap-2 cursor-pointer hover:text-klijn-text text-klijn-muted">
            <input
              type="checkbox"
              checked={filters.categories.includes(cat)}
              onChange={() => toggleCategory(cat)}
              className="rounded border-klijn-border accent-klijn-blue"
            />
            <span className={filters.categories.includes(cat) ? 'text-klijn-text font-medium' : ''}>{cat}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Voorraadstatus">
        {([
          { value: 'in-stock',     label: 'Op voorraad',      dotClass: 'bg-emerald-500' },
          { value: 'low-stock',    label: 'Lage voorraad',    dotClass: 'bg-amber-500'   },
          { value: 'out-of-stock', label: 'Niet op voorraad', dotClass: 'bg-red-500'     },
        ] as { value: StockStatus; label: string; dotClass: string }[]).map(({ value, label, dotClass }) => (
          <label key={value} className="flex items-center gap-2 cursor-pointer hover:text-klijn-text text-klijn-muted">
            <input
              type="checkbox"
              checked={filters.stockStatuses.includes(value)}
              onChange={() => toggleStatus(value)}
              className="rounded border-klijn-border accent-klijn-blue"
            />
            <span className={`w-2 h-2 rounded-full ${dotClass}`} />
            <span className={filters.stockStatuses.includes(value) ? 'text-klijn-text font-medium' : ''}>{label}</span>
          </label>
        ))}
      </FilterSection>

      <FilterSection title="Leverancier">
        <select
          value={filters.supplier}
          onChange={e => onChange({ ...filters, supplier: e.target.value })}
          className="w-full border border-klijn-border rounded px-2 py-1.5 text-sm text-klijn-text bg-white focus:border-klijn-blue outline-none"
        >
          <option value="">Alle leveranciers</option>
          {ALL_SUPPLIERS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </FilterSection>
    </aside>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-klijn-muted">{title}</h3>
      <div className="space-y-1.5">{children}</div>
    </div>
  )
}
