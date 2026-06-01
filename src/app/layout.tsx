import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NavBar } from '@/components/ui/NavBar'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Klijn Bevestigingsprodukten – Assortiment',
  description: 'Intern assortiments- en voorraadbeheer voor verkopers en vertegenwoordigers',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className={`${inter.variable} bg-klijn-bg min-h-screen`}>
        <NavBar />
        <main className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
      </body>
    </html>
  )
}
