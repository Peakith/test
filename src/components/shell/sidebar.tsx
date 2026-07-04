'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Settings, Clapperboard, LogOut, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from '@/lib/actions/auth'

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/clients', label: 'Klanten', icon: Users },
  { href: '/settings', label: 'Instellingen', icon: Settings },
]

export function Sidebar({ email }: { email: string | null }) {
  const pathname = usePathname()

  return (
    <aside className="flex h-screen w-60 shrink-0 flex-col border-r border-border bg-surface">
      <div className="flex items-center gap-2 px-5 py-5">
        <div className="flex size-8 items-center justify-center rounded-md bg-ink text-brand">
          <Clapperboard className="size-4" />
        </div>
        <div>
          <p className="text-sm font-bold leading-none text-ink">Brutaal Studio</p>
          <p className="text-[11px] leading-none text-muted mt-0.5">Studio OS</p>
        </div>
      </div>

      <div className="px-3">
        <Link
          href="/projects/new"
          className="flex items-center justify-center gap-2 rounded-md bg-brand px-3 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-hover"
        >
          <Plus className="size-4" />
          Nieuwe briefing
        </Link>
      </div>

      <nav className="mt-6 flex flex-1 flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-ink',
                active && 'bg-surface-muted text-ink'
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-border px-3 py-4">
        {email && <p className="truncate px-3 pb-2 text-xs text-muted">{email}</p>}
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-surface-muted hover:text-ink"
          >
            <LogOut className="size-4" />
            Uitloggen
          </button>
        </form>
      </div>
    </aside>
  )
}
