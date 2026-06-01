'use client'

import { Search, X } from 'lucide-react'

interface SearchBarProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
}

export function SearchBar({ value, onChange, placeholder = 'Zoek op artikelnummer, naam, afmeting…' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-klijn-muted pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-9 pr-8 py-2.5 bg-white border border-klijn-border rounded-lg text-sm text-klijn-text placeholder:text-klijn-muted focus:border-klijn-blue focus:ring-2 focus:ring-klijn-blue/20 outline-none transition-colors"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-klijn-muted hover:text-klijn-text"
          aria-label="Zoekopdracht wissen"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
