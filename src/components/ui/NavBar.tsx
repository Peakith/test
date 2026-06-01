'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Package, LayoutDashboard } from 'lucide-react'

export function NavBar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-klijn-navy shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-base tracking-wide">
            <div className="w-8 h-8 bg-klijn-accent rounded flex items-center justify-center">
              <Package size={16} className="text-klijn-navy" />
            </div>
            <span className="hidden sm:block">Klijn Bevestigingsprodukten</span>
            <span className="sm:hidden">Klijn BV</span>
          </Link>

          <nav className="flex items-center gap-1">
            <NavLink href="/" icon={<LayoutDashboard size={15} />} label="Dashboard" active={pathname === '/'} />
            <NavLink href="/producten" icon={<Package size={15} />} label="Producten" active={pathname.startsWith('/producten')} />
          </nav>
        </div>
      </div>
    </header>
  )
}

function NavLink({ href, icon, label, active }: { href: string; icon: React.ReactNode; label: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors
        ${active ? 'bg-white/15 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  )
}
