'use client'

import { useState, useMemo, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { products } from '@/data/products'
import type { Category } from '@/types'
import { SearchBar } from '@/components/producten/SearchBar'
import { FilterPanel, type Filters } from '@/components/producten/FilterPanel'
import { ProductTable, type SortKey, type SortDir } from '@/components/producten/ProductTable'
import { SlidersHorizontal, X } from 'lucide-react'

export default function ProductenPage() {
  return (
    <Suspense fallback={<div className="text-klijn-muted text-sm p-4">Laden…</div>}>
      <ProductenContent />
    </Suspense>
  )
}

function ProductenContent() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get('categorie') as Category | null

  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<Filters>({
    categories: initialCategory ? [initialCategory] : [],
    stockStatuses: [],
    supplier: '',
  })
  const [sortKey, setSortKey] = useState<SortKey>('articleNumber')
  const [sortDir, setSortDir] = useState<SortDir>('asc')
  const [showFilters, setShowFilters] = useState(false)

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('asc')
    }
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    return products
      .filter(p => {
        if (q && ![p.articleNumber, p.name, p.category, p.dimensions, p.material, p.supplier]
          .some(f => f.toLowerCase().includes(q))) return false
        if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false
        if (filters.stockStatuses.length > 0 && !filters.stockStatuses.includes(p.stockStatus)) return false
        if (filters.supplier && p.supplier !== filters.supplier) return false
        return true
      })
      .sort((a, b) => {
        let cmp = 0
        if (sortKey === 'articleNumber') cmp = a.articleNumber.localeCompare(b.articleNumber)
        else if (sortKey === 'name') cmp = a.name.localeCompare(b.name)
        else if (sortKey === 'category') cmp = a.category.localeCompare(b.category)
        else if (sortKey === 'stock') cmp = a.stock - b.stock
        return sortDir === 'asc' ? cmp : -cmp
      })
  }, [query, filters, sortKey, sortDir])

  const activeFilterCount = filters.categories.length + filters.stockStatuses.length + (filters.supplier ? 1 : 0)

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-klijn-text">Productoverzicht</h1>
          <p className="text-klijn-muted text-sm">{filtered.length} van {products.length} artikelen</p>
        </div>
        <button
          onClick={() => setShowFilters(v => !v)}
          className={`lg:hidden flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors
            ${showFilters || activeFilterCount > 0 ? 'bg-klijn-blue text-white border-klijn-blue' : 'bg-white text-klijn-text border-klijn-border hover:border-klijn-blue'}`}
        >
          <SlidersHorizontal size={15} />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-white/30 rounded-full w-4 h-4 text-[10px] flex items-center justify-center">{activeFilterCount}</span>
          )}
        </button>
      </div>

      {/* Search */}
      <SearchBar value={query} onChange={setQuery} />

      {/* Active filter chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.categories.map(cat => (
            <Chip key={cat} label={cat} onRemove={() => setFilters(f => ({ ...f, categories: f.categories.filter(c => c !== cat) }))} />
          ))}
          {filters.stockStatuses.map(s => (
            <Chip key={s} label={s === 'in-stock' ? 'Op voorraad' : s === 'low-stock' ? 'Lage voorraad' : 'Niet op voorraad'} onRemove={() => setFilters(f => ({ ...f, stockStatuses: f.stockStatuses.filter(x => x !== s) }))} />
          ))}
          {filters.supplier && (
            <Chip label={filters.supplier} onRemove={() => setFilters(f => ({ ...f, supplier: '' }))} />
          )}
        </div>
      )}

      {/* Layout */}
      <div className="flex gap-5 items-start">
        {/* Sidebar filters */}
        <div className={`w-56 flex-shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <FilterPanel filters={filters} onChange={setFilters} />
        </div>

        {/* Table */}
        <div className="flex-1 min-w-0">
          <ProductTable
            products={filtered}
            sortKey={sortKey}
            sortDir={sortDir}
            onSort={handleSort}
          />
        </div>
      </div>
    </div>
  )
}

function Chip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-klijn-blue/10 text-klijn-blue border border-klijn-blue/20 text-xs font-medium px-2 py-1 rounded-full">
      {label}
      <button onClick={onRemove} className="hover:text-klijn-navy ml-0.5"><X size={11} /></button>
    </span>
  )
}
