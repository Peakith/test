import { createClient } from '@/lib/supabase/server'
import { Sidebar } from '@/components/shell/sidebar'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen">
      <Sidebar email={user?.email ?? null} />
      <main className="flex-1 overflow-x-hidden px-8 py-8">
        <div className="mx-auto max-w-6xl">{children}</div>
      </main>
    </div>
  )
}
