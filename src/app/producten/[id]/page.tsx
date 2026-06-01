import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductById, getProductByArticleNumber } from '@/data/products'
import { StockBadge } from '@/components/ui/StockBadge'
import { ArrowLeft, MapPin, Package, Tag, Layers } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) notFound()

  const alternativeProducts = product.alternatives
    .map(artNr => getProductByArticleNumber(artNr))
    .filter(Boolean)

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-klijn-muted">
        <Link href="/producten" className="inline-flex items-center gap-1 hover:text-klijn-blue transition-colors">
          <ArrowLeft size={14} /> Producten
        </Link>
        <span>/</span>
        <span className="text-klijn-text">{product.articleNumber}</span>
      </div>

      {/* Title & Status */}
      <div className="bg-white border border-klijn-border rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-mono text-klijn-muted">{product.articleNumber}</p>
            <h1 className="text-xl font-bold text-klijn-text leading-snug">{product.name}</h1>
            <p className="text-klijn-muted text-sm">{product.description}</p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 flex-shrink-0">
            <StockBadge status={product.stockStatus} stock={product.stock} />
            {product.price !== null && (
              <p className="text-lg font-bold text-klijn-text">
                € {product.price.toFixed(2)}
                <span className="text-xs font-normal text-klijn-muted ml-1">/ {product.packagingUnit}</span>
              </p>
            )}
          </div>
        </div>

        {/* Key info row */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-klijn-border">
          <InfoItem icon={<Layers size={14} />} label="Categorie" value={product.category} />
          <InfoItem icon={<Tag size={14} />} label="Afmeting" value={product.dimensions} />
          <InfoItem icon={<Package size={14} />} label="Verpakking" value={product.packagingUnit} />
          <InfoItem icon={<MapPin size={14} />} label="Locatie" value={product.location} />
        </div>
      </div>

      {/* Specifications */}
      <div className="bg-white border border-klijn-border rounded-lg p-5">
        <h2 className="font-semibold text-klijn-text mb-4">Specificaties</h2>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
          <SpecRow label="Materiaal" value={product.material} />
          <SpecRow label="Leverancier" value={product.supplier} />
          {product.specifications.map(spec => (
            <SpecRow key={spec.label} label={spec.label} value={spec.value} />
          ))}
        </dl>
      </div>

      {/* Stock detail */}
      <div className={`border rounded-lg p-5 ${
        product.stockStatus === 'out-of-stock'
          ? 'bg-red-50 border-red-200'
          : product.stockStatus === 'low-stock'
          ? 'bg-amber-50 border-amber-200'
          : 'bg-emerald-50 border-emerald-200'
      }`}>
        <h2 className="font-semibold text-klijn-text mb-3">Voorraadinformatie</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div>
            <p className="text-xs text-klijn-muted mb-1">Huidige voorraad</p>
            <p className={`text-3xl font-bold ${
              product.stockStatus === 'out-of-stock' ? 'text-red-600'
              : product.stockStatus === 'low-stock' ? 'text-amber-600'
              : 'text-emerald-700'
            }`}>
              {product.stock}
            </p>
            <p className="text-xs text-klijn-muted mt-0.5">stuks beschikbaar</p>
          </div>
          <div>
            <p className="text-xs text-klijn-muted mb-1">Status</p>
            <StockBadge status={product.stockStatus} />
          </div>
          <div>
            <p className="text-xs text-klijn-muted mb-1">Magazijnlocatie</p>
            <p className="font-semibold text-klijn-text">{product.location}</p>
          </div>
        </div>
      </div>

      {/* Seller notes */}
      {product.sellerNotes && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h2 className="font-semibold text-amber-800 mb-1 text-sm">📌 Notitie voor verkopers</h2>
          <p className="text-amber-700 text-sm">{product.sellerNotes}</p>
        </div>
      )}

      {/* Alternatives */}
      {alternativeProducts.length > 0 && (
        <div className="bg-white border border-klijn-border rounded-lg p-5">
          <h2 className="font-semibold text-klijn-text mb-3">Alternatieve producten</h2>
          <div className="space-y-2">
            {alternativeProducts.map(alt => alt && (
              <Link
                key={alt.id}
                href={`/producten/${alt.id}`}
                className="flex items-center justify-between gap-4 p-3 border border-klijn-border rounded-lg hover:border-klijn-blue hover:bg-slate-50 transition-all group"
              >
                <div>
                  <p className="text-xs font-mono text-klijn-muted">{alt.articleNumber}</p>
                  <p className="font-medium text-klijn-text group-hover:text-klijn-blue text-sm">{alt.name}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <StockBadge status={alt.stockStatus} stock={alt.stock} size="sm" />
                  <span className="text-klijn-muted text-xs">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-klijn-muted mb-0.5">
        {icon}
        <span className="text-xs">{label}</span>
      </div>
      <p className="font-medium text-klijn-text text-sm">{value}</p>
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 py-1.5 border-b border-klijn-border/50">
      <dt className="text-klijn-muted text-sm">{label}</dt>
      <dd className="font-medium text-klijn-text text-sm text-right">{value}</dd>
    </div>
  )
}
