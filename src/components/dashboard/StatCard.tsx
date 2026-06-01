interface StatCardProps {
  label: string
  value: number | string
  sub?: string
  color?: 'default' | 'warning' | 'danger' | 'success'
  icon: React.ReactNode
}

const colorMap = {
  default: 'border-klijn-border text-klijn-text',
  success: 'border-emerald-200 text-emerald-700',
  warning: 'border-amber-200 text-amber-700',
  danger:  'border-red-200 text-red-700',
}

const iconBgMap = {
  default: 'bg-slate-100 text-slate-600',
  success: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  danger:  'bg-red-50 text-red-600',
}

export function StatCard({ label, value, sub, color = 'default', icon }: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg border p-4 flex items-center gap-4 ${colorMap[color]}`}>
      <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${iconBgMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold leading-tight">{value}</p>
        <p className="text-sm font-medium text-klijn-muted">{label}</p>
        {sub && <p className="text-xs text-klijn-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}
