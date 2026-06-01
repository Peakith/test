'use client'

import Link from 'next/link'
import type { Product } from '@/types'
import { StockBadge } from '@/components/ui/StockBadge'
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react'

export type SortKey = 'articleNumber' | 'name' | 'category' | 'stock'
export type SortDir = 'asc' | 'desc'

interface ProductTableProps {
  products: Product[]
  sortKey: SortKey
  sortDir: SortDir
  onSort: (key: SortKey) => void
}

export function ProductTable({ products, sortKey, sortDir, onSort }: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="bg-white border border-klijn-border rounded-lg py-16 text-center">
        <p className="text-klijn-muted text-sm">Geen producten gevonden die overeenkomen met uw zoekopdracht.</p>
      </div>
    )
  }

  return (
    <div className="bg-white border border-klijn-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-klijn-border bg-slate-50">
              <SortTh label="Art.nr." sortKey="articleNumber" current={sortKey} dir={sortDir} onSort={onSort} />
              <SortTh label="Productnaam" sortKey="name" current={sortKey} dir={sortDir} onSort={onSort} />
              <SortTh label="Categorie" sortKey="category" current={sortKey} dir={sortDir} onSort={onSort} />
              <th className="text-left px-4 py-3 font-semibold text-klijn-muted text-xs uppercase tracking-wider">Afmeting</th>
              <th className="text-left px-4 py-3 font-semibold text-klijn-muted text-xs uppercase tracking-wider">Verpakking</th>
              <th className="text-right px-4 py-3 font-semibold text-klijn-muted text-xs uppercase tracking-wider">Prijs</th>
              <SortTh label="Voorraad" sortKey="stock" current={sortKey} dir={sortDir} onSort={onSort} align="right" />
              <th className="text-left px-4 py-3 font-semibold text-klijn-muted text-xs uppercase tracking-wider">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-klijn-border">
            {products.map(product => (
              <tr
                key={product.id}
                className={`hover:bg-slate-50 transition-colors ${product.stockStatus === 'out-of-stock' ? 'bg-red-50/30' : product.stockStatus === 'low-stock' ? 'bg-amber-50/20' : ''}`}
              >
                <td className="px-4 py-3 font-mono text-xs text-klijn-muted whitespace-nowrap">
                  {product.articleNumber}
                </td>
                <td className="px-4 py-3">
                  <Link href={`/producten/${product.id}`} className="font-medium text-klijn-text hover:text-klijn-blue transition-colors">
                    {product.name}
                  </Link>
                  {product.sellerNotes && (
                    <p className="text-xs text-amber-600 mt-0.5 truncate max-w-xs">📌 {product.sellerNotes}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-klijn-muted whitespace-nowrap">{product.category}</td>
                <td className="px-4 py-3 text-klijn-muted whitespace-nowrap">{product.dimensions}</td>
                <td className="px-4 py-3 text-klijn-muted whitespace-nowrap text-xs">{product.packagingUnit}</td>
                <td className="px-4 py-3 text-right text-klijn-muted whitespace-nowrap">
                  {product.price !== null ? `€ ${product.price.toFixed(2)}` : '—'}
                </td>
                <td className="px-4 py-3 text-right font-medium tabular-nums whitespace-nowrap">
                  {product.stockStatus === 'out-of-stock'
                    ? <span className="text-red-600">0</span>
                    : product.stockStatus === 'low-stock'
                    ? <span className="text-amber-600">{product.stock}</span>
                    : <span className="text-emerald-700">{product.stock}</span>
                  }
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <StockBadge status={product.stockStatus} size="sm" />
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/producten/${product.id}`}
                    className="text-xs text-klijn-blue hover:underline whitespace-nowrap"
                  >
                    Details →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

interface SortThProps {
  label: string
  sortKey: SortKey
  current: SortKey
  dir: SortDir
  onSort: (k: SortKey) => void
  align?: 'left' | 'right'
}

function SortTh({ label, sortKey, current, dir, onSort, align = 'left' }: SortThProps) {
  const active = current === sortKey
  return (
    <th
      className={`px-4 py-3 font-semibold text-klijn-muted text-xs uppercase tracking-wider cursor-pointer select-none hover:text-klijn-text transition-colors ${align === 'right' ? 'text-right' : 'text-left'}`}
      onClick={() => onSort(sortKey)}
    >
      <span className={`inline-flex items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''}`}>
        {label}
        {active ? (
          dir === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />
        ) : (
          <ArrowUpDown size={11} className="opacity-30" />
        )}
      </span>
    </th>
  )
}
