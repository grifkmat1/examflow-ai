import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
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
  keywords: ['exam scheduling', 'study plans', 'AI', 'academic'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <body className="min-h-screen bg-surface-50 antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}
