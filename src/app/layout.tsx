import type { Metadata } from 'next'
import { Manrope } from 'next/font/google'
import './globals.css'
import { ProjectProvider } from '@/context/ProjectContext'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  weight: ['300', '400', '500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: 'Studio Brutaal – Dashboard',
  description: 'Projectmanagement voor film & video agencies',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className={`${manrope.variable} bg-brutaal-black min-h-screen`}>
        <ProjectProvider>
          {/* ─── Header ─── */}
          <nav className="sticky top-0 z-50 border-b border-white/10 bg-brutaal-black/95 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 lg:px-10">
              <div className="flex items-center justify-between h-14">
                <a href="/projects" className="flex items-center gap-3 group">
                  <div className="w-6 h-6 bg-brutaal-yellow flex items-center justify-center">
                    <span className="text-brutaal-black text-[9px] font-black leading-none">SB</span>
                  </div>
                  <span className="text-brutaal-white text-sm font-black tracking-[0.2em] uppercase group-hover:text-brutaal-yellow transition-colors">
                    Studio Brutaal
                  </span>
                </a>

                <div className="flex items-center gap-6">
                  <a
                    href="/projects"
                    className="text-white/50 hover:text-brutaal-yellow text-[11px] font-bold tracking-[0.15em] uppercase transition-colors"
                  >
                    Projecten
                  </a>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-6 lg:px-10 py-10 relative z-10">
            {children}
          </main>
        </ProjectProvider>
      </body>
    </html>
  )
}
