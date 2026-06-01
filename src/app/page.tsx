import Link from 'next/link'
import { products } from '@/data/products'
import { CATEGORIES, type Category } from '@/types'
import { StatCard } from '@/components/dashboard/StatCard'
import { CategoryCard } from '@/components/dashboard/CategoryCard'
import { Package, AlertTriangle, XCircle, Search, ArrowRight } from 'lucide-react'

export default function DashboardPage() {
  const total = products.length
  const lowStock = products.filter(p => p.stockStatus === 'low-stock').length
  const outOfStock = products.filter(p => p.stockStatus === 'out-of-stock').length
  const inStock = products.filter(p => p.stockStatus === 'in-stock').length

  const categorySummary = CATEGORIES.map(cat => {
    const catProducts = products.filter(p => p.category === cat)
    return {
      category: cat as Category,
      count: catProducts.length,
      outOfStock: catProducts.filter(p => p.stockStatus === 'out-of-stock').length,
      lowStock: catProducts.filter(p => p.stockStatus === 'low-stock').length,
    }
  }).filter(c => c.count > 0)

  const urgentProducts = products.filter(p => p.stockStatus === 'out-of-stock' || p.stockStatus === 'low-stock')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-klijn-text">Assortiment Dashboard</h1>
          <p className="text-klijn-muted text-sm mt-0.5">Overzicht voorraadstatus · intern gebruik</p>
        </div>
        <Link
          href="/producten"
          className="inline-flex items-center gap-2 bg-klijn-blue text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Alle producten <ArrowRight size={14} />
        </Link>
      </div>

      {/* Quick Search */}
      <Link
        href="/producten"
        className="flex items-center gap-3 bg-white border border-klijn-border rounded-lg px-4 py-3 hover:border-klijn-blue hover:shadow-sm transition-all group"
      >
        <Search size={16} className="text-klijn-muted group-hover:text-klijn-blue transition-colors" />
        <span className="text-klijn-muted text-sm">Snel zoeken op artikelnummer, naam of afmeting…</span>
        <span className="ml-auto text-xs text-klijn-muted border border-klijn-border px-1.5 py-0.5 rounded bg-slate-50">→ Producten</span>
      </Link>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard
          label="Totaal artikelen"
          value={total}
          icon={<Package size={20} />}
          color="default"
        />
        <StatCard
          label="Op voorraad"
          value={inStock}
          icon={<Package size={20} />}
          color="success"
        />
        <StatCard
          label="Lage voorraad"
          value={lowStock}
          sub="Bijbestellen aanbevolen"
          icon={<AlertTriangle size={20} />}
          color="warning"
        />
        <StatCard
          label="Niet op voorraad"
          value={outOfStock}
          sub="Directe actie vereist"
          icon={<XCircle size={20} />}
          color="danger"
        />
      </div>

      {/* Categories */}
      <div>
        <h2 className="text-sm font-semibold text-klijn-muted uppercase tracking-wider mb-3">Productcategorieën</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {categorySummary.map(c => (
            <CategoryCard key={c.category} {...c} />
          ))}
        </div>
      </div>

      {/* Attention list */}
      {urgentProducts.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-klijn-muted uppercase tracking-wider mb-3">Vereist aandacht</h2>
          <div className="bg-white border border-klijn-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-klijn-border">
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-klijn-muted uppercase tracking-wider">Art.nr.</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-klijn-muted uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-klijn-muted uppercase tracking-wider hidden sm:table-cell">Categorie</th>
                  <th className="text-right px-4 py-2.5 text-xs font-semibold text-klijn-muted uppercase tracking-wider">Voorraad</th>
                  <th className="text-left px-4 py-2.5 text-xs font-semibold text-klijn-muted uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-klijn-border">
                {urgentProducts.map(p => (
                  <tr key={p.id} className={`hover:bg-slate-50 transition-colors ${p.stockStatus === 'out-of-stock' ? 'bg-red-50/40' : 'bg-amber-50/30'}`}>
                    <td className="px-4 py-2.5 font-mono text-xs text-klijn-muted">{p.articleNumber}</td>
                    <td className="px-4 py-2.5">
                      <Link href={`/producten/${p.id}`} className="font-medium text-klijn-text hover:text-klijn-blue transition-colors">
                        {p.name}
                      </Link>
                    </td>
                    <td className="px-4 py-2.5 text-klijn-muted hidden sm:table-cell">{p.category}</td>
                    <td className="px-4 py-2.5 text-right font-medium tabular-nums">
                      {p.stockStatus === 'out-of-stock'
                        ? <span className="text-red-600">0</span>
                        : <span className="text-amber-600">{p.stock}</span>
                      }
                    </td>
                    <td className="px-4 py-2.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border
                        ${p.stockStatus === 'out-of-stock'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${p.stockStatus === 'out-of-stock' ? 'bg-red-500' : 'bg-amber-500'}`} />
                        {p.stockStatus === 'out-of-stock' ? 'Niet op voorraad' : 'Lage voorraad'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
