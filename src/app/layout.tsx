import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ProjectProvider } from '@/context/ProjectContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FilmDesk – Projectmanagement',
  description: 'Professioneel projectmanagement voor videoproductiebedrijven',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className={`${inter.className} bg-slate-50 min-h-screen`}>
        <ProjectProvider>
          <nav className="bg-white border-b border-slate-100 sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-14">
                <a href="/projects" className="flex items-center gap-2">
                  <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">FD</span>
                  </div>
                  <span className="font-bold text-slate-800 text-base">FilmDesk</span>
                </a>
                <div className="flex items-center gap-1">
                  <a
                    href="/projects"
                    className="text-sm text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors font-medium"
                  >
                    Projecten
                  </a>
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </ProjectProvider>
      </body>
    </html>
  )
}
