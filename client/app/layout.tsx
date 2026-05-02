import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'ExamFlow AI',
    template: '%s | ExamFlow AI',
  },
  description: 'AI-powered exam scheduling, conflict detection, and personalised study plans.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen bg-gray-950 antialiased">
        {children}
      </body>
    </html>
  )
}
