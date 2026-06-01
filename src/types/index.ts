export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export type Category =
  | 'Schroeven'
  | 'Bouten'
  | 'Moeren'
  | 'Ringen'
  | 'Pluggen'
  | 'Ankers'
  | 'Kitten & Lijmen'
  | 'Gereedschap & Accessoires'

export interface ProductSpecification {
  label: string
  value: string
}

export interface Product {
  id: string
  articleNumber: string
  name: string
  category: Category
  description: string
  dimensions: string
  material: string
  supplier: string
  packagingUnit: string
  price: number | null
  stock: number
  stockStatus: StockStatus
  location: string
  specifications: ProductSpecification[]
  alternatives: string[]
  sellerNotes: string
}

export const CATEGORIES: Category[] = [
  'Schroeven',
  'Bouten',
  'Moeren',
  'Ringen',
  'Pluggen',
  'Ankers',
  'Kitten & Lijmen',
  'Gereedschap & Accessoires',
]

export const STOCK_STATUS_CONFIG: Record<StockStatus, { label: string; color: string; bg: string; dot: string }> = {
  'in-stock':    { label: 'Op voorraad',   color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200',   dot: 'bg-emerald-500' },
  'low-stock':   { label: 'Lage voorraad', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200',       dot: 'bg-amber-500'   },
  'out-of-stock':{ label: 'Niet op voorraad', color: 'text-red-700',  bg: 'bg-red-50 border-red-200',           dot: 'bg-red-500'     },
}
