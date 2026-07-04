import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Brutaal Studio OS',
  description: 'Interne AI-assistent voor sales, strategie en pre-productie van videoprojecten.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl">
      <body className={`${inter.variable} bg-background min-h-screen text-foreground`}>
        {children}
      </body>
    </html>
  )
}
